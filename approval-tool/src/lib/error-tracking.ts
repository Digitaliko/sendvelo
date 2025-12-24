import { env } from "@/env";

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
}

const SENTRY_DSN = env.NEXT_PUBLIC_SENTRY_DSN;
const IS_PRODUCTION = env.NODE_ENV === "production";

export function captureException(error: Error, context?: ErrorContext): void {
  if (IS_PRODUCTION && SENTRY_DSN) {
    // Sentry integration ready - install @sentry/nextjs and uncomment:
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.withScope((scope) => {
    //   if (context?.tags) scope.setTags(context.tags);
    //   if (context?.extra) scope.setExtras(context.extra);
    //   if (context?.user) scope.setUser(context.user);
    //   Sentry.captureException(error);
    // });
  }

  console.error("[Error Tracking]", {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    ...context,
  });
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: ErrorContext
): void {
  if (IS_PRODUCTION && SENTRY_DSN) {
    // Sentry integration ready - install @sentry/nextjs and uncomment:
    // Sentry.captureMessage(message, level);
  }

  const logMethod = level === "error" ? "error" : level === "warning" ? "warn" : "info";
  console[logMethod]("[Error Tracking]", {
    message,
    level,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    ...context,
  });
}

export function setErrorContext(context: ErrorContext): void {
  if (IS_PRODUCTION && SENTRY_DSN) {
    // Sentry integration ready - install @sentry/nextjs and uncomment:
    // if (context.user) Sentry.setUser(context.user);
    // if (context.tags) Sentry.setTags(context.tags);
    // if (context.extra) Sentry.setExtras(context.extra);
  }
}
