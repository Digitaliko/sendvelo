import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { sendReviewRequestEmail, sendReviewDecisionEmail, sendReminderEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import { calculateReviewStatus, normalizeStatusFilter } from "@/lib/review-status";
import { rateLimiter, getRateLimitIdentifier, getClientIp } from "@/lib/rate-limiter";
import { getEmailUsername } from "@/lib/utils";
import { captureException } from "@/lib/error-tracking";
import {
  CreateReviewInputSchema,
  GetMyReviewsInputSchema,
  GetBySlugInputSchema,
  SubmitDecisionInputSchema,
  AddCommentInputSchema,
  SubmitDecisionFromEmailInputSchema,
  GetShareDetailsInputSchema,
  UpdatePublicAccessInputSchema,
  AddReviewersInputSchema,
  RemoveReviewerInputSchema,
  ResendInvitationInputSchema,
  SubmitPublicDecisionInputSchema,
  UpdateEngagementInputSchema,
} from "@/lib/schemas";

function isTokenExpired(accessExpires: Date | null): boolean {
  return accessExpires !== null && new Date() > accessExpires;
}

export const reviewRouter = createTRPCRouter({
  // Create review with multiple reviewers
  create: protectedProcedure
    .input(CreateReviewInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Check subscription limits
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          subscriptionTier: true,
          reviewsThisMonth: true,
          resetDate: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Check if we need to reset the counter (monthly reset)
      const now = new Date();
      const resetDate = new Date(user.resetDate);
      const monthsSinceReset =
        (now.getFullYear() - resetDate.getFullYear()) * 12 +
        (now.getMonth() - resetDate.getMonth());

      let currentReviewCount = user.reviewsThisMonth;

      if (monthsSinceReset >= 1) {
        // Reset counter
        await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
            reviewsThisMonth: 0,
            resetDate: now,
          },
        });
        currentReviewCount = 0;
      }

      // Free users have 5 reviews per month limit
      if (user.subscriptionTier === "FREE") {
        const limit = 5;
        if (currentReviewCount >= limit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Monthly review limit reached. Please upgrade your plan to create more reviews.",
          });
        }
      }

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
          deadline: input.deadline,
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
          captureException(e instanceof Error ? e : new Error("Failed to email reviewer"), {
            extra: { email: reviewer.email, reviewId: review.id },
          });
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

      // Increment review count
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          reviewsThisMonth: {
            increment: 1,
          },
        },
      });

      return review;
    }),

  // Get reviews with filters
  getMyReviews: protectedProcedure
    .input(GetMyReviewsInputSchema)
    .query(async ({ ctx, input }) => {
      const where: {
        creatorId: string;
        status?: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "PARTIALLY_APPROVED" | "CANCELED";
        organizationId?: string;
        title?: { contains: string; mode: "insensitive" };
      } = { creatorId: ctx.session.user.id };

      const normalizedStatus = normalizeStatusFilter(input?.status);
      if (normalizedStatus) {
        where.status = normalizedStatus;
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
    .input(GetBySlugInputSchema)
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: {
          creator: { select: { name: true, email: true, image: true } },
          reviewers: { orderBy: { order: "asc" }, take: 100 },
          versions: { orderBy: { version: "desc" }, take: 1 },
          comments: {
            orderBy: { createdAt: "asc" },
            take: 50,
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
        if (reviewer && !reviewer.viewedAt && !isTokenExpired(reviewer.accessExpires)) {
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
    .input(SubmitDecisionInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Rate limiting: 10 decisions per minute per IP/token
      const clientIp = getClientIp(ctx.headers);
      const rateLimitId = getRateLimitIdentifier(clientIp, input.token);
      const rateLimit = rateLimiter.check(rateLimitId, 10, 60000);

      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many decision submissions. Please try again later.",
        });
      }

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

      if (isTokenExpired(reviewer.accessExpires)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access token has expired" });
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

        const calculatedStatus = calculateReviewStatus(
          updatedReviewers,
          review.workflowType,
          input.decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
          review.status
        );

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
          captureException(error instanceof Error ? error : new Error("Failed to send decision email"), {
            extra: { reviewId: review.id },
          });
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
          captureException(error instanceof Error ? error : new Error("Failed to send Slack notification"), {
            extra: { reviewId: review.id, organizationId: review.organizationId },
          });
        }
      }

      return { success: true, newStatus };
    }),

  submitPublicDecision: publicProcedure
    .input(SubmitPublicDecisionInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.honeypot) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Spam detected",
        });
      }

      if (env.TURNSTILE_SECRET_KEY && input.turnstileToken) {
        try {
          const verifyResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: env.TURNSTILE_SECRET_KEY,
                response: input.turnstileToken,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (!verifyData.success) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "CAPTCHA verification failed",
            });
          }
        } catch (error) {
          captureException(error instanceof Error ? error : new Error("Turnstile verification error"));
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "CAPTCHA verification failed",
          });
        }
      }

      const clientIp = getClientIp(ctx.headers);
      const rateLimitId = getRateLimitIdentifier(clientIp);
      const rateLimit = rateLimiter.check(rateLimitId, 10, 60000);

      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many decision submissions. Please try again later.",
        });
      }

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

      if (review.publicAccessLevel !== "FULL_ACCESS") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This review does not allow public decisions",
        });
      }

      if (review.status !== "PENDING" && review.status !== "PARTIALLY_APPROVED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This review has already been decided",
        });
      }

      const publicEmail = input.email ?? `anonymous-${nanoid(6)}@public.thumbway.app`;
      const publicName = input.name ?? (input.email ? getEmailUsername(input.email) : "Anonymous");

      const newStatus = await ctx.prisma.$transaction(async (tx) => {
        const publicReviewer = await tx.reviewer.create({
          data: {
            reviewId: review.id,
            email: publicEmail,
            name: publicName,
            status: input.decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
            comments: input.comments ?? null,
            decidedAt: new Date(),
            viewedAt: new Date(),
            order: 0,
            isPublicSubmission: true,
          },
        });

        const updatedReviewers = await tx.reviewer.findMany({
          where: { reviewId: review.id },
        });

        const calculatedStatus = calculateReviewStatus(
          updatedReviewers,
          review.workflowType,
          input.decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
          review.status
        );

        if (calculatedStatus !== review.status) {
          await tx.review.update({
            where: { id: review.id },
            data: { status: calculatedStatus },
          });
        }

        await tx.activityLog.create({
          data: {
            action: input.decision === "approved" ? "REVIEW_APPROVED"
              : input.decision === "rejected" ? "REVIEW_REJECTED"
              : "REVIEW_CHANGES_REQUESTED",
            reviewId: review.id,
            metadata: {
              reviewerEmail: publicEmail,
              reviewerName: publicName,
              comments: input.comments,
              isPublicSubmission: true,
            },
          },
        });

        return calculatedStatus;
      });

      if (review.creator.email) {
        try {
          await sendReviewDecisionEmail({
            to: review.creator.email,
            creatorName: review.creator.name ?? "there",
            title: review.title,
            decision: input.decision,
            reviewerEmail: publicEmail,
            comments: input.comments,
            reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
          });
        } catch (error) {
          captureException(error instanceof Error ? error : new Error("Failed to send decision email"), {
            extra: { reviewId: review.id },
          });
        }
      }

      if (review.organizationId) {
        try {
          await sendSlackNotification({
            organizationId: review.organizationId,
            type: input.decision === "approved" ? "APPROVED" : input.decision === "rejected" ? "REJECTED" : "CHANGES_REQUESTED",
            data: {
              title: review.title,
              reviewerEmail: `${publicName} (via public link)`,
              creatorName: review.creator.name ?? review.creator.email,
              reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
            },
          });
        } catch (error) {
          captureException(error instanceof Error ? error : new Error("Failed to send Slack notification"), {
            extra: { reviewId: review.id, organizationId: review.organizationId },
          });
        }
      }

      return { success: true, newStatus };
    }),

  addComment: publicProcedure
    .input(AddCommentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const clientIp = getClientIp(ctx.headers);
      const rateLimitKey = `comment:${input.token ?? `ip:${clientIp}`}`;
      const rateLimit = rateLimiter.check(rateLimitKey, 10, 60000);
      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many comments. Please wait before trying again.",
        });
      }

      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: { reviewers: true },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let authorData: {
        authorEmail?: string;
        authorName?: string;
        userId?: string;
      } = {};

      if (input.token) {
        const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
        if (!reviewer) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Invalid access token" });
        }
        if (isTokenExpired(reviewer.accessExpires)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access token has expired" });
        }
        authorData = {
          authorEmail: reviewer.email,
          authorName: reviewer.name ?? getEmailUsername(reviewer.email),
          userId: reviewer.userId ?? undefined,
        };
      } else if (ctx.session?.user) {
        authorData = {
          authorEmail: ctx.session.user.email,
          authorName: ctx.session.user.name ?? getEmailUsername(ctx.session.user.email),
          userId: ctx.session.user.id,
        };
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication required to add comments",
        });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          reviewId: review.id,
          content: input.content,
          ...authorData,
        },
      });

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
    .input(SubmitDecisionFromEmailInputSchema)
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

      if (isTokenExpired(reviewer.accessExpires)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access token has expired" });
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
        const calculatedStatus = calculateReviewStatus(
          updatedReviewers,
          review.workflowType,
          input.decision,
          review.status
        );

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
          captureException(error instanceof Error ? error : new Error("Failed to send decision email"), {
            extra: { reviewId: reviewer.review.id },
          });
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
          captureException(error instanceof Error ? error : new Error("Failed to send Slack notification"), {
            extra: { reviewId: reviewer.review.id, organizationId: reviewer.review.organizationId },
          });
        }
      }

      return result;
    }),

  // ========================================
  // SHARE MODAL PROCEDURES
  // ========================================

  getShareDetails: protectedProcedure
    .input(GetShareDetailsInputSchema)
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: {
          creator: { select: { name: true, email: true } },
          reviewers: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              email: true,
              name: true,
              status: true,
              viewedAt: true,
              viewCount: true,
              decidedAt: true,
              createdAt: true,
            },
          },
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      return {
        id: review.id,
        title: review.title,
        slug: review.slug,
        publicAccessLevel: review.publicAccessLevel,
        publicViewCount: review.publicViewCount,
        creator: review.creator,
        reviewers: review.reviewers,
      };
    }),

  updatePublicAccess: protectedProcedure
    .input(UpdatePublicAccessInputSchema)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const updated = await ctx.prisma.review.update({
        where: { id: input.reviewId },
        data: { publicAccessLevel: input.accessLevel },
      });

      await ctx.prisma.activityLog.create({
        data: {
          action: "REVIEW_UPDATED",
          userId: ctx.session.user.id,
          reviewId: review.id,
          metadata: { publicAccessLevel: input.accessLevel },
        },
      });

      return { success: true, publicAccessLevel: updated.publicAccessLevel };
    }),

  addReviewers: protectedProcedure
    .input(AddReviewersInputSchema)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: {
          reviewers: true,
          creator: { select: { name: true, email: true } },
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const existingEmails = new Set(review.reviewers.map((r) => r.email.toLowerCase()));
      const newEmails = input.emails
        .map((e) => e.toLowerCase().trim())
        .filter((e) => !existingEmails.has(e));

      if (newEmails.length === 0) {
        return { success: true, added: 0, message: "All emails already invited" };
      }

      if (review.reviewers.length + newEmails.length > 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum 10 reviewers per review",
        });
      }

      const maxOrder = Math.max(...review.reviewers.map((r) => r.order), 0);

      const createdReviewers = await ctx.prisma.$transaction(
        newEmails.map((email, idx) =>
          ctx.prisma.reviewer.create({
            data: {
              reviewId: review.id,
              email,
              order: review.workflowType === "SEQUENTIAL" ? maxOrder + idx + 1 : 0,
            },
          })
        )
      );

      for (const reviewer of createdReviewers) {
        const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
        try {
          await sendReviewRequestEmail({
            to: reviewer.email,
            creatorName: review.creator.name ?? review.creator.email ?? "Someone",
            title: review.title,
            reviewUrl: accessUrl,
            reviewId: review.id,
            reviewerId: reviewer.id,
          });
        } catch (e) {
          captureException(e instanceof Error ? e : new Error("Failed to email reviewer"), {
            extra: { email: reviewer.email, reviewId: review.id },
          });
        }
      }

      await ctx.prisma.activityLog.create({
        data: {
          action: "REVIEWER_ADDED",
          userId: ctx.session.user.id,
          reviewId: review.id,
          metadata: { emails: newEmails },
        },
      });

      return { success: true, added: newEmails.length };
    }),

  removeReviewer: protectedProcedure
    .input(RemoveReviewerInputSchema)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: { reviewers: true },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const reviewer = review.reviewers.find((r) => r.id === input.reviewerId);
      if (!reviewer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reviewer not found" });
      }

      if (review.reviewers.length <= 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot remove the last reviewer",
        });
      }

      await ctx.prisma.reviewer.delete({
        where: { id: input.reviewerId },
      });

      await ctx.prisma.activityLog.create({
        data: {
          action: "REVIEWER_REMOVED",
          userId: ctx.session.user.id,
          reviewId: review.id,
          metadata: { email: reviewer.email },
        },
      });

      return { success: true };
    }),

  resendInvitation: protectedProcedure
    .input(ResendInvitationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: {
          reviewers: true,
          creator: { select: { name: true, email: true } },
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const reviewer = review.reviewers.find((r) => r.id === input.reviewerId);
      if (!reviewer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reviewer not found" });
      }

      if (reviewer.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only resend to pending reviewers",
        });
      }

      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? undefined,
          creatorName: review.creator.name ?? review.creator.email ?? "Someone",
          title: review.title,
          reviewUrl: accessUrl,
          customMessage: input.customMessage,
        });
      } catch (e) {
        captureException(e instanceof Error ? e : new Error("Failed to resend email to reviewer"), {
          extra: { email: reviewer.email, reviewId: input.reviewId },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email",
        });
      }

      await ctx.prisma.activityLog.create({
        data: {
          action: "REMINDER_SENT",
          userId: ctx.session.user.id,
          reviewId: review.id,
          metadata: { email: reviewer.email, customMessage: input.customMessage },
        },
      });

      return { success: true };
    }),

  // ========================================
  // VERSION HISTORY
  // ========================================

  getVersionHistory: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      return ctx.prisma.reviewVersion.findMany({
        where: { reviewId: input.reviewId },
        orderBy: { version: "desc" },
      });
    }),

  getVersionDiff: protectedProcedure
    .input(z.object({
      reviewId: z.string(),
      version1: z.number(),
      version2: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const [v1, v2] = await Promise.all([
        ctx.prisma.reviewVersion.findUnique({
          where: {
            reviewId_version: {
              reviewId: input.reviewId,
              version: input.version1,
            },
          },
        }),
        ctx.prisma.reviewVersion.findUnique({
          where: {
            reviewId_version: {
              reviewId: input.reviewId,
              version: input.version2,
            },
          },
        }),
      ]);

      if (!v1 || !v2) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Version not found" });
      }

      return {
        version1: v1,
        version2: v2,
      };
    }),

  restoreVersion: protectedProcedure
    .input(z.object({
      reviewId: z.string(),
      versionToRestore: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: {
          versions: { orderBy: { version: "desc" }, take: 1 },
        },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const versionToRestore = await ctx.prisma.reviewVersion.findUnique({
        where: {
          reviewId_version: {
            reviewId: input.reviewId,
            version: input.versionToRestore,
          },
        },
      });

      if (!versionToRestore) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Version not found" });
      }

      const newVersion = (review.versions[0]?.version ?? 0) + 1;

      const restoredVersion = await ctx.prisma.reviewVersion.create({
        data: {
          reviewId: review.id,
          version: newVersion,
          content: versionToRestore.content,
          contentFormat: versionToRestore.contentFormat,
          wordCount: versionToRestore.wordCount,
          characterCount: versionToRestore.characterCount,
          changes: `Restored from version ${input.versionToRestore}`,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          action: "REVIEW_UPDATED",
          userId: ctx.session.user.id,
          reviewId: review.id,
          metadata: {
            version: newVersion,
            restoredFrom: input.versionToRestore,
          },
        },
      });

      return { success: true, newVersion, restoredVersion };
    }),

  // ========================================
  // REMINDER SCHEDULING
  // ========================================

  scheduleReminder: protectedProcedure
    .input(z.object({
      reviewId: z.string(),
      reviewerId: z.string(),
      scheduledAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id: input.reviewId,
          creatorId: ctx.session.user.id,
        },
        include: { reviewers: true },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const reviewer = review.reviewers.find((r) => r.id === input.reviewerId);
      if (!reviewer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reviewer not found" });
      }

      if (reviewer.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only schedule reminders for pending reviewers",
        });
      }

      const scheduledAt = input.scheduledAt ?? new Date();

      const reminder = await ctx.prisma.reminder.create({
        data: {
          reviewerId: reviewer.id,
          scheduledAt,
        },
      });

      return { success: true, reminder };
    }),

  sendReminder: protectedProcedure
    .input(z.object({
      reminderId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const reminder = await ctx.prisma.reminder.findUnique({
        where: { id: input.reminderId },
      });

      if (!reminder) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reminder not found" });
      }

      if (reminder.sentAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reminder already sent",
        });
      }

      const reviewer = await ctx.prisma.reviewer.findUnique({
        where: { id: reminder.reviewerId },
        include: {
          review: {
            include: {
              creator: { select: { name: true, email: true } },
            },
          },
        },
      });

      if (!reviewer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reviewer not found" });
      }

      if (reviewer.status !== "PENDING") {
        await ctx.prisma.reminder.update({
          where: { id: reminder.id },
          data: { sentAt: new Date() },
        });
        return { success: true, message: "Reviewer already responded" };
      }

      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${reviewer.review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? getEmailUsername(reviewer.email),
          creatorName: reviewer.review.creator.name ?? reviewer.review.creator.email ?? "Someone",
          title: reviewer.review.title,
          reviewUrl: accessUrl,
        });
      } catch (error) {
        captureException(error instanceof Error ? error : new Error("Failed to send reminder email"), {
          extra: { reminderId: input.reminderId, reviewerId: reviewer.id },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send reminder email",
        });
      }

      await ctx.prisma.reminder.update({
        where: { id: reminder.id },
        data: { sentAt: new Date() },
      });

      await ctx.prisma.activityLog.create({
        data: {
          action: "REMINDER_SENT",
          userId: ctx.session.user.id,
          reviewId: reviewer.review.id,
          metadata: { email: reviewer.email, reminderId: reminder.id },
        },
      });

      return { success: true };
    }),

  updateEngagement: publicProcedure
    .input(UpdateEngagementInputSchema)
    .mutation(async ({ ctx, input }) => {
      const reviewer = await ctx.prisma.reviewer.findUnique({
        where: { accessToken: input.accessToken },
        select: { id: true, reviewId: true, accessExpires: true },
      });

      if (!reviewer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid access token",
        });
      }

      if (isTokenExpired(reviewer.accessExpires)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access token has expired" });
      }

      await ctx.prisma.reviewer.update({
        where: { id: reviewer.id },
        data: {
          timeSpentMs: { increment: input.timeSpentMs },
          lastActiveAt: new Date(),
        },
      });

      return { success: true };
    }),

  getDashboardStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(["week", "month", "all"]).default("week"),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const now = new Date();

      let startDate: Date | undefined;
      if (input?.period === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (input?.period === "month") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const whereClause = {
        creatorId: userId,
        ...(startDate && { createdAt: { gte: startDate } }),
      };

      const reviews = await ctx.prisma.review.findMany({
        where: whereClause,
        select: {
          id: true,
          status: true,
          createdAt: true,
          deadline: true,
          reviewers: {
            select: {
              status: true,
              decidedAt: true,
            },
          },
        },
      });

      const sent = reviews.length;
      const approved = reviews.filter((r) => r.status === "APPROVED").length;
      const pending = reviews.filter(
        (r) => r.status === "PENDING" || r.status === "PARTIALLY_APPROVED"
      ).length;
      const rejected = reviews.filter((r) => r.status === "REJECTED").length;
      const changesRequested = reviews.filter(
        (r) => r.status === "CHANGES_REQUESTED"
      ).length;

      const overdue = reviews.filter(
        (r) =>
          (r.status === "PENDING" || r.status === "PARTIALLY_APPROVED") &&
          r.deadline &&
          new Date(r.deadline) < now
      ).length;

      let avgTimeDays: number | null = null;
      const completedReviews = reviews.filter((r) => {
        if (r.status !== "APPROVED" && r.status !== "REJECTED") return false;
        const lastDecision = r.reviewers
          .filter((rev) => rev.decidedAt)
          .sort(
            (a, b) =>
              new Date(b.decidedAt!).getTime() - new Date(a.decidedAt!).getTime()
          )[0];
        return !!lastDecision;
      });

      if (completedReviews.length > 0) {
        const totalMs = completedReviews.reduce((sum, r) => {
          const lastDecision = r.reviewers
            .filter((rev) => rev.decidedAt)
            .sort(
              (a, b) =>
                new Date(b.decidedAt!).getTime() -
                new Date(a.decidedAt!).getTime()
            )[0];
          if (!lastDecision?.decidedAt) return sum;
          return (
            sum +
            (new Date(lastDecision.decidedAt).getTime() - r.createdAt.getTime())
          );
        }, 0);
        avgTimeDays =
          Math.round((totalMs / completedReviews.length / (1000 * 60 * 60 * 24)) * 10) / 10;
      }

      const approvalRate =
        sent > 0 ? Math.round((approved / sent) * 100) : null;

      return {
        sent,
        approved,
        pending,
        rejected,
        changesRequested,
        overdue,
        avgTimeDays,
        approvalRate,
      };
    }),
});
