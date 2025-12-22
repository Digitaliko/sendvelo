import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { sendOrganizationInviteEmail } from "@/lib/email";
import { env } from "@/env";

export const organizationRouter = createTRPCRouter({
  // Create organization
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check subscription tier
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { subscriptionTier: true },
      });

      if (user?.subscriptionTier === "FREE") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Upgrade to create organizations",
        });
      }

      // Check organization limit (5)
      const orgCount = await ctx.prisma.organizationMember.count({
        where: { userId: ctx.session.user.id, role: "OWNER" },
      });

      if (orgCount >= 5) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Maximum 5 organizations per user",
        });
      }

      // Create org with user as owner
      const slug = `${input.name.toLowerCase().replace(/\s+/g, "-")}-${nanoid(6)}`;

      const org = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
      });

      return org;
    }),

  // Get user's organizations
  getMyOrganizations: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await ctx.prisma.organizationMember.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        organization: {
          include: {
            _count: { select: { members: true, reviews: true } },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.organization,
      role: m.role,
      memberCount: m.organization._count.members,
      reviewCount: m.organization._count.reviews,
    }));
  }),

  // Get organization by slug
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organization: { slug: input.slug },
        },
        include: {
          organization: {
            include: {
              members: {
                include: { user: { select: { id: true, name: true, email: true, image: true } } },
              },
              slackSettings: true,
            },
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
      }

      return {
        ...membership.organization,
        currentUserRole: membership.role,
      };
    }),

  // Invite member
  inviteMember: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      email: z.string().email(),
      role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
        include: { organization: true },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Check if already a member
      const existing = await ctx.prisma.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          user: { email: input.email },
        },
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "User is already a member" });
      }

      // Create invitation
      const invitation = await ctx.prisma.invitation.create({
        data: {
          email: input.email,
          inviterId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: input.role,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Send email
      const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/accept-invite/${invitation.id}`;
      await sendOrganizationInviteEmail({
        to: input.email,
        inviterName: ctx.session.user.name ?? ctx.session.user.email ?? "Someone",
        organizationName: membership.organization.name,
        inviteLink,
        role: input.role,
      });

      return invitation;
    }),

  // Accept invitation
  acceptInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: { id: input.invitationId },
        include: { organization: true },
      });

      if (!invitation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }

      if (invitation.email.toLowerCase() !== ctx.session.user.email?.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invitation is for a different email" });
      }

      if (invitation.status !== "PENDING") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already processed" });
      }

      if (invitation.expiresAt < new Date()) {
        await ctx.prisma.invitation.update({
          where: { id: input.invitationId },
          data: { status: "EXPIRED" },
        });
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
      }

      // Create membership
      await ctx.prisma.organizationMember.create({
        data: {
          userId: ctx.session.user.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      });

      // Update invitation
      await ctx.prisma.invitation.update({
        where: { id: input.invitationId },
        data: { status: "ACCEPTED" },
      });

      return invitation.organization;
    }),

  // Remove member
  removeMember: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Can't remove owner
      const targetMembership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: input.userId,
          organizationId: input.organizationId,
        },
      });

      if (targetMembership?.role === "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot remove owner" });
      }

      await ctx.prisma.organizationMember.delete({
        where: {
          userId_organizationId: {
            userId: input.userId,
            organizationId: input.organizationId,
          },
        },
      });

      return { success: true };
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      userId: z.string(),
      role: z.enum(["ADMIN", "MEMBER"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: "OWNER",
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owners can change roles" });
      }

      // Can't change owner's role
      const targetMembership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: input.userId,
          organizationId: input.organizationId,
        },
      });

      if (targetMembership?.role === "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot change owner's role" });
      }

      await ctx.prisma.organizationMember.update({
        where: {
          userId_organizationId: {
            userId: input.userId,
            organizationId: input.organizationId,
          },
        },
        data: { role: input.role },
      });

      return { success: true };
    }),

  // Get pending invitations
  getPendingInvitations: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      return ctx.prisma.invitation.findMany({
        where: {
          organizationId: input.organizationId,
          status: "PENDING",
        },
        include: {
          inviter: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Cancel invitation
  cancelInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: { id: input.invitationId },
      });

      if (!invitation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }

      // Check if user is admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: invitation.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      await ctx.prisma.invitation.update({
        where: { id: input.invitationId },
        data: { status: "CANCELED" },
      });

      return { success: true };
    }),
});
