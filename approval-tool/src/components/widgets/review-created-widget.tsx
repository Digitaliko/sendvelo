"use client";

import { Check, Copy, ExternalLink, UserPlus, Settings, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWidgetProps, useOpenAiActions } from "./hooks";
import { cn } from "@/lib/utils";

interface ReviewerInfo {
  email: string;
  status: "sent" | "pending" | "failed";
}

interface ReviewCreatedData {
  reviewId: string;
  title: string;
  slug: string;
  shareLink: string;
  workflowType: "parallel" | "sequential" | "any_one";
  reviewers: ReviewerInfo[];
  format: string;
  remindAfter: string;
  reviewsRemaining: number | "unlimited";
}

function WorkflowBadge({ type }: { type: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    parallel: { label: "All must approve", color: "bg-blue-500/10 text-blue-600" },
    sequential: { label: "In order", color: "bg-purple-500/10 text-purple-600" },
    any_one: { label: "First approves", color: "bg-green-500/10 text-green-600" },
  };
  const config = labels[type] ?? { label: type, color: "bg-muted text-muted-foreground" };

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.color)}>
      {config.label}
    </span>
  );
}

function ReviewerRow({ reviewer }: { reviewer: ReviewerInfo }) {
  const statusConfig = {
    sent: { icon: Check, color: "text-green-500", label: "Sent" },
    pending: { icon: Check, color: "text-yellow-500", label: "Pending" },
    failed: { icon: Check, color: "text-red-500", label: "Failed" },
  };
  const config = statusConfig[reviewer.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {reviewer.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm truncate max-w-[180px]">{reviewer.email}</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon className={cn("w-3.5 h-3.5", config.color)} />
        <span className={cn("text-xs", config.color)}>{config.label}</span>
      </div>
    </div>
  );
}

export function ReviewCreatedWidget() {
  const data = useWidgetProps<ReviewCreatedData>();
  const { sendFollowUpMessage, openExternal } = useOpenAiActions();
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Check className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="h-4 w-32 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-48 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      openExternal(data.shareLink);
    }
  };

  const handleCheckStatus = async () => {
    await sendFollowUpMessage(`Check the status of "${data.title}"`);
  };

  const handleAddReviewer = async () => {
    await sendFollowUpMessage(`Add a reviewer to "${data.title}"`);
  };

  const handleShareSettings = async () => {
    await sendFollowUpMessage(`Show share settings for "${data.title}"`);
  };

  const sentCount = data.reviewers.filter(r => r.status === "sent").length;

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Review Sent!</CardTitle>
              <p className="text-sm text-muted-foreground">
                {sentCount} of {data.reviewers.length} emails delivered
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">{data.title}</h3>
              <WorkflowBadge type={data.workflowType} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Reviewers ({data.reviewers.length})
            </h4>
            <div className="bg-muted/30 rounded-lg px-3 py-1 max-h-[140px] overflow-y-auto">
              {data.reviewers.map((reviewer, idx) => (
                <ReviewerRow key={idx} reviewer={reviewer} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate flex-1">
              {data.shareLink}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCheckStatus}>
              <Check className="w-3.5 h-3.5 mr-1" />
              Check Status
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddReviewer}>
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              Add Reviewer
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareSettings}>
              <Share2 className="w-3.5 h-3.5 mr-1" />
              Share Settings
            </Button>
          </div>

          {typeof data.reviewsRemaining === "number" && (
            <p className="text-xs text-muted-foreground text-center">
              {data.reviewsRemaining} review{data.reviewsRemaining !== 1 ? "s" : ""} remaining this month
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
