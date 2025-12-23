import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendReviewRequestEmail, sendReminderEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { sanitizeForStorage } from "@/lib/sanitization";
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
  format: z.enum(["plain_text", "markdown", "html"]).default("markdown")
    .describe("Content format: plain_text, markdown, or html. Defaults to markdown."),
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
    FREE: 5,
    STARTER: 999999,
    TEAM: 999999,
    BUSINESS: 999999,
  };

  const limit = limits[user.subscriptionTier] ?? 5;
  if (user.reviewsThisMonth >= limit) {
    return {
      content: [{
        type: "text",
        text: `You've reached your monthly limit of ${limit} reviews. Upgrade at ${env.NEXT_PUBLIC_APP_URL}/en/dashboard to send more reviews.`,
      }],
      isError: true,
    };
  }

  // Validate reviewer emails
  const validEmails = input.reviewers.filter((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });

  if (validEmails.length === 0) {
    return {
      content: [{
        type: "text",
        text: "No valid email addresses provided. Please provide at least one valid reviewer email.",
      }],
      isError: true,
    };
  }

  // Map format to ContentFormat enum
  const contentFormatMap: Record<string, "PLAIN_TEXT" | "MARKDOWN" | "HTML"> = {
    plain_text: "PLAIN_TEXT",
    markdown: "MARKDOWN",
    html: "HTML",
  };
  const contentFormat = contentFormatMap[input.format] ?? "MARKDOWN";

  // Compute content metadata
  const wordCount = input.content.split(/\s+/).filter(Boolean).length;
  const characterCount = input.content.length;

  // Sanitize content (XSS prevention)
  const sanitizedTitle = input.title.trim().slice(0, 200);
  const sanitizedContent = sanitizeForStorage(input.content, contentFormat);

  // Create review and increment counter atomically
  const review = await prisma.$transaction(async (tx) => {
    // Create review with initial version
    const newReview = await tx.review.create({
      data: {
        slug: nanoid(10),
        title: sanitizedTitle,
        creatorId: userId,
        workflowType: input.workflowType.toUpperCase() as "PARALLEL" | "SEQUENTIAL" | "ANY_ONE",
        versions: {
          create: {
            version: 1,
            content: sanitizedContent,
            contentFormat,
            wordCount,
            characterCount,
          },
        },
        reviewers: {
          create: input.reviewers.map((email, index) => ({
            email: email.toLowerCase().trim(),
            order: input.workflowType === "sequential" ? index + 1 : 0,
          })),
        },
      },
      include: {
        reviewers: true,
      },
    });

    // Increment review count atomically
    await tx.user.update({
      where: { id: userId },
      data: { reviewsThisMonth: { increment: 1 } },
    });

    return newReview;
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
        reviewId: review.id,
        reviewerId: reviewer.id,
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
      text: `Review created successfully!

**${input.title}**
Link: ${reviewUrl}
Reviewers: ${input.reviewers.join(", ")}
Workflow: ${input.workflowType}
Format: ${input.format}
Reminder: ${input.remindAfter}

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
      content: [{ type: "text", text: "Review not found. Try listing your reviews first." }],
      isError: true,
    };
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "[PENDING]",
    APPROVED: "[APPROVED]",
    REJECTED: "[REJECTED]",
    CHANGES_REQUESTED: "[CHANGES]",
    PARTIALLY_APPROVED: "[PARTIAL]",
  };

  const reviewerStatuses = review.reviewers.map((r) => {
    const emoji = statusEmoji[r.status] ?? "[PENDING]";
    const viewed = r.viewedAt ? ` (viewed ${formatTimeAgo(r.viewedAt)})` : "";
    return `  ${emoji} ${r.email}${viewed}`;
  }).join("\n");

  return {
    content: [{
      type: "text",
      text: `**${review.title}**

Status: ${statusEmoji[review.status] ?? "[PENDING]"} ${review.status}
Version: ${review.versions[0]?.version ?? 1}
Created: ${formatTimeAgo(review.createdAt)}

**Reviewers:**
${reviewerStatuses}

Link: ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
    }],
  };
}

