import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { sendReviewRequestEmail, sendReviewDecisionEmail } from "@/lib/email";
import { env } from "@/env";

export const reviewRouter = createTRPCRouter({
  // Create a new review (protected - requires auth)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        content: z.string().min(1).max(10000),
        reviewerEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.create({
        data: {
          slug: nanoid(10),
          title: input.title,
          content: input.content,
          reviewerEmail: input.reviewerEmail,
          creatorId: ctx.session.user.id,
        },
      });

      // Send email notification
      const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;
      await sendReviewRequestEmail({
        to: input.reviewerEmail,
        creatorName: ctx.session.user.name ?? "Someone",
        title: input.title,
        reviewUrl,
      });

      return review;
    }),

  // Get all reviews for the current user
  getMyReviews: protectedProcedure
    .input(
      z
        .object({
          status: z.enum(["all", "pending", "approved", "rejected"]).optional(),
          limit: z.number().min(1).max(100).default(50),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;

      const where = {
        creatorId: ctx.session.user.id,
        ...(input?.status && input.status !== "all"
          ? { status: input.status }
          : {}),
      };

      const reviews = await ctx.prisma.review.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (reviews.length > limit) {
        const nextItem = reviews.pop();
        nextCursor = nextItem?.id;
      }

      return {
        reviews,
        nextCursor,
      };
    }),

  // Get a single review by slug (public - no auth required)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: {
          creator: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return review;
    }),

  // Update review decision (public - no auth required, anyone with link can approve/reject)
  updateDecision: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        decision: z.enum(["approved", "rejected"]),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findUnique({
        where: { slug: input.slug },
        include: {
          creator: true,
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (review.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Review has already been decided",
        });
      }

      const updatedReview = await ctx.prisma.review.update({
        where: { id: review.id },
        data: {
          status: input.decision,
          comments: input.comments,
        },
      });

      // Send email notification to creator
      const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;
      await sendReviewDecisionEmail({
        to: review.creator.email,
        creatorName: review.creator.name ?? "there",
        title: review.title,
        decision: input.decision,
        comments: input.comments,
        reviewUrl,
      });

      return updatedReview;
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
      pending: statsMap.pending ?? 0,
      approved: statsMap.approved ?? 0,
      rejected: statsMap.rejected ?? 0,
    };
  }),
});
