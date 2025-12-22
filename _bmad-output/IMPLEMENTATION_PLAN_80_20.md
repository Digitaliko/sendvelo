# 80/20 Implementation Plan: High-Impact Feature Gaps

**Goal:** One-shot implementation of the features that deliver 80% of user value with 20% of the effort.

**Excluded (too complex for 80/20):**
- Scheduled reminder system (needs background job infrastructure)
- AI routing/predictions (ML complexity)
- Google Workspace/Notion integrations (OAuth complexity)
- Zapier/Make webhooks (infrastructure)
- Analytics dashboard (can come later)

---

## Priority 1: One-Click Approve from Email (HIGHEST IMPACT, LOWEST EFFORT)

**Why:** Table stakes feature. Users want to approve without visiting the website.

**Implementation:**

### 1.1 Add API endpoint for direct email approval

```typescript
// File: approval-tool/src/server/api/routers/review.ts
// Add new mutation after submitDecision

submitDecisionFromEmail: publicProcedure
  .input(z.object({
    reviewId: z.string(),
    reviewerId: z.string(),
    token: z.string(),
    decision: z.enum(["APPROVED", "REJECTED"]),
  }))
  .mutation(async ({ ctx, input }) => {
    // Validate magic link token
    const reviewer = await ctx.db.reviewer.findFirst({
      where: {
        id: input.reviewerId,
        reviewId: input.reviewId,
        magicLinkToken: input.token,
        magicLinkExpiresAt: { gt: new Date() },
      },
      include: { review: true },
    });

    if (!reviewer) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired link" });
    }

    // Update reviewer status
    await ctx.db.reviewer.update({
      where: { id: reviewer.id },
      data: {
        status: input.decision,
        respondedAt: new Date(),
      },
    });

    // Recalculate review status (reuse existing logic)
    await recalculateReviewStatus(ctx.db, input.reviewId);

    // Log activity
    await ctx.db.activityLog.create({
      data: {
        reviewId: input.reviewId,
        action: input.decision === "APPROVED" ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
        actorType: "GUEST",
        actorEmail: reviewer.email,
        metadata: { via: "email_link" },
      },
    });

    return { success: true, decision: input.decision };
  }),
```

### 1.2 Create email approval landing page

```typescript
// File: approval-tool/app/[locale]/approve/[reviewId]/[reviewerId]/page.tsx

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

interface Props {
  params: { reviewId: string; reviewerId: string };
  searchParams: { token: string; decision: "approve" | "reject" };
}

export default async function EmailApprovePage({ params, searchParams }: Props) {
  const { token, decision } = searchParams;

  if (!token || !decision) {
    return <ErrorPage message="Invalid approval link" />;
  }

  try {
    const result = await api.review.submitDecisionFromEmail({
      reviewId: params.reviewId,
      reviewerId: params.reviewerId,
      token,
      decision: decision === "approve" ? "APPROVED" : "REJECTED",
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            decision === "approve" ? "bg-green-100" : "bg-red-100"
          }`}>
            {decision === "approve" ? (
              <CheckIcon className="w-8 h-8 text-green-600" />
            ) : (
              <XIcon className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {decision === "approve" ? "Approved!" : "Rejected"}
          </h1>
          <p className="mt-2 text-gray-600">
            Your decision has been recorded. You can close this page.
          </p>
          <a href={`/review/${params.reviewId}?token=${token}`}
             className="mt-6 inline-block text-blue-600 hover:underline">
            View full review →
          </a>
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorPage message="This link has expired or already been used" />;
  }
}
```

### 1.3 Update email template with approve/reject buttons

```typescript
// File: approval-tool/src/lib/email.ts
// Update sendReviewRequestEmail function

