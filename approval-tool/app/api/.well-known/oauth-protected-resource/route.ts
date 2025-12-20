import { env } from "@/env";

/**
 * OAuth 2.1 Protected Resource Metadata
 *
 * This endpoint provides metadata about the protected resource (our MCP server)
 * to authorization servers (Better Auth) and clients (ChatGPT).
 *
 * Spec: https://datatracker.ietf.org/doc/html/rfc8414
 * MCP Spec: https://spec.modelcontextprotocol.io/authorization/
 */

export async function GET() {
  return Response.json({
    // The protected resource identifier (our app)
    resource: env.NEXT_PUBLIC_APP_URL,

    // Authorization servers that can issue tokens for this resource
    authorization_servers: [env.NEXT_PUBLIC_APP_URL],

    // Scopes supported by this protected resource
    scopes_supported: ["reviews:read", "reviews:write"],

    // Bearer token types supported
    bearer_methods_supported: ["header"],

    // Documentation URL
    resource_documentation: `${env.NEXT_PUBLIC_APP_URL}/docs`,

    // Human-readable resource name
    resource_signing_alg_values_supported: ["RS256"],
  });
}
