"use client";

import { useState } from "react";
import { Users, MoreVertical, Trash2, RefreshCw, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewerStatusBadge } from "@/components/ui/status-badge";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/toast";
import type { ReviewerStatus } from "@prisma/client";

interface Reviewer {
  id: string;
  email: string;
  name: string | null;
  status: ReviewerStatus;
  viewedAt: Date | null;
  viewCount: number;
  decidedAt: Date | null;
  createdAt: Date;
}

interface AccessManagementSectionProps {
  reviewId: string;
  reviewers: Reviewer[];
  creatorEmail: string | null;
  onChanged: () => void;
}

export function AccessManagementSection({
  reviewId,
  reviewers,
  creatorEmail,
  onChanged,
}: AccessManagementSectionProps) {
  const { addToast } = useToast();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const removeReviewerMutation = api.review.removeReviewer.useMutation({
    onSuccess: () => {
      onChanged();
      setMenuOpenId(null);
      addToast("success", "Reviewer removed");
    },
    onError: (error) => {
      addToast("error", "Failed to remove", error.message);
    },
  });

  const resendMutation = api.review.resendInvitation.useMutation({
    onSuccess: () => {
      onChanged();
      setMenuOpenId(null);
      addToast("success", "Invitation resent");
    },
    onError: (error) => {
      addToast("error", "Failed to resend", error.message);
    },
  });

  const handleRemove = (reviewerId: string) => {
    if (reviewers.length <= 1) {
      addToast("error", "Cannot remove", "At least one reviewer is required");
      return;
    }
    removeReviewerMutation.mutate({ reviewId, reviewerId });
  };

  const handleResend = (reviewerId: string) => {
    resendMutation.mutate({ reviewId, reviewerId });
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return null;
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Users className="w-4 h-4" />
        People with access
      </div>

      <div className="space-y-2">
        {creatorEmail && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Crown className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{creatorEmail}</p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        )}

        {reviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {reviewer.email[0]?.toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {reviewer.name ?? reviewer.email}
                </p>
                <div className="flex items-center gap-2">
                  <ReviewerStatusBadge status={reviewer.status} />
                  {reviewer.viewedAt && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="w-3 h-3" />
                      {formatTimeAgo(reviewer.viewedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMenuOpenId(menuOpenId === reviewer.id ? null : reviewer.id)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {menuOpenId === reviewer.id && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpenId(null)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    {reviewer.status === "PENDING" && (
                      <button
                        onClick={() => handleResend(reviewer.id)}
                        disabled={resendMutation.isPending}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Resend invite
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(reviewer.id)}
                      disabled={removeReviewerMutation.isPending || reviewers.length <= 1}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviewers.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No reviewers invited yet. Add reviewers above.
        </p>
      )}
    </div>
  );
}
