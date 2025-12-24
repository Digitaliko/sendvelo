"use client";

import { useState, useMemo } from "react";
import { Check, X, Clock, AlertCircle, Bell, Eye, LayoutGrid, List, Search, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useWidgetProps,
  useWidgetState,
  useOpenAiActions,
  useDisplayMode,
} from "./hooks";
import { cn, formatTimeAgo } from "@/lib/utils";

interface ReviewerSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface Review {
  id: string;
  title: string;
  slug: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "PARTIALLY_APPROVED";
  createdAt: string;
  reviewers: ReviewerSummary;
  shareLink: string;
}

interface ReviewsDashboardData {
  reviews: Review[];
  filter: string;
  totalCount: number;
}

interface WidgetState {
  viewMode: "cards" | "list";
  searchQuery: string;
  statusFilter: string;
  [key: string]: unknown;
}

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  APPROVED: { icon: Check, color: "text-green-500", bg: "bg-green-500/10", label: "Approved" },
  REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected" },
  CHANGES_REQUESTED: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Changes" },
  PARTIALLY_APPROVED: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Partial" },
};

function ReviewCard({
  review,
  onNudge,
  onView,
  compact = false
}: {
  review: Review;
  onNudge: (reviewId: string, title: string) => void;
  onView: (shareLink: string) => void;
  compact?: boolean;
}) {
  const config = STATUS_CONFIG[review.status];
  const Icon = config.icon;
  const progressPercent = review.reviewers.total > 0
    ? (review.reviewers.approved / review.reviewers.total) * 100
    : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">{review.title}</div>
            <div className="text-xs text-muted-foreground">
              {review.reviewers.approved}/{review.reviewers.total} approved • {formatTimeAgo(review.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {review.reviewers.pending > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onNudge(review.id, review.title)}
            >
              <Bell className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView(review.shareLink)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("px-2 py-1 rounded-full text-xs flex items-center gap-1", config.bg, config.color)}>
            <Icon className="w-3 h-3" />
            {config.label}
          </div>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(review.createdAt)}</span>
        </div>

        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{review.title}</h3>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Approval Progress</span>
            <span>{review.reviewers.approved}/{review.reviewers.total}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                progressPercent === 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {review.reviewers.pending > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onNudge(review.id, review.title)}
            >
              <Bell className="w-3 h-3 mr-1" />
              Nudge ({review.reviewers.pending})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={review.reviewers.pending > 0 ? "" : "flex-1"}
            onClick={() => onView(review.shareLink)}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewsDashboardWidget() {
  const data = useWidgetProps<ReviewsDashboardData>();
  const displayMode = useDisplayMode();
  const { sendFollowUpMessage, requestDisplayMode, openExternal } = useOpenAiActions();
  const [state, setState] = useWidgetState<WidgetState>({
    viewMode: "cards",
    searchQuery: "",
    statusFilter: "all",
  });

  const isExpanded = displayMode === "fullscreen";

  const filteredReviews = useMemo(() => {
    if (!data?.reviews) return [];

    return data.reviews.filter((review) => {
      const matchesSearch = state?.searchQuery
        ? review.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        : true;

      const matchesStatus = state?.statusFilter === "all"
        ? true
        : review.status === state.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data?.reviews, state?.searchQuery, state?.statusFilter]);

  const statusCounts = useMemo(() => {
    if (!data?.reviews) return { all: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };

    return {
      all: data.reviews.length,
      PENDING: data.reviews.filter((r) => r.status === "PENDING").length,
      APPROVED: data.reviews.filter((r) => r.status === "APPROVED").length,
      REJECTED: data.reviews.filter((r) => r.status === "REJECTED").length,
    };
  }, [data?.reviews]);

  if (!data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleNudge = async (reviewId: string, title: string) => {
    await sendFollowUpMessage(
      `Send reminders to all pending reviewers for "${title}" (ID: ${reviewId})`
    );
  };

  const handleView = (shareLink: string) => {
    openExternal(shareLink);
  };

  const handleToggleFullscreen = async () => {
    await requestDisplayMode(isExpanded ? "inline" : "fullscreen");
  };

  const handleNudgeAll = async () => {
    const pendingReviews = data.reviews.filter((r) => r.status === "PENDING");
    if (pendingReviews.length > 0) {
      await sendFollowUpMessage(
        `Send reminders to all pending reviewers across all my pending reviews`
      );
    }
  };

  return (
    <div className={cn("p-4", isExpanded && "p-6")}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Your Reviews</h2>
          <p className="text-sm text-muted-foreground">{data.totalCount} total reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setState({ ...state!, viewMode: state?.viewMode === "cards" ? "list" : "cards" })}
          >
            {state?.viewMode === "cards" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleToggleFullscreen}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={state?.searchQuery ?? ""}
            onChange={(e) => setState({ ...state!, searchQuery: e.target.value })}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <Button
              key={status}
              variant={state?.statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setState({ ...state!, statusFilter: status })}
              className="text-xs"
            >
              {status === "all" ? "All" : STATUS_CONFIG[status]?.label ?? status}
              <span className="ml-1 opacity-70">
                ({statusCounts[status]})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {statusCounts.PENDING > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-4"
          onClick={handleNudgeAll}
        >
          <Bell className="w-4 h-4 mr-2" />
          Nudge All Pending Reviews ({statusCounts.PENDING})
        </Button>
      )}

      {filteredReviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No reviews found</p>
        </div>
      ) : state?.viewMode === "cards" ? (
        <div className={cn(
          "grid gap-4",
          isExpanded ? "grid-cols-3" : "grid-cols-2"
        )}>
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onNudge={handleNudge}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onNudge={handleNudge}
                onView={handleView}
                compact
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
