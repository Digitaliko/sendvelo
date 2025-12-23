# Thumbway Setup Guide

All code has been written! This guide will help you complete the setup, testing, and deployment.

## What's Been Completed ✅

### Core Infrastructure
- ✅ Prisma database schema with User, Session, Account, Review models
- ✅ Better Auth configuration with OAuth (Google, GitHub) and OIDC Provider
- ✅ tRPC setup with full type safety (context, routers, procedures)
- ✅ T3 Env validation for all environment variables
- ✅ Postmark email service
- ✅ Stripe integration with subscriptions

### API & Backend
- ✅ MCP server with `send_for_review` tool (`/app/mcp/route.ts`)
- ✅ OAuth metadata endpoint (`/.well-known/oauth-protected-resource`)
- ✅ tRPC API routes (`/api/trpc`)
- ✅ Better Auth API routes (`/api/auth`)
- ✅ Stripe webhook handler (`/api/webhooks/stripe`)

### Pages & UI
- ✅ Homepage with features and pricing
- ✅ Sign in / Sign up pages
- ✅ Dashboard with reviews list and stats
- ✅ Public review page (approve/reject)
- ✅ Protected app layout with navigation
- ✅ Error boundaries (error.tsx, not-found.tsx)

### Configuration
- ✅ Shadcn UI configuration (components.json)
- ✅ Root layout with TRPCReactProvider
- ✅ Environment variable templates (.env.example, .env.local)

---

## Setup Tasks (You Need to Do These) 📋

### 1. Database Setup (10 minutes)

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project to Vercel
vercel link

# Create Postgres database
vercel postgres create

# Get DATABASE_URL
vercel env pull .env.local
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb approval_tool

# Add to .env.local
echo "DATABASE_URL=postgresql://localhost/approval_tool" >> .env.local
```

**Run Prisma migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 2. Environment Variables (15 minutes)

Copy `.env.local` and fill in the values:

```bash
# Required for development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=<from step 1>
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Optional for now (can test without these)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
POSTMARK_TOKEN=
FROM_EMAIL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3. OAuth Credentials (20 minutes - Optional for initial testing)

#### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy Client ID and Client Secret to `.env.local`

#### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: "Thumbway"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Copy Client ID and Client Secret to `.env.local`

---

### 4. Postmark Setup (10 minutes - Optional for initial testing)

1. Sign up at https://postmarkapp.com/
2. Create a new "Server"
3. Go to "API Tokens" tab
4. Copy "Server API token" to `POSTMARK_TOKEN` in `.env.local`
5. Go to "Sender Signatures" and verify your email domain
6. Set `FROM_EMAIL` to your verified email (e.g., `noreply@yourdomain.com`)

**Without Postmark:** Email notifications will be logged to console only.

---

### 5. Stripe Setup (15 minutes - Optional for initial testing)

1. Sign up at https://stripe.com/
2. Go to Developers → API Keys
3. Copy "Publishable key" to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copy "Secret key" to `STRIPE_SECRET_KEY`
5. Create Products:
   - Pro Plan: $15/month recurring
   - Copy Price ID (starts with `price_...`)
6. Update `src/lib/stripe.ts` line 17 with your Price ID

**For webhook secret (production only):**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to STRIPE_WEBHOOK_SECRET
```

**Without Stripe:** Free tier will still work, upgrade buttons won't function.

---

### 6. Run Development Server (2 minutes)

```bash
# Install dependencies if you haven't
pnpm install

# Run dev server
pnpm dev
```

Open http://localhost:3000

---

### 7. Test the Application (30 minutes)

#### Basic Tests
- [ ] Homepage loads
- [ ] Sign up with email works
- [ ] Sign in with email works
- [ ] Dashboard loads after signin
- [ ] Create review from dashboard
- [ ] View public review page
- [ ] Approve/reject review works
- [ ] Email notification received (if Postmark configured)

#### OAuth Tests (if configured)
- [ ] Sign in with Google works
- [ ] Sign in with GitHub works

#### Stripe Tests (if configured)
- [ ] Upgrade button shows
- [ ] Checkout session creates
- [ ] Subscription activates after payment
- [ ] Usage limits enforced (free tier: 5/month)

#### MCP/ChatGPT Tests (requires ChatGPT setup - see below)
- [ ] MCP server responds at `/mcp`
- [ ] `send_for_review` tool appears in ChatGPT
- [ ] Creating review from ChatGPT works
- [ ] OAuth login flow works from ChatGPT

---

### 8. ChatGPT Integration Setup (30 minutes)

**Prerequisites:**
- Your app must be deployed to a public URL (see Deployment below)
- You need a ChatGPT Plus or Team account

**Steps:**

1. **Deploy to Vercel** (see section 9 below)

2. **Register your app with OpenAI:**
   - Go to https://platform.openai.com/apps
   - Click "Create App"
   - Fill in details:
     - Name: "Thumbway"
     - Description: "Send content for approval via email"
     - MCP Endpoint: `https://yourdomain.com/mcp`
     - OAuth Configuration:
       - Authorization URL: `https://yourdomain.com/api/auth/authorize`
       - Token URL: `https://yourdomain.com/api/auth/token`
       - Scopes: `reviews:read reviews:write`
   - Submit for review

3. **Update Better Auth config** (`src/lib/auth.ts` line 31):
   ```typescript
   trustedOrigins: [
     "https://chatgpt.com",
     "https://platform.openai.com",
     "https://yourdomain.com" // Add your domain
   ],
   ```

