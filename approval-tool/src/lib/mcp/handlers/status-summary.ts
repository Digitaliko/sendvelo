import { prisma } from "@/lib/db";
import { z } from "zod";
import { formatTimeAgo } from "@/lib/mcp/utils";

export const StatusSummarySchema = z.object({
  reviewId: z.string().optional().describe("Review ID to summarize"),
  title: z.string().optional().describe("Search by review title"),
}).refine(
  (data) => data.reviewId || data.title,
  { message: "Either reviewId or title must be provided" }
);

function getHoursSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
}

export async function handleStatusSummary(
  input: z.infer<typeof StatusSummarySchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
      include: {
        reviewers: { orderBy: { order: "asc" } },
      },
    });
  } else if (input.title) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.title, mode: "insensitive" },
      },
      include: {
        reviewers: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!review) {
    return {
      content: [{ type: "text", text: "Review not found. Try listing your reviews first." }],
      isError: true,
    };
  }

  const totalReviewers = review.reviewers.length;
  const approvedCount = review.reviewers.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = review.reviewers.filter((r) => r.status === "REJECTED").length;
  const changesRequestedCount = review.reviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
  const pendingCount = review.reviewers.filter((r) => r.status === "PENDING").length;

  const reviewerDetails: string[] = [];
  const suggestions: string[] = [];

  for (const reviewer of review.reviewers) {
    const email = reviewer.name ?? reviewer.email;

    if (reviewer.status === "APPROVED") {
      reviewerDetails.push(`${email} approved ${formatTimeAgo(reviewer.decidedAt!)}`);
    } else if (reviewer.status === "REJECTED") {
      reviewerDetails.push(`${email} rejected ${formatTimeAgo(reviewer.decidedAt!)}`);
    } else if (reviewer.status === "CHANGES_REQUESTED") {
      reviewerDetails.push(`${email} requested changes ${formatTimeAgo(reviewer.decidedAt!)}`);
    } else if (reviewer.status === "PENDING") {
      if (reviewer.viewedAt) {
        const hoursSinceView = getHoursSince(reviewer.viewedAt);
        reviewerDetails.push(`${email} viewed ${formatTimeAgo(reviewer.viewedAt)} but hasn't decided`);

        if (hoursSinceView > 24) {
          suggestions.push(`Consider nudging ${email} - viewed ${Math.floor(hoursSinceView / 24)} days ago but hasn't responded`);
        }
      } else {
        const hoursSinceCreated = getHoursSince(review.createdAt);
        reviewerDetails.push(`${email} hasn't viewed yet`);

        if (hoursSinceCreated > 24) {
          suggestions.push(`Consider nudging ${email} - hasn't viewed the review in ${Math.floor(hoursSinceCreated / 24)} days`);
        }
      }
    }
  }

  let statusLine = "";
  if (approvedCount === totalReviewers && totalReviewers > 0) {
    statusLine = `All ${totalReviewers} reviewers approved. Ready to proceed!`;
    suggestions.push("All reviewers have approved - you're good to go!");
  } else if (rejectedCount > 0) {
    statusLine = `${approvedCount} of ${totalReviewers} approved, ${rejectedCount} rejected`;
    suggestions.push("Some reviewers rejected - review their feedback and consider updating the review");
  } else if (changesRequestedCount > 0) {
    statusLine = `${approvedCount} of ${totalReviewers} approved, ${changesRequestedCount} requested changes`;
    suggestions.push("Changes requested - address the feedback and update the review version");
  } else if (approvedCount > 0) {
    statusLine = `${approvedCount} of ${totalReviewers} approved`;
  } else {
    statusLine = `0 of ${totalReviewers} approved`;

    const allUnviewed = review.reviewers.every((r) => !r.viewedAt);
    if (allUnviewed && getHoursSince(review.createdAt) > 48) {
      suggestions.push("No one has viewed this review yet after 2+ days - consider sending reminders");
    }
  }

  const summary = `Your '${review.title}' review: ${statusLine}. ${reviewerDetails.join(", ")}.`;

  return {
    content: [{
      type: "text",
      text: `**Status Summary**

${summary}

${suggestions.length > 0 ? `**Suggestions:**\n${suggestions.map((s) => `- ${s}`).join("\n")}` : ""}`,
    }],
    summary,
    suggestions,
    data: {
      reviewId: review.id,
      title: review.title,
      status: review.status,
      totalReviewers,
      approvedCount,
      rejectedCount,
      changesRequestedCount,
      pendingCount,
      createdAt: review.createdAt,
    },
  };
}
