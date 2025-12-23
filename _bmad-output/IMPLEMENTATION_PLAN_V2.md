# Thumbway: Complete Implementation Plan v2.0
## One-Shot Code Generation Ready

**Date:** December 22, 2025
**Status:** Ready for Implementation
**Based on:** Market Research + User Feedback (50+ quotes)

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [New Package Dependencies](#new-package-dependencies)
3. [Environment Variables](#environment-variables)
4. [Database Schema (Prisma)](#database-schema-prisma)
5. [Better Auth Organization Plugin](#better-auth-organization-plugin)
6. [MCP Tools (5 Tools)](#mcp-tools-5-tools)
7. [tRPC Router Updates](#trpc-router-updates)
8. [Slack Integration](#slack-integration)
9. [Mobile-Optimized Review Page](#mobile-optimized-review-page)
10. [Email Templates](#email-templates)
11. [File Structure](#file-structure)
12. [Implementation Checklist](#implementation-checklist)

---

## Current State Analysis

### Existing Stack
- **Framework:** Next.js 15.5.9 with App Router
- **Auth:** Better Auth 1.4.7 with OIDC Provider
- **Database:** PostgreSQL + Prisma 6.19.1
- **API:** tRPC 11.8.0
- **Email:** Postmark
- **Payments:** Stripe
- **MCP:** @modelcontextprotocol/sdk + mcp-handler
- **i18n:** next-intl

### Current MCP Tools
- `send_for_review` (1 tool) - NEEDS EXPANSION TO 5

### Current Schema Gaps
- Single reviewer per review (needs multi-reviewer)
- No engagement tracking (viewed, time spent)
- No version history
- No organization/team support
- No Slack integration

---

## New Package Dependencies

### Add to package.json

```json
{
  "dependencies": {
    "@slack/web-api": "^7.8.0",
    "@slack/oauth": "^3.0.2",
    "diff": "^7.0.0"
  },
  "devDependencies": {
    "@types/diff": "^6.0.0"
  }
}
```

**Install command:**
```bash
cd approval-tool && pnpm add @slack/web-api @slack/oauth diff && pnpm add -D @types/diff
```

---

## Environment Variables

### Update src/env.ts

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Existing
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url().optional(),
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    BETTER_AUTH_URL: z.string().url().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    POSTMARK_TOKEN: z.string().optional(),
    FROM_EMAIL: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_PRICE_ID_PRO: z.string().optional(),
    STRIPE_PRICE_ID_TEAM: z.string().optional(),
    STRIPE_PRICE_ID_BUSINESS: z.string().optional(),

    // NEW: Slack Integration
    SLACK_CLIENT_ID: z.string().optional(),
    SLACK_CLIENT_SECRET: z.string().optional(),
    SLACK_SIGNING_SECRET: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },

  runtimeEnv: {
    // Existing
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    POSTMARK_TOKEN: process.env.POSTMARK_TOKEN,
    FROM_EMAIL: process.env.FROM_EMAIL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_PRO: process.env.STRIPE_PRICE_ID_PRO,
    STRIPE_PRICE_ID_TEAM: process.env.STRIPE_PRICE_ID_TEAM,
    STRIPE_PRICE_ID_BUSINESS: process.env.STRIPE_PRICE_ID_BUSINESS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

    // NEW: Slack
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

---

## Database Schema (Prisma)

### Full prisma/schema.prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ========================================
// AUTHENTICATION (Better Auth Core)
// ========================================

model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  emailVerified Boolean  @default(false)
  image         String?

  // Subscription (Stripe) - UPDATED TIERS
  subscriptionTier   SubscriptionTier @default(FREE)
  subscriptionStatus String?          // "active" | "canceled" | "past_due"
  stripeCustomerId   String?          @unique
  reviewsThisMonth   Int              @default(0)
  resetDate          DateTime         @default(now())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  sessions            Session[]
  accounts            Account[]
  reviews             Review[]
  organizationMembers OrganizationMember[]
  invitationsSent     Invitation[]         @relation("InvitationInviter")
  reviewerAssignments Reviewer[]           @relation("ReviewerUser")
  comments            Comment[]
  activityLogs        ActivityLog[]

  @@index([email])
  @@index([subscriptionTier])
}

enum SubscriptionTier {
  FREE     // 3 active approvals/month
  STARTER  // $19/mo - Unlimited approvals, 3 team members
  TEAM     // $49/mo - Unlimited everything, Slack
  BUSINESS // $99/mo - SSO, audit logs, API
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  // NEW: Active organization
  activeOrganizationId String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}

model Account {
  id                String   @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  accessToken       String?  @db.Text
  refreshToken      String?  @db.Text
  expiresAt         Int?
  createdAt         DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

// ========================================
// ORGANIZATIONS (Better Auth Plugin)
// ========================================

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logo      String?
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  members       OrganizationMember[]
  invitations   Invitation[]
  teams         Team[]
  reviews       Review[]
  slackSettings SlackIntegration?
  activityLogs  ActivityLog[]

  @@index([slug])
}

model OrganizationMember {
  id             String           @id @default(cuid())
  userId         String
  organizationId String
  role           OrganizationRole @default(MEMBER)
  createdAt      DateTime         @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([organizationId])
  @@index([userId])
}

enum OrganizationRole {
  OWNER
  ADMIN
  MEMBER
}

model Invitation {
  id             String           @id @default(cuid())
  email          String
  inviterId      String
  organizationId String
  role           OrganizationRole @default(MEMBER)
  status         InvitationStatus @default(PENDING)
  expiresAt      DateTime
  createdAt      DateTime         @default(now())

  inviter      User         @relation("InvitationInviter", fields: [inviterId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([email])
  @@index([status])
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  REJECTED
  CANCELED
  EXPIRED
}

model Team {
  id             String   @id @default(cuid())
  name           String
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  members      TeamMember[]

  @@index([organizationId])
}

model TeamMember {
  id        String   @id @default(cuid())
  teamId    String
  userId    String
  createdAt DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
}

// ========================================
// CORE REVIEW WORKFLOW (Enhanced)
// ========================================

model Review {
  id          String       @id @default(cuid())
  slug        String       @unique
  title       String
  status      ReviewStatus @default(PENDING)
  workflowType WorkflowType @default(PARALLEL)

  // Creator (authenticated user)
  creatorId String
  creator   User   @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  // Optional organization link
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  reviewers    Reviewer[]
  versions     ReviewVersion[]
  comments     Comment[]
  activityLogs ActivityLog[]

  @@index([slug])
  @@index([status])
  @@index([creatorId])
  @@index([organizationId])
  @@index([creatorId, status])
}

enum ReviewStatus {
  PENDING
  PARTIALLY_APPROVED
  CHANGES_REQUESTED
  APPROVED
  REJECTED
  CANCELED
}

enum WorkflowType {
  PARALLEL    // All reviewers can approve in any order
  SEQUENTIAL  // Must approve in order
  ANY_ONE     // First approval completes the review
}

model ReviewVersion {
  id        String   @id @default(cuid())
  reviewId  String
  version   Int
  content   String   @db.Text
  changes   String?  @db.Text // Summary of what changed
  createdAt DateTime @default(now())

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@unique([reviewId, version])
  @@index([reviewId])
}

model Reviewer {
  id       String         @id @default(cuid())
  reviewId String
  email    String
  name     String?
  status   ReviewerStatus @default(PENDING)

  // Workflow ordering (0 = parallel, 1+ = sequential position)
  order    Int     @default(0)
  required Boolean @default(true)

  // For registered users
  userId String?
  user   User?   @relation("ReviewerUser", fields: [userId], references: [id])

  // Magic link access token (for guest reviewers)
  accessToken   String   @unique @default(cuid())
  accessExpires DateTime @default(dbgenerated("NOW() + INTERVAL '7 days'"))

  // Engagement tracking
  viewedAt    DateTime?
  viewCount   Int       @default(0)
  timeSpentMs Int       @default(0)
  lastActiveAt DateTime?

  // Decision
  decidedAt DateTime?
  comments  String?   @db.Text

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([reviewId])
  @@index([email])
  @@index([accessToken])
  @@index([userId])
}

enum ReviewerStatus {
  PENDING
  APPROVED
  REJECTED
  CHANGES_REQUESTED
}

model Comment {
  id       String @id @default(cuid())
  reviewId String
  content  String @db.Text

  // Author (either user or guest)
  userId      String?
  user        User?   @relation(fields: [userId], references: [id])
  authorEmail String?
  authorName  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([reviewId])
  @@index([userId])
}

// ========================================
// SLACK INTEGRATION
// ========================================

model SlackIntegration {
  id             String @id @default(cuid())
  organizationId String @unique

  // OAuth tokens
  accessToken    String  @db.Text
  botUserId      String
  teamId         String
  teamName       String

  // Default channel for notifications
  defaultChannelId   String?
  defaultChannelName String?

  // Settings
  notifyOnNew      Boolean @default(true)
  notifyOnApproved Boolean @default(true)
  notifyOnRejected Boolean @default(true)
  notifyOnComment  Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([teamId])
}

// ========================================
// ACTIVITY LOG (Audit Trail)
// ========================================

model ActivityLog {
  id       String       @id @default(cuid())
  action   ActivityType
  metadata Json?

  // Actor
  userId String?
  user   User?   @relation(fields: [userId], references: [id])

  // Context
  reviewId       String?
  review         Review?       @relation(fields: [reviewId], references: [id], onDelete: SetNull)
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())

  @@index([reviewId])
  @@index([organizationId])
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

enum ActivityType {
  // Review lifecycle
  REVIEW_CREATED
  REVIEW_UPDATED
  REVIEW_CANCELED
  REVIEWER_ADDED
  REVIEWER_REMOVED

  // Reviewer actions
  REVIEW_VIEWED
  REVIEW_APPROVED
  REVIEW_REJECTED
  REVIEW_CHANGES_REQUESTED
  COMMENT_ADDED

  // Organization
  ORG_MEMBER_INVITED
  ORG_MEMBER_JOINED
  ORG_MEMBER_REMOVED

  // Integrations
  SLACK_CONNECTED
  SLACK_DISCONNECTED
  REMINDER_SENT
}

// ========================================
// REMINDERS
// ========================================

model Reminder {
  id         String   @id @default(cuid())
  reviewerId String
  scheduledAt DateTime
  sentAt     DateTime?
  attempt    Int      @default(1)

  createdAt DateTime @default(now())

  @@index([scheduledAt])
  @@index([reviewerId])
}
```

### Migration Command

```bash
cd approval-tool
pnpm prisma migrate dev --name "add_organizations_multi_reviewer_slack"
pnpm prisma generate
```

---

## Better Auth Organization Plugin

### Update src/lib/auth.ts

```typescript
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
    // OIDC Provider for ChatGPT OAuth
    oidcProvider({
      loginPage: "/signin",
    }),

    // NEW: Organization Plugin
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
          inviterName: data.inviter.name ?? data.inviter.email ?? "Someone",
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

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  trustedOrigins: [
    "https://chatgpt.com",
    "https://platform.openai.com",
  ],
});

export type Session = typeof auth.$Infer.Session;
```

### Update src/lib/auth-client.ts

```typescript
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "",
  plugins: [
    organizationClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
} = authClient;
```

---

## MCP Tools (5 Tools)

### Update app/mcp/route.ts

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendReviewRequestEmail, sendReminderEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import { nanoid } from "nanoid";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// ========================================
// SCHEMAS
// ========================================

const SendForReviewSchema = z.object({
  title: z.string().describe("Title of the content to review"),
  content: z.string().describe("Content to review (markdown supported)"),
  reviewers: z.array(z.string().email()).min(1).max(10)
    .describe("Email addresses of reviewers (1-10)"),
  workflowType: z.enum(["parallel", "sequential", "any_one"]).default("parallel")
    .describe("Workflow type: parallel (all approve), sequential (in order), any_one (first approves)"),
  remindAfter: z.enum(["24h", "48h", "72h", "never"]).default("24h")
    .describe("Auto-remind after this time if no response"),
});

const CheckStatusSchema = z.object({
  reviewId: z.string().optional().describe("Specific review ID to check"),
  titleSearch: z.string().optional().describe("Search reviews by title"),
});

const ListReviewsSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "all"]).default("all")
    .describe("Filter by status"),
  limit: z.number().min(1).max(20).default(10)
    .describe("Maximum number of reviews to return"),
});

const UpdateReviewSchema = z.object({
  reviewId: z.string().describe("The review ID to update"),
  newContent: z.string().describe("Updated content"),
  changeSummary: z.string().optional().describe("Brief summary of what changed"),
  notifyReviewers: z.enum(["all", "pending_only", "none"]).default("pending_only")
    .describe("Which reviewers to notify about the update"),
});

const ManageReviewersSchema = z.object({
  reviewId: z.string().describe("The review ID"),
  action: z.enum(["add", "remove", "remind"])
    .describe("Action: add new reviewers, remove existing, or send reminder"),
  emails: z.array(z.string().email()).min(1)
    .describe("Email addresses to add/remove/remind"),
});

// ========================================
// AUTH HELPERS
// ========================================

async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    return session?.user ? session : null;
  } catch {
    return null;
  }
}

function unauthorizedResponse() {
  const resourceMetadata = `${env.NEXT_PUBLIC_APP_URL}/.well-known/oauth-protected-resource`;
  return Response.json(
    {
      content: [{ type: "text", text: "Authentication required. Please login to continue." }],
      _meta: {
        "mcp/www_authenticate": [
          `Bearer resource_metadata="${resourceMetadata}", error="insufficient_scope"`,
        ],
      },
      isError: true,
    },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": `Bearer resource_metadata="${resourceMetadata}"`,
        "Content-Type": "application/json",
      },
    }
  );
}

// ========================================
// TOOL HANDLERS
// ========================================

async function handleSendForReview(
  input: z.infer<typeof SendForReviewSchema>,
  userId: string,
  userName: string,
  userEmail: string
) {
  // Check usage limits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, reviewsThisMonth: true, resetDate: true },
  });

  if (!user) throw new Error("User not found");

  // Reset monthly counter if needed
  const now = new Date();
  if (now.getMonth() !== user.resetDate.getMonth()) {
    await prisma.user.update({
      where: { id: userId },
      data: { reviewsThisMonth: 0, resetDate: now },
    });
    user.reviewsThisMonth = 0;
  }

  // Check limits based on tier
  const limits: Record<string, number> = {
    FREE: 3,
    STARTER: 999999,
    TEAM: 999999,
    BUSINESS: 999999,
  };

  const limit = limits[user.subscriptionTier] ?? 3;
  if (user.reviewsThisMonth >= limit) {
    return {
      content: [{
        type: "text",
        text: `You've reached your monthly limit of ${limit} reviews. Upgrade at ${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }],
      isError: true,
    };
  }

  // Create review with initial version
  const review = await prisma.review.create({
    data: {
      slug: nanoid(10),
      title: input.title,
      creatorId: userId,
      workflowType: input.workflowType.toUpperCase() as "PARALLEL" | "SEQUENTIAL" | "ANY_ONE",
      versions: {
        create: {
          version: 1,
          content: input.content,
        },
      },
      reviewers: {
        create: input.reviewers.map((email, index) => ({
          email,
          order: input.workflowType === "sequential" ? index + 1 : 0,
        })),
      },
    },
    include: {
      reviewers: true,
    },
  });

  // Increment review count
  await prisma.user.update({
    where: { id: userId },
    data: { reviewsThisMonth: { increment: 1 } },
  });

  // Send email notifications
  const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;
  for (const reviewer of review.reviewers) {
    const accessUrl = `${reviewUrl}?token=${reviewer.accessToken}`;
    try {
      await sendReviewRequestEmail({
        to: reviewer.email,
        reviewerName: reviewer.email.split("@")[0],
        creatorName: userName,
        title: input.title,
        reviewUrl: accessUrl,
      });
    } catch (e) {
      console.error(`Failed to send email to ${reviewer.email}:`, e);
    }
  }

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: "REVIEW_CREATED",
      userId,
      reviewId: review.id,
      metadata: { reviewerCount: input.reviewers.length, workflowType: input.workflowType },
    },
  });

  const remaining = user.subscriptionTier === "FREE"
    ? limit - (user.reviewsThisMonth + 1)
    : "unlimited";

  return {
    content: [{
      type: "text",
      text: `✅ Review created successfully!

📝 **${input.title}**
🔗 Link: ${reviewUrl}
👥 Reviewers: ${input.reviewers.join(", ")}
📊 Workflow: ${input.workflowType}
⏰ Reminder: ${input.remindAfter}

Reviews remaining: ${remaining}`,
    }],
  };
}

async function handleCheckStatus(
  input: z.infer<typeof CheckStatusSchema>,
  userId: string
) {
  let review;

  if (input.reviewId) {
    review = await prisma.review.findFirst({
      where: { id: input.reviewId, creatorId: userId },
      include: {
        reviewers: { orderBy: { order: "asc" } },
        versions: { orderBy: { version: "desc" }, take: 1 },
      },
    });
  } else if (input.titleSearch) {
    review = await prisma.review.findFirst({
      where: {
        creatorId: userId,
        title: { contains: input.titleSearch, mode: "insensitive" },
      },
      include: {
        reviewers: { orderBy: { order: "asc" } },
        versions: { orderBy: { version: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!review) {
    return {
      content: [{ type: "text", text: "❌ Review not found. Try listing your reviews first." }],
      isError: true,
    };
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "⏳",
    APPROVED: "✅",
    REJECTED: "❌",
    CHANGES_REQUESTED: "📝",
    PARTIALLY_APPROVED: "🔄",
  };

  const reviewerStatuses = review.reviewers.map((r) => {
    const emoji = statusEmoji[r.status] ?? "⏳";
    const viewed = r.viewedAt ? ` (viewed ${formatTimeAgo(r.viewedAt)})` : "";
    return `  ${emoji} ${r.email}${viewed}`;
  }).join("\n");

  return {
    content: [{
      type: "text",
      text: `📋 **${review.title}**

Status: ${statusEmoji[review.status] ?? "⏳"} ${review.status}
Version: ${review.versions[0]?.version ?? 1}
Created: ${formatTimeAgo(review.createdAt)}

**Reviewers:**
${reviewerStatuses}

🔗 Link: ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
    }],
  };
}

async function handleListReviews(
  input: z.infer<typeof ListReviewsSchema>,
  userId: string
) {
  const where: any = { creatorId: userId };
  if (input.status !== "all") {
    where.status = input.status.toUpperCase();
  }

  const reviews = await prisma.review.findMany({
    where,
    include: {
      reviewers: true,
      _count: { select: { reviewers: true } },
    },
    orderBy: { createdAt: "desc" },
    take: input.limit,
  });

  if (reviews.length === 0) {
    return {
      content: [{ type: "text", text: "📭 No reviews found." }],
    };
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "⏳",
    APPROVED: "✅",
    REJECTED: "❌",
    CHANGES_REQUESTED: "📝",
    PARTIALLY_APPROVED: "🔄",
  };

  const reviewList = reviews.map((r, i) => {
    const approved = r.reviewers.filter((rv) => rv.status === "APPROVED").length;
    const total = r.reviewers.length;
    return `${i + 1}. ${statusEmoji[r.status] ?? "⏳"} **${r.title}** (${approved}/${total} approved)\n   ID: ${r.id} | ${formatTimeAgo(r.createdAt)}`;
  }).join("\n\n");

  return {
    content: [{
      type: "text",
      text: `📋 **Your Reviews** (${input.status})\n\n${reviewList}`,
    }],
  };
}

async function handleUpdateReview(
  input: z.infer<typeof UpdateReviewSchema>,
  userId: string,
  userName: string
) {
  const review = await prisma.review.findFirst({
    where: { id: input.reviewId, creatorId: userId },
    include: { reviewers: true, versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!review) {
    return {
      content: [{ type: "text", text: "❌ Review not found or you don't have access." }],
      isError: true,
    };
  }

  const newVersion = (review.versions[0]?.version ?? 0) + 1;

  // Create new version
  await prisma.reviewVersion.create({
    data: {
      reviewId: review.id,
      version: newVersion,
      content: input.newContent,
      changes: input.changeSummary,
    },
  });

  // Update review status if changes were requested
  if (review.status === "CHANGES_REQUESTED") {
    await prisma.review.update({
      where: { id: review.id },
      data: { status: "PENDING" },
    });
  }

  // Notify reviewers
  const reviewersToNotify = input.notifyReviewers === "all"
    ? review.reviewers
    : input.notifyReviewers === "pending_only"
    ? review.reviewers.filter((r) => r.status === "PENDING" || r.status === "CHANGES_REQUESTED")
    : [];

  for (const reviewer of reviewersToNotify) {
    const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
    try {
      await sendReviewRequestEmail({
        to: reviewer.email,
        reviewerName: reviewer.name ?? reviewer.email.split("@")[0],
        creatorName: userName,
        title: `[Updated v${newVersion}] ${review.title}`,
        reviewUrl: accessUrl,
      });
    } catch (e) {
      console.error(`Failed to notify ${reviewer.email}:`, e);
    }
  }

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: "REVIEW_UPDATED",
      userId,
      reviewId: review.id,
      metadata: { version: newVersion, changes: input.changeSummary },
    },
  });

  return {
    content: [{
      type: "text",
      text: `✅ Review updated to version ${newVersion}!

📝 **${review.title}**
${input.changeSummary ? `📋 Changes: ${input.changeSummary}` : ""}
📧 Notified: ${reviewersToNotify.length} reviewer(s)

🔗 Link: ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
    }],
  };
}

async function handleManageReviewers(
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
      content: [{ type: "text", text: "❌ Review not found or you don't have access." }],
      isError: true,
    };
  }

  if (input.action === "add") {
    const existingEmails = new Set(review.reviewers.map((r) => r.email.toLowerCase()));
    const newEmails = input.emails.filter((e) => !existingEmails.has(e.toLowerCase()));

    if (newEmails.length === 0) {
      return {
        content: [{ type: "text", text: "⚠️ All specified reviewers are already on this review." }],
      };
    }

    // Add new reviewers
    const maxOrder = Math.max(...review.reviewers.map((r) => r.order), 0);
    for (let i = 0; i < newEmails.length; i++) {
      const reviewer = await prisma.reviewer.create({
        data: {
          reviewId: review.id,
          email: newEmails[i]!,
          order: review.workflowType === "SEQUENTIAL" ? maxOrder + i + 1 : 0,
        },
      });

      // Send email
      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReviewRequestEmail({
          to: newEmails[i]!,
          reviewerName: newEmails[i]!.split("@")[0],
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
        });
      } catch (e) {
        console.error(`Failed to send email to ${newEmails[i]}:`, e);
      }
    }

    return {
      content: [{
        type: "text",
        text: `✅ Added ${newEmails.length} reviewer(s): ${newEmails.join(", ")}`,
      }],
    };
  }

  if (input.action === "remove") {
    const result = await prisma.reviewer.deleteMany({
      where: {
        reviewId: review.id,
        email: { in: input.emails.map((e) => e.toLowerCase()) },
      },
    });

    return {
      content: [{
        type: "text",
        text: `✅ Removed ${result.count} reviewer(s)`,
      }],
    };
  }

  if (input.action === "remind") {
    const reviewersToRemind = review.reviewers.filter(
      (r) => input.emails.includes(r.email.toLowerCase()) && r.status === "PENDING"
    );

    for (const reviewer of reviewersToRemind) {
      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? reviewer.email.split("@")[0],
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
        });
      } catch (e) {
        console.error(`Failed to remind ${reviewer.email}:`, e);
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "REMINDER_SENT",
        userId,
        reviewId: review.id,
        metadata: { count: reviewersToRemind.length },
      },
    });

    return {
      content: [{
        type: "text",
        text: `✅ Sent reminder to ${reviewersToRemind.length} reviewer(s)`,
      }],
    };
  }

  return {
    content: [{ type: "text", text: "❌ Unknown action" }],
    isError: true,
  };
}

// ========================================
// HELPERS
// ========================================

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ========================================
// ROUTE HANDLERS
// ========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // tools/list - Return all available tools
    if (body.method === "tools/list") {
      return Response.json({
        tools: [
          {
            name: "send_for_review",
            description: "Send content for approval to one or more reviewers. Supports parallel, sequential, or any-one approval workflows.",
            inputSchema: zodToJsonSchema(SendForReviewSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
          },
          {
            name: "check_approval_status",
            description: "Check the current status of a review, including which reviewers have approved and engagement data (when they viewed it).",
            inputSchema: zodToJsonSchema(CheckStatusSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
          },
          {
            name: "list_pending_reviews",
            description: "List your reviews filtered by status (pending, approved, rejected, or all).",
            inputSchema: zodToJsonSchema(ListReviewsSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
          },
          {
            name: "update_review_version",
            description: "Update a review with new content, creating a new version. Useful for addressing feedback.",
            inputSchema: zodToJsonSchema(UpdateReviewSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
          },
          {
            name: "manage_reviewers",
            description: "Add, remove, or send reminders to reviewers on an existing review.",
            inputSchema: zodToJsonSchema(ManageReviewersSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
          },
        ],
      });
    }

    // tools/call - Execute a tool
    if (body.method === "tools/call") {
      const session = await verifyToken(request);
      if (!session) return unauthorizedResponse();

      const { name, arguments: args } = body.params;
      const userId = session.user.id;
      const userName = session.user.name ?? session.user.email ?? "Someone";
      const userEmail = session.user.email ?? "";

      try {
        switch (name) {
          case "send_for_review": {
            const input = SendForReviewSchema.parse(args);
            const result = await handleSendForReview(input, userId, userName, userEmail);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          case "check_approval_status": {
            const input = CheckStatusSchema.parse(args);
            const result = await handleCheckStatus(input, userId);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          case "list_pending_reviews": {
            const input = ListReviewsSchema.parse(args);
            const result = await handleListReviews(input, userId);
            return Response.json(result);
          }

          case "update_review_version": {
            const input = UpdateReviewSchema.parse(args);
            const result = await handleUpdateReview(input, userId, userName);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          case "manage_reviewers": {
            const input = ManageReviewersSchema.parse(args);
            const result = await handleManageReviewers(input, userId, userName);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          default:
            return Response.json(
              { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true },
              { status: 400 }
            );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return Response.json(
            {
              content: [{
                type: "text",
                text: `Invalid input: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
              }],
              isError: true,
            },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    return Response.json(
      { content: [{ type: "text", text: `Unknown method: ${body.method}` }], isError: true },
      { status: 400 }
    );
  } catch (error) {
    console.error("MCP handler error:", error);
    return Response.json(
      { content: [{ type: "text", text: "An error occurred processing your request." }], isError: true },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    name: "Thumbway Approval Tool",
    version: "2.0.0",
    description: "AI-native approval workflows for ChatGPT content",
    capabilities: {
      tools: [
        "send_for_review",
        "check_approval_status",
        "list_pending_reviews",
        "update_review_version",
        "manage_reviewers",
      ],
      auth: "oauth2",
    },
  });
}
```

---

## tRPC Router Updates

### New file: src/server/api/routers/organization.ts

```typescript
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
});
```

### Update src/server/api/routers/review.ts (Enhanced)

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { sendReviewRequestEmail, sendReviewDecisionEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";

export const reviewRouter = createTRPCRouter({
  // Create review with multiple reviewers
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1).max(50000),
      reviewers: z.array(z.string().email()).min(1).max(10),
      workflowType: z.enum(["PARALLEL", "SEQUENTIAL", "ANY_ONE"]).default("PARALLEL"),
      organizationId: z.string().optional(),
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
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = { creatorId: ctx.session.user.id };

      if (input?.status && input.status !== "all") {
        where.status = input.status.toUpperCase();
      }
      if (input?.organizationId) {
        where.organizationId = input.organizationId;
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

      // Update reviewer status
      await ctx.prisma.reviewer.update({
        where: { id: reviewer.id },
        data: {
          status: input.decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
          comments: input.comments,
          decidedAt: new Date(),
        },
      });

      // Calculate new review status
      const updatedReviewers = await ctx.prisma.reviewer.findMany({
        where: { reviewId: review.id },
      });

      let newStatus = review.status;
      const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
      const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
      const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
      const total = updatedReviewers.length;

      if (review.workflowType === "ANY_ONE") {
        // First approval/rejection completes
        if (input.decision === "approved") newStatus = "APPROVED";
        else if (input.decision === "rejected") newStatus = "REJECTED";
        else newStatus = "CHANGES_REQUESTED";
      } else {
        // All must decide
        if (rejected > 0) newStatus = "REJECTED";
        else if (changesRequested > 0) newStatus = "CHANGES_REQUESTED";
        else if (approved === total) newStatus = "APPROVED";
        else if (approved > 0) newStatus = "PARTIALLY_APPROVED";
      }

      // Update review status
      if (newStatus !== review.status) {
        await ctx.prisma.review.update({
          where: { id: review.id },
          data: { status: newStatus },
        });
      }

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          action: input.decision === "approved" ? "REVIEW_APPROVED"
            : input.decision === "rejected" ? "REVIEW_REJECTED"
            : "REVIEW_CHANGES_REQUESTED",
          reviewId: review.id,
          metadata: { reviewerEmail: reviewer.email, comments: input.comments },
        },
      });

      // Send email to creator
      await sendReviewDecisionEmail({
        to: review.creator.email,
        creatorName: review.creator.name ?? "there",
        title: review.title,
        decision: input.decision,
        reviewerEmail: reviewer.email,
        comments: input.comments,
        reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
      });

      // Send Slack notification
      if (review.organizationId) {
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
      let authorData: any = {};

      if (input.token) {
        const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
        if (reviewer) {
          authorData = {
            authorEmail: reviewer.email,
            authorName: reviewer.name ?? reviewer.email.split("@")[0],
            userId: reviewer.userId,
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

  // Get stats
  getStats: protectedProcedure
    .input(z.object({ organizationId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = { creatorId: ctx.session.user.id };
      if (input?.organizationId) {
        where.organizationId = input.organizationId;
      }

      const stats = await ctx.prisma.review.groupBy({
        by: ["status"],
        where,
        _count: { status: true },
      });

      const statsMap = stats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count.status;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: stats.reduce((sum, stat) => sum + stat._count.status, 0),
        pending: statsMap.pending ?? 0,
        approved: statsMap.approved ?? 0,
        rejected: statsMap.rejected ?? 0,
        changesRequested: statsMap.changes_requested ?? 0,
      };
    }),

  // Delete review
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: { id: input.id, creatorId: ctx.session.user.id },
      });

      if (!review) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.review.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
```

### Update src/server/api/root.ts

```typescript
import { createTRPCRouter } from "./trpc";
import { reviewRouter } from "./routers/review";
import { userRouter } from "./routers/user";
import { organizationRouter } from "./routers/organization";
import { slackRouter } from "./routers/slack";

export const appRouter = createTRPCRouter({
  review: reviewRouter,
  user: userRouter,
  organization: organizationRouter,
  slack: slackRouter,
});

export type AppRouter = typeof appRouter;
```

---

## Slack Integration

### New file: src/lib/slack.ts

```typescript
import { WebClient } from "@slack/web-api";
import { prisma } from "./db";
import { env } from "@/env";

export async function getSlackClient(organizationId: string): Promise<WebClient | null> {
  const integration = await prisma.slackIntegration.findUnique({
    where: { organizationId },
  });

  if (!integration) return null;

  return new WebClient(integration.accessToken);
}

type NotificationType = "NEW_REVIEW" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "COMMENT";

interface NotificationData {
  title: string;
  creatorName: string;
  reviewUrl: string;
  reviewerEmail?: string;
  reviewerCount?: number;
  comments?: string;
}

export async function sendSlackNotification({
  organizationId,
  type,
  data,
}: {
  organizationId: string;
  type: NotificationType;
  data: NotificationData;
}) {
  try {
    const integration = await prisma.slackIntegration.findUnique({
      where: { organizationId },
    });

    if (!integration || !integration.defaultChannelId) return;

    // Check notification settings
    if (type === "NEW_REVIEW" && !integration.notifyOnNew) return;
    if (type === "APPROVED" && !integration.notifyOnApproved) return;
    if (type === "REJECTED" && !integration.notifyOnRejected) return;
    if (type === "COMMENT" && !integration.notifyOnComment) return;

    const client = new WebClient(integration.accessToken);

    const emoji = {
      NEW_REVIEW: "📝",
      APPROVED: "✅",
      REJECTED: "❌",
      CHANGES_REQUESTED: "📋",
      COMMENT: "💬",
    }[type];

    const action = {
      NEW_REVIEW: `requested approval for`,
      APPROVED: `approved`,
      REJECTED: `rejected`,
      CHANGES_REQUESTED: `requested changes on`,
      COMMENT: `commented on`,
    }[type];

    const message = {
      channel: integration.defaultChannelId,
      text: `${emoji} ${data.creatorName} ${action} *${data.title}*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${emoji} *${type === "NEW_REVIEW" ? "New Review Request" : type.replace("_", " ")}*\n\n*${data.title}*\n\nBy: ${data.creatorName}${data.reviewerEmail ? ` | From: ${data.reviewerEmail}` : ""}${data.reviewerCount ? ` | ${data.reviewerCount} reviewers` : ""}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Review" },
              url: data.reviewUrl,
              action_id: "view_review",
            },
          ],
        },
      ],
    };

    await client.chat.postMessage(message);
  } catch (error) {
    console.error("Slack notification error:", error);
  }
}
```

### New file: src/server/api/routers/slack.ts

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { WebClient } from "@slack/web-api";
import { env } from "@/env";

export const slackRouter = createTRPCRouter({
  // Get Slack status for organization
  getStatus: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify membership
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const integration = await ctx.prisma.slackIntegration.findUnique({
        where: { organizationId: input.organizationId },
        select: {
          teamName: true,
          defaultChannelName: true,
          notifyOnNew: true,
          notifyOnApproved: true,
          notifyOnRejected: true,
          notifyOnComment: true,
          createdAt: true,
        },
      });

      return integration;
    }),

  // Get OAuth URL
  getOAuthUrl: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!env.SLACK_CLIENT_ID) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Slack not configured" });
      }

      // Verify admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const state = Buffer.from(JSON.stringify({
        organizationId: input.organizationId,
        userId: ctx.session.user.id,
      })).toString("base64");

      const scopes = [
        "chat:write",
        "chat:write.public",
        "channels:read",
        "users:read",
      ].join(",");

      const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/slack/callback`;

      return `https://slack.com/oauth/v2/authorize?client_id=${env.SLACK_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    }),

  // Update settings
  updateSettings: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      defaultChannelId: z.string().optional(),
      notifyOnNew: z.boolean().optional(),
      notifyOnApproved: z.boolean().optional(),
      notifyOnRejected: z.boolean().optional(),
      notifyOnComment: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { organizationId, ...updates } = input;

      // If setting channel, get channel name
      if (updates.defaultChannelId) {
        const integration = await ctx.prisma.slackIntegration.findUnique({
          where: { organizationId },
        });

        if (integration) {
          const client = new WebClient(integration.accessToken);
          try {
            const channelInfo = await client.conversations.info({
              channel: updates.defaultChannelId,
            });
            (updates as any).defaultChannelName = (channelInfo.channel as any)?.name;
          } catch (e) {
            console.error("Failed to get channel info:", e);
          }
        }
      }

      return ctx.prisma.slackIntegration.update({
        where: { organizationId },
        data: updates,
      });
    }),

  // Disconnect Slack
  disconnect: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify admin/owner
      const membership = await ctx.prisma.organizationMember.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.prisma.slackIntegration.delete({
        where: { organizationId: input.organizationId },
      });

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          action: "SLACK_DISCONNECTED",
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      });

      return { success: true };
    }),

  // Get channels for dropdown
  getChannels: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const integration = await ctx.prisma.slackIntegration.findUnique({
        where: { organizationId: input.organizationId },
      });

      if (!integration) return [];

      const client = new WebClient(integration.accessToken);
      try {
        const result = await client.conversations.list({
          types: "public_channel,private_channel",
          limit: 100,
        });

        return (result.channels ?? []).map((c) => ({
          id: c.id!,
          name: c.name!,
        }));
      } catch (e) {
        console.error("Failed to get channels:", e);
        return [];
      }
    }),
});
```

### New file: app/api/slack/callback/route.ts

```typescript
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { WebClient } from "@slack/web-api";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return redirect("/dashboard?slack=error&message=" + encodeURIComponent(error));
  }

  if (!code || !state) {
    return redirect("/dashboard?slack=error&message=missing_params");
  }

  try {
    // Decode state
    const { organizationId, userId } = JSON.parse(
      Buffer.from(state, "base64").toString()
    );

    // Verify user is still admin/owner
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
        role: { in: ["OWNER", "ADMIN"] },
      },
    });

    if (!membership) {
      return redirect("/dashboard?slack=error&message=unauthorized");
    }

    // Exchange code for token
    const client = new WebClient();
    const result = await client.oauth.v2.access({
      client_id: env.SLACK_CLIENT_ID!,
      client_secret: env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/slack/callback`,
    });

    if (!result.ok || !result.access_token) {
      return redirect("/dashboard?slack=error&message=token_exchange_failed");
    }

    // Save integration
    await prisma.slackIntegration.upsert({
      where: { organizationId },
      create: {
        organizationId,
        accessToken: result.access_token,
        botUserId: result.bot_user_id!,
        teamId: result.team!.id!,
        teamName: result.team!.name!,
      },
      update: {
        accessToken: result.access_token,
        botUserId: result.bot_user_id!,
        teamId: result.team!.id!,
        teamName: result.team!.name!,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "SLACK_CONNECTED",
        userId,
        organizationId,
        metadata: { teamName: result.team!.name },
      },
    });

    return redirect("/dashboard?slack=connected");
  } catch (e) {
    console.error("Slack OAuth error:", e);
    return redirect("/dashboard?slack=error&message=unknown");
  }
}
```

---

## Mobile-Optimized Review Page

### Update app/[locale]/review/[slug]/page.tsx

```typescript
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { sendReviewDecisionEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import { formatDistanceToNow } from "date-fns";

interface ReviewPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;

  // Fetch review with all relations
  const review = await prisma.review.findUnique({
    where: { slug },
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

  if (!review) notFound();

  // Find current reviewer by token
  const currentReviewer = token
    ? review.reviewers.find((r) => r.accessToken === token)
    : null;

  // Track view if valid token and first view
  if (currentReviewer && !currentReviewer.viewedAt) {
    await prisma.reviewer.update({
      where: { id: currentReviewer.id },
      data: {
        viewedAt: new Date(),
        viewCount: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "REVIEW_VIEWED",
        reviewId: review.id,
        metadata: { reviewerEmail: currentReviewer.email },
      },
    });
  }

  const latestVersion = review.versions[0];
  const canDecide = currentReviewer && currentReviewer.status === "PENDING";
  const isDecided = currentReviewer && currentReviewer.status !== "PENDING";

  // Server action for decision
  async function handleDecision(formData: FormData) {
    "use server";

    const decision = formData.get("decision") as string;
    const comments = formData.get("comments") as string;
    const reviewerToken = formData.get("token") as string;

    if (!decision || !["approved", "rejected", "changes_requested"].includes(decision)) {
      throw new Error("Invalid decision");
    }

    const reviewData = await prisma.review.findUnique({
      where: { slug },
      include: { reviewers: true, creator: true },
    });

    if (!reviewData) throw new Error("Review not found");

    const reviewer = reviewData.reviewers.find((r) => r.accessToken === reviewerToken);
    if (!reviewer || reviewer.status !== "PENDING") {
      throw new Error("Cannot submit decision");
    }

    // Update reviewer
    await prisma.reviewer.update({
      where: { id: reviewer.id },
      data: {
        status: decision.toUpperCase() as any,
        comments: comments || null,
        decidedAt: new Date(),
      },
    });

    // Calculate new status
    const updatedReviewers = await prisma.reviewer.findMany({
      where: { reviewId: reviewData.id },
    });

    const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
    const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
    const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
    const total = updatedReviewers.length;

    let newStatus = reviewData.status;
    if (reviewData.workflowType === "ANY_ONE") {
      if (decision === "approved") newStatus = "APPROVED";
      else if (decision === "rejected") newStatus = "REJECTED";
      else newStatus = "CHANGES_REQUESTED";
    } else {
      if (rejected > 0) newStatus = "REJECTED";
      else if (changesRequested > 0) newStatus = "CHANGES_REQUESTED";
      else if (approved === total) newStatus = "APPROVED";
      else if (approved > 0) newStatus = "PARTIALLY_APPROVED";
    }

    if (newStatus !== reviewData.status) {
      await prisma.review.update({
        where: { id: reviewData.id },
        data: { status: newStatus },
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: decision === "approved" ? "REVIEW_APPROVED" : decision === "rejected" ? "REVIEW_REJECTED" : "REVIEW_CHANGES_REQUESTED",
        reviewId: reviewData.id,
        metadata: { reviewerEmail: reviewer.email, comments },
      },
    });

    // Send email
    await sendReviewDecisionEmail({
      to: reviewData.creator.email,
      creatorName: reviewData.creator.name ?? "there",
      title: reviewData.title,
      decision: decision as any,
      reviewerEmail: reviewer.email,
      comments: comments || undefined,
      reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`,
    });

    // Slack notification
    if (reviewData.organizationId) {
      await sendSlackNotification({
        organizationId: reviewData.organizationId,
        type: decision === "approved" ? "APPROVED" : decision === "rejected" ? "REJECTED" : "CHANGES_REQUESTED",
        data: {
          title: reviewData.title,
          reviewerEmail: reviewer.email,
          creatorName: reviewData.creator.name ?? reviewData.creator.email ?? "",
          reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`,
        },
      });
    }

    redirect(`/review/${slug}?token=${reviewerToken}`);
  }

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    CHANGES_REQUESTED: "bg-orange-100 text-orange-800 border-orange-200",
    PARTIALLY_APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE-OPTIMIZED: Sticky header with actions */}
      {canDecide && (
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <form action={handleDecision} className="p-4">
            <input type="hidden" name="token" value={token} />
            <div className="flex gap-3">
              <button
                type="submit"
                name="decision"
                value="approved"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl text-lg touch-manipulation active:scale-95 transition-transform"
              >
                ✓ Approve
              </button>
              <button
                type="submit"
                name="decision"
                value="rejected"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl text-lg touch-manipulation active:scale-95 transition-transform"
              >
                ✗ Reject
              </button>
            </div>
            <button
              type="submit"
              name="decision"
              value="changes_requested"
              className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl text-base touch-manipulation active:scale-95 transition-transform"
            >
              📝 Request Changes
            </button>
          </form>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {review.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>From: {review.creator.name ?? review.creator.email}</span>
            <span>•</span>
            <span>{formatDistanceToNow(review.createdAt, { addSuffix: true })}</span>
            {latestVersion && latestVersion.version > 1 && (
              <>
                <span>•</span>
                <span className="text-blue-600">v{latestVersion.version}</span>
              </>
            )}
          </div>

          {/* Overall status */}
          <div className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColors[review.status]}`}>
            {review.status.replace("_", " ")}
          </div>
        </div>

        {/* Your decision (if already decided) */}
        {isDecided && currentReviewer && (
          <div className={`rounded-xl p-4 mb-4 border ${statusColors[currentReviewer.status]}`}>
            <p className="font-semibold">
              You {currentReviewer.status.toLowerCase().replace("_", " ")} this review
            </p>
            {currentReviewer.comments && (
              <p className="mt-2 text-sm">Your feedback: {currentReviewer.comments}</p>
            )}
          </div>
        )}

        {/* Reviewers status */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Reviewers</h3>
          <div className="space-y-2">
            {review.reviewers.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-700">
                  {r.email}
                  {r.accessToken === token && (
                    <span className="ml-2 text-xs text-blue-600">(you)</span>
                  )}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[r.status]}`}>
                  {r.status === "PENDING" && r.viewedAt
                    ? `Viewed ${formatDistanceToNow(r.viewedAt, { addSuffix: true })}`
                    : r.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="prose prose-sm sm:prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 text-base leading-relaxed">
              {latestVersion?.content}
            </div>
          </div>
        </div>

        {/* Comments form (if can decide) */}
        {canDecide && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <form action={handleDecision}>
              <input type="hidden" name="token" value={token} />
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add feedback (optional)
              </label>
              <textarea
                name="comments"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your comments..."
              />
            </form>
          </div>
        )}

        {/* Comments section */}
        {review.comments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Comments</h3>
            <div className="space-y-4">
              {review.comments.map((c) => (
                <div key={c.id} className="border-l-4 border-gray-200 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    {c.user?.name ?? c.authorName ?? c.authorEmail ?? "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(c.createdAt, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <a href={env.NEXT_PUBLIC_APP_URL} className="text-blue-600 hover:text-blue-700 font-medium">
              Thumbway
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = await prisma.review.findUnique({
    where: { slug },
    select: { title: true },
  });

  return {
    title: review ? `Review: ${review.title}` : "Review Not Found",
    description: "Review and provide feedback",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
  };
}
```

---

## Email Templates

### Update src/lib/email.ts

Add these new email functions:

```typescript
// Add to existing email.ts

export async function sendOrganizationInviteEmail({
  to,
  inviterName,
  organizationName,
  inviteLink,
  role,
}: {
  to: string;
  inviterName: string;
  organizationName: string;
  inviteLink: string;
  role: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
          .button { display: inline-block; background: #4F46E5; color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">You're Invited!</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on Thumbway as a <strong>${role.toLowerCase()}</strong>.</p>
            <p style="text-align: center;">
              <a href="${inviteLink}" class="button">Accept Invitation</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">This invitation expires in 7 days.</p>
          </div>
          <div class="footer">
            <p>Powered by Thumbway</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!client) {
    console.log("Would send invite email:", { to, organizationName });
    return;
  }

  await client.sendEmail({
    From: env.FROM_EMAIL!,
    To: to,
    Subject: `Join ${organizationName} on Thumbway`,
    HtmlBody: html,
  });
}

export async function sendReminderEmail({
  to,
  reviewerName,
  creatorName,
  title,
  reviewUrl,
}: {
  to: string;
  reviewerName: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
          .button { display: inline-block; background: #4F46E5; color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">⏰ Reminder: Review Pending</h1>
          </div>
          <div class="content">
            <p>Hi ${reviewerName},</p>
            <p>This is a friendly reminder that <strong>${creatorName}</strong> is waiting for your review on:</p>
            <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
            <p style="text-align: center;">
              <a href="${reviewUrl}" class="button">Review Now</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!client) {
    console.log("Would send reminder email:", { to, title });
    return;
  }

  await client.sendEmail({
    From: env.FROM_EMAIL!,
    To: to,
    Subject: `⏰ Reminder: Review pending - ${title}`,
    HtmlBody: html,
  });
}

// Update sendReviewDecisionEmail to include reviewer info
export async function sendReviewDecisionEmail({
  to,
  creatorName,
  title,
  decision,
  reviewerEmail,
  comments,
  reviewUrl,
}: {
  to: string;
  creatorName: string;
  title: string;
  decision: "approved" | "rejected" | "changes_requested";
  reviewerEmail?: string;
  comments?: string;
  reviewUrl: string;
}) {
  const statusConfig = {
    approved: { color: "#10b981", text: "Approved", emoji: "✅" },
    rejected: { color: "#ef4444", text: "Rejected", emoji: "❌" },
    changes_requested: { color: "#f59e0b", text: "Changes Requested", emoji: "📝" },
  };

  const config = statusConfig[decision];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${config.color}; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
          .status { display: inline-block; background: ${config.color}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
          .comments { background: #f9fafb; padding: 16px; border-left: 4px solid ${config.color}; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .button { display: inline-block; background: #4F46E5; color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">${config.emoji} Review ${config.text}</h1>
          </div>
          <div class="content">
            <p>Hi ${creatorName},</p>
            <p>Your review request has been <span class="status">${config.text}</span></p>
            <h2 style="color: #4F46E5; margin: 20px 0;">${title}</h2>
            ${reviewerEmail ? `<p><strong>By:</strong> ${reviewerEmail}</p>` : ""}
            ${comments ? `
              <div class="comments">
                <p style="margin: 0; font-weight: 600; color: #6b7280; font-size: 14px;">Feedback:</p>
                <p style="margin: 8px 0 0 0;">${comments}</p>
              </div>
            ` : ""}
            <p style="text-align: center; margin-top: 30px;">
              <a href="${reviewUrl}" class="button">View Review</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!client) {
    console.log("Would send decision email:", { to, decision, title });
    return;
  }

  await client.sendEmail({
    From: env.FROM_EMAIL!,
    To: to,
    Subject: `${config.emoji} Review ${config.text}: ${title}`,
    HtmlBody: html,
  });
}
```

---

## File Structure

```
approval-tool/
├── app/
│   ├── [locale]/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── organizations/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── signin/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── review/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Updated (mobile-first)
│   │   ├── accept-invite/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # NEW
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── slack/
│   │   │   └── callback/
│   │   │       └── route.ts          # NEW
│   │   └── trpc/[trpc]/route.ts
│   ├── mcp/
│   │   └── route.ts                  # Updated (5 tools)
│   └── layout.tsx
├── prisma/
│   └── schema.prisma                 # Updated
├── src/
│   ├── env.ts                        # Updated
│   ├── lib/
│   │   ├── auth.ts                   # Updated (organization plugin)
│   │   ├── auth-client.ts            # Updated
│   │   ├── db.ts
│   │   ├── email.ts                  # Updated
│   │   ├── slack.ts                  # NEW
│   │   ├── stripe.ts
│   │   └── utils.ts
│   ├── server/
│   │   └── api/
│   │       ├── routers/
│   │       │   ├── review.ts         # Updated
│   │       │   ├── user.ts
│   │       │   ├── organization.ts   # NEW
│   │       │   └── slack.ts          # NEW
│   │       ├── root.ts               # Updated
│   │       └── trpc.ts
│   └── trpc/
│       ├── react.tsx
│       └── server.ts
├── messages/
│   └── en.json                       # Update with new strings
└── package.json                      # Updated
```

---

## Implementation Checklist

### Phase 1: Database & Auth (Day 1-2)
- [ ] Install new dependencies (`@slack/web-api`, `@slack/oauth`, `diff`)
- [ ] Update `prisma/schema.prisma` with full schema
- [ ] Run `pnpm prisma migrate dev`
- [ ] Update `src/env.ts` with new environment variables
- [ ] Update `src/lib/auth.ts` with organization plugin
- [ ] Update `src/lib/auth-client.ts`

### Phase 2: MCP Tools (Day 2-3)
- [ ] Update `app/mcp/route.ts` with all 5 tools
- [ ] Test each tool via ChatGPT

### Phase 3: tRPC Routers (Day 3-4)
- [ ] Create `src/server/api/routers/organization.ts`
- [ ] Create `src/server/api/routers/slack.ts`
- [ ] Update `src/server/api/routers/review.ts`
- [ ] Update `src/server/api/root.ts`

### Phase 4: Slack Integration (Day 4-5)
- [ ] Create `src/lib/slack.ts`
- [ ] Create `app/api/slack/callback/route.ts`
- [ ] Create Slack app in Slack API dashboard
- [ ] Test OAuth flow

### Phase 5: Email & UI (Day 5-6)
- [ ] Update `src/lib/email.ts` with new templates
- [ ] Update `app/[locale]/review/[slug]/page.tsx` (mobile-first)
- [ ] Create `app/[locale]/accept-invite/[id]/page.tsx`

### Phase 6: Dashboard UI (Day 6-7)
- [ ] Update dashboard with organization switcher
- [ ] Add organization settings page
- [ ] Add Slack settings UI
- [ ] Add member management UI

### Phase 7: Testing (Day 7)
- [ ] Test full flow: Create review → Email → Approve → Notification
- [ ] Test mobile approval experience
- [ ] Test Slack notifications
- [ ] Test multi-reviewer workflows

---

## Environment Variables (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/thumbway"

# Better Auth
BETTER_AUTH_SECRET="your-32-character-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email (Postmark)
POSTMARK_TOKEN=""
FROM_EMAIL="noreply@thumbway.com"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID_PRO=""
STRIPE_PRICE_ID_TEAM=""
STRIPE_PRICE_ID_BUSINESS=""

# Slack
SLACK_CLIENT_ID=""
SLACK_CLIENT_SECRET=""
SLACK_SIGNING_SECRET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

---

## Summary

This implementation plan provides:

1. **5 MCP Tools** - Full CRUD + management capabilities
2. **Multi-Reviewer Support** - Parallel, sequential, any-one workflows
3. **Organization System** - Teams, members, invitations via Better Auth
4. **Engagement Tracking** - Viewed at, time spent, last active
5. **Version History** - Track content changes with diff
6. **Slack Integration** - OAuth, notifications, settings
7. **Mobile-First Review Pages** - One-tap approve/reject
8. **Activity Logging** - Full audit trail
9. **Auto-Reminders** - Ghosting prevention

**Ready for one-shot code generation.** Run the code agent with this plan to implement all features.