4. **Test in ChatGPT:**
   - Open ChatGPT
   - Enable your app from the apps menu
   - Try: "Send this proposal to john@example.com for approval"

---

### 9. Deploy to Vercel (15 minutes)

```bash
# Make sure you're in the project directory
cd /Users/filip.popranec/Develop/AIProposal/approval-tool

# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: thumbway (or your choice)
# - Directory: ./ (default)
# - Override settings? No

# After deployment, set environment variables in Vercel dashboard
# Go to: https://vercel.com/your-username/thumbway/settings/environment-variables

# Add all variables from .env.local

# Redeploy to apply env vars
vercel --prod
```

**Important:** After deployment:
1. Update `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to your Vercel domain
2. Update OAuth redirect URIs in Google/GitHub to include Vercel domain
3. Update Stripe webhook endpoint to Vercel domain
4. Update ChatGPT app configuration with Vercel domain

---

### 10. Production Checklist

Before going live:

- [ ] Database backed up regularly (Vercel Postgres does this automatically)
- [ ] Environment variables set in Vercel
- [ ] OAuth credentials use production redirect URIs
- [ ] Postmark sender domain verified
- [ ] Stripe webhook configured with production endpoint
- [ ] ChatGPT app approved and published
- [ ] Error tracking set up (optional: Sentry)
- [ ] Analytics set up (optional: Vercel Analytics)
- [ ] Custom domain configured (optional)
- [ ] Terms of Service and Privacy Policy added
- [ ] GDPR compliance (if EU users)

---

## Common Issues & Solutions

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Database connection error"
- Check `DATABASE_URL` in `.env.local`
- Make sure PostgreSQL is running
- Run migrations: `npx prisma migrate dev`

### "BETTER_AUTH_SECRET must be at least 32 characters"
```bash
openssl rand -base64 32
```

### "OAuth redirect URI mismatch"
- Make sure redirect URI in Google/GitHub matches exactly
- Include both `http://localhost:3000` and production URL

### "Stripe webhook signature invalid"
- Make sure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### "Email not sending"
- Check `POSTMARK_TOKEN` is correct
- Verify sender email in Postmark dashboard
- Check console logs for error messages

### "tRPC errors"
- Make sure you wrapped app in `<TRPCReactProvider>` (already done in app/layout.tsx)
- Check browser console for detailed error messages
- Verify API route is accessible: `http://localhost:3000/api/trpc`

---

## File Structure Reference

```
approval-tool/
├── app/
│   ├── (app)/                    # Protected routes
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard with reviews list
│   │   └── layout.tsx           # Protected layout with auth check
│   │
│   ├── (auth)/                   # Auth routes
│   │   ├── signin/page.tsx      # Sign in page
│   │   └── signup/page.tsx      # Sign up page
│   │
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth API
│   │   ├── trpc/[trpc]/         # tRPC API
│   │   ├── webhooks/stripe/     # Stripe webhook handler
│   │   └── .well-known/         # OAuth metadata
│   │
│   ├── mcp/
│   │   └── route.ts             # MCP server for ChatGPT
│   │
│   ├── review/[slug]/
│   │   └── page.tsx             # Public review page
│   │
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   ├── error.tsx                # Error boundary
│   └── not-found.tsx            # 404 page
│
├── src/
│   ├── env.ts                   # T3 Env validation
│   │
│   ├── lib/
│   │   ├── db.ts                # Prisma client
│   │   ├── auth.ts              # Better Auth config
│   │   ├── auth-client.ts       # Better Auth client
│   │   ├── email.ts             # Postmark service
│   │   ├── stripe.ts            # Stripe integration
│   │   └── utils.ts             # Utility functions
│   │
│   ├── server/api/
│   │   ├── trpc.ts              # tRPC setup
│   │   ├── root.ts              # Main router
│   │   └── routers/
│   │       ├── review.ts        # Review CRUD
│   │       └── user.ts          # User profile & subscription
│   │
│   └── trpc/
│       ├── react.tsx            # Client tRPC provider
│       └── server.ts            # Server tRPC helpers
│
├── prisma/
│   └── schema.prisma            # Database schema
│
├── .env.local                   # Environment variables
├── .env.example                 # Template
├── components.json              # Shadcn config
└── package.json                 # Dependencies
```

---

## Next Steps After Setup

1. **Test everything locally** - Go through the test checklist above
2. **Deploy to Vercel** - Follow deployment guide
3. **Submit ChatGPT app** - Register with OpenAI
4. **Add features** - Refer to the plan file for Week 3+ features:
   - Version history
   - Multiple reviewers per review
   - Review expiration
   - Analytics dashboard
   - Slack notifications

---

## Support & Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- tRPC: https://trpc.io/docs
- Prisma: https://www.prisma.io/docs
- Better Auth: https://www.better-auth.com/docs
- Stripe: https://stripe.com/docs
- Postmark: https://postmarkapp.com/developer

**Issues:**
- Check the plan file for architecture decisions
- Review the code comments for implementation details
- All environment variables are validated by T3 Env (src/env.ts)

---

## Summary

All code is complete! You just need to:
1. Set up database (10 min)
2. Configure environment variables (15 min)
3. Run `pnpm dev` (2 min)
4. Test locally (30 min)
5. Deploy to Vercel (15 min)
6. Register with ChatGPT (30 min)

**Total estimated time: ~2 hours**

Good luck! 🚀
