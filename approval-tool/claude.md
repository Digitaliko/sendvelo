# CLAUDE.md - Thumbway Approval Tool Development Guide

Essential patterns, conventions, and commands for AI assistants working with the Thumbway codebase.

## Project Information

**Thumbway** - Review approval workflow platform with ChatGPT integration via MCP. Features multi-reviewer approvals, organization workspaces, Slack notifications, and subscription billing.

**Tech Stack**: Next.js 15 (Turbopack), React 19, TypeScript 5, tRPC 11, Prisma 6, PostgreSQL, Better Auth, Tailwind CSS 4, Radix UI, Stripe, Postmark, Slack API, MCP SDK

## Developer Profile

Senior Full Stack Developer expert in Next.js/TypeScript. Follow existing patterns, use path alias imports (`@/*`), write clean self-documenting code without comments unless requested. Use strict TypeScript, functional components with hooks, proper error handling. Forms: React Hook Form + Zod patterns where applicable. Server: tRPC procedures with Zod validation.

## Quick Start Commands

```bash
# Development (Turbopack)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Database
pnpm db:push        # Push schema changes
pnpm db:generate    # Generate Prisma client
pnpm db:studio      # Open Prisma Studio
```

## Project Structure

```
approval-tool/
├── app/                          # Next.js App Router
│   ├── [locale]/                # i18n routes
│   │   ├── (app)/               # Protected routes (dashboard, settings)
│   │   ├── (auth)/              # Auth routes (signin, signup)
│   │   ├── approve/             # Public approval pages
│   │   └── review/              # Public review pages
│   ├── api/                     # API routes
│   │   ├── auth/[...all]/       # Better Auth handler
│   │   ├── trpc/[trpc]/         # tRPC endpoint
│   │   ├── slack/               # Slack webhooks
│   │   └── webhooks/stripe/     # Stripe webhooks
│   └── mcp/                     # MCP server route
├── src/
│   ├── env.ts                   # T3 Env validation
│   ├── i18n/                    # next-intl config
│   ├── lib/                     # Core libraries
│   │   ├── auth.ts              # Better Auth server config
│   │   ├── auth-client.ts       # Better Auth client
│   │   ├── db.ts                # Prisma singleton
│   │   ├── email.ts             # Postmark integration
│   │   ├── slack.ts             # Slack API client
│   │   ├── stripe.ts            # Stripe integration
│   │   └── utils.ts             # Utilities (cn, formatDate, etc.)
│   ├── server/api/              # tRPC backend
│   │   ├── trpc.ts              # tRPC setup & procedures
│   │   ├── root.ts              # Router aggregation
│   │   └── routers/             # Individual routers
│   ├── trpc/                    # tRPC client setup
│   │   ├── react.tsx            # React Query integration
│   │   └── server.ts            # RSC caller
│   └── components/              # React components
│       └── ui/                  # UI components (toast, etc.)
├── prisma/schema.prisma         # Database schema
├── messages/en.json             # i18n translations
└── middleware.ts                # CORS + i18n middleware
```

## Core Patterns

### 1. Type Safety (CRITICAL)

```typescript
// ✅ GOOD: Infer types from tRPC
import { type RouterOutputs } from "@/trpc/react";
type Review = RouterOutputs["review"]["getMyReviews"]["reviews"][number];

// ✅ GOOD: Infer from Better Auth
import type { Session } from "@/lib/auth";
type Session = typeof auth.$Infer.Session;

// ❌ BAD: Manual type definitions that drift
type Review = { id: string; title: string; /* ... */ };
```

### 2. Server Components by Default

```typescript
// ✅ GOOD: Server component (default)
export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  return <Dashboard />;
}

// ✅ GOOD: Client component only when needed
"use client";
import { useState } from "react";
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### 3. tRPC Patterns (MANDATORY for all server calls)

**Router Definition:**
```typescript
// src/server/api/routers/your-router.ts
export const yourRouter = createTRPCRouter({
  // Public - accessible without auth
  getPublicData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.yourModel.findUnique({
        where: { id: input.id },
      });
    }),

  // Protected - requires authentication
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1).max(50000),
    }))
    .mutation(async ({ ctx, input }) => {
      // ctx.session.user is guaranteed to exist
      return await ctx.prisma.yourModel.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
});
```

**Client Usage:**
```typescript
"use client";
import { api } from "@/trpc/react";

export function Component() {
  // Query
  const { data, isLoading, refetch } = api.review.getMyReviews.useQuery();

  // Mutation
  const mutation = api.review.create.useMutation({
    onSuccess: () => {
      refetch();
      addToast("success", "Created!");
    },
    onError: (error) => {
      addToast("error", error.message);
    },
  });

  const handleSubmit = () => mutation.mutate({ title, content });
}
```

**Server-Side tRPC (RSC):**
```typescript
import { trpc } from "@/trpc/server";

export default async function Page() {
  const reviews = await trpc.review.getMyReviews();
  return <div>...</div>;
}
```

### 4. Error Handling

```typescript
// tRPC: Use TRPCError with specific codes
import { TRPCError } from "@trpc/server";

if (!session) {
  throw new TRPCError({ code: "UNAUTHORIZED" });
}
if (!review) {
  throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
}
if (!isMember) {
  throw new TRPCError({ code: "FORBIDDEN", message: "Not a member" });
}

// Client: Handle in mutation callbacks
const mutation = api.review.create.useMutation({
  onError: (error) => addToast("error", error.message),
});
```

### 5. Database Patterns (Prisma)

```typescript
// ✅ GOOD: Select only needed fields
const review = await prisma.review.findUnique({
  where: { slug },
  select: { title: true, content: true, status: true },
});

