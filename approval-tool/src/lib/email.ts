import { ServerClient } from "postmark";
import { render } from "@react-email/components";
import { env } from "@/env";
import {
  ReviewRequestEmail,
  ReviewDecisionEmail,
  ReminderEmail,
  OrganizationInviteEmail,
} from "@/emails";

const client = env.POSTMARK_TOKEN
  ? new ServerClient(env.POSTMARK_TOKEN)
  : null;

/**
 * Helper to send emails with consistent error handling
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!client) {
    console.warn("[Email] Postmark not configured, skipping email send");
    return;
  }

  if (!env.FROM_EMAIL) {
    console.error("[Email] FROM_EMAIL environment variable is not configured");
    throw new Error("Email sending is not properly configured. Please contact support.");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: subject,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    throw new Error("Failed to send email notification");
  }
}

// ========================================
// REVIEW EMAILS
// ========================================

export async function sendReviewRequestEmail({
  to,
  reviewerName,
  creatorName,
  title,
  reviewUrl,
  reviewId,
  reviewerId,
}: {
  to: string;
  reviewerName?: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
  reviewId?: string;
  reviewerId?: string;
}) {
  // Extract token from reviewUrl safely
  let token = "";
  try {
    const urlParts = new URL(reviewUrl);
    token = urlParts.searchParams.get("token") ?? "";
  } catch (error) {
    console.error("[Email] Invalid reviewUrl provided:", error);
    token = "";
  }

  // Validate we have the necessary data for one-click links
  const canBuildOneClickLinks = reviewId && reviewerId && token;

  // Build one-click approve/reject URLs
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const approveUrl = canBuildOneClickLinks
    ? `${baseUrl}/en/approve/${reviewId}/${reviewerId}?token=${encodeURIComponent(token)}&decision=approve`
    : undefined;
  const rejectUrl = canBuildOneClickLinks
    ? `${baseUrl}/en/approve/${reviewId}/${reviewerId}?token=${encodeURIComponent(token)}&decision=reject`
    : undefined;

  const html = await render(
    ReviewRequestEmail({
      reviewerName,
      creatorName,
      title,
      reviewUrl,
      approveUrl,
      rejectUrl,
    })
  );

  await sendEmail({
    to,
    subject: `Review request: ${title}`,
    html,
  });
}

export async function sendReviewDecisionEmail({
  to,
  creatorName,
  title,
  decision,
  reviewerEmail,
  comments,
  reviewUrl,
}: {
  to: string;
  creatorName: string;
  title: string;
  decision: "approved" | "rejected" | "changes_requested";
  reviewerEmail?: string;
  comments?: string;
  reviewUrl: string;
}) {
  const statusText = {
    approved: "Approved",
    rejected: "Rejected",
    changes_requested: "Changes Requested",
  };

  const html = await render(
    ReviewDecisionEmail({
      creatorName,
      title,
      decision,
      reviewerEmail,
      comments,
      reviewUrl,
    })
  );

  await sendEmail({
    to,
    subject: `Review ${statusText[decision]}: ${title}`,
    html,
  });
}

export async function sendReminderEmail({
  to,
  reviewerName,
  creatorName,
  title,
  reviewUrl,
}: {
  to: string;
  reviewerName?: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
}) {
  const html = await render(
    ReminderEmail({
      reviewerName,
      creatorName,
      title,
      reviewUrl,
    })
  );

  await sendEmail({
    to,
    subject: `Reminder: Review pending - ${title}`,
    html,
  });
}

// ========================================
// ORGANIZATION EMAILS
// ========================================

export async function sendOrganizationInviteEmail({
  to,
  inviterName,
  organizationName,
  inviteLink,
  role,
}: {
  to: string;
  inviterName: string;
  organizationName: string;
  inviteLink: string;
  role: string;
}) {
  const html = await render(
    OrganizationInviteEmail({
      inviterName,
      organizationName,
      inviteLink,
      role,
    })
  );

  await sendEmail({
    to,
    subject: `You're invited to join ${organizationName}`,
    html,
  });
}
