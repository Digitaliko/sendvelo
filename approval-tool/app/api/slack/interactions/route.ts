import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendReviewDecisionEmail } from "@/lib/email";
import { env } from "@/env";

/**
 * Slack Interactions Webhook
 *
 * Handles interactive button clicks from Slack messages.
 * Allows users to approve/reject reviews directly from Slack.
 */

export async function POST(req: NextRequest) {
  try {
    let body: FormData;
    let rawBody: string;

    try {
      body = await req.formData();
      rawBody = `payload=${encodeURIComponent(body.get("payload") as string)}`;
    } catch (error) {
      console.error("Failed to parse form data:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const payloadStr = body.get("payload") as string;

    if (!payloadStr) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    // CRITICAL SECURITY: Verify Slack signature to prevent unauthorized requests
    const signature = req.headers.get("x-slack-signature");
    const timestamp = req.headers.get("x-slack-request-timestamp");

    if (!signature || !timestamp) {
      console.warn("Missing Slack signature or timestamp");
      return NextResponse.json({ error: "Invalid request" }, { status: 401 });
    }

    // Verify timestamp is recent (within 5 minutes) to prevent replay attacks
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const requestTimestamp = parseInt(timestamp, 10);
    if (Math.abs(currentTimestamp - requestTimestamp) > 300) {
      console.warn("Slack request timestamp too old");
      return NextResponse.json({ error: "Request expired" }, { status: 401 });
    }

    // Verify Slack signature with SLACK_SIGNING_SECRET
    if (env.SLACK_SIGNING_SECRET) {
      const crypto = await import("crypto");
      const sigBasestring = `v0:${timestamp}:${rawBody}`;
      const mySignature = 'v0=' + crypto.createHmac('sha256', env.SLACK_SIGNING_SECRET).update(sigBasestring, 'utf8').digest('hex');

      // Use timing-safe comparison to prevent timing attacks
      const isValid = crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(signature, 'utf8')
      );

      if (!isValid) {
        console.warn("Slack signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("SLACK_SIGNING_SECRET not configured - skipping signature verification (NOT RECOMMENDED FOR PRODUCTION)");
    }

    const payload = JSON.parse(payloadStr) as SlackInteractionPayload;

    if (payload.type === "block_actions") {
      const action = payload.actions[0];
      if (!action) {
        return NextResponse.json({ error: "No action found" }, { status: 400 });
      }

      const actionId = action.action_id;

      if (actionId === "approve_review" || actionId === "reject_review") {
        let value: { reviewId: string; reviewerEmail: string };

        try {
          value = JSON.parse(action.value) as {
            reviewId: string;
            reviewerEmail: string;
          };
        } catch (error) {
          console.error("Failed to parse action value:", error);
          return NextResponse.json({
            response_type: "ephemeral",
            replace_original: false,
            text: "Invalid action data. Please try again.",
          });
        }

        const decision = actionId === "approve_review" ? "APPROVED" : "REJECTED";
        const slackUserId = payload.user.id;
        const slackUserName = payload.user.name;

        // Find reviewer by email
        const reviewer = await prisma.reviewer.findFirst({
          where: {
            reviewId: value.reviewId,
            email: value.reviewerEmail,
          },
          include: {
            review: {
              include: {
                creator: true,
                reviewers: true,
              },
            },
          },
        });

        if (!reviewer) {
          return NextResponse.json({
            response_type: "ephemeral",
            replace_original: false,
            text: "Unable to process: Review or reviewer not found.",
          });
        }

        if (reviewer.status !== "PENDING") {
          return NextResponse.json({
            response_type: "ephemeral",
            replace_original: false,
            text: `This review has already been ${reviewer.status.toLowerCase()}.`,
          });
        }

        const review = reviewer.review;

        // Use transaction to prevent race conditions
        await prisma.$transaction(async (tx) => {
          // Update reviewer status
          await tx.reviewer.update({
            where: { id: reviewer.id },
            data: {
              status: decision,
              decidedAt: new Date(),
            },
          });

          // Recalculate review status within same transaction
          const updatedReviewers = await tx.reviewer.findMany({
            where: { reviewId: value.reviewId },
          });

          let calculatedStatus = review.status;
          const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
          const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
          const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
          const total = updatedReviewers.length;

          if (review.workflowType === "ANY_ONE") {
            calculatedStatus = decision;
          } else {
            if (rejected > 0) calculatedStatus = "REJECTED";
            else if (changesRequested > 0) calculatedStatus = "CHANGES_REQUESTED";
            else if (approved === total) calculatedStatus = "APPROVED";
            else if (approved > 0) calculatedStatus = "PARTIALLY_APPROVED";
          }

          // Update review status if changed
          if (calculatedStatus !== review.status) {
            await tx.review.update({
              where: { id: review.id },
              data: { status: calculatedStatus },
            });
          }

          // Log activity
          await tx.activityLog.create({
            data: {
              reviewId: value.reviewId,
              action: decision === "APPROVED" ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
              metadata: {
                reviewerEmail: value.reviewerEmail,
                via: "slack",
                slackUserId,
                slackUserName,
              },
            },
          });
        });

        // Send email notification to creator
        if (review.creator.email) {
          try {
            await sendReviewDecisionEmail({
              to: review.creator.email,
              creatorName: review.creator.name ?? "there",
              title: review.title,
              decision: decision.toLowerCase() as "approved" | "rejected",
              reviewerEmail: value.reviewerEmail,
              reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
            });
          } catch (error) {
            console.error("Failed to send decision email:", error);
          }
        }

        // Update the original Slack message
        const emoji = decision === "APPROVED" ? ":white_check_mark:" : ":x:";
        const statusText = decision === "APPROVED" ? "Approved" : "Rejected";

        return NextResponse.json({
          response_type: "in_channel",
          replace_original: true,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${review.title}*\n\n${emoji} *${statusText}* by <@${slackUserId}>`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `Decision recorded at ${new Date().toISOString()} | <${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}|View Review>`,
                },
              ],
            },
          ],
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Slack interaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Type definitions for Slack interaction payloads
interface SlackInteractionPayload {
  type: "block_actions" | "view_submission" | "shortcut";
  user: {
    id: string;
    name: string;
    username: string;
    team_id: string;
  };
  trigger_id: string;
  actions: Array<{
    action_id: string;
    block_id: string;
    value: string;
    type: string;
  }>;
  response_url: string;
  message?: {
    ts: string;
    text: string;
  };
}
