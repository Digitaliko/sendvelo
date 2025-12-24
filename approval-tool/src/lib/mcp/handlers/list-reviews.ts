import { prisma } from "@/lib/db";
import { env } from "@/env";
import { z } from "zod";
import { formatTimeAgo } from "@/lib/mcp/utils";

export const ListReviewsSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "all"]).default("all")
    .describe("Filter by status"),
  limit: z.number().min(1).max(20).default(10)
    .describe("Maximum number of reviews to return"),
});

export async function handleListReviews(
  input: z.infer<typeof ListReviewsSchema>,
  userId: string
) {
  const statusMap: Record<string, "PENDING" | "APPROVED" | "REJECTED"> = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
  };

  const reviews = await prisma.review.findMany({
    where: {
      creatorId: userId,
      ...(input.status !== "all" && statusMap[input.status] ? { status: statusMap[input.status] } : {}),
    },
    include: {
      reviewers: true,
      _count: { select: { reviewers: true } },
    },
    orderBy: { createdAt: "desc" },
    take: input.limit,
  });

  if (reviews.length === 0) {
    return {
      content: [{ type: "text", text: "No reviews found." }],
      structuredContent: {
        reviews: [],
        filter: input.status,
        totalCount: 0,
      },
    };
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "[PENDING]",
    APPROVED: "[APPROVED]",
    REJECTED: "[REJECTED]",
    CHANGES_REQUESTED: "[CHANGES]",
    PARTIALLY_APPROVED: "[PARTIAL]",
  };

  const reviewList = reviews.map((r, i) => {
    const approved = r.reviewers.filter((rv) => rv.status === "APPROVED").length;
    const total = r.reviewers.length;
    return `${i + 1}. ${statusEmoji[r.status] ?? "[PENDING]"} **${r.title}** (${approved}/${total} approved)\n   ID: ${r.id} | ${formatTimeAgo(r.createdAt)}`;
  }).join("\n\n");

  const structuredReviews = reviews.map((r) => {
    const approved = r.reviewers.filter((rv) => rv.status === "APPROVED").length;
    const pending = r.reviewers.filter((rv) => rv.status === "PENDING").length;
    const rejected = r.reviewers.filter((rv) => rv.status === "REJECTED").length;
    const total = r.reviewers.length;

    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      shareLink: `${env.NEXT_PUBLIC_APP_URL}/review/${r.slug}`,
      reviewers: {
        total,
        approved,
        pending,
        rejected,
      },
    };
  });

  return {
    content: [{
      type: "text",
      text: `**Your Reviews** (${input.status})\n\n${reviewList}`,
    }],
    structuredContent: {
      reviews: structuredReviews,
      filter: input.status,
      totalCount: reviews.length,
    },
  };
}
