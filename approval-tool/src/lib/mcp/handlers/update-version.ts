import { prisma } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";
import { sanitizeForStorage } from "@/lib/sanitization";
import { env } from "@/env";
import { z } from "zod";
import { getEmailUsername } from "@/lib/utils";
import { captureException } from "@/lib/error-tracking";

export const UpdateReviewSchema = z.object({
  reviewId: z.string().describe("The review ID to update"),
  newContent: z.string().describe("Updated content"),
  changeSummary: z.string().optional().describe("Brief summary of what changed"),
  notifyReviewers: z.enum(["all", "pending_only", "none"]).default("pending_only")
    .describe("Which reviewers to notify about the update"),
});

export async function handleUpdateReview(
  input: z.infer<typeof UpdateReviewSchema>,
  userId: string,
  userName: string
) {
  const review = await prisma.review.findFirst({
    where: { id: input.reviewId, creatorId: userId },
    include: { reviewers: true, versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!review) {
    return {
      content: [{ type: "text", text: "Review not found or you don't have access." }],
      isError: true,
    };
  }

  const newVersion = (review.versions[0]?.version ?? 0) + 1;
  const contentFormat = review.versions[0]?.contentFormat ?? "MARKDOWN";

  const wordCount = input.newContent.split(/\s+/).filter(Boolean).length;
  const characterCount = input.newContent.length;

  const sanitizedContent = sanitizeForStorage(input.newContent, contentFormat);

  await prisma.reviewVersion.create({
    data: {
      reviewId: review.id,
      version: newVersion,
      content: sanitizedContent,
      contentFormat,
      changes: input.changeSummary,
      wordCount,
      characterCount,
    },
  });

  if (review.status === "CHANGES_REQUESTED") {
    await prisma.review.update({
      where: { id: review.id },
      data: { status: "PENDING" },
    });
  }

  const reviewersToNotify = input.notifyReviewers === "all"
    ? review.reviewers
    : input.notifyReviewers === "pending_only"
    ? review.reviewers.filter((r) => r.status === "PENDING" || r.status === "CHANGES_REQUESTED")
    : [];

  for (const reviewer of reviewersToNotify) {
    const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
    try {
      await sendReviewRequestEmail({
        to: reviewer.email,
        reviewerName: reviewer.name ?? getEmailUsername(reviewer.email),
        creatorName: userName,
        title: `[Updated v${newVersion}] ${review.title}`,
        reviewUrl: accessUrl,
      });
    } catch (e) {
      captureException(e instanceof Error ? e : new Error("Failed to notify reviewer"), {
        extra: { email: reviewer.email, reviewId: review.id },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      action: "REVIEW_UPDATED",
      userId,
      reviewId: review.id,
      metadata: { version: newVersion, changes: input.changeSummary },
    },
  });

  return {
    content: [{
      type: "text",
      text: `Review updated to version ${newVersion}!

**${review.title}**
${input.changeSummary ? `Changes: ${input.changeSummary}` : ""}
Notified: ${reviewersToNotify.length} reviewer(s)

Link: ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
    }],
  };
}
