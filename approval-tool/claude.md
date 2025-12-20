# Claude Patterns & Best Practices

This document outlines the coding patterns and best practices for the SendVelo codebase.

## Core Principles

1. **Type Safety First**: Use TypeScript strictly - infer types, avoid `any`
2. **Server Components by Default**: Use RSC unless client interactivity needed
3. **End-to-End Type Safety**: tRPC for all API calls
4. **Progressive Enhancement**: Forms work without JS
5. **Separation of Concerns**: Clean separation between UI, business logic, and data

## TypeScript Patterns

### Type Inference
```typescript
// ✅ GOOD: Infer types from tRPC router
import { type RouterOutputs } from "@/trpc/react";
type Review = RouterOutputs["review"]["getMyReviews"]["reviews"][number];

// ❌ BAD: Manual type definitions that drift
type Review = {
  id: string;
  title: string;
  // ...manual fields
};
```

### Avoid Any
```typescript
// ✅ GOOD: Proper typing
const reviews = reviewsData?.reviews || [];
reviews.map((review: Review) => ...)

// ❌ BAD: Using any
reviews.map((review: any) => ...)
```

### Non-Null Assertions
```typescript
// ✅ GOOD: Use when you're certain value exists
const stripe = new Stripe(env.STRIPE_SECRET_KEY!, { ... });

// ⚠️ WARN: Check for null first if uncertain
if (review.creator.email) {
  await sendEmail({ to: review.creator.email, ... });
}
```

## Next.js 15 Patterns

### Server Components (Default)
```typescript
// ✅ GOOD: Server component by default
export default async function Page() {
  const data = await prisma.review.findMany();
  return <div>{data.map(...)}</div>;
}
```

### Client Components (When Needed)
```typescript
// ✅ GOOD: Use "use client" only when needed
"use client";
import { useState } from "react";
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### Async Headers in Server Components
```typescript
// ✅ GOOD: Await headers() in Next.js 15
const heads = new Headers(await headers());

// ❌ BAD: Direct use without await
const heads = new Headers(headers());
```

## tRPC Patterns

### Router Definition
```typescript
// ✅ GOOD: Group related procedures
export const reviewRouter = createTRPCRouter({
  getMyReviews: protectedProcedure
    .input(z.object({ cursor: z.string().optional() }))
    .query(async ({ ctx, input }) => { ... }),

  create: protectedProcedure
    .input(CreateReviewSchema)
    .mutation(async ({ ctx, input }) => { ... }),
});
```

### Type-Safe Client Calls
```typescript
// ✅ GOOD: Full type safety
const { data } = api.review.getMyReviews.useQuery();
const createMutation = api.review.create.useMutation({
  onSuccess: () => refetch(),
});

// Access typed data
const reviews = data?.reviews || [];
```

### Server-Side tRPC Calls
```typescript
// ✅ GOOD: Use server-side caller
import { trpc } from "@/trpc/server";

export default async function Page() {
  const reviews = await trpc.review.getMyReviews();
  return <div>...</div>;
}
```

## Database Patterns (Prisma)

### Query Optimization
```typescript
// ✅ GOOD: Select only needed fields
const review = await prisma.review.findUnique({
  where: { slug },
  select: { title: true, content: true },
});

// ⚠️ WARN: Avoid selecting everything when not needed
const review = await prisma.review.findUnique({
  where: { slug },
});
```

### Include Relations When Needed
```typescript
// ✅ GOOD: Include relations explicitly
const review = await prisma.review.findUnique({
  where: { slug },
  include: { creator: true },
});
```

### Null Safety
```typescript
// ✅ GOOD: Refetch with includes before accessing nested data
const reviewWithCreator = await prisma.review.findUnique({
  where: { slug },
  include: { creator: true },
});

if (reviewWithCreator?.creator.email) {
  await sendEmail({ to: reviewWithCreator.creator.email });
}
```

## Environment Variables

### T3 Env Validation
```typescript
// ✅ GOOD: Validate all env vars with Zod
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

### Usage
```typescript
// ✅ GOOD: Import from env.ts
import { env } from "@/env";
const apiKey = env.STRIPE_SECRET_KEY!;

// ❌ BAD: Direct process.env access
const apiKey = process.env.STRIPE_SECRET_KEY;
```

## Authentication Patterns (Better Auth)

### Session Access in Server Components
```typescript
// ✅ GOOD: Get session in server components
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  return <div>Welcome {session.user.name}</div>;
}
```

### Protected tRPC Procedures
```typescript
// ✅ GOOD: Use protectedProcedure for auth-required endpoints
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
```

## i18n Patterns (next-intl)

