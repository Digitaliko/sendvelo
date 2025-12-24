import { prisma } from "@/lib/db";
import { z } from "zod";

export const CancelReviewSchema = z.object({
  reviewId: z.string().optional().describe("Review ID to cancel"),
  title: z.string().optional().describe("Search by review title"),
}).refine(
  (data) => data.reviewId || data.title,
  { message: "Either reviewId or title must be provided" }
);

export async function handleCancelReview(
  input: z.infer<typeof CancelReviewSchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
    });
  } else if (input.title) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.title, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!review) {
    return {
      content: [{ type: "text", text: "Review not found or you don't have permission to cancel it." }],
      isError: true,
    };
  }

  if (review.status === "CANCELED") {
    return {
      content: [{
        type: "text",
        text: `The review "${review.title}" is already cancelled.`,
      }],
    };
  }

  await prisma.review.update({
    where: { id: review.id },
    data: { status: "CANCELED" },
  });

  await prisma.activityLog.create({
    data: {
      action: "REVIEW_CANCELED",
      userId,
      reviewId: review.id,
    },
  });

  return {
    content: [{
      type: "text",
      text: `Successfully cancelled the review "${review.title}". All pending reviewers have been notified that this review is no longer active.`,
    }],
  };
}
