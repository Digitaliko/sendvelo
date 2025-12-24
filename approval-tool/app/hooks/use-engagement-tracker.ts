"use client";

import { useEffect, useRef, useCallback } from "react";
import { api } from "@/trpc/react";

interface UseEngagementTrackerOptions {
  accessToken: string | null;
  enabled?: boolean;
}

export function useEngagementTracker({ accessToken, enabled = true }: UseEngagementTrackerOptions) {
  const timeAccumulator = useRef(0);
  const lastActiveTime = useRef<number | null>(null);
  const isVisible = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateEngagement = api.review.updateEngagement.useMutation({
    onError: (error) => {
      console.error("Failed to update engagement:", error);
    },
  });

  const mutateRef = useRef(updateEngagement.mutate);
  mutateRef.current = updateEngagement.mutate;

  const sendUpdate = useCallback((token: string) => {
    if (timeAccumulator.current > 0) {
      mutateRef.current({
        accessToken: token,
        timeSpentMs: timeAccumulator.current,
      });
      timeAccumulator.current = 0;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !accessToken) {
      return;
    }

    const startTracking = () => {
      lastActiveTime.current = Date.now();
    };

    const stopTracking = () => {
      if (lastActiveTime.current !== null) {
        const elapsed = Date.now() - lastActiveTime.current;
        timeAccumulator.current += elapsed;
        lastActiveTime.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible.current = false;
        stopTracking();
      } else {
        isVisible.current = true;
        startTracking();
      }
    };

    const handleBlur = () => {
      stopTracking();
    };

    const handleFocus = () => {
      if (!document.hidden) {
        startTracking();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    startTracking();

    intervalRef.current = setInterval(() => sendUpdate(accessToken), 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      stopTracking();
      sendUpdate(accessToken);
    };
  }, [accessToken, enabled, sendUpdate]);
}
