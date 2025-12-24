import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter, getClientIp } from "@/lib/rate-limiter";

const handler = toNextJsHandler(auth);

const RATE_LIMIT_CONFIG = {
  signin: { limit: 5, windowMs: 60 * 1000 },
  signup: { limit: 3, windowMs: 60 * 1000 },
  "forgot-password": { limit: 3, windowMs: 60 * 1000 },
} as const;

async function withRateLimit(
  request: NextRequest,
  originalHandler: (req: NextRequest) => Promise<Response>
): Promise<Response> {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const action = segments[segments.length - 1];

  if (request.method === "POST" && action in RATE_LIMIT_CONFIG) {
    const config = RATE_LIMIT_CONFIG[action as keyof typeof RATE_LIMIT_CONFIG];
    const ip = getClientIp(request.headers);
    const identifier = `auth:${action}:${ip}`;

    const { allowed, remaining, resetAt } = rateLimiter.check(
      identifier,
      config.limit,
      config.windowMs
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    }
  }

  return originalHandler(request);
}

export async function GET(request: NextRequest) {
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, handler.POST);
}
