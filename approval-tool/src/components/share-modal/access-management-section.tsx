"use client";

import { Users, MoreVertical, Trash2, RefreshCw, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReviewerStatusBadge } from "@/components/ui/status-badge";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import type { ReviewerStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const t = useTranslations("share.access");
  const { addToast } = useToast();

  const removeReviewerMutation = api.review.removeReviewer.useMutation({
    onSuccess: () => {
      onChanged();
      addToast("success", t("removeSuccess"));
    },
    onError: (error) => {
      addToast("error", t("removeFailed"), error.message);
    },
  });

  const resendMutation = api.review.resendInvitation.useMutation({
    onSuccess: () => {
      onChanged();
      addToast("success", t("resendSuccess"));
    },
    onError: (error) => {
      addToast("error", t("resendFailed"), error.message);
    },
  });

  const handleRemove = (reviewerId: string) => {
    if (reviewers.length <= 1) {
      addToast("error", t("cannotRemove"), t("cannotRemoveLast"));
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
    if (seconds < 60) return t("timeAgo.justNow");
    if (seconds < 3600) return t("timeAgo.minutesAgo", { count: Math.floor(seconds / 60) });
    if (seconds < 86400) return t("timeAgo.hoursAgo", { count: Math.floor(seconds / 3600) });
    return t("timeAgo.daysAgo", { count: Math.floor(seconds / 86400) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Users className="w-4 h-4" />
        {t("title")}
      </div>

      <div className="space-y-2">
        {creatorEmail && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100">
                  <Crown className="w-4 h-4 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{creatorEmail}</p>
                <p className="text-xs text-gray-500">{t("owner")}</p>
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
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-600">
                  {reviewer.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {reviewer.status === "PENDING" && (
                  <DropdownMenuItem
                    onClick={() => handleResend(reviewer.id)}
                    disabled={resendMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("resend")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => handleRemove(reviewer.id)}
                  disabled={removeReviewerMutation.isPending || reviewers.length <= 1}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("remove")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {reviewers.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          {t("noReviewers")}
        </p>
      )}
    </div>
  );
}