### Server Components
```typescript
// ✅ GOOD: Use useTranslations in server components
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("home");
  return <h1>{t("hero.title")}</h1>;
}
```

### Client Components
```typescript
// ✅ GOOD: Same API works in client components
"use client";
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations("dashboard");
  return <button>{t("createReview")}</button>;
}
```

### Translation Files Structure
```json
{
  "namespace": {
    "key": "Simple string",
    "nested": {
      "key": "Nested value"
    },
    "withPlaceholder": "Hello {{name}}"
  }
}
```

## Form Patterns

### Server Actions
```typescript
// ✅ GOOD: Use server actions for forms
async function handleDecision(formData: FormData) {
  "use server";

  const decision = formData.get("decision") as string;
  await prisma.review.update({
    where: { slug },
    data: { status: decision },
  });

  redirect(`/review/${slug}`);
}

// In component
<form action={handleDecision}>
  <button name="decision" value="approved">Approve</button>
</form>
```

### Client-Side Forms with tRPC
```typescript
// ✅ GOOD: Use tRPC mutations for client-side forms
const createMutation = api.review.create.useMutation({
  onSuccess: () => {
    refetch();
    setIsOpen(false);
  },
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await createMutation.mutateAsync(formData);
};
```

## Error Handling

### tRPC Error Handling
```typescript
// ✅ GOOD: Use TRPCError with proper codes
import { TRPCError } from "@trpc/server";

if (!session) {
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in",
  });
}

if (!review) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Review not found",
  });
}
```

### Client-Side Error Handling
```typescript
// ✅ GOOD: Handle mutation errors
const mutation = api.review.create.useMutation({
  onError: (error) => {
    toast.error(error.message);
  },
  onSuccess: () => {
    toast.success("Review created!");
  },
});
```

## Email Patterns

### Type-Safe Email Functions
```typescript
// ✅ GOOD: Dedicated functions with typed params
export async function sendReviewRequestEmail({
  to,
  reviewerName,
  creatorName,
  title,
  reviewUrl,
}: {
  to: string;
  reviewerName?: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
}) {
  if (!client) {
    console.warn("Email client not configured");
    return;
  }

  await client.sendEmail({
    From: env.FROM_EMAIL!,
    To: to,
    Subject: `Review request: ${title}`,
    HtmlBody: generateHtml({ ... }),
  });
}
```

## Stripe Patterns

### Conditional Initialization
```typescript
// ✅ GOOD: Only initialize if API key exists
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    })
  : null;
```

### Usage with Null Checks
```typescript
// ✅ GOOD: Check before using
export async function createCheckoutSession(...) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  return await stripe.checkout.sessions.create({ ... });
}
```

## Performance Patterns

### Pagination
```typescript
// ✅ GOOD: Implement cursor-based pagination
getMyReviews: protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(50),
    cursor: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const reviews = await ctx.db.review.findMany({
      where: { creatorId: ctx.session.user.id },
      take: input.limit + 1,
      cursor: input.cursor ? { id: input.cursor } : undefined,
    });

    let nextCursor: string | undefined;
    if (reviews.length > input.limit) {
      const nextItem = reviews.pop();
      nextCursor = nextItem!.id;
    }

    return { reviews, nextCursor };
  });
```

### Database Indexing
```prisma
// ✅ GOOD: Add indexes for frequent queries
model Review {
  id     String @id @default(cuid())
  slug   String @unique
  status String @default("pending")

  @@index([slug])
  @@index([status])
  @@index([creatorId])
}
```

## Security Patterns

### Input Validation
```typescript
// ✅ GOOD: Validate all inputs with Zod
const CreateReviewSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  reviewerEmail: z.string().email(),
});

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      // input is fully validated
    }),
});
```

### SQL Injection Prevention
```typescript
// ✅ GOOD: Prisma handles this automatically
await prisma.review.findUnique({
  where: { slug: userInput }, // Safe
});

// ❌ BAD: Raw SQL without parameterization
await prisma.$queryRaw`SELECT * FROM Review WHERE slug = ${userInput}`;

// ✅ GOOD: Parameterized raw queries if needed
await prisma.$queryRaw`SELECT * FROM Review WHERE slug = ${Prisma.sql([userInput])}`;
```

### XSS Prevention
```typescript
// ✅ GOOD: React escapes by default
<div>{userContent}</div>

// ⚠️ WARN: Only use dangerouslySetInnerHTML with sanitized content
<div dangerouslySetInnerHTML={{ __html: sanitize(userContent) }} />
```

## Code Organization

