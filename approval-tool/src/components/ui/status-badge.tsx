import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewStatus, ReviewerStatus } from "@prisma/client";

const reviewStatusConfig: Record<ReviewStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string; label: string }> = {
  APPROVED: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100", label: "Approved" },
  REJECTED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100", label: "Rejected" },
  PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", label: "Pending" },
  PARTIALLY_APPROVED: { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-100", label: "Partial" },
  CHANGES_REQUESTED: { variant: "secondary", className: "bg-orange-100 text-orange-800 hover:bg-orange-100", label: "Changes Requested" },
  CANCELED: { variant: "outline", className: "bg-gray-100 text-gray-800 hover:bg-gray-100", label: "Canceled" },
};

const reviewerStatusConfig: Record<ReviewerStatus, { dotColor: string; label: string }> = {
  APPROVED: { dotColor: "bg-green-500", label: "Approved" },
  REJECTED: { dotColor: "bg-red-500", label: "Rejected" },
  PENDING: { dotColor: "bg-gray-300", label: "Pending" },
  CHANGES_REQUESTED: { dotColor: "bg-yellow-500", label: "Changes" },
};

interface StatusBadgeProps {
  status: ReviewStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = reviewStatusConfig[status as ReviewStatus] ?? reviewStatusConfig.PENDING;

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
  const config = reviewerStatusConfig[status as ReviewerStatus] ?? reviewerStatusConfig.PENDING;

  return (
    <span className={cn("flex items-center gap-1.5 text-xs text-gray-500", className)}>
      <span className={cn("w-2 h-2 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
