import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { sendReviewRequestEmail, sendReviewDecisionEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import type { ContentFormat } from "@prisma/client";

export const reviewRouter = createTRPCRouter({
  // Create review with multiple reviewers
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1).max(50000),
      reviewers: z.array(z.string().email()).min(1).max(10),
      workflowType: z.enum(["PARALLEL", "SEQUENTIAL", "ANY_ONE"]).default("PARALLEL"),
      organizationId: z.string().optional(),
      contentFormat: z.enum(["PLAIN_TEXT", "MARKDOWN", "HTML"]).default("MARKDOWN"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify organization access if provided
      if (input.organizationId) {
        const membership = await ctx.prisma.organizationMember.findFirst({
          where: {
            userId: ctx.session.user.id,
            organizationId: input.organizationId,
          },
        });
        if (!membership) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this organization" });
        }
      }

      // Validate unique reviewers
      const uniqueReviewers = [...new Set(input.reviewers.map((e) => e.toLowerCase()))];
      if (uniqueReviewers.length !== input.reviewers.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Duplicate reviewer emails not allowed" });
      }

      // Compute content metadata
      const wordCount = input.content.split(/\s+/).filter(Boolean).length;
      const characterCount = input.content.length;

      // Create review
      const review = await ctx.prisma.review.create({
        data: {
          slug: nanoid(10),
          title: input.title,
          creatorId: ctx.session.user.id,
          organizationId: input.organizationId,
          workflowType: input.workflowType,
          versions: {
            create: {
              version: 1,
              content: input.content,
              contentFormat: input.contentFormat,
              wordCount,
              characterCount,
            },
          },
          reviewers: {
            create: input.reviewers.map((email, idx) => ({
              email,
              order: input.workflowType === "SEQUENTIAL" ? idx + 1 : 0,
            })),
          },
        },
        include: {
          reviewers: true,
          creator: { select: { name: true, email: true } },
        },
      });

      // Send emails
      for (const reviewer of review.reviewers) {
        const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
        try {
          await sendReviewRequestEmail({
            to: reviewer.email,
            creatorName: review.creator.name ?? review.creator.email ?? "Someone",
            title: input.title,
            reviewUrl: accessUrl,
            reviewId: review.id,
            reviewerId: reviewer.id,
          });
        } catch (e) {
          console.error(`Failed to email ${reviewer.email}:`, e);
        }
      }

      // Send Slack notification if connected
      if (input.organizationId) {
        await sendSlackNotification({
          organizationId: input.organizationId,
          type: "NEW_REVIEW",
          data: {
            title: input.title,
            creatorName: review.creator.name ?? review.creator.email,
            reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
            reviewerCount: input.reviewers.length,
          },
        });
      }

      return review;
    }),

  // Get reviews with filters
  getMyReviews: protectedProcedure
    .input(z.object({
      status: z.enum(["all", "pending", "approved", "rejected", "changes_requested"]).optional(),
      organizationId: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const statusMap: Record<string, "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "PARTIALLY_APPROVED"> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
        changes_requested: "CHANGES_REQUESTED",
      };

      type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "PARTIALLY_APPROVED" | "CANCELED";

      const where: {
        creatorId: string;
        status?: ReviewStatus;
        organizationId?: string;
        title?: { contains: string; mode: "insensitive" };
      } = { creatorId: ctx.session.user.id };

      if (input?.status && input.status !== "all" && statusMap[input.status]) {
        where.status = statusMap[input.status];
      }
      if (input?.organizationId) {
        where.organizationId = input.organizationId;
      }
      if (input?.search && input.search.trim()) {
        where.title = { contains: input.search.trim(), mode: "insensitive" };
      }

      const reviews = await ctx.prisma.review.findMany({
        where,
        include: {
          reviewers: { orderBy: { order: "asc" } },
          versions: { orderBy: { version: "desc" }, take: 1 },
          organization: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: (input?.limit ?? 50) + 1,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (reviews.length > (input?.limit ?? 50)) {
        nextCursor = reviews.pop()?.id;
      }

      return { reviews, nextCursor };
    }),

  // Get review by slug (public with token access)
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
      token: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: {
          creator: { select: { name: true, email: true, image: true } },
          reviewers: { orderBy: { order: "asc" } },
          versions: { orderBy: { version: "desc" } },
          comments: {
            orderBy: { createdAt: "asc" },
            include: { user: { select: { name: true, image: true } } },
          },
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      // Track engagement if token provided
      if (input.token) {
        const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
        if (reviewer && !reviewer.viewedAt) {
          await ctx.prisma.reviewer.update({
            where: { id: reviewer.id },
            data: {
              viewedAt: new Date(),
              viewCount: { increment: 1 },
              lastActiveAt: new Date(),
            },
          });

          // Log activity
          await ctx.prisma.activityLog.create({
            data: {
              action: "REVIEW_VIEWED",
              reviewId: review.id,
              metadata: { reviewerEmail: reviewer.email },
            },
          });
        }
      }

      return review;
    }),

  // Submit decision (approve/reject/request changes)
  submitDecision: publicProcedure
    .input(z.object({
      slug: z.string(),
      token: z.string(),
      decision: z.enum(["approved", "rejected", "changes_requested"]),
      comments: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find review and reviewer
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: {
          reviewers: true,
          creator: true,
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
      if (!reviewer) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invalid access token" });
      }

      if (reviewer.status !== "PENDING") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You've already submitted your decision" });
      }

      // Use transaction for atomic status update to prevent race conditions
      const newStatus = await ctx.prisma.$transaction(async (tx) => {
        // Update reviewer status
        await tx.reviewer.update({
          where: { id: reviewer.id },
          data: {
            status: input.decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
            comments: input.comments,
            decidedAt: new Date(),
          },
        });

        // Calculate new review status within same transaction
        const updatedReviewers = await tx.reviewer.findMany({
          where: { reviewId: review.id },
        });

        let calculatedStatus = review.status;
        const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
        const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
        const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
        const total = updatedReviewers.length;

        if (review.workflowType === "ANY_ONE") {
          // First approval/rejection completes
          if (input.decision === "approved") calculatedStatus = "APPROVED";
          else if (input.decision === "rejected") calculatedStatus = "REJECTED";
          else calculatedStatus = "CHANGES_REQUESTED";
        } else {
          // All must decide
          if (rejected > 0) calculatedStatus = "REJECTED";
          else if (changesRequested > 0) calculatedStatus = "CHANGES_REQUESTED";
          else if (approved === total) calculatedStatus = "APPROVED";
          else if (approved > 0) calculatedStatus = "PARTIALLY_APPROVED";
        }

        // Update review status
        if (calculatedStatus !== review.status) {
          await tx.review.update({
            where: { id: review.id },
            data: { status: calculatedStatus },
          });
        }

        // Log activity
        await tx.activityLog.create({
          data: {
            action: input.decision === "approved" ? "REVIEW_APPROVED"
              : input.decision === "rejected" ? "REVIEW_REJECTED"
              : "REVIEW_CHANGES_REQUESTED",
            reviewId: review.id,
            metadata: { reviewerEmail: reviewer.email, comments: input.comments },
          },
        });

        return calculatedStatus;
      });

      // Send notifications outside transaction (non-blocking)
      // Email to creator
      if (review.creator.email) {
        try {
          await sendReviewDecisionEmail({
            to: review.creator.email,
            creatorName: review.creator.name ?? "there",
            title: review.title,
            decision: input.decision,
            reviewerEmail: reviewer.email,
            comments: input.comments,
            reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
          });
        } catch (error) {
          console.error("Failed to send decision email:", error);
        }
      }

      // Send Slack notification
      if (review.organizationId) {
        try {
          await sendSlackNotification({
            organizationId: review.organizationId,
            type: input.decision === "approved" ? "APPROVED" : input.decision === "rejected" ? "REJECTED" : "CHANGES_REQUESTED",
            data: {
              title: review.title,
              reviewerEmail: reviewer.email,
              creatorName: review.creator.name ?? review.creator.email,
              reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
            },
          });
        } catch (error) {
          console.error("Failed to send Slack notification:", error);
        }
      }

      return { success: true, newStatus };
    }),

  // Add comment
  addComment: publicProcedure
    .input(z.object({
      slug: z.string(),
      token: z.string().optional(),
      content: z.string().min(1).max(5000),
    }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: { reviewers: true },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Determine author
      let authorData: {
        authorEmail?: string;
        authorName?: string;
        userId?: string;
      } = {};

      if (input.token) {
        const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
        if (reviewer) {
          authorData = {
            authorEmail: reviewer.email,
            authorName: reviewer.name ?? reviewer.email.split("@")[0],
            userId: reviewer.userId ?? undefined,
          };
        }
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          reviewId: review.id,
          content: input.content,
          ...authorData,
        },
      });

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          action: "COMMENT_ADDED",
          reviewId: review.id,
          metadata: { commentId: comment.id },
        },
      });

      return comment;
    }),

  // Delete a review (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if review exists AND belongs to user in a single query
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.id,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found or you don't have permission to delete it",
        });
      }

      await ctx.prisma.review.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Cancel a review
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.id,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found or you don't have permission",
        });
      }

      await ctx.prisma.review.update({
        where: { id: input.id },
        data: { status: "CANCELED" },
      });

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          action: "REVIEW_CANCELED",
          userId: ctx.session.user.id,
          reviewId: review.id,
        },
      });

      return { success: true };
    }),

  // Get review statistics for the current user
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.prisma.review.groupBy({
      by: ["status"],
      where: { creatorId: ctx.session.user.id },
      _count: { status: true },
    });

    const statsMap = stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: stats.reduce((sum, stat) => sum + stat._count.status, 0),
      pending: (statsMap.PENDING ?? 0) + (statsMap.PARTIALLY_APPROVED ?? 0),
      approved: statsMap.APPROVED ?? 0,
      rejected: statsMap.REJECTED ?? 0,
      changesRequested: statsMap.CHANGES_REQUESTED ?? 0,
    };
  }),

  // Get activity log for a review
  getActivityLog: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify access
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      return ctx.prisma.activityLog.findMany({
        where: { reviewId: input.reviewId },
        include: { user: { select: { name: true, email: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }),

  // Submit decision from email link (one-click approve/reject)
  submitDecisionFromEmail: publicProcedure
    .input(z.object({
      reviewId: z.string(),
      reviewerId: z.string(),
      token: z.string(),
      decision: z.enum(["APPROVED", "REJECTED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate magic link token
      const reviewer = await ctx.prisma.reviewer.findFirst({
        where: {
          id: input.reviewerId,
          reviewId: input.reviewId,
          accessToken: input.token,
        },
        include: {
          review: {
            include: {
              creator: true,
              reviewers: true,
            },
          },
        },
      });

      if (!reviewer) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired link" });
      }

      if (reviewer.status !== "PENDING") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You have already submitted your decision" });
      }

      // Use transaction for atomic status update
      const result = await ctx.prisma.$transaction(async (tx) => {
        // Update reviewer status
        await tx.reviewer.update({
          where: { id: reviewer.id },
          data: {
            status: input.decision,
            decidedAt: new Date(),
          },
        });

        // Recalculate review status
        const updatedReviewers = await tx.reviewer.findMany({
          where: { reviewId: input.reviewId },
        });

        const review = reviewer.review;
        let calculatedStatus = review.status;
        const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
        const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
        const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
        const total = updatedReviewers.length;

        if (review.workflowType === "ANY_ONE") {
          calculatedStatus = input.decision;
        } else {
          if (rejected > 0) calculatedStatus = "REJECTED";
          else if (changesRequested > 0) calculatedStatus = "CHANGES_REQUESTED";
          else if (approved === total) calculatedStatus = "APPROVED";
          else if (approved > 0) calculatedStatus = "PARTIALLY_APPROVED";
        }

        // Update review status if changed
        if (calculatedStatus !== review.status) {
          await tx.review.update({
            where: { id: review.id },
            data: { status: calculatedStatus },
          });
        }

        // Log activity
        await tx.activityLog.create({
          data: {
            reviewId: input.reviewId,
            action: input.decision === "APPROVED" ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
            metadata: { reviewerEmail: reviewer.email, via: "email_link" },
          },
        });

        return { success: true, decision: input.decision, newStatus: calculatedStatus };
      });

      // Send notifications outside transaction (non-blocking)
      if (reviewer.review.creator.email) {
        try {
          await sendReviewDecisionEmail({
            to: reviewer.review.creator.email,
            creatorName: reviewer.review.creator.name ?? "there",
            title: reviewer.review.title,
            decision: input.decision.toLowerCase() as "approved" | "rejected",
            reviewerEmail: reviewer.email,
            reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${reviewer.review.slug}`,
          });
        } catch (error) {
          console.error("Failed to send decision email:", error);
        }
      }

      // Send Slack notification
      if (reviewer.review.organizationId) {
        try {
          await sendSlackNotification({
            organizationId: reviewer.review.organizationId,
            type: input.decision === "APPROVED" ? "APPROVED" : "REJECTED",
            data: {
              title: reviewer.review.title,
              reviewerEmail: reviewer.email,
              creatorName: reviewer.review.creator.name ?? reviewer.review.creator.email,
              reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${reviewer.review.slug}`,
            },
          });
        } catch (error) {
          console.error("Failed to send Slack notification:", error);
        }
      }

      return result;
    }),
});
