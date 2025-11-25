# SendVelo - Technical Stack Analysis

## Digitaliko Standard Stack (From slovenskaznamka & offroadmarket)

### Core Framework
- **Next.js 14+** with App Router
- **TypeScript** (strict mode)
- **pnpm** as package manager

### API & Data Layer
- **tRPC** v10/v11 for end-to-end type safety
- **Prisma** ORM with PostgreSQL
- **Superjson** for data serialization
- **@tanstack/react-query** for client-side state

### UI & Styling
- **Shadcn/ui** components (mandatory)
- **Tailwind CSS** for styling
- **Radix UI** primitives (via shadcn)
- **Lucide React** for icons
- **Class Variance Authority** (cva) for component variants

### Authentication & Authorization
- **NextAuth.js** (Auth.js v4/v5)
- **Bcrypt** for password hashing
- Role-based access control

### Payments
- **Stripe** SDK
- **@stripe/stripe-js** + **@stripe/react-stripe-js**

### Email
- **Postmark** for transactional emails
- **React Email** for email templates (in slovenskaznamka)

### Forms & Validation
- **React Hook Form** with **@hookform/resolvers**
- **Zod** for schema validation

### Analytics & Monitoring
- **PostHog** (posthog-js + posthog-node)
- **Vercel Analytics** (optional)

### Internationalization
- **next-intl** for i18n support

### Additional Tools
- **next-themes** for dark mode
- **Sonner** for toast notifications
- **date-fns** for date manipulation
- **Vitest** for testing

## Recommended Stack for SendVelo

Based on Digitaliko standards + AI requirements:

### ✅ Keep From Digitaliko Stack
- Next.js 14 (App Router)
- tRPC for API layer
- Prisma + PostgreSQL (Neon serverless)
- Shadcn/ui + Tailwind CSS
- NextAuth.js v5
- Stripe for payments
- Postmark for emails
- React Hook Form + Zod
- PostHog analytics
- next-intl (optional for MVP)

### ➕ Add for AI Features
- **Vercel AI SDK** (ai package)
- **@ai-sdk/openai** (or Anthropic)
- **Langfuse** (optional - for AI observability)

### 📦 Complete Package.json Dependencies

```json
{
  "dependencies": {
    // Core
    "@t3-oss/env-nextjs": "^0.13.4",
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",

    // tRPC & Data
    "@trpc/client": "^10.45.2",
    "@trpc/next": "^10.45.2",
    "@trpc/react-query": "^10.45.2",
    "@trpc/server": "^10.45.2",
    "@tanstack/react-query": "^5.59.0",
    "superjson": "^2.2.2",

    // Database
    "@prisma/client": "^6.7.0",

    // Auth
    "next-auth": "^5.0.0-beta.25",
    "bcryptjs": "^3.0.2",
    "@types/bcryptjs": "^2.4.6",

    // AI
    "ai": "^4.1.7",
    "@ai-sdk/openai": "^1.0.19",
    "@ai-sdk/anthropic": "^1.0.19",

    // UI Components (shadcn/ui)
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.5",

    // Styling
    "tailwindcss": "^3.4.16",
    "tailwindcss-animate": "^1.0.7",
    "tailwind-merge": "^2.5.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "next-themes": "^0.3.0",

    // Forms & Validation
    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.25.28",

    // Payments
    "stripe": "^18.2.1",
    "@stripe/stripe-js": "^7.3.1",
    "@stripe/react-stripe-js": "^3.7.0",

    // Email
    "postmark": "^4.0.5",
    "react-email": "^3.0.3",

    // Utilities
    "date-fns": "^4.1.0",
    "sonner": "^1.7.3",

    // Analytics
    "posthog-js": "^1.194.3",
    "posthog-node": "^5.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.7.2",
    "prisma": "^6.7.0",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.15",
    "@vitest/ui": "^2.1.8",
    "vitest": "^2.1.8",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  },
  "packageManager": "pnpm@9.15.9"
}
```

## Architecture Decision

### Option A: Pure Digitaliko Stack (tRPC-first) ⭐ RECOMMENDED
**Start with:** Create T3 App + manual additions
- ✅ Perfect stack alignment with existing Digitaliko projects
- ✅ Team familiarity with tRPC patterns
- ✅ Full type safety across stack
- ⚠️ More setup work (2-3 weeks)

### Option B: Hybrid Approach
**Start with:** mickasmt/next-saas-stripe-starter
- ✅ Faster to production (1 week)
- ✅ Stripe fully integrated
- ✅ Shadcn/ui included
- ⚠️ Uses Server Actions instead of tRPC
- ⚠️ Would diverge from Digitaliko standards

## Final Recommendation

**Use Option A (tRPC-first)** for consistency with Digitaliko ecosystem:

```bash
pnpm create t3-app@latest sendvelo
# Select: TypeScript, tRPC, Prisma, NextAuth, Tailwind
```

Then add:
1. Shadcn/ui components
2. Vercel AI SDK
3. Stripe integration (reference mickasmt template)
4. Postmark emails
5. PostHog analytics

**Rationale:**
- Maintains Digitaliko stack consistency
- Easier for team to maintain across projects
- Type safety across entire stack
- Can reuse patterns from slovenskaznamka/offroadmarket
- Worth the extra 1-2 weeks setup time for long-term benefits
