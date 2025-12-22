import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oidcProvider, organization } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "@/env";
import { sendOrganizationInviteEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        }
      : undefined,
    github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        }
      : undefined,
  },

  plugins: [
    // Enable OIDC Provider for ChatGPT OAuth
    oidcProvider({
      loginPage: "/signin",
    }),

    // Organization Plugin
    organization({
      // Only paid tiers can create organizations
      allowUserToCreateOrganization: async (user) => {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { subscriptionTier: true },
        });
        return dbUser?.subscriptionTier !== "FREE";
      },

      organizationLimit: 5,
      creatorRole: "owner",

      // Enable teams within organizations
      teams: {
        enabled: true,
        maximumTeams: 10,
      },

      // Custom invitation email
      async sendInvitationEmail(data) {
        const inviteLink = `${env.BETTER_AUTH_URL}/accept-invite/${data.id}`;
        await sendOrganizationInviteEmail({
          to: data.email,
          inviterName: data.inviter.user.name ?? data.inviter.user.email ?? "Someone",
          organizationName: data.organization.name,
          inviteLink,
          role: data.role,
        });
      },

      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
    }),
  ],

  secret: env.BETTER_AUTH_SECRET!,
  baseURL: env.BETTER_AUTH_URL!,

  // Enable session management
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Redirect URLs for ChatGPT OAuth flow
  trustedOrigins: [
    "https://chatgpt.com",
    "https://platform.openai.com",
  ],
});

export type Session = typeof auth.$Infer.Session;
