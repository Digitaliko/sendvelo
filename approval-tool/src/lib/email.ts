import { ServerClient } from "postmark";
import { env } from "@/env";

const client = env.POSTMARK_TOKEN
  ? new ServerClient(env.POSTMARK_TOKEN)
  : null;

// ========================================
// EMAIL TEMPLATE HELPERS
// ========================================

function getBaseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .content { background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4F46E5; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 24px 0; }
          .button:hover { background: #4338CA; }
          .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px; }
          .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: 600; font-size: 14px; }
          .status-approved { background: #10b981; color: white; }
          .status-rejected { background: #ef4444; color: white; }
          .status-changes { background: #f59e0b; color: white; }
          .comment-box { background: white; padding: 16px; border-left: 4px solid #4F46E5; margin: 16px 0; border-radius: 0 4px 4px 0; }
          .url-text { margin-top: 24px; font-size: 13px; color: #6b7280; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          <div class="footer">
            <p>Powered by SendVelo</p>
          </div>
        </div>
      </body>
    </html>
  `;
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
    console.error("Invalid reviewUrl provided to sendReviewRequestEmail:", error);
    // If URL parsing fails, we can't build one-click links - fall back to regular review link
    token = "";
  }

  // Validate we have the necessary data for one-click links
  const canBuildOneClickLinks = reviewId && reviewerId && token;

  // Build one-click approve/reject URLs
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const approveUrl = canBuildOneClickLinks
    ? `${baseUrl}/en/approve/${reviewId}/${reviewerId}?token=${encodeURIComponent(token)}&decision=approve`
    : reviewUrl;
  const rejectUrl = canBuildOneClickLinks
    ? `${baseUrl}/en/approve/${reviewId}/${reviewerId}?token=${encodeURIComponent(token)}&decision=reject`
    : reviewUrl;

  const content = `
    <div class="header">
      <h1>Review Request</h1>
    </div>
    <div class="content">
      <p>Hello${reviewerName ? ` ${reviewerName}` : ""},</p>
      <p><strong>${creatorName}</strong> has requested your review for:</p>
      <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>

      ${canBuildOneClickLinks ? `
      <!-- One-Click Approve/Reject Buttons -->
      <div style="margin: 32px 0; text-align: center;">
        <a href="${approveUrl}"
           style="display: inline-block; padding: 14px 32px; background: #22c55e; color: white;
                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;
                  margin-right: 12px;">
          Approve
        </a>
        <a href="${rejectUrl}"
           style="display: inline-block; padding: 14px 32px; background: #ef4444; color: white;
                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Reject
        </a>
      </div>
      <p style="color: #6a6a6a; font-size: 14px; text-align: center; margin-bottom: 24px;">
        Or <a href="${reviewUrl}" style="color: #3b82f6;">view the full review</a> to add comments or request changes
      </p>
      ` : `
      <p>Click the button below to review and provide your feedback:</p>
      <a href="${reviewUrl}" class="button">Review Now</a>
      `}

      <p class="url-text">
        Copy and paste this URL into your browser:<br>
        ${reviewUrl}
      </p>
    </div>
  `;

  const html = getBaseTemplate(content);

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    return;
  }

  if (!env.FROM_EMAIL) {
    console.error("FROM_EMAIL environment variable is not configured");
    throw new Error("Email sending is not properly configured. Please contact support.");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: `Review request: ${title}`,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("Failed to send review request email:", error);
    throw new Error("Failed to send email notification");
  }
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
  const statusConfig = {
    approved: { color: "#10b981", text: "Approved", class: "status-approved", headerBg: "#10b981" },
    rejected: { color: "#ef4444", text: "Rejected", class: "status-rejected", headerBg: "#ef4444" },
    changes_requested: { color: "#f59e0b", text: "Changes Requested", class: "status-changes", headerBg: "#f59e0b" },
  };

  const status = statusConfig[decision];

  const content = `
    <div class="header" style="background: ${status.headerBg};">
      <h1>Review Decision</h1>
    </div>
    <div class="content">
      <p>Hello ${creatorName},</p>
      <p>Your review request has been:</p>
      <p><span class="status-badge ${status.class}">${status.text}</span></p>
      <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
      ${reviewerEmail ? `<p style="color: #6b7280;">Decision by: ${reviewerEmail}</p>` : ""}
      ${comments ? `
        <div class="comment-box">
          <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Feedback</h4>
          <p style="margin: 0;">${comments}</p>
        </div>
      ` : ""}
      <a href="${reviewUrl}" class="button">View Review</a>
    </div>
  `;

  const html = getBaseTemplate(content);

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    return;
  }

  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: `Review ${status.text}: ${title}`,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("Failed to send review decision email:", error);
    throw new Error("Failed to send email notification");
  }
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
  const content = `
    <div class="header" style="background: #f59e0b;">
      <h1>Reminder: Review Pending</h1>
    </div>
    <div class="content">
      <p>Hello${reviewerName ? ` ${reviewerName}` : ""},</p>
      <p>This is a friendly reminder that <strong>${creatorName}</strong> is waiting for your review on:</p>
      <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
      <p>Please take a moment to review and provide your feedback:</p>
      <a href="${reviewUrl}" class="button">Review Now</a>
      <p class="url-text">
        Or copy and paste this URL into your browser:<br>
        ${reviewUrl}
      </p>
    </div>
  `;

  const html = getBaseTemplate(content);

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    return;
  }

  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: `Reminder: Review pending - ${title}`,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("Failed to send reminder email:", error);
    throw new Error("Failed to send email notification");
  }
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
  const content = `
    <div class="header">
      <h1>Organization Invitation</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> as a <strong>${role.toLowerCase()}</strong>.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${inviteLink}" class="button">Accept Invitation</a>
      <p class="url-text">
        Or copy and paste this URL into your browser:<br>
        ${inviteLink}
      </p>
      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        This invitation will expire in 7 days.
      </p>
    </div>
  `;

  const html = getBaseTemplate(content);

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    return;
  }

  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: `You're invited to join ${organizationName}`,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("Failed to send organization invite email:", error);
    throw new Error("Failed to send email notification");
  }
}
