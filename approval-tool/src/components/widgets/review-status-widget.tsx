"use client";

import { useMemo } from "react";
import { Check, X, Clock, Eye, EyeOff, Bell, Share2, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useWidgetProps,
  useWidgetState,
  useOpenAiActions,
  useDisplayMode,
} from "./hooks";
import { cn } from "@/lib/utils";

interface Reviewer {
  id: string;
  email: string;
  name: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  viewedAt: string | null;
  decidedAt: string | null;
  timeSpentMs: number;
}

interface ReviewStatusData {
  reviewId: string;
  title: string;
  status: string;
  slug: string;
  createdAt: string;
  reviewers: Reviewer[];
  totalReviewers: number;
  approvedCount: number;
  rejectedCount: number;
  changesRequestedCount: number;
  pendingCount: number;
  shareLink: string;
  suggestions?: string[];
}

interface WidgetState {
  selectedReviewerId: string | null;
  [key: string]: unknown;
}

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            "stroke-current transition-all duration-500",
            percentage === 100 ? "text-green-500" : "text-primary"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-xs text-muted-foreground">approved</span>
      </div>
    </div>
  );
}

function ReviewerRow({
  reviewer,
  onNudge
}: {
  reviewer: Reviewer;
  onNudge: (email: string) => void;
}) {
  const statusConfig = {
    APPROVED: { icon: Check, color: "text-green-500", bg: "bg-green-500/10", label: "Approved" },
    REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected" },
    CHANGES_REQUESTED: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Changes" },
    PENDING: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  };

  const config = statusConfig[reviewer.status];
  const Icon = config.icon;
  const displayName = reviewer.name ?? reviewer.email.split("@")[0];

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div>
          <div className="font-medium text-sm">{displayName}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {reviewer.viewedAt ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Viewed {formatTimeAgo(reviewer.viewedAt)}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Not viewed yet</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-xs px-2 py-1 rounded-full", config.bg, config.color)}>
          {config.label}
        </span>
        {reviewer.status === "PENDING" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNudge(reviewer.email)}
            title="Send reminder"
          >
            <Bell className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function ReviewStatusWidget() {
  const data = useWidgetProps<ReviewStatusData>();
  const displayMode = useDisplayMode();
  const { sendFollowUpMessage, requestDisplayMode, openExternal } = useOpenAiActions();
  const [state, setState] = useWidgetState<WidgetState>({ selectedReviewerId: null });

  const isExpanded = displayMode === "fullscreen";

  const approvalPercentage = useMemo(() => {
    if (!data || data.totalReviewers === 0) return 0;
    return (data.approvedCount / data.totalReviewers) * 100;
  }, [data]);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4" />
          <div className="h-4 w-32 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-48 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const handleNudge = async (email: string) => {
    await sendFollowUpMessage(
      `Send a reminder to ${email} for the review "${data.title}"`
    );
  };

  const handleNudgeAll = async () => {
    await sendFollowUpMessage(
      `Send reminders to all pending reviewers for "${data.title}"`
    );
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(data.shareLink);
    } catch {
      openExternal(data.shareLink);
    }
  };

  const handleToggleFullscreen = async () => {
    await requestDisplayMode(isExpanded ? "inline" : "fullscreen");
  };

  const handleViewReview = () => {
    openExternal(data.shareLink);
  };

  return (
    <div className={cn("p-4", isExpanded && "p-6")}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{data.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {data.approvedCount} of {data.totalReviewers} approved
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleToggleFullscreen}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "flex gap-6",
            isExpanded ? "flex-row" : "flex-col items-center"
          )}>
            <div className="flex-shrink-0">
              <ProgressRing
                percentage={approvalPercentage}
                size={isExpanded ? 140 : 100}
                strokeWidth={isExpanded ? 10 : 8}
              />
            </div>

            <div className="flex-1 w-full">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Reviewers</h4>
                <div className="max-h-[200px] overflow-y-auto">
                  {data.reviewers.map((reviewer) => (
                    <ReviewerRow
                      key={reviewer.id}
                      reviewer={reviewer}
                      onNudge={handleNudge}
                    />
                  ))}
                </div>
              </div>

              {data.suggestions && data.suggestions.length > 0 && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Suggestions</h4>
                  <ul className="text-sm space-y-1">
                    {data.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-muted-foreground">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {data.pendingCount > 0 && (
                  <Button variant="outline" size="sm" onClick={handleNudgeAll}>
                    <Bell className="w-4 h-4 mr-1" />
                    Nudge All ({data.pendingCount})
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" onClick={handleViewReview}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
