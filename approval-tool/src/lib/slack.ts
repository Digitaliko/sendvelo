import { WebClient } from "@slack/web-api";
import { prisma } from "./db";

type SlackNotificationType =
  | "NEW_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "COMMENT";

interface SlackNotificationData {
  title: string;
  creatorName?: string;
  reviewerEmail?: string;
  reviewUrl: string;
  reviewerCount?: number;
  comment?: string;
  reviewId?: string;
}

interface SendSlackNotificationParams {
  organizationId: string;
  type: SlackNotificationType;
  data: SlackNotificationData;
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on final attempt
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError ?? new Error("Retry failed");
}

export async function sendSlackNotification({
  organizationId,
  type,
  data,
}: SendSlackNotificationParams): Promise<boolean> {
  try {
    // Get Slack integration for this organization
    const integration = await prisma.slackIntegration.findUnique({
      where: { organizationId },
    });

    if (!integration || !integration.accessToken) {
      return false;
    }

    // Check if notification type is enabled
    // CHANGES_REQUESTED uses notifyOnRejected as it's a blocking status like rejection
    const shouldNotify =
      (type === "NEW_REVIEW" && integration.notifyOnNew) ||
      (type === "APPROVED" && integration.notifyOnApproved) ||
      (type === "REJECTED" && integration.notifyOnRejected) ||
      (type === "CHANGES_REQUESTED" && integration.notifyOnRejected) ||
      (type === "COMMENT" && integration.notifyOnComment);

    if (!shouldNotify || !integration.defaultChannelId) {
      return false;
    }

    const client = new WebClient(integration.accessToken);

    // Build message based on type
    const message = buildSlackMessage(type, data);

    // Retry Slack API call with exponential backoff (3 attempts: 0s, 1s, 2s)
    await retryWithBackoff(async () => {
      await client.chat.postMessage({
        channel: integration.defaultChannelId!,
        ...message,
      });
    }, 3, 1000);

    return true;
  } catch (error) {
    console.error("Failed to send Slack notification after retries:", error);
    return false;
  }
}

function buildSlackMessage(type: SlackNotificationType, data: SlackNotificationData) {
  const blocks: object[] = [];
  let text = "";

  switch (type) {
    case "NEW_REVIEW":
      text = `New review request: ${data.title}`;
      blocks.push(
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "New Review Request",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${data.title}*\n\nCreated by ${data.creatorName ?? "Someone"}\n${data.reviewerCount ?? 1} reviewer(s) assigned`,
          },
        },
        {
          type: "actions",
          block_id: `review_actions_${data.reviewId ?? "unknown"}`,
          elements: [
            // Interactive approve button
            ...(data.reviewId && data.reviewerEmail ? [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Approve",
                  emoji: true,
                },
                style: "primary",
                action_id: "approve_review",
                value: JSON.stringify({
                  reviewId: data.reviewId,
                  reviewerEmail: data.reviewerEmail,
                }),
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Reject",
                  emoji: true,
                },
                style: "danger",
                action_id: "reject_review",
                value: JSON.stringify({
                  reviewId: data.reviewId,
                  reviewerEmail: data.reviewerEmail,
                }),
              },
            ] : []),
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Details",
                emoji: true,
              },
              url: data.reviewUrl,
              action_id: "view_review",
            },
          ],
        }
      );
      break;

    case "APPROVED":
      text = `Review approved: ${data.title}`;
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: *${data.title}* has been approved by ${data.reviewerEmail ?? "a reviewer"}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<${data.reviewUrl}|View Review>`,
            },
          ],
        }
      );
      break;

    case "REJECTED":
      text = `Review rejected: ${data.title}`;
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:x: *${data.title}* has been rejected by ${data.reviewerEmail ?? "a reviewer"}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<${data.reviewUrl}|View Review>`,
            },
          ],
        }
      );
      break;

    case "CHANGES_REQUESTED":
      text = `Changes requested on: ${data.title}`;
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:pencil2: Changes requested on *${data.title}* by ${data.reviewerEmail ?? "a reviewer"}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<${data.reviewUrl}|View Review>`,
            },
          ],
        }
      );
      break;

    case "COMMENT":
      text = `New comment on: ${data.title}`;
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:speech_balloon: New comment on *${data.title}*`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<${data.reviewUrl}|View Review>`,
            },
          ],
        }
      );
      break;
  }

  return { text, blocks };
}

export async function getSlackChannels(accessToken: string) {
  try {
    if (!accessToken) {
      return [];
    }

    const client = new WebClient(accessToken);
    const result = await client.conversations.list({
      types: "public_channel,private_channel",
      exclude_archived: true,
      limit: 100,
    });

    return (result.channels ?? []).map((channel) => ({
      id: channel.id ?? "",
      name: channel.name ?? "",
      isPrivate: channel.is_private ?? false,
    })).filter((channel) => channel.id && channel.name);
  } catch (error) {
    console.error("Failed to get Slack channels:", error);
    return [];
  }
}

export async function testSlackConnection(accessToken: string): Promise<boolean> {
  try {
    if (!accessToken) {
      return false;
    }

    const client = new WebClient(accessToken);
    const result = await client.auth.test();
    return result.ok === true;
  } catch {
    return false;
  }
}
