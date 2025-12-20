import { ServerClient } from "postmark";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

const client = env.POSTMARK_TOKEN
  ? new ServerClient(env.POSTMARK_TOKEN)
  : null;

export async function sendReviewRequestEmail({
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
  // Will implement the actual React Email template later
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Review Request</h1>
          </div>
          <div class="content">
            <p>Hello${reviewerName ? ` ${reviewerName}` : ""},</p>
            <p><strong>${creatorName}</strong> has requested your review for:</p>
            <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
            <p>Click the button below to review and provide your feedback:</p>
            <a href="${reviewUrl}" class="button">Review Now</a>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Or copy and paste this URL into your browser:<br>
              ${reviewUrl}
            </p>
          </div>
          <div class="footer">
            <p>Powered by Approval Tool</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    console.log("Would send email:", { to, subject: `Review request: ${title}`, html });
    return;
  }

  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
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
  comments,
  reviewUrl,
}: {
  to: string;
  creatorName: string;
  title: string;
  decision: "approved" | "rejected";
  comments?: string;
  reviewUrl: string;
}) {
  const statusColor = decision === "approved" ? "#10b981" : "#ef4444";
  const statusText = decision === "approved" ? "Approved" : "Rejected";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .status { display: inline-block; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
          .comments { background: white; padding: 15px; border-left: 4px solid ${statusColor}; margin: 20px 0; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Review Decision</h1>
          </div>
          <div class="content">
            <p>Hello ${creatorName},</p>
            <p>Your review request has been <span class="status">${statusText}</span></p>
            <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
            ${comments ? `
              <div class="comments">
                <h3 style="margin-top: 0; color: #6b7280; font-size: 14px;">Feedback:</h3>
                <p style="margin: 0;">${comments}</p>
              </div>
            ` : ""}
            <a href="${reviewUrl}" class="button">View Review</a>
          </div>
          <div class="footer">
            <p>Powered by Approval Tool</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!client) {
    console.warn("Postmark not configured, skipping email send");
    console.log("Would send email:", { to, subject: `Review ${statusText}: ${title}`, html });
    return;
  }

  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
  }

  try {
    await client.sendEmail({
      From: env.FROM_EMAIL,
      To: to,
      Subject: `Review ${statusText}: ${title}`,
      HtmlBody: html,
    });
  } catch (error) {
    console.error("Failed to send review decision email:", error);
    throw new Error("Failed to send email notification");
  }
}
