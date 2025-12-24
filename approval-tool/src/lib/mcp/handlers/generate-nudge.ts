import { prisma } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";
import { env } from "@/env";
import { z } from "zod";
import { getEmailUsername } from "@/lib/utils";
import { captureException } from "@/lib/error-tracking";
import { formatTimeAgo } from "@/lib/mcp/utils";

export const GenerateNudgeSchema = z.object({
  reviewId: z.string().optional().describe("Specific review ID to nudge about"),
  titleSearch: z.string().optional().describe("Search reviews by title to nudge about"),
  reviewerEmail: z.string().email().optional().describe("Specific reviewer to nudge (if not provided, nudges all pending)"),
  tone: z.enum(["friendly", "professional", "urgent"]).default("friendly")
    .describe("Tone of the nudge message"),
  sendImmediately: z.boolean().default(false)
    .describe("If true, sends the nudge immediately. If false, returns the draft for review."),
});

export async function handleGenerateNudge(
  input: z.infer<typeof GenerateNudgeSchema>,
  userId: string,
  userName: string
) {
  let review;
  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
      include: { reviewers: true },
    });
  } else if (input.titleSearch) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.titleSearch, mode: "insensitive" },
      },
      include: { reviewers: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!review) {
    return {
      content: [{ type: "text", text: "Review not found. Try listing your reviews first with list_pending_reviews." }],
      isError: true,
    };
  }

  let reviewersToNudge = review.reviewers.filter((r) => r.status === "PENDING");

  if (input.reviewerEmail) {
    reviewersToNudge = reviewersToNudge.filter(
      (r) => r.email.toLowerCase() === input.reviewerEmail?.toLowerCase()
    );
    if (reviewersToNudge.length === 0) {
      return {
        content: [{ type: "text", text: `${input.reviewerEmail} is not a pending reviewer on this review, or has already responded.` }],
        isError: true,
      };
    }
  }

  if (reviewersToNudge.length === 0) {
    return {
      content: [{ type: "text", text: "No pending reviewers to nudge. All reviewers have already responded!" }],
    };
  }

  const daysSinceCreated = Math.floor((Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const toneTemplates = {
    friendly: {
      subject: `Friendly reminder: "${review.title}" awaiting your feedback`,
      messages: [
        `Hey! Just wanted to check in about "${review.title}". I'd love to get your thoughts whenever you have a moment.`,
        `Hi there! Quick reminder about "${review.title}" - no rush, but would appreciate your feedback when you get a chance.`,
        `Hope you're doing well! Just floating "${review.title}" back to the top - would love to hear what you think!`,
      ],
    },
    professional: {
      subject: `Reminder: Your review requested for "${review.title}"`,
      messages: [
        `I wanted to follow up on the review request for "${review.title}". Your feedback would be valuable in moving this forward.`,
        `This is a gentle reminder regarding "${review.title}". Please review and provide your feedback at your earliest convenience.`,
        `Following up on the pending review for "${review.title}". Your input is important for this decision.`,
      ],
    },
    urgent: {
      subject: `Action needed: "${review.title}" requires your immediate attention`,
      messages: [
        `I need your feedback on "${review.title}" as soon as possible. This is holding up our progress.`,
        `Urgent: "${review.title}" has been waiting ${daysSinceCreated} day(s) for your review. Please respond today if possible.`,
        `Time-sensitive: We're blocked on "${review.title}" and need your decision. Can you please review this today?`,
      ],
    },
  };

  const template = toneTemplates[input.tone];
  const messageIndex = Math.floor(Math.random() * template.messages.length);
  const nudgeMessage = template.messages[messageIndex];

  const reviewerNames = reviewersToNudge.map((r) => r.email).join(", ");
  const viewStatus = reviewersToNudge.map((r) => {
    if (r.viewedAt) {
      return `${r.email}: Viewed ${formatTimeAgo(r.viewedAt)} but hasn't decided`;
    }
    return `${r.email}: Hasn't viewed yet`;
  }).join("\n");

  if (input.sendImmediately) {
    const emailResults: Array<{ email: string; success: boolean; error?: string }> = [];

    for (const reviewer of reviewersToNudge) {
      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? getEmailUsername(reviewer.email),
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
          customMessage: nudgeMessage,
        });
        emailResults.push({ email: reviewer.email, success: true });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        emailResults.push({ email: reviewer.email, success: false, error: errorMessage });
        captureException(e instanceof Error ? e : new Error("Failed to send nudge"), {
          extra: { email: reviewer.email, reviewId: review.id },
        });
      }
    }

    const successCount = emailResults.filter((r) => r.success).length;
    const failureCount = emailResults.filter((r) => !r.success).length;
    const failures = emailResults.filter((r) => !r.success);

    await prisma.activityLog.create({
      data: {
        action: "REMINDER_SENT",
        userId,
        reviewId: review.id,
        metadata: {
          tone: input.tone,
          count: reviewersToNudge.length,
          successCount,
          failureCount,
          aiGenerated: true
        },
      },
    });

    let responseText = `Nudge sent! (${input.tone} tone)

**Review:** ${review.title}
**Message:** "${nudgeMessage}"

**Results:**
- Successfully sent: ${successCount}/${reviewersToNudge.length}`;

    if (failures.length > 0) {
      responseText += `\n- Failed to send: ${failureCount}\n\n**Failed emails:**\n`;
      responseText += failures.map((f) => `- ${f.email}: ${f.error}`).join("\n");
    } else {
      responseText += `\n\nThe reviewer(s) will receive this message with a direct link to respond.`;
    }

    return {
      content: [{
        type: "text",
        text: responseText,
      }],
      isError: failureCount === reviewersToNudge.length,
    };
  }

  return {
    content: [{
      type: "text",
      text: `**AI-Generated Nudge Draft** (${input.tone} tone)

**Review:** ${review.title}
**Waiting:** ${daysSinceCreated} day(s)
**To:** ${reviewerNames}

**Reviewer Status:**
${viewStatus}

**Suggested Message:**
"${nudgeMessage}"

---

To send this nudge, call generate_nudge again with sendImmediately: true

Or you can customize and send manually via manage_reviewers with action: "remind"`,
    }],
    structuredContent: {
      reviewId: review.id,
      reviewTitle: review.title,
      tone: input.tone,
      daysSinceCreated,
      recipients: reviewersToNudge.map((r) => r.email),
      reviewerStatuses: reviewersToNudge.map((r) => ({
        email: r.email,
        viewedAt: r.viewedAt?.toISOString() ?? null,
        status: r.status,
      })),
      suggestedSubject: template.subject,
      suggestedMessage: nudgeMessage,
      isDraft: true,
    },
  };
}
