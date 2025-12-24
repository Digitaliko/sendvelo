import { prisma } from "@/lib/db";
import { sendReviewRequestEmail, sendReminderEmail } from "@/lib/email";
import { env } from "@/env";
import { z } from "zod";
import { getEmailUsername } from "@/lib/utils";
import { captureException } from "@/lib/error-tracking";

export const ManageReviewersSchema = z.object({
  reviewId: z.string().describe("The review ID"),
  action: z.enum(["add", "remove", "remind"])
    .describe("Action: add new reviewers, remove existing, or send reminder"),
  emails: z.array(z.string().email()).min(1)
    .describe("Email addresses to add/remove/remind"),
});

async function getReviewerWidgetData(reviewId: string, title: string) {
  const reviewers = await prisma.reviewer.findMany({
    where: { reviewId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      viewedAt: true,
      decidedAt: true,
      timeSpentMs: true,
    },
  });

  return {
    reviewId,
    title,
    reviewers: reviewers.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      status: r.status,
      viewedAt: r.viewedAt?.toISOString() ?? null,
      decidedAt: r.decidedAt?.toISOString() ?? null,
      timeSpentMs: r.timeSpentMs,
    })),
    canAddMore: reviewers.length < 10,
    maxReviewers: 10,
  };
}

export async function handleManageReviewers(
  input: z.infer<typeof ManageReviewersSchema>,
  userId: string,
  userName: string
) {
  const review = await prisma.review.findFirst({
    where: { id: input.reviewId, creatorId: userId },
    include: { reviewers: true },
  });

  if (!review) {
    return {
      content: [{ type: "text", text: "Review not found or you don't have access." }],
      isError: true,
    };
  }

  if (input.action === "add" && review.reviewers.length + input.emails.length > 10) {
    return {
      content: [{ type: "text", text: "Cannot add reviewers. Maximum of 10 reviewers per review." }],
      isError: true,
    };
  }

  if (input.action === "add") {
    const existingEmails = new Set(review.reviewers.map((r) => r.email.toLowerCase()));
    const newEmails = input.emails.filter((e) => !existingEmails.has(e.toLowerCase()));

    if (newEmails.length === 0) {
      return {
        content: [{ type: "text", text: "All specified reviewers are already on this review." }],
      };
    }

    const maxOrder = Math.max(...review.reviewers.map((r) => r.order), 0);
    for (let i = 0; i < newEmails.length; i++) {
      const email = newEmails[i];
      if (!email) continue;

      const reviewer = await prisma.reviewer.create({
        data: {
          reviewId: review.id,
          email,
          order: review.workflowType === "SEQUENTIAL" ? maxOrder + i + 1 : 0,
        },
      });

      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReviewRequestEmail({
          to: email,
          reviewerName: getEmailUsername(email),
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
          reviewId: review.id,
          reviewerId: reviewer.id,
        });
      } catch (e) {
        captureException(e instanceof Error ? e : new Error("Failed to send email to reviewer"), {
          extra: { email, reviewId: review.id },
        });
      }
    }

    const widgetData = await getReviewerWidgetData(review.id, review.title);
    return {
      content: [{
        type: "text",
        text: `Added ${newEmails.length} reviewer(s): ${newEmails.join(", ")}`,
      }],
      structuredContent: widgetData,
    };
  }

  if (input.action === "remove") {
    if (review.reviewers.length <= input.emails.length) {
      return {
        content: [{
          type: "text",
          text: "Cannot remove all reviewers. At least one reviewer must remain.",
        }],
        isError: true,
      };
    }

    const result = await prisma.reviewer.deleteMany({
      where: {
        reviewId: review.id,
        email: { in: input.emails.map((e) => e.toLowerCase()) },
        status: "PENDING",
      },
    });

    const widgetData = await getReviewerWidgetData(review.id, review.title);
    return {
      content: [{
        type: "text",
        text: `Removed ${result.count} reviewer(s)`,
      }],
      structuredContent: widgetData,
    };
  }

  if (input.action === "remind") {
    const reviewersToRemind = review.reviewers.filter(
      (r) => input.emails.map(e => e.toLowerCase()).includes(r.email.toLowerCase()) && r.status === "PENDING"
    );

    for (const reviewer of reviewersToRemind) {
      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? getEmailUsername(reviewer.email),
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
        });
      } catch (e) {
        captureException(e instanceof Error ? e : new Error("Failed to remind reviewer"), {
          extra: { email: reviewer.email, reviewId: review.id },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "REMINDER_SENT",
        userId,
        reviewId: review.id,
        metadata: { count: reviewersToRemind.length },
      },
    });

    const widgetData = await getReviewerWidgetData(review.id, review.title);
    return {
      content: [{
        type: "text",
        text: `Sent reminder to ${reviewersToRemind.length} reviewer(s)`,
      }],
      structuredContent: widgetData,
    };
  }

  return {
    content: [{ type: "text", text: "Unknown action" }],
    isError: true,
  };
}
