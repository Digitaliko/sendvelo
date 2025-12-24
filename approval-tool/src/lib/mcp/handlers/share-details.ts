import { z } from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { formatTimeAgo } from "@/lib/mcp/utils";

export const GetShareDetailsSchema = z.object({
  reviewId: z.string().optional().describe("Specific review ID to get share details for"),
  titleSearch: z.string().optional().describe("Search reviews by title"),
});

export async function handleGetShareDetails(
  input: z.infer<typeof GetShareDetailsSchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
      include: {
        reviewers: {
          orderBy: { createdAt: "asc" },
          select: {
            email: true,
            name: true,
            status: true,
            viewedAt: true,
            decidedAt: true,
            isPublicSubmission: true,
          },
        },
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          select: {
            version: true,
            content: true,
            contentFormat: true,
          },
        },
      },
    });
  } else if (input.titleSearch) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.titleSearch, mode: "insensitive" },
      },
      include: {
        reviewers: {
          orderBy: { createdAt: "asc" },
          select: {
            email: true,
            name: true,
            status: true,
            viewedAt: true,
            decidedAt: true,
            isPublicSubmission: true,
          },
        },
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          select: {
            version: true,
            content: true,
            contentFormat: true,
          },
        },
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

  const accessLevelLabels: Record<string, string> = {
    NONE: "Invite only (no public access)",
    VIEW_ONLY: "Anyone with link can view",
    VIEW_COMMENT: "Anyone with link can view and comment",
    FULL_ACCESS: "Anyone with link can approve/reject",
  };

  const reviewerList = review.reviewers.map((r) => {
    const status = r.status === "PENDING" ? "[PENDING]" : r.status === "APPROVED" ? "[APPROVED]" : r.status === "REJECTED" ? "[REJECTED]" : "[CHANGES]";
    const viewed = r.viewedAt ? `viewed ${formatTimeAgo(r.viewedAt)}` : "not viewed";
    const publicTag = r.isPublicSubmission ? " (via public link)" : "";
    return `  ${status} ${r.email}${publicTag} - ${viewed}`;
  }).join("\n");

  const latestVersion = review.versions[0];
  const approvers = review.reviewers
    .filter((r) => r.status === "APPROVED")
    .map((r) => ({
      name: r.name ?? r.email.split("@")[0],
      email: r.email,
      approvedAt: r.decidedAt?.toISOString() ?? null,
    }));

  const formatMap: Record<string, "plain_text" | "markdown" | "html"> = {
    PLAIN_TEXT: "plain_text",
    MARKDOWN: "markdown",
    HTML: "html",
  };

  return {
    content: [{
      type: "text",
      text: `**Share Details for "${review.title}"**

**Public Access:** ${accessLevelLabels[review.publicAccessLevel] ?? review.publicAccessLevel}
**Public Views:** ${review.publicViewCount}

**Share Link:** ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}

**Reviewers:**
${reviewerList}

---
To change the access level, use update_public_access tool.`,
    }],
    structuredContent: {
      reviewId: review.id,
      title: review.title,
      content: latestVersion?.content ?? "",
      format: formatMap[latestVersion?.contentFormat ?? "MARKDOWN"] ?? "markdown",
      status: review.status,
      approvedAt: review.status === "APPROVED" ? review.updatedAt.toISOString() : null,
      approvers,
      shareLink: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
      version: latestVersion?.version ?? 1,
    },
  };
}
