# Thumbway: Content Rendering Plan v2.1 (Simplified)
## Follow-up to IMPLEMENTATION_PLAN_V2.md

**Date:** December 22, 2025
**Status:** Ready for Implementation
**Purpose:** Add markdown rendering for AI-generated content

---

## Overview

This plan extends the base implementation with **minimal** content format support:
- Markdown rendering using Vercel Streamdown (optimized for AI-streamed content)
- Simple format field to differentiate plain text vs markdown vs HTML
- Basic metadata (word count, character count)

**Philosophy:** Keep it simple. Users send markdown from ChatGPT. Render it properly. Done.

---

## 1. New Package Dependency

### Add to package.json

```bash
cd approval-tool && pnpm add @vercel/streamdown
```

**Why Streamdown?**
- Built specifically for streaming markdown from AI models
- Handles incomplete/unterminated markdown blocks gracefully
- Drop-in replacement for react-markdown
- By Vercel, well-maintained

---

## 2. Database Schema Addition

### Update prisma/schema.prisma

Add to existing `ReviewVersion` model:

```prisma
enum ContentFormat {
  PLAIN_TEXT
  MARKDOWN
  HTML
}

model ReviewVersion {
  id            String        @id @default(cuid())
  reviewId      String
  version       Int
  content       String        @db.Text
  changes       String?       @db.Text

  // NEW: Content format for rendering
  contentFormat ContentFormat @default(MARKDOWN)

  // NEW: Basic metadata (computed on create)
  wordCount     Int           @default(0)
  characterCount Int          @default(0)

  createdAt DateTime @default(now())

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@unique([reviewId, version])
  @@index([reviewId])
}
```

### Migration

```bash
cd approval-tool && npx prisma migrate dev --name add_content_format
```

---

## 3. Content Renderer Component

### New file: src/components/content-renderer.tsx

```tsx
"use client";

import { Streamdown } from "@vercel/streamdown";
import type { ContentFormat } from "@prisma/client";

interface ContentRendererProps {
  content: string;
  format: ContentFormat;
  className?: string;
}

export function ContentRenderer({ content, format, className }: ContentRendererProps) {
  if (format === "MARKDOWN") {
    return (
      <div className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none ${className ?? ""}`}>
        <Streamdown content={content} />
      </div>
    );
  }

  if (format === "HTML") {
    return (
      <div
        className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // PLAIN_TEXT
  return (
    <pre className={`whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed ${className ?? ""}`}>
      {content}
    </pre>
  );
}
```

---

## 4. Update Review Page

### Update app/[locale]/review/[slug]/page.tsx

Replace the content display section:

```tsx
import { ContentRenderer } from "@/components/content-renderer";

// In the component:
<main className="max-w-2xl mx-auto px-4 py-6">
  <ContentRenderer
    content={latestVersion?.content ?? ""}
    format={latestVersion?.contentFormat ?? "MARKDOWN"}
  />
</main>
```

---

## 5. Update MCP Tool

### Update send_for_review in app/mcp/route.ts

Add optional format parameter:

```typescript
{
  name: "send_for_review",
  description: "Send content for approval to one or more reviewers",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the review request",
      },
      content: {
        type: "string",
        description: "The content to be reviewed (markdown supported)",
      },
      to: {
        type: "string",
        description: "Comma-separated email addresses of reviewers",
      },
      workflow_type: {
        type: "string",
        enum: ["parallel", "sequential", "any_one"],
        description: "How reviewers should approve",
        default: "parallel",
      },
      remind_after: {
        type: "string",
        enum: ["24h", "48h", "72h", "never"],
        description: "When to send reminder if not approved",
        default: "24h",
      },
      // NEW: Content format (optional, defaults to markdown)
      format: {
        type: "string",
        enum: ["plain_text", "markdown", "html"],
        description: "Format of the content. Defaults to markdown.",
        default: "markdown",
      },
    },
    required: ["title", "content", "to"],
  },
}
```

### Handler update:

```typescript
// In handleSendForReview function:
const contentFormat = (params.format?.toUpperCase() ?? "MARKDOWN") as ContentFormat;
const wordCount = content.split(/\s+/).filter(Boolean).length;
const characterCount = content.length;

const review = await prisma.review.create({
  data: {
    title,
    slug: generateSlug(),
    status: "PENDING",
    workflowType: mapWorkflowType(params.workflow_type),
    creatorId: session.user.id,
    organizationId: session.activeOrganizationId,
    versions: {
      create: {
        version: 1,
        content,
        contentFormat,
        wordCount,
        characterCount,
      },
    },
    reviewers: {
      create: reviewerEmails.map((email, index) => ({
        email,
        order: index,
        token: generateToken(),
      })),
    },
  },
  include: {
    versions: true,
    reviewers: true,
  },
});
```

---

## 6. Update tRPC Router

### Update src/server/api/routers/review.ts

Add format to create mutation:

```typescript
create: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      reviewerEmails: z.array(z.string().email()).min(1),
      workflowType: z.enum(["PARALLEL", "SEQUENTIAL", "ANY_ONE"]).default("PARALLEL"),
      format: z.enum(["PLAIN_TEXT", "MARKDOWN", "HTML"]).default("MARKDOWN"),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const wordCount = input.content.split(/\s+/).filter(Boolean).length;
    const characterCount = input.content.length;

    const review = await ctx.db.review.create({
      data: {
        title: input.title,
        slug: generateSlug(),
        creatorId: ctx.session.user.id,
        workflowType: input.workflowType,
        versions: {
          create: {
            version: 1,
            content: input.content,
            contentFormat: input.format,
            wordCount,
            characterCount,
          },
        },
        reviewers: {
          create: input.reviewerEmails.map((email, i) => ({
            email,
            order: i,
            token: generateToken(),
          })),
        },
      },
    });

    return review;
  }),
```

---

## 7. Implementation Checklist

- [ ] Install `@vercel/streamdown`
- [ ] Add `ContentFormat` enum to Prisma schema
- [ ] Add `contentFormat`, `wordCount`, `characterCount` fields to `ReviewVersion`
- [ ] Run Prisma migration
- [ ] Create `ContentRenderer` component
- [ ] Update review page to use `ContentRenderer`
- [ ] Update MCP `send_for_review` tool with `format` parameter
- [ ] Update tRPC `review.create` mutation with `format` parameter
- [ ] Test markdown rendering on review page

---

## Summary

| What | Lines | Complexity |
|------|-------|------------|
| Schema addition | ~10 | Low |
| ContentRenderer component | ~30 | Low |
| MCP tool update | ~5 | Low |
| tRPC update | ~5 | Low |
| **Total** | **~50** | **Low** |

**Compare to original V2.1:** ~550 lines of content detection, AI analysis, platform-specific metadata.

**This version:** Markdown in, rendered markdown out. Simple.