// ✅ GOOD: Include relations explicitly
const review = await prisma.review.findUnique({
  where: { slug },
  include: {
    creator: { select: { name: true, email: true } },
    reviewers: true,
  },
});

// ✅ GOOD: Transactions for atomic operations
const result = await prisma.$transaction(async (tx) => {
  await tx.reviewer.update({ ... });
  await tx.review.update({ ... });
  return calculatedStatus;
});

// ✅ GOOD: Cursor-based pagination
const reviews = await prisma.review.findMany({
  take: limit + 1,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: "desc" },
});
let nextCursor: string | undefined;
if (reviews.length > limit) {
  nextCursor = reviews.pop()?.id;
}
```

### 6. Authentication (Better Auth)

```typescript
// Server Component: Get session
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),  // Must await in Next.js 15
});

// Protected Layout Pattern
export default async function AppLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  return <>{children}</>;
}

// Client: Use auth client
import { authClient } from "@/lib/auth-client";
await authClient.signIn.email({ email, password });
await authClient.signOut();
```

### 7. Environment Variables (T3 Env)

```typescript
// ✅ GOOD: Import from env.ts
import { env } from "@/env";
const apiKey = env.STRIPE_SECRET_KEY;

// ❌ BAD: Direct process.env access
const apiKey = process.env.STRIPE_SECRET_KEY;
```

### 8. Internationalization (next-intl)

```typescript
// Server & Client Components
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations("dashboard");
  return <h1>{t("title")}</h1>;
}
```

### 9. Import Patterns

```typescript
// ✅ GOOD: Use @ alias for all imports
import { prisma } from "@/lib/db";
import { env } from "@/env";
import { api, type RouterOutputs } from "@/trpc/react";
import type { Session } from "@/lib/auth";
import { cn, formatDate } from "@/lib/utils";

// ❌ BAD: Relative imports for shared code
import { prisma } from "../../../lib/db";
```

## API Routes (Exceptions to tRPC)

Only these should NOT use tRPC:
- `/api/auth/[...all]` - Better Auth handler
- `/api/webhooks/stripe` - Stripe webhooks (signature verification)
- `/api/slack/interactions` - Slack webhooks (signature verification)
- `/mcp` - MCP server

## Utility Functions

```typescript
import { cn } from "@/lib/utils";

// Merge Tailwind classes
<div className={cn("flex items-center", isActive && "bg-primary", className)} />

// Date formatting
import { formatDate, formatRelativeTime } from "@/lib/utils";
formatDate(review.createdAt);      // "January 15, 2025"
formatRelativeTime(review.updatedAt); // "5 minutes ago"

// Absolute URL (for emails)
import { absoluteUrl } from "@/lib/utils";
absoluteUrl("/review/" + slug);    // "https://app.com/review/abc"
```

## External Integration Patterns

```typescript
// Conditional initialization (null if not configured)
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-10-29.clover" })
  : null;

// Usage with null check
export async function createCheckout(params) {
  if (!stripe) throw new Error("Stripe not configured");
  return await stripe.checkout.sessions.create({ ... });
}
```

## Security Patterns

```typescript
// XSS prevention in emails
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}

// Row-level authorization
const review = await prisma.review.findFirst({
  where: {
    id: input.id,
    creatorId: ctx.session.user.id,  // Ownership check
  },
});
if (!review) throw new TRPCError({ code: "NOT_FOUND" });

// Token-based access (magic links)
const reviewer = review.reviewers.find((r) => r.accessToken === input.token);
if (!reviewer) throw new TRPCError({ code: "FORBIDDEN" });
```

## File Naming Conventions

- **Components**: PascalCase (`DashboardPage.tsx`)
- **Utilities/hooks**: camelCase (`useToast.ts`, `utils.ts`)
- **Routers**: singular noun (`review.ts`, `user.ts`)
- **Layouts/Pages**: `layout.tsx`, `page.tsx`, `error.tsx`
- **API routes**: `route.ts`

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/env.ts` | Environment variable validation |
| `src/lib/auth.ts` | Better Auth server configuration |
| `src/lib/db.ts` | Prisma client singleton |
| `src/server/api/trpc.ts` | tRPC setup with procedures |
| `src/server/api/root.ts` | Router aggregation |
| `src/trpc/react.tsx` | React Query + tRPC client |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | CORS + i18n middleware |
| `app/layout.tsx` | Root layout with ChatGPT SDK bootstrap |

## Database Models Overview

- **User**: Auth, subscription tier (FREE/STARTER/TEAM/BUSINESS), review quota
- **Review**: Status (PENDING/APPROVED/REJECTED/CHANGES_REQUESTED), workflow type, versions
- **Reviewer**: Magic link access, engagement tracking, decision
- **Organization**: Multi-tenant workspace with members and roles
- **SlackIntegration**: OAuth tokens, notification settings
- **ActivityLog**: Comprehensive audit trail

## Don't Forget

1. **Always use tRPC** for server calls (except webhooks)
2. **No comments** unless explicitly requested - code is self-documenting
3. **Run `pnpm build`** before considering work complete
4. **Use path aliases** (`@/`) not relative imports
5. **Await `headers()`** in Next.js 15 server components
6. **Null-check integrations** (Stripe, Postmark, Slack)
7. **Use transactions** for multi-step database operations
8. **Escape HTML** in email templates

---

**Version**: 1.0.0
**Last Updated**: 2025-01-24