export async function sendReviewRequestEmail(params: {
  to: string;
  reviewTitle: string;
  reviewSlug: string;
  reviewId: string;
  reviewerId: string;
  creatorName: string;
  magicLinkToken: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const reviewUrl = `${baseUrl}/review/${params.reviewSlug}?token=${params.magicLinkToken}`;
  const approveUrl = `${baseUrl}/approve/${params.reviewId}/${params.reviewerId}?token=${params.magicLinkToken}&decision=approve`;
  const rejectUrl = `${baseUrl}/approve/${params.reviewId}/${params.reviewerId}?token=${params.magicLinkToken}&decision=reject`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Review Request: ${params.reviewTitle}</h2>
      <p style="color: #4a4a4a; font-size: 16px;">
        ${params.creatorName} has requested your approval.
      </p>

      <!-- One-Click Approve/Reject Buttons -->
      <div style="margin: 32px 0; text-align: center;">
        <a href="${approveUrl}"
           style="display: inline-block; padding: 14px 32px; background: #22c55e; color: white;
                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;
                  margin-right: 12px;">
          ✓ Approve
        </a>
        <a href="${rejectUrl}"
           style="display: inline-block; padding: 14px 32px; background: #ef4444; color: white;
                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          ✗ Reject
        </a>
      </div>

      <p style="color: #6a6a6a; font-size: 14px; text-align: center;">
        Or <a href="${reviewUrl}" style="color: #3b82f6;">view the full review</a> to add comments
      </p>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
      <p style="color: #9a9a9a; font-size: 12px;">
        This link expires in 7 days. If you have questions, reply to this email.
      </p>
    </div>
  `;

  await sendEmail({ to: params.to, subject: `Review Request: ${params.reviewTitle}`, html });
}
```

---

## Priority 2: Mobile-Optimized Approval UX

**Why:** 89 mentions in research, 9.7/10 priority score. Users approve on-the-go.

**Implementation:**

### 2.1 Mobile-first review page redesign

```typescript
// File: approval-tool/app/[locale]/review/[slug]/page.tsx
// Replace existing review page with mobile-optimized version

export default async function ReviewPage({ params, searchParams }: Props) {
  const review = await api.review.getBySlug({ slug: params.slug, token: searchParams.token });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4
                      flex gap-3 md:hidden z-50 safe-area-inset-bottom">
        <button
          onClick={() => submitDecision("REJECTED")}
          className="flex-1 py-4 px-6 bg-red-500 text-white rounded-xl font-semibold
                     text-lg active:scale-95 transition-transform touch-manipulation">
          Reject
        </button>
        <button
          onClick={() => submitDecision("APPROVED")}
          className="flex-1 py-4 px-6 bg-green-500 text-white rounded-xl font-semibold
                     text-lg active:scale-95 transition-transform touch-manipulation">
          Approve
        </button>
      </div>

      {/* Content with bottom padding for fixed bar */}
      <div className="pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-gray-900 truncate">{review.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={review.status} />
            <span className="text-sm text-gray-500">
              from {review.creator.name}
            </span>
          </div>
        </header>

        {/* Review Content - optimized for reading */}
        <main className="p-4 md:p-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="prose prose-sm md:prose max-w-none">
              {review.currentVersion.content}
            </div>
          </div>

          {/* Reviewer Status Cards - Mobile optimized */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Reviewers ({review.reviewers.filter(r => r.status !== "PENDING").length}/{review.reviewers.length})
            </h2>
            <div className="space-y-2">
              {review.reviewers.map((reviewer) => (
                <div key={reviewer.id}
                     className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                  <span className="text-gray-900">{reviewer.email}</span>
                  <StatusBadge status={reviewer.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Comments
            </h2>
            <CommentSection reviewId={review.id} comments={review.comments} />
          </div>
        </main>

        {/* Desktop action buttons (hidden on mobile) */}
        <div className="hidden md:flex fixed bottom-8 right-8 gap-3">
          <button
            onClick={() => submitDecision("REJECTED")}
            className="py-3 px-8 bg-red-500 hover:bg-red-600 text-white rounded-lg
                       font-semibold shadow-lg transition-colors">
            Reject
          </button>
          <button
            onClick={() => submitDecision("APPROVED")}
            className="py-3 px-8 bg-green-500 hover:bg-green-600 text-white rounded-lg
                       font-semibold shadow-lg transition-colors">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Touch-optimized CSS utilities

```css
/* File: approval-tool/app/globals.css - Add these utilities */

/* Safe area for iPhone notch/home indicator */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Larger touch targets */
.touch-manipulation {
  touch-action: manipulation;
}

/* Prevent text selection on buttons */
.select-none {
  -webkit-user-select: none;
  user-select: none;
}

/* Mobile tap highlight */
@media (hover: none) {
  button:active,
  a:active {
    opacity: 0.8;
  }
}

/* Minimum tap target size (44x44 per Apple HIG) */
.tap-target {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Priority 3: Slack Interactive Approve/Reject Buttons

**Why:** #1 integration request. Users live in Slack.

**Implementation:**

### 3.1 Update Slack notification with interactive buttons

```typescript
// File: approval-tool/src/lib/slack.ts
// Update sendSlackNotification to include interactive buttons

export async function sendSlackNotification(params: {
  channel: string;
  accessToken: string;
  type: "NEW_REVIEW" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  review: { id: string; title: string; slug: string; creatorName: string };
  reviewer?: { email: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const reviewUrl = `${baseUrl}/review/${params.review.slug}`;

  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: getMessageText(params),
      },
    },
  ];

  // Add interactive buttons only for NEW_REVIEW
  if (params.type === "NEW_REVIEW") {
    blocks.push({
      type: "actions",
      block_id: `review_actions_${params.review.id}`,
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✓ Approve", emoji: true },
          style: "primary",
          action_id: "approve_review",
          value: JSON.stringify({
            reviewId: params.review.id,
            reviewerEmail: params.reviewer?.email
          }),
        },
        {
          type: "button",
          text: { type: "plain_text", text: "✗ Reject", emoji: true },
          style: "danger",
          action_id: "reject_review",
          value: JSON.stringify({
            reviewId: params.review.id,
            reviewerEmail: params.reviewer?.email
          }),
        },
        {
          type: "button",
          text: { type: "plain_text", text: "View Details", emoji: true },
          action_id: "view_review",
          url: reviewUrl,
        },
      ],
    });
  }

  // Add context
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Review: *${params.review.title}* | Requested by ${params.review.creatorName}`,
      },
    ],
  });

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: params.channel,
      blocks,
      text: getMessageText(params), // Fallback for notifications
    }),
  });
}
```

### 3.2 Add Slack interactivity webhook endpoint

```typescript
// File: approval-tool/app/api/slack/interactions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const payloadStr = body.get("payload") as string;
  const payload = JSON.parse(payloadStr);

  // Verify Slack signature (implement proper verification)
  // const isValid = verifySlackSignature(req);

  if (payload.type === "block_actions") {
    const action = payload.actions[0];
    const value = JSON.parse(action.value);
    const userId = payload.user.id;
    const userName = payload.user.name;

    if (action.action_id === "approve_review" || action.action_id === "reject_review") {
      const decision = action.action_id === "approve_review" ? "APPROVED" : "REJECTED";

      // Find reviewer by email (need to match Slack user to reviewer)
      const reviewer = await db.reviewer.findFirst({
        where: {
          reviewId: value.reviewId,
          email: value.reviewerEmail,
          status: "PENDING",
        },
        include: { review: true },
      });

      if (!reviewer) {
        return NextResponse.json({
          response_type: "ephemeral",
          text: "Unable to process: You may not be assigned to this review or already responded.",
        });
      }

      // Update reviewer status
      await db.reviewer.update({
        where: { id: reviewer.id },
        data: {
          status: decision,
          respondedAt: new Date(),
        },
      });

      // Recalculate review status
      await recalculateReviewStatus(db, value.reviewId);

      // Log activity
      await db.activityLog.create({
        data: {
          reviewId: value.reviewId,
          action: decision === "APPROVED" ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
          actorType: "GUEST",
          actorEmail: value.reviewerEmail,
          metadata: { via: "slack", slackUserId: userId },
        },
      });

      // Update the original message to show decision
      return NextResponse.json({
        response_type: "in_channel",
        replace_original: true,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${reviewer.review.title}*\n\n${decision === "APPROVED" ? "✅" : "❌"} *${decision}* by <@${userId}>`,
            },
          },
          {
            type: "context",
            elements: [
              { type: "mrkdwn", text: `Decision recorded at ${new Date().toISOString()}` },
            ],
          },
        ],
      });
    }
  }

  return NextResponse.json({ ok: true });
}
```

### 3.3 Register Slack app interactivity URL

In your Slack app settings:
1. Go to **Interactivity & Shortcuts**
2. Enable **Interactivity**
3. Set Request URL to: `https://your-domain.com/api/slack/interactions`

---

## Priority 4: Dashboard Search & Filter UI (Quick Win)

**Why:** API already supports filtering. Just need UI. Fast to implement.

**Implementation:**

### 4.1 Add search/filter component to dashboard

```typescript
// File: approval-tool/app/[locale]/(app)/dashboard/components/ReviewFilters.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "all", label: "All Reviews" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CHANGES_REQUESTED", label: "Changes Requested" },
];

export function ReviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          const params = new URLSearchParams(searchParams);
          if (e.target.value === "all") {
            params.delete("status");
          } else {
            params.set("status", e.target.value);
          }
          if (search) params.set("search", search);
          router.push(`/dashboard?${params.toString()}`);
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
```

### 4.2 Update dashboard page to use filters

```typescript
// File: approval-tool/app/[locale]/(app)/dashboard/page.tsx
// Add filter handling to the dashboard

import { ReviewFilters } from "./components/ReviewFilters";

export default async function DashboardPage({ searchParams }: {
  searchParams: { status?: string; search?: string }
}) {
  const reviews = await api.review.getMyReviews({
    status: searchParams.status as ReviewStatus | undefined,
    // Note: search needs to be added to the tRPC router if not present
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      <ReviewFilters />

      {/* Existing review table/list */}
      <ReviewList reviews={reviews} />
    </div>
  );
}
```

---

## Priority 5: Toast Notification System (Quick UX Polish)

**Why:** Every action should give feedback. Currently silent.

**Implementation:**

### 5.1 Add toast provider and hook

```typescript
// File: approval-tool/src/components/ui/toast.tsx

"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white flex items-center gap-3
                      animate-slide-up ${
            toast.type === "success" ? "bg-green-500" :
            toast.type === "error" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 5.2 Add animation CSS

```css
/* File: approval-tool/app/globals.css - Add animation */

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.2s ease-out;
}
```

### 5.3 Wrap app with ToastProvider

```typescript
// File: approval-tool/app/layout.tsx
// Add ToastProvider to the root layout

import { ToastProvider } from "~/components/ui/toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TRPCProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
```

### 5.4 Use toasts in components

```typescript
// Example usage in any component
const { addToast } = useToast();

const handleApprove = async () => {
  try {
    await api.review.submitDecision.mutate({ ... });
    addToast("success", "Review approved successfully!");
  } catch (error) {
    addToast("error", "Failed to submit decision. Please try again.");
  }
};
```

---

## Priority 6: Review Templates (Quick Onboarding Win)

**Why:** "5-minute setup" requirement. Reduce friction for new users.

**Implementation:**

### 6.1 Add templates data

```typescript
// File: approval-tool/src/lib/templates.ts

export const REVIEW_TEMPLATES = [
  {
    id: "blog-post",
    name: "Blog Post",
    icon: "📝",
    description: "Content review for blog articles",
    defaultTitle: "Blog Post: [Title]",
    defaultContent: `## Article Title
[Your article title]

## Summary
[Brief 2-3 sentence summary of the article]

## Full Content
[Paste your article content here]

## Key Points to Review
- Accuracy of information
- Tone and voice alignment
- SEO optimization
- Call-to-action effectiveness`,
    suggestedReviewers: ["editor@", "marketing@"],
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: "📱",
    description: "Quick approval for social posts",
    defaultTitle: "Social Post: [Platform] - [Date]",
    defaultContent: `## Platform
[Twitter / LinkedIn / Instagram / Facebook]

## Post Content
[Your post copy here]

## Image/Media
[Link to image or describe the visual]

## Hashtags
[List hashtags]

## Scheduled Time
[Date and time]`,
    suggestedReviewers: ["social@", "brand@"],
  },
  {
    id: "design-asset",
    name: "Design Asset",
    icon: "🎨",
    description: "Creative and design review",
    defaultTitle: "Design Review: [Asset Name]",
    defaultContent: `## Asset Type
[Logo / Banner / Ad Creative / Email Template]

## Preview Link
[Figma / Google Drive / Direct link]

## Design Brief
[What this asset is for]

## Review Checklist
- [ ] Brand guidelines compliance
- [ ] Color accuracy
- [ ] Typography correct
- [ ] Responsive versions included`,
    suggestedReviewers: ["design@", "brand@"],
  },
  {
    id: "proposal",
    name: "Client Proposal",
    icon: "💼",
    description: "Proposal or quote for client approval",
    defaultTitle: "Proposal: [Client Name] - [Project]",
    defaultContent: `## Project Overview
[Brief description of the proposed work]

## Scope of Work
[Detailed breakdown of deliverables]

## Timeline
[Project milestones and dates]

## Investment
[Pricing breakdown]

## Terms
[Payment terms, revisions included, etc.]`,
    suggestedReviewers: [],
  },
  {
    id: "blank",
    name: "Blank",
    icon: "📄",
    description: "Start from scratch",
    defaultTitle: "",
    defaultContent: "",
    suggestedReviewers: [],
  },
];
```

### 6.2 Template selector in create modal

```typescript
// File: approval-tool/app/[locale]/(app)/dashboard/components/CreateReviewModal.tsx

import { useState } from "react";
import { REVIEW_TEMPLATES } from "~/lib/templates";

export function CreateReviewModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"template" | "details">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof REVIEW_TEMPLATES[0] | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const selectTemplate = (template: typeof REVIEW_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setTitle(template.defaultTitle);
    setContent(template.defaultContent);
    setStep("details");
  };

  if (step === "template") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Create New Review</h2>
            <p className="text-gray-500 mt-1">Choose a template to get started quickly</p>
          </div>

          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {REVIEW_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500
                           hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-2xl">{template.icon}</span>
                <h3 className="font-semibold mt-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Details form (existing form logic with pre-filled values)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <button onClick={() => setStep("template")} className="text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {selectedTemplate?.icon} {selectedTemplate?.name}
            </h2>
          </div>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Reviewer inputs... */}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium">
              Send for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Implementation Checklist

```
Phase 1: Email Approve (Day 1)
[ ] Add submitDecisionFromEmail mutation to review router
[ ] Create /approve/[reviewId]/[reviewerId] page
[ ] Update email template with approve/reject buttons
[ ] Test email flow end-to-end

Phase 2: Mobile UX (Day 1-2)
[ ] Redesign review page with fixed bottom action bar
[ ] Add touch-optimized CSS utilities
[ ] Add safe area insets for iPhone
[ ] Test on real mobile devices

Phase 3: Slack Buttons (Day 2)
[ ] Update sendSlackNotification with Block Kit buttons
[ ] Create /api/slack/interactions endpoint
[ ] Register interactivity URL in Slack app settings
[ ] Test approve/reject flow in Slack

Phase 4: Dashboard Polish (Day 2-3)
[ ] Add ReviewFilters component
[ ] Wire filters to API (add search to tRPC if needed)
[ ] Add toast notification system
[ ] Wrap app with ToastProvider
[ ] Add toasts to all mutations

Phase 5: Templates (Day 3)
[ ] Create templates data file
[ ] Build template selector UI
[ ] Update CreateReviewModal with 2-step flow
[ ] Test template flow
```

---

## What We're NOT Building (80/20 Exclusions)

These are valuable but require disproportionate effort:

1. **Scheduled reminders** - Needs cron/background job infrastructure
2. **AI routing suggestions** - Needs ML pipeline
3. **Version comparison UI** - Medium effort, can add later
4. **Analytics dashboard** - Nice-to-have, not critical for MVP
5. **Google Workspace integration** - Complex OAuth, later phase
6. **Notion integration** - Complex API, later phase
7. **Zapier/Make webhooks** - Needs webhook infrastructure
8. **Smart notification batching** - Complexity vs. value

---

## Expected Impact

After implementing these 6 features:

| Metric | Before | After |
|--------|--------|-------|
| Approval completion rate | ~60% | ~85% (email+Slack buttons) |
| Mobile approval time | 45+ seconds | <10 seconds |
| Time to first review | 5+ minutes | <2 minutes (templates) |
| User feedback on actions | None | Instant (toasts) |
| Discoverability of reviews | Poor | Good (search/filter) |

This 80/20 implementation addresses the top 5 pain points from user research with minimal complexity.