### File Structure
```
/app                 # Next.js App Router
  /(app)            # Authenticated app routes
    /dashboard      # Dashboard page
    layout.tsx      # App layout with auth
  /api              # API routes
  /review           # Public review pages
  layout.tsx        # Root layout
  page.tsx          # Landing page

/src
  /env.ts           # Environment validation
  /i18n             # Internationalization
  /lib              # Shared libraries
    /auth.ts        # Better Auth setup
    /db.ts          # Prisma client
    /email.ts       # Email functions
    /stripe.ts      # Stripe setup
  /server           # Server-only code
    /api            # tRPC routers
  /trpc             # tRPC client/server setup

/prisma
  schema.prisma     # Database schema

/messages           # i18n translation files
  en.json
```

### Import Aliases
```typescript
// ✅ GOOD: Use @ alias for absolute imports
import { prisma } from "@/lib/db";
import { env } from "@/env";

// ❌ BAD: Relative imports for shared code
import { prisma } from "../../../lib/db";
```

## Testing Patterns (To Implement)

### Unit Tests
```typescript
// ✅ GOOD: Test business logic separately
describe("calculateSubscriptionUsage", () => {
  it("should return remaining reviews for free tier", () => {
    const result = calculateRemaining("free", 3);
    expect(result).toBe(2);
  });
});
```

### Integration Tests
```typescript
// ✅ GOOD: Test tRPC procedures
describe("review.create", () => {
  it("should create review when authenticated", async () => {
    const caller = createCaller({ session: mockSession });
    const review = await caller.review.create({
      title: "Test",
      content: "Content",
      reviewerEmail: "test@example.com",
    });
    expect(review.id).toBeDefined();
  });
});
```

## Accessibility Patterns

### Semantic HTML
```typescript
// ✅ GOOD: Use semantic elements
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

// ❌ BAD: Div soup
<div className="nav">
  <div className="nav-item">
    <div onClick={() => router.push("/dashboard")}>Dashboard</div>
  </div>
</div>
```

### Form Labels
```typescript
// ✅ GOOD: Always label inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ BAD: Unlabeled inputs
<input type="email" placeholder="Email" />
```

## Anti-Patterns to Avoid

### ❌ Direct Database Access in Client Components
```typescript
// ❌ BAD: Can't use Prisma in client components
"use client";
import { prisma } from "@/lib/db";
export default function Component() {
  const data = await prisma.review.findMany(); // ERROR
}

// ✅ GOOD: Use tRPC
"use client";
export default function Component() {
  const { data } = api.review.getMyReviews.useQuery();
}
```

### ❌ Missing Error Boundaries
```typescript
// ⚠️ TODO: Add error boundaries
// app/error.tsx
"use client";
export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### ❌ Hardcoded Strings (i18n)
```typescript
// ❌ BAD: Hardcoded text
<button>Create Review</button>

// ✅ GOOD: Internationalized
<button>{t("createReview")}</button>
```

## Performance Checklist

- [ ] Use Server Components by default
- [ ] Lazy load client components when possible
- [ ] Implement proper pagination for large lists
- [ ] Add database indexes for frequent queries
- [ ] Optimize images with next/image
- [ ] Use React.memo for expensive renders
- [ ] Implement proper caching strategies (stale-while-revalidate)
- [ ] Minimize client-side bundle size

## Security Checklist

- [ ] Validate all user inputs with Zod
- [ ] Use protectedProcedure for authenticated endpoints
- [ ] Implement CSRF protection (Better Auth handles this)
- [ ] Sanitize user content before rendering
- [ ] Use HTTPS in production
- [ ] Set proper CORS headers
- [ ] Rate limit API endpoints
- [ ] Implement proper session management

## Code Review Checklist

Before committing code, verify:

- [ ] TypeScript strict mode passes with no errors
- [ ] No `any` types (unless absolutely necessary)
- [ ] All forms have proper validation
- [ ] Error cases are handled
- [ ] Loading states are shown
- [ ] Success/error messages are displayed
- [ ] Code follows established patterns
- [ ] New code is covered by translation strings
- [ ] Database queries are optimized
- [ ] Build passes (`pnpm build`)

## Future Improvements

1. **Add E2E Tests**: Implement Playwright tests for critical flows
2. **Add Unit Tests**: Test business logic and tRPC procedures
3. **Implement Logging**: Add structured logging with Pino
4. **Add Monitoring**: Implement error tracking (Sentry)
5. **Optimize Bundle**: Analyze and reduce client bundle size
6. **Add Caching**: Implement Redis for session/data caching
7. **Rate Limiting**: Add rate limiting to prevent abuse
8. **Email Templates**: Migrate to React Email for better templates
9. **Webhooks**: Add webhook support for review events
10. **Multi-tenancy**: Implement team workspaces
