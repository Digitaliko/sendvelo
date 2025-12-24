"use client";

import { useEngagementTracker } from "@/app/hooks/use-engagement-tracker";

interface EngagementTrackerProps {
  accessToken: string;
}

export function EngagementTracker({ accessToken }: EngagementTrackerProps) {
  useEngagementTracker({
    accessToken,
    enabled: true,
  });

  return null;
}
