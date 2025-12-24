import { prisma } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";
import { sanitizeForStorage } from "@/lib/sanitization";
import { env } from "@/env";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getEmailUsername } from "@/lib/utils";
import { captureException } from "@/lib/error-tracking";

export const SendForReviewSchema = z.object({
  title: z.string().describe("Title of the content to review"),
  content: z.string().describe("Content to review (markdown supported)"),
  reviewers: z.array(z.string().email()).min(1).max(10)
    .describe("Email addresses of reviewers (1-10)"),
  workflowType: z.enum(["parallel", "sequential", "any_one"]).default("parallel")
    .describe("Workflow type: parallel (all approve), sequential (in order), any_one (first approves)"),
  remindAfter: z.enum(["24h", "48h", "72h", "never"]).default("24h")
    .describe("Auto-remind after this time if no response"),
  format: z.enum(["plain_text", "markdown", "html"]).default("markdown")
    .describe("Content format: plain_text, markdown, or html. Defaults to markdown."),
});

export async function handleSendForReview(
  input: z.infer<typeof SendForReviewSchema>,
  userId: string,
  userName: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, reviewsThisMonth: true, resetDate: true },
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  if (now.getMonth() !== user.resetDate.getMonth()) {
    await prisma.user.update({
      where: { id: userId },
      data: { reviewsThisMonth: 0, resetDate: now },
    });
    user.reviewsThisMonth = 0;
  }

  const limits: Record<string, number> = {
    FREE: 5,
    STARTER: 999999,
    TEAM: 999999,
    BUSINESS: 999999,
  };

  const limit = limits[user.subscriptionTier] ?? 5;
  if (user.reviewsThisMonth >= limit) {
    return {
      content: [{
        type: "text",
        text: `You've reached your monthly limit of ${limit} reviews. Upgrade at ${env.NEXT_PUBLIC_APP_URL}/en/dashboard to send more reviews.`,
      }],
      isError: true,
    };
  }

  const validEmails = input.reviewers.filter((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });

  if (validEmails.length === 0) {
    return {
      content: [{
        type: "text",
        text: "No valid email addresses provided. Please provide at least one valid reviewer email.",
      }],
      isError: true,
    };
  }

  const contentFormatMap: Record<string, "PLAIN_TEXT" | "MARKDOWN" | "HTML"> = {
    plain_text: "PLAIN_TEXT",
    markdown: "MARKDOWN",
    html: "HTML",
  };
  const contentFormat = contentFormatMap[input.format] ?? "MARKDOWN";

  const wordCount = input.content.split(/\s+/).filter(Boolean).length;
  const characterCount = input.content.length;

  const sanitizedTitle = input.title.trim().slice(0, 200);
  const sanitizedContent = sanitizeForStorage(input.content, contentFormat);

  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        slug: nanoid(10),
        title: sanitizedTitle,
        creatorId: userId,
        workflowType: input.workflowType.toUpperCase() as "PARALLEL" | "SEQUENTIAL" | "ANY_ONE",
        versions: {
          create: {
            version: 1,
            content: sanitizedContent,
            contentFormat,
            wordCount,
            characterCount,
          },
        },
        reviewers: {
          create: input.reviewers.map((email, index) => ({
            email: email.toLowerCase().trim(),
            order: input.workflowType === "sequential" ? index + 1 : 0,
          })),
        },
      },
      include: {
        reviewers: true,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { reviewsThisMonth: { increment: 1 } },
    });

    return newReview;
  });

  const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;
  for (const reviewer of review.reviewers) {
    const accessUrl = `${reviewUrl}?token=${reviewer.accessToken}`;
    try {
      await sendReviewRequestEmail({
        to: reviewer.email,
        reviewerName: getEmailUsername(reviewer.email),
        creatorName: userName,
        title: input.title,
        reviewUrl: accessUrl,
        reviewId: review.id,
        reviewerId: reviewer.id,
      });
    } catch (e) {
      captureException(e instanceof Error ? e : new Error("Failed to send email to reviewer"), {
        extra: { email: reviewer.email, reviewId: review.id },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      action: "REVIEW_CREATED",
      userId,
      reviewId: review.id,
      metadata: { reviewerCount: input.reviewers.length, workflowType: input.workflowType },
    },
  });

  const remaining = user.subscriptionTier === "FREE"
    ? limit - (user.reviewsThisMonth + 1)
    : "unlimited";

  return {
    content: [{
      type: "text",
      text: `Review created successfully!

**${input.title}**
Link: ${reviewUrl}
Reviewers: ${input.reviewers.join(", ")}
Workflow: ${input.workflowType}
Format: ${input.format}
Reminder: ${input.remindAfter}

Reviews remaining: ${remaining}`,
    }],
    structuredContent: {
      reviewId: review.id,
      title: input.title,
      slug: review.slug,
      shareLink: reviewUrl,
      workflowType: input.workflowType,
      format: input.format,
      remindAfter: input.remindAfter,
      reviewers: review.reviewers.map((r) => ({
        email: r.email,
        status: "sent" as const,
      })),
      reviewsRemaining: remaining,
    },
  };
}
