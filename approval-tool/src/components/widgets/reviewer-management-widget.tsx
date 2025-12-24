"use client";

import { useState } from "react";
import { Check, X, Clock, Eye, EyeOff, Bell, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWidgetProps, useOpenAiActions, useWidgetState } from "./hooks";
import { cn, formatTimeAgo } from "@/lib/utils";

interface Reviewer {
  id: string;
  email: string;
  name: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  viewedAt: string | null;
  decidedAt: string | null;
  timeSpentMs: number;
}

interface ReviewerManagementData {
  reviewId: string;
  title: string;
  reviewers: Reviewer[];
  canAddMore: boolean;
  maxReviewers: number;
}

interface WidgetState {
  [key: string]: unknown;
  newEmail: string;
  isAdding: boolean;
}

function formatDuration(ms: number): string {
  if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m`;
  return `${Math.floor(ms / 3600000)}h`;
}

function ReviewerRow({
  reviewer,
  onNudge,
  onRemove,
}: {
  reviewer: Reviewer;
  onNudge: (email: string) => void;
  onRemove: (email: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const statusConfig = {
    APPROVED: { icon: Check, color: "text-green-500", bg: "bg-green-500/10", label: "Approved" },
    REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected" },
    CHANGES_REQUESTED: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Changes" },
    PENDING: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  };

  const config = statusConfig[reviewer.status];
  const Icon = config.icon;
  const displayName = reviewer.name ?? reviewer.email.split("@")[0];
  const isPending = reviewer.status === "PENDING";

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(reviewer.email);
    setIsRemoving(false);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground truncate">{reviewer.email}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            {reviewer.viewedAt ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Viewed {formatTimeAgo(reviewer.viewedAt)}</span>
                {reviewer.timeSpentMs > 0 && (
                  <span>• {formatDuration(reviewer.timeSpentMs)} reading</span>
                )}
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
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className={cn("text-xs px-2 py-0.5 rounded-full whitespace-nowrap", config.bg, config.color)}>
          {config.label}
        </span>
        {isPending && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onNudge(reviewer.email)}
              title="Send reminder"
            >
              <Bell className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={isRemoving}
              title="Remove reviewer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function ReviewerManagementWidget() {
  const data = useWidgetProps<ReviewerManagementData>();
  const { sendFollowUpMessage } = useOpenAiActions();
  const [state, setState] = useWidgetState<WidgetState>({
    newEmail: "",
    isAdding: false,
  });

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="h-4 w-32 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-48 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const handleNudge = async (email: string) => {
    await sendFollowUpMessage(`Send a reminder to ${email} for "${data.title}"`);
  };

  const handleRemove = async (email: string) => {
    await sendFollowUpMessage(`Remove ${email} from the review "${data.title}"`);
  };

  const handleAddReviewer = async () => {
    if (!state.newEmail || !state.newEmail.includes("@")) return;

    setState({ ...state, isAdding: true });
    try {
      await sendFollowUpMessage(`Add ${state.newEmail} as a reviewer to "${data.title}"`);
      setState({ newEmail: "", isAdding: false });
    } catch {
      setState({ ...state, isAdding: false });
    }
  };

  const handleNudgeAll = async () => {
    const pendingEmails = data.reviewers
      .filter(r => r.status === "PENDING")
      .map(r => r.email);
    if (pendingEmails.length === 0) return;
    await sendFollowUpMessage(`Send reminders to all pending reviewers for "${data.title}"`);
  };

  const pendingCount = data.reviewers.filter(r => r.status === "PENDING").length;
  const approvedCount = data.reviewers.filter(r => r.status === "APPROVED").length;

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Manage Reviewers</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {approvedCount}/{data.reviewers.length} approved
                </p>
              </div>
            </div>
            {pendingCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleNudgeAll}>
                <Bell className="w-3.5 h-3.5 mr-1" />
                Nudge All ({pendingCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-medium">{data.title}</div>

          <div className="max-h-[240px] overflow-y-auto -mx-2 px-2">
            {data.reviewers.map((reviewer) => (
              <ReviewerRow
                key={reviewer.id}
                reviewer={reviewer}
                onNudge={handleNudge}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {data.canAddMore && (
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Add reviewer email..."
                    className="pl-9 h-9"
                    value={state.newEmail}
                    onChange={(e) => setState({ ...state, newEmail: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAddReviewer()}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-9"
                  onClick={handleAddReviewer}
                  disabled={state.isAdding || !state.newEmail.includes("@")}
                >
                  {state.isAdding ? "Adding..." : "Add"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.reviewers.length}/{data.maxReviewers} reviewers
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
