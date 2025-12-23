import { TRPCError } from "@trpc/server";

/**
 * Standardized tRPC error creators for consistent error handling across the API.
 */
export const TRPCErrors = {
  unauthorized: (message = "Authentication required") =>
    new TRPCError({ code: "UNAUTHORIZED", message }),

  forbidden: (resource?: string) =>
    new TRPCError({
      code: "FORBIDDEN",
      message: resource ? `Access denied to ${resource}` : "Access denied",
    }),

  notFound: (resource: string) =>
    new TRPCError({ code: "NOT_FOUND", message: `${resource} not found` }),

  badRequest: (message: string) =>
    new TRPCError({ code: "BAD_REQUEST", message }),

  conflict: (message: string) =>
    new TRPCError({ code: "CONFLICT", message }),

  rateLimited: (message = "Too many requests, please try again later") =>
    new TRPCError({ code: "TOO_MANY_REQUESTS", message }),

  internal: (message = "An internal error occurred") =>
    new TRPCError({ code: "INTERNAL_SERVER_ERROR", message }),

  usageLimitReached: (limit: number, upgradeUrl?: string) =>
    new TRPCError({
      code: "FORBIDDEN",
      message: `Monthly limit of ${limit} reviews reached.${upgradeUrl ? ` Upgrade at ${upgradeUrl}` : ""}`,
    }),
} as const;

/**
 * Helper to check if an error is a TRPCError
 */
export function isTRPCError(error: unknown): error is TRPCError {
  return error instanceof TRPCError;
}

/**
 * Helper to wrap async operations with standardized error handling
 */
export async function withTRPCErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage = "Operation failed"
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isTRPCError(error)) {
      throw error;
    }
    console.error(`[tRPC Error] ${errorMessage}:`, error);
    throw TRPCErrors.internal(errorMessage);
  }
}
