import { z } from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/env";

export const UpdatePublicAccessSchema = z.object({
  reviewId: z.string().optional().describe("Specific review ID to update"),
  titleSearch: z.string().optional().describe("Search reviews by title"),
  accessLevel: z.enum(["none", "view_only", "view_comment", "full_access"])
    .describe("Public access level: none (invite only), view_only (anyone can view), view_comment (view and comment), full_access (anyone can approve)"),
});

export async function handleUpdatePublicAccess(
  input: z.infer<typeof UpdatePublicAccessSchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
    });
  } else if (input.titleSearch) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.titleSearch, mode: "insensitive" },
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

  const accessLevelMap: Record<string, "NONE" | "VIEW_ONLY" | "VIEW_COMMENT" | "FULL_ACCESS"> = {
    none: "NONE",
    view_only: "VIEW_ONLY",
    view_comment: "VIEW_COMMENT",
    full_access: "FULL_ACCESS",
  };

  const newAccessLevel = accessLevelMap[input.accessLevel];

  await prisma.review.update({
    where: { id: review.id },
    data: { publicAccessLevel: newAccessLevel },
  });

  await prisma.activityLog.create({
    data: {
      action: "REVIEW_UPDATED",
      userId,
      reviewId: review.id,
      metadata: { publicAccessLevel: newAccessLevel, via: "mcp" },
    },
  });

  const accessLevelLabels: Record<string, string> = {
    NONE: "Invite only (no public access)",
    VIEW_ONLY: "Anyone with link can view",
    VIEW_COMMENT: "Anyone with link can view and comment",
    FULL_ACCESS: "Anyone with link can approve/reject",
  };

  return {
    content: [{
      type: "text",
      text: `Public access updated for "${review.title}"

**New Access Level:** ${accessLevelLabels[newAccessLevel]}
**Share Link:** ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}

${newAccessLevel === "FULL_ACCESS" ? "Anyone with this link can now approve or reject the review." : ""}`,
    }],
  };
}
