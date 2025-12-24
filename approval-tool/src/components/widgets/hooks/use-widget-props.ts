"use client";

import { useToolOutput } from "./use-openai-global";

export function useWidgetProps<T = Record<string, unknown>>(
  fallback?: T | (() => T)
): T | null {
  const toolOutput = useToolOutput<T>();

  if (toolOutput != null) {
    return toolOutput;
  }

  if (fallback != null) {
    return typeof fallback === "function" ? (fallback as () => T)() : fallback;
  }

  return null;
}
