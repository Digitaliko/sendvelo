import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createCheckoutSession, createCustomerPortalSession } from "@/lib/stripe";
import { env } from "@/env";

export const userRouter = createTRPCRouter({
  // Get current user's profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        reviewsThisMonth: true,
        resetDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Create Stripe checkout session
  createCheckout: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await createCheckoutSession({
        userId: ctx.session.user.id,
        userEmail: ctx.session.user.email,
        priceId: input.priceId,
        successUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancelUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      });

      return { url: session.url };
    }),

  // Create Stripe customer portal session
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const session = await createCustomerPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return { url: session.url };
  }),

  // Check if user can create more reviews this month
  canCreateReview: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        subscriptionTier: true,
        reviewsThisMonth: true,
        resetDate: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Check if we need to reset the counter (monthly reset)
    const now = new Date();
    const resetDate = new Date(user.resetDate);
    const monthsSinceReset =
      (now.getFullYear() - resetDate.getFullYear()) * 12 +
      (now.getMonth() - resetDate.getMonth());

    if (monthsSinceReset >= 1) {
      // Reset counter
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          reviewsThisMonth: 0,
          resetDate: now,
        },
      });
      return { canCreate: true, remaining: user.subscriptionTier !== "FREE" ? -1 : 5 };
    }

    // Paid users have unlimited reviews
    if (user.subscriptionTier !== "FREE") {
      return { canCreate: true, remaining: -1 };
    }

    // Free users have 5 reviews per month
    const limit = 5;
    const canCreate = user.reviewsThisMonth < limit;
    const remaining = Math.max(0, limit - user.reviewsThisMonth);

    return { canCreate, remaining };
  }),

  // Increment review count (called after creating a review)
  incrementReviewCount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        reviewsThisMonth: {
          increment: 1,
        },
      },
    });

    return { success: true };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
        },
      });

      return { success: true, user };
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({
        where: { creatorId: ctx.session.user.id },
      });

      await tx.user.delete({
        where: { id: ctx.session.user.id },
      });
    });

    return { success: true };
  }),
});
