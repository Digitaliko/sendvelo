"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard(resetDelayMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard API not available");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelayMs);
        return true;
      } catch (error) {
        console.error("Failed to copy:", error);
        return false;
      }
    },
    [resetDelayMs]
  );

  return { copied, copy };
}
