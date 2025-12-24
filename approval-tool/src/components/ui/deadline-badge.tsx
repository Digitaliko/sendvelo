"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { cn, calculateDeadlineUrgency, formatDeadline, type DeadlineUrgency } from "@/lib/utils";

interface DeadlineBadgeProps {
  deadline: Date | string | null;
  className?: string;
}

const urgencyStyles: Record<DeadlineUrgency, string> = {
  normal: "bg-gray-100 text-gray-700",
  soon: "bg-yellow-100 text-yellow-800",
  urgent: "bg-orange-100 text-orange-800 animate-pulse",
  overdue: "bg-red-100 text-red-800",
};

export function DeadlineBadge({ deadline, className }: DeadlineBadgeProps) {
  if (!deadline) return null;

  const urgency = calculateDeadlineUrgency(deadline);
  const formattedDeadline = formatDeadline(deadline);
  const isOverdue = urgency === "overdue";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        urgencyStyles[urgency],
        className
      )}
    >
      {isOverdue ? (
        <AlertTriangle className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {formattedDeadline}
    </span>
  );
}