async function handleListReviews(
  input: z.infer<typeof ListReviewsSchema>,
  userId: string
) {
  const statusMap: Record<string, "PENDING" | "APPROVED" | "REJECTED"> = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
  };

  const reviews = await prisma.review.findMany({
    where: {
      creatorId: userId,
      ...(input.status !== "all" && statusMap[input.status] ? { status: statusMap[input.status] } : {}),
    },
    include: {
      reviewers: true,
      _count: { select: { reviewers: true } },
    },
    orderBy: { createdAt: "desc" },
    take: input.limit,
  });

  if (reviews.length === 0) {
    return {
      content: [{ type: "text", text: "No reviews found." }],
    };
  }

  const statusEmoji: Record<string, string> = {
    PENDING: "[PENDING]",
    APPROVED: "[APPROVED]",
    REJECTED: "[REJECTED]",
    CHANGES_REQUESTED: "[CHANGES]",
    PARTIALLY_APPROVED: "[PARTIAL]",
  };

  const reviewList = reviews.map((r, i) => {
    const approved = r.reviewers.filter((rv) => rv.status === "APPROVED").length;
    const total = r.reviewers.length;
    return `${i + 1}. ${statusEmoji[r.status] ?? "[PENDING]"} **${r.title}** (${approved}/${total} approved)\n   ID: ${r.id} | ${formatTimeAgo(r.createdAt)}`;
  }).join("\n\n");

  return {
    content: [{
      type: "text",
      text: `**Your Reviews** (${input.status})\n\n${reviewList}`,
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
      content: [{ type: "text", text: "Review not found or you don't have access." }],
      isError: true,
    };
  }

  const newVersion = (review.versions[0]?.version ?? 0) + 1;
  const contentFormat = review.versions[0]?.contentFormat ?? "MARKDOWN";

  // Compute content metadata
  const wordCount = input.newContent.split(/\s+/).filter(Boolean).length;
  const characterCount = input.newContent.length;

  // Sanitize content (XSS prevention)
  const sanitizedContent = sanitizeForStorage(input.newContent, contentFormat);

  // Create new version
  await prisma.reviewVersion.create({
    data: {
      reviewId: review.id,
      version: newVersion,
      content: sanitizedContent,
      contentFormat,
      changes: input.changeSummary,
      wordCount,
      characterCount,
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
      text: `Review updated to version ${newVersion}!

**${review.title}**
${input.changeSummary ? `Changes: ${input.changeSummary}` : ""}
Notified: ${reviewersToNotify.length} reviewer(s)

Link: ${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`,
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
      content: [{ type: "text", text: "Review not found or you don't have access." }],
      isError: true,
    };
  }

  // Prevent adding more than 10 total reviewers
  if (input.action === "add" && review.reviewers.length + input.emails.length > 10) {
    return {
      content: [{ type: "text", text: "Cannot add reviewers. Maximum of 10 reviewers per review." }],
      isError: true,
    };
  }

  if (input.action === "add") {
    const existingEmails = new Set(review.reviewers.map((r) => r.email.toLowerCase()));
    const newEmails = input.emails.filter((e) => !existingEmails.has(e.toLowerCase()));

    if (newEmails.length === 0) {
      return {
        content: [{ type: "text", text: "All specified reviewers are already on this review." }],
      };
    }

    // Add new reviewers
    const maxOrder = Math.max(...review.reviewers.map((r) => r.order), 0);
    for (let i = 0; i < newEmails.length; i++) {
      const email = newEmails[i];
      if (!email) continue;

      const reviewer = await prisma.reviewer.create({
        data: {
          reviewId: review.id,
          email,
          order: review.workflowType === "SEQUENTIAL" ? maxOrder + i + 1 : 0,
        },
      });

      // Send email
      const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}?token=${reviewer.accessToken}`;
      try {
        await sendReviewRequestEmail({
          to: email,
          reviewerName: email.split("@")[0],
          creatorName: userName,
          title: review.title,
          reviewUrl: accessUrl,
          reviewId: review.id,
          reviewerId: reviewer.id,
        });
      } catch (e) {
        console.error(`Failed to send email to ${email}:`, e);
      }
    }

    return {
      content: [{
        type: "text",
        text: `Added ${newEmails.length} reviewer(s): ${newEmails.join(", ")}`,
      }],
    };
  }

  if (input.action === "remove") {
    // Prevent removing all reviewers
    if (review.reviewers.length <= input.emails.length) {
      return {
        content: [{
          type: "text",
          text: "Cannot remove all reviewers. At least one reviewer must remain.",
        }],
        isError: true,
      };
    }

    const result = await prisma.reviewer.deleteMany({
      where: {
        reviewId: review.id,
        email: { in: input.emails.map((e) => e.toLowerCase()) },
        status: "PENDING", // Only allow removing pending reviewers
      },
    });

    return {
      content: [{
        type: "text",
        text: `Removed ${result.count} reviewer(s)`,
      }],
    };
  }

  if (input.action === "remind") {
    const reviewersToRemind = review.reviewers.filter(
      (r) => input.emails.map(e => e.toLowerCase()).includes(r.email.toLowerCase()) && r.status === "PENDING"
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
        text: `Sent reminder to ${reviewersToRemind.length} reviewer(s)`,
      }],
    };
  }

  return {
    content: [{ type: "text", text: "Unknown action" }],
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

      try {
        switch (name) {
          case "send_for_review": {
            const input = SendForReviewSchema.parse(args);
            const result = await handleSendForReview(input, userId, userName);
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
