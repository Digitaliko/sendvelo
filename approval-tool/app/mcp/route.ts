import { auth } from "@/lib/auth";
import { env } from "@/env";
import { baseURL } from "@/baseUrl";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  handleSendForReview,
  SendForReviewSchema,
  handleCheckStatus,
  CheckStatusSchema,
  handleListReviews,
  ListReviewsSchema,
  handleUpdateReview,
  UpdateReviewSchema,
  handleManageReviewers,
  ManageReviewersSchema,
  handleGenerateNudge,
  GenerateNudgeSchema,
  handleGetShareDetails,
  GetShareDetailsSchema,
  handleUpdatePublicAccess,
  UpdatePublicAccessSchema,
  handleStatusSummary,
  StatusSummarySchema,
  handleCancelReview,
  CancelReviewSchema,
} from "@/lib/mcp";

// ========================================
// WIDGET HELPERS
// ========================================

type WidgetConfig = {
  templateUri: string;
  invoking: string;
  invoked: string;
  widgetPath: string;
};

const WIDGET_CONFIGS: Record<string, WidgetConfig> = {
  check_approval_status: {
    templateUri: "ui://thumbway/review-status",
    invoking: "Loading review status...",
    invoked: "Review status loaded",
    widgetPath: "/widget/review-status",
  },
  list_pending_reviews: {
    templateUri: "ui://thumbway/reviews-dashboard",
    invoking: "Loading your reviews...",
    invoked: "Reviews loaded",
    widgetPath: "/widget/reviews-dashboard",
  },
  status_summary: {
    templateUri: "ui://thumbway/review-status",
    invoking: "Analyzing review status...",
    invoked: "Status summary ready",
    widgetPath: "/widget/review-status",
  },
  send_for_review: {
    templateUri: "ui://thumbway/review-created",
    invoking: "Sending for review...",
    invoked: "Review sent successfully!",
    widgetPath: "/widget/review-created",
  },
  generate_nudge: {
    templateUri: "ui://thumbway/nudge-preview",
    invoking: "Crafting nudge message...",
    invoked: "Nudge ready for review",
    widgetPath: "/widget/nudge-preview",
  },
  manage_reviewers: {
    templateUri: "ui://thumbway/reviewer-management",
    invoking: "Loading reviewers...",
    invoked: "Reviewers loaded",
    widgetPath: "/widget/reviewer-management",
  },
  get_share_details: {
    templateUri: "ui://thumbway/export",
    invoking: "Loading share details...",
    invoked: "Share details ready",
    widgetPath: "/widget/export",
  },
};

