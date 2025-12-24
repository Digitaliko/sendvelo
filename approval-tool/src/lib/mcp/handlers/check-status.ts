import { prisma } from "@/lib/db";
import { env } from "@/env";
import { z } from "zod";
import { formatTimeAgo } from "@/lib/mcp/utils";

export const CheckStatusSchema = z.object({
  reviewId: z.string().optional().describe("Specific review ID to check"),
  titleSearch: z.string().optional().describe("Search reviews by title"),
});

export async function handleCheckStatus(
  input: z.infer<typeof CheckStatusSchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
      include: {
        reviewers: { orderBy: { order: "asc" } },
        versions: { orderBy: { version: "desc" }, take: 1 },
      },
    });
  } else if (input.titleSearch) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.titleSearch, mode: "insensitive" },
      },
      include: {
        reviewers: { orderBy: { order: "asc" } },
        versions: { orderBy: { version: "desc" }, take: 1 },
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

  const statusEmoji: Record<string, string> = {
    PENDING: "[PENDING]",
    APPROVED: "[APPROVED]",
    REJECTED: "[REJECTED]",
    CHANGES_REQUESTED: "[CHANGES]",
    PARTIALLY_APPROVED: "[PARTIAL]",
  };

  const reviewerStatuses = review.reviewers.map((r) => {
    const emoji = statusEmoji[r.status] ?? "[PENDING]";
    const viewed = r.viewedAt ? ` (viewed ${formatTimeAgo(r.viewedAt)})` : "";
    return `  ${emoji} ${r.email}${viewed}`;
  }).join("\n");

  const totalReviewers = review.reviewers.length;
  const approvedCount = review.reviewers.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = review.reviewers.filter((r) => r.status === "REJECTED").length;
  const changesRequestedCount = review.reviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
  const pendingCount = review.reviewers.filter((r) => r.status === "PENDING").length;

  const shareLink = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;

  return {
    content: [{
      type: "text",
      text: `**${review.title}**

Status: ${statusEmoji[review.status] ?? "[PENDING]"} ${review.status}
Version: ${review.versions[0]?.version ?? 1}
Created: ${formatTimeAgo(review.createdAt)}

**Reviewers:**
${reviewerStatuses}

Link: ${shareLink}`,
    }],
    structuredContent: {
      reviewId: review.id,
      title: review.title,
      status: review.status,
      slug: review.slug,
      createdAt: review.createdAt.toISOString(),
      shareLink,
      totalReviewers,
      approvedCount,
      rejectedCount,
      changesRequestedCount,
      pendingCount,
      reviewers: review.reviewers.map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        status: r.status,
        viewedAt: r.viewedAt?.toISOString() ?? null,
        decidedAt: r.decidedAt?.toISOString() ?? null,
        timeSpentMs: r.timeSpentMs,
      })),
    },
  };
}
