import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";
import { env } from "@/env";
import { nanoid } from "nanoid";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * MCP Server for ChatGPT Integration
 *
 * Implements the Model Context Protocol with OAuth 2.1 authentication.
 * ChatGPT users must authenticate via Better Auth before using tools.
 */

const SendForReviewSchema = z.object({
  title: z.string().describe("Title of the content to review"),
  content: z.string().describe("Content to review (markdown supported)"),
  reviewerEmail: z.string().email().describe("Email address of the reviewer"),
});

type SendForReviewInput = z.infer<typeof SendForReviewSchema>;

/**
 * Verify Bearer token and extract user session
 */
async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    // Verify token with Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Return unauthorized response with MCP-compliant error format
 */
function unauthorizedResponse() {
  const resourceMetadata = `${env.NEXT_PUBLIC_APP_URL}/.well-known/oauth-protected-resource`;

  return Response.json(
    {
      content: [
        {
          type: "text",
          text: "Authentication required. Please login to continue.",
        },
      ],
      _meta: {
        "mcp/www_authenticate": [
          `Bearer resource_metadata="${resourceMetadata}", error="insufficient_scope", error_description="You need to login to continue"`,
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

/**
 * Handle MCP protocol requests
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle tools/list - returns available tools
    if (body.method === "tools/list") {
      return Response.json({
        tools: [
          {
            name: "send_for_review",
            description:
              "Send content for approval to a reviewer via email. The reviewer will receive a link to approve or reject the content.",
            inputSchema: zodToJsonSchema(SendForReviewSchema),
            securitySchemes: [
              {
                type: "oauth2",
                scopes: ["reviews:write"],
              },
            ],
          },
        ],
      });
    }

    // Handle tools/call - execute tool
    if (body.method === "tools/call") {
      const { name, arguments: args } = body.params;

      if (name === "send_for_review") {
        // Verify authentication
        const session = await verifyToken(request);

        if (!session) {
          return unauthorizedResponse();
        }

        // Validate input
        const input = SendForReviewSchema.parse(args) as SendForReviewInput;

        // Check usage limits
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            subscriptionTier: true,
            reviewsThisMonth: true,
            resetDate: true,
          },
        });

        if (!user) {
          return Response.json(
            {
              content: [
                {
                  type: "text",
                  text: "User not found. Please try logging in again.",
                },
              ],
              isError: true,
            },
            { status: 404 }
          );
        }

        // Reset monthly counter if needed
        const now = new Date();
        const resetDate = new Date(user.resetDate);
        if (now.getMonth() !== resetDate.getMonth()) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              reviewsThisMonth: 0,
              resetDate: now,
            },
          });
          user.reviewsThisMonth = 0;
        }

        // Check limits (5 for free, unlimited for pro)
        if (user.subscriptionTier === "free" && user.reviewsThisMonth >= 5) {
          return Response.json(
            {
              content: [
                {
                  type: "text",
                  text: `You've reached your monthly limit of 5 reviews on the free plan. Upgrade to Pro for unlimited reviews at ${env.NEXT_PUBLIC_APP_URL}/dashboard`,
                },
              ],
              isError: true,
            },
            { status: 403 }
          );
        }

        // Create review
        const review = await prisma.review.create({
          data: {
            slug: nanoid(10),
            title: input.title,
            content: input.content,
            reviewerEmail: input.reviewerEmail,
            creatorId: user.id,
          },
        });

        // Increment review count
        await prisma.user.update({
          where: { id: user.id },
          data: {
            reviewsThisMonth: {
              increment: 1,
            },
          },
        });

        // Send email notification
        const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${review.slug}`;

        try {
          await sendReviewRequestEmail({
            to: input.reviewerEmail,
            reviewerName: input.reviewerEmail.split("@")[0] ?? "there",
            creatorName: user.name ?? user.email ?? "Someone",
            title: input.title,
            reviewUrl,
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Continue anyway - review was created
        }

        // Return success response
        const remaining =
          user.subscriptionTier === "free"
            ? 5 - (user.reviewsThisMonth + 1)
            : "unlimited";

        return Response.json({
          content: [
            {
              type: "text",
              text: `✓ Review sent successfully!\n\nReview link: ${reviewUrl}\n\nThe reviewer (${input.reviewerEmail}) will receive an email notification.\n\nReviews remaining this month: ${remaining}`,
            },
          ],
        });
      }

      // Unknown tool
      return Response.json(
        {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        },
        { status: 400 }
      );
    }

    // Unknown method
    return Response.json(
      {
        content: [
          {
            type: "text",
            text: `Unknown method: ${body.method}`,
          },
        ],
        isError: true,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("MCP handler error:", error);

    // Validation error
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          content: [
            {
              type: "text",
              text: `Invalid input: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
            },
          ],
          isError: true,
        },
        { status: 400 }
      );
    }

    // Generic error
    return Response.json(
      {
        content: [
          {
            type: "text",
            text: "An error occurred processing your request.",
          },
        ],
        isError: true,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests - return server info
 */
export async function GET() {
  return Response.json({
    name: "SendVelo Approval Tool",
    version: "1.0.0",
    description: "Send content for approval via email",
    capabilities: {
      tools: ["send_for_review"],
      auth: "oauth2",
    },
  });
}
