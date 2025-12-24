import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewStatus, ReviewerStatus } from "@prisma/client";
import { REVIEW_STATUS_CONFIG, REVIEWER_STATUS_CONFIG, REVIEW_STATUS } from "@/lib/constants";

interface StatusBadgeProps {
  status: ReviewStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = REVIEW_STATUS_CONFIG[status as ReviewStatus] ?? REVIEW_STATUS_CONFIG[REVIEW_STATUS.PENDING];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

interface ReviewerStatusBadgeProps {
  status: ReviewerStatus | string;
  className?: string;
}

export function ReviewerStatusBadge({ status, className }: ReviewerStatusBadgeProps) {
  const config = REVIEWER_STATUS_CONFIG[status as ReviewerStatus] ?? REVIEWER_STATUS_CONFIG.PENDING;

  return (
    <span className={cn("flex items-center gap-1.5 text-xs text-gray-500", className)}>
      <span className={cn("w-2 h-2 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