async function getWidgetHtml(widgetPath: string): Promise<string | null> {
  try {
    const response = await fetch(`${baseURL}${widgetPath}`, {
      headers: { Accept: "text/html" },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch widget HTML for ${widgetPath}:`, error);
    return null;
  }
}

function createWidgetMeta(config: WidgetConfig, widgetHtml: string | null) {
  const meta: Record<string, unknown> = {
    "openai/outputTemplate": config.templateUri,
    "openai/toolInvocation/invoking": config.invoking,
    "openai/toolInvocation/invoked": config.invoked,
    "openai/resultCanProduceWidget": true,
    "openai/widgetAccessible": true,
  };

  if (widgetHtml) {
    meta["openai/widgetHtml"] = widgetHtml;
    meta["openai/widgetPrefersBorder"] = false;
    meta["openai/widgetCsp"] = {
      connect_domains: [baseURL],
      resource_domains: [baseURL],
    };
  }

  return meta;
}

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
            description: "Send content for approval to one or more reviewers. Supports parallel, sequential, or any-one approval workflows. Shows confirmation widget with next actions.",
            inputSchema: zodToJsonSchema(SendForReviewSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.send_for_review.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "check_approval_status",
            description: "Check the current status of a review, including which reviewers have approved and engagement data (when they viewed it). Shows an interactive widget with approval progress.",
            inputSchema: zodToJsonSchema(CheckStatusSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.check_approval_status.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "list_pending_reviews",
            description: "List your reviews filtered by status (pending, approved, rejected, or all). Shows an interactive dashboard widget.",
            inputSchema: zodToJsonSchema(ListReviewsSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.list_pending_reviews.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "update_review_version",
            description: "Update a review with new content, creating a new version. Useful for addressing feedback.",
            inputSchema: zodToJsonSchema(UpdateReviewSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
          },
          {
            name: "manage_reviewers",
            description: "Add, remove, or send reminders to reviewers on an existing review. Shows interactive reviewer management widget.",
            inputSchema: zodToJsonSchema(ManageReviewersSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.manage_reviewers.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "generate_nudge",
            description: "Generate an AI-crafted follow-up message to nudge pending reviewers. Shows preview widget to review and edit before sending. Uses context like view status and time waiting to craft appropriate messages.",
            inputSchema: zodToJsonSchema(GenerateNudgeSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.generate_nudge.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "get_share_details",
            description: "Get the current sharing settings for a review, including public access level, share link, public view count, and export options.",
            inputSchema: zodToJsonSchema(GetShareDetailsSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.get_share_details.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "update_public_access",
            description: "Update the public access level for a review. Controls who can view, comment on, or approve the review via the public link.",
            inputSchema: zodToJsonSchema(UpdatePublicAccessSchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:write"] }],
          },
          {
            name: "status_summary",
            description: "Get a natural language summary of a review's approval status with smart suggestions. Shows an interactive status widget.",
            inputSchema: zodToJsonSchema(StatusSummarySchema),
            securitySchemes: [{ type: "oauth2", scopes: ["reviews:read"] }],
            _meta: {
              "openai/outputTemplate": WIDGET_CONFIGS.status_summary.templateUri,
              "openai/resultCanProduceWidget": true,
            },
          },
          {
            name: "cancel_review",
            description: "Cancel a review by ID or title. Stops all pending reviewers and marks the review as cancelled.",
            inputSchema: zodToJsonSchema(CancelReviewSchema),
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
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            const widgetConfig = WIDGET_CONFIGS.send_for_review;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "check_approval_status": {
            const input = CheckStatusSchema.parse(args);
            const result = await handleCheckStatus(input, userId);
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            const widgetConfig = WIDGET_CONFIGS.check_approval_status;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "list_pending_reviews": {
            const input = ListReviewsSchema.parse(args);
            const result = await handleListReviews(input, userId);
            const widgetConfig = WIDGET_CONFIGS.list_pending_reviews;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "update_review_version": {
            const input = UpdateReviewSchema.parse(args);
            const result = await handleUpdateReview(input, userId, userName);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          case "manage_reviewers": {
            const input = ManageReviewersSchema.parse(args);
            const result = await handleManageReviewers(input, userId, userName);
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            const widgetConfig = WIDGET_CONFIGS.manage_reviewers;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "generate_nudge": {
            const input = GenerateNudgeSchema.parse(args);
            const result = await handleGenerateNudge(input, userId, userName);
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            // Only show widget for draft mode (not when sendImmediately is true)
            if (!input.sendImmediately) {
              const widgetConfig = WIDGET_CONFIGS.generate_nudge;
              const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
              return Response.json({
                ...result,
                _meta: createWidgetMeta(widgetConfig, widgetHtml),
              });
            }
            return Response.json(result);
          }

          case "get_share_details": {
            const input = GetShareDetailsSchema.parse(args);
            const result = await handleGetShareDetails(input, userId);
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            const widgetConfig = WIDGET_CONFIGS.get_share_details;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "update_public_access": {
            const input = UpdatePublicAccessSchema.parse(args);
            const result = await handleUpdatePublicAccess(input, userId);
            return Response.json(result, { status: result.isError ? 400 : 200 });
          }

          case "status_summary": {
            const input = StatusSummarySchema.parse(args);
            const result = await handleStatusSummary(input, userId);
            if (result.isError) {
              return Response.json(result, { status: 400 });
            }
            const widgetConfig = WIDGET_CONFIGS.status_summary;
            const widgetHtml = await getWidgetHtml(widgetConfig.widgetPath);
            return Response.json({
              ...result,
              _meta: createWidgetMeta(widgetConfig, widgetHtml),
            });
          }

          case "cancel_review": {
            const input = CancelReviewSchema.parse(args);
            const result = await handleCancelReview(input, userId);
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
    version: "2.1.0",
    description: "AI-native approval workflows for ChatGPT content",
    capabilities: {
      tools: [
        "send_for_review",
        "check_approval_status",
        "list_pending_reviews",
        "update_review_version",
        "manage_reviewers",
        "generate_nudge",
        "get_share_details",
        "update_public_access",
        "status_summary",
        "cancel_review",
      ],
      auth: "oauth2",
    },
  });
}
