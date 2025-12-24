import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const slackRouter = createTRPCRouter({
  getIntegration: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const member = await ctx.prisma.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not a member of this organization",
        });
      }

      const integration = await ctx.prisma.slackIntegration.findUnique({
        where: { organizationId: input.organizationId },
        select: {
          id: true,
          teamName: true,
          defaultChannelId: true,
          defaultChannelName: true,
          notifyOnNew: true,
          notifyOnApproved: true,
          notifyOnRejected: true,
          notifyOnComment: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return integration;
    }),

  disconnect: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners and admins can disconnect Slack",
        });
      }

      await ctx.prisma.slackIntegration.delete({
        where: { organizationId: input.organizationId },
      });

      await ctx.prisma.activityLog.create({
        data: {
          action: "SLACK_DISCONNECTED",
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      });

      return { success: true };
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        notifyOnNew: z.boolean().optional(),
        notifyOnApproved: z.boolean().optional(),
        notifyOnRejected: z.boolean().optional(),
        notifyOnComment: z.boolean().optional(),
        defaultChannelId: z.string().optional(),
        defaultChannelName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners and admins can update Slack settings",
        });
      }

      const { organizationId, ...settings } = input;

      const integration = await ctx.prisma.slackIntegration.update({
        where: { organizationId },
        data: settings,
        select: {
          id: true,
          teamName: true,
          defaultChannelId: true,
          defaultChannelName: true,
          notifyOnNew: true,
          notifyOnApproved: true,
          notifyOnRejected: true,
          notifyOnComment: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return integration;
    }),
});
