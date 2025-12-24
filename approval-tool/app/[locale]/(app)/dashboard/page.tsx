"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { STRIPE_PRICES } from "@/lib/stripe-prices";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { REVIEW_TEMPLATES, type ReviewTemplate } from "@/lib/templates";
import { formatTimeSpent, formatTimeAgo } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  Share2,
  Palette,
  Briefcase,
  Mail,
  Newspaper,
  File,
  ChevronLeft,
  Eye,
  EyeOff,
  Bell,
  Clock,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeadlineBadge } from "@/components/ui/deadline-badge";
import { DashboardStats } from "@/components/dashboard-stats";
import { ShareModal } from "@/components/share-modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  CredenzaFooter,
} from "@/components/ui/credenza";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Review = RouterOutputs["review"]["getMyReviews"]["reviews"][number];

// Icon map for templates
const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  Newspaper: <Newspaper className="w-6 h-6" />,
  File: <File className="w-6 h-6" />,
};

/**
 * Dashboard Page
 *
 * Shows user's reviews with search/filter, subscription status, and allows creating new reviews.
 */

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState<"template" | "details">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");

  // Share modal state
  const [shareReviewId, setShareReviewId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } =
    api.user.getProfile.useQuery();

  const { data: reviewsData, isLoading: reviewsLoading, refetch } =
    api.review.getMyReviews.useQuery({
      status: statusFilter !== "all" ? statusFilter as "pending" | "approved" | "rejected" | "changes_requested" : undefined,
      search: searchQuery || undefined,
    });

  const reviews = reviewsData?.reviews || [];

  const { data: stats } = api.review.getStats.useQuery();

  const createReviewMutation = api.review.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      setCreateStep("template");
      setSelectedTemplate(null);
      addToast("success", t("reviews.createSuccess"), t("reviews.createSuccessDesc"));
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
      addToast("error", t("reviews.createFailed"), error.message);
    },
  });

  const deleteReviewMutation = api.review.delete.useMutation({
    onSuccess: () => {
      refetch();
      addToast("success", t("reviews.deleteSuccess"));
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
      addToast("error", t("reviews.deleteFailed"), error.message);
    },
  });

  const pokeMutation = api.review.resendInvitation.useMutation({
    onSuccess: () => {
      addToast("success", t("reviews.reminderSent"), t("reviews.reminderSentDesc"));
    },
    onError: (error) => {
      addToast("error", t("reviews.reminderFailed"), error.message);
    },
  });

  const createCheckoutMutation = api.user.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Failed to create checkout session:", error);
      addToast("error", "Failed to start checkout", error.message);
    },
  });

  const createPortalMutation = api.user.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Failed to create portal session:", error);
      addToast("error", "Failed to open billing portal", error.message);
    },
  });

  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    reviewerEmail: "",
    deadline: "",
  });

  const handleSelectTemplate = (template: ReviewTemplate) => {
    setSelectedTemplate(template);
    setNewReview({
      title: template.defaultTitle,
      content: template.defaultContent,
      reviewerEmail: "",
      deadline: "",
    });
    setCreateStep("details");
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReviewMutation.mutateAsync({
        title: newReview.title,
        content: newReview.content,
        reviewers: [newReview.reviewerEmail],
        contentFormat: "MARKDOWN",
        deadline: newReview.deadline ? new Date(newReview.deadline) : undefined,
      });
      setNewReview({ title: "", content: "", reviewerEmail: "", deadline: "" });
    } catch (error) {
      // Error is already handled by onError callback
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (status !== "all") params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  if (profileLoading || reviewsLoading) {
    return <DashboardSkeleton />;
  }

  const tier = profile?.subscriptionTier ?? "FREE";
  const remaining =
    tier === "FREE" ? 5 - (profile?.reviewsThisMonth ?? 0) : "unlimited";

  return (
    <TooltipProvider>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("stats.totalReviews")}
            </h3>
            <p className="text-3xl font-bold mt-2">
              {stats?.total ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("stats.pending")}
            </h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats?.pending ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("stats.subscription")}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold capitalize">
                {tier.toLowerCase()}
              </p>
              {tier === "FREE" ? (
                <Button
                  size="sm"
                  onClick={() =>
                    createCheckoutMutation.mutate({
                      priceId: STRIPE_PRICES.PRO.id || "",
                    })
                  }
                  disabled={createCheckoutMutation.isPending}
                >
                  {t("subscription.upgrade")}
                </Button>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => createPortalMutation.mutate()}
                  disabled={createPortalMutation.isPending}
                >
                  {t("subscription.manage")}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {remaining === "unlimited"
                ? t("subscription.unlimited")
                : t("subscription.reviewsRemaining", { count: remaining })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Stats Overview */}
      <DashboardStats period="week" />

      {/* Header with Search/Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {t("reviews.title")}
        </h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          {t("createReview")}
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search reviews"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="pl-10 w-[180px]">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="pending">{t("filters.pending")}</SelectItem>
              <SelectItem value="approved">{t("filters.approved")}</SelectItem>
              <SelectItem value="rejected">{t("filters.rejected")}</SelectItem>
              <SelectItem value="changes_requested">{t("filters.changesRequested")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("reviews.table.title")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("reviews.table.reviewer")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("reviews.table.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("reviews.table.created")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("reviews.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review: Review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/review/${review.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {review.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      {review.reviewers.map((r) => (
                        <div key={r.id} className="flex items-center gap-2">
                          {r.viewedAt ? (
                            <span className="flex items-center gap-1 text-green-600" title={t("reviews.viewedAgo", { time: formatTimeAgo(r.viewedAt) })}>
                              <Eye className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400" title={t("reviews.notViewedYet")}>
                              <EyeOff className="w-3 h-3" />
                            </span>
                          )}
                          <span className="truncate max-w-[150px]">{r.email}</span>
                          {r.timeSpentMs && r.timeSpentMs > 0 && (
                            <span className="text-xs text-gray-500 flex items-center gap-0.5" title={`Time spent: ${formatTimeSpent(r.timeSpentMs)}`}>
                              <Clock className="w-3 h-3" />
                              {formatTimeSpent(r.timeSpentMs)}
                            </span>
                          )}
                          {r.status === "PENDING" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => pokeMutation.mutate({ reviewId: review.id, reviewerId: r.id })}
                                  disabled={pokeMutation.isPending}
                                  aria-label={t("reviews.sendReminder")}
                                  className="h-8 w-8"
                                >
                                  <Bell className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{t("reviews.sendReminder")}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      ))}
                      {/* Remind All button when multiple reviewers pending */}
                      {review.reviewers.filter(r => r.status === "PENDING").length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            review.reviewers
                              .filter(r => r.status === "PENDING")
                              .forEach(r => pokeMutation.mutate({ reviewId: review.id, reviewerId: r.id }));
                          }}
                          disabled={pokeMutation.isPending}
                          className="mt-2 text-xs"
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          {t("reviews.remindAll", { count: review.reviewers.filter(r => r.status === "PENDING").length })}
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={review.status} />
                      {review.deadline && <DeadlineBadge deadline={review.deadline} />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShareReviewId(review.id)}
                            aria-label={`Share review ${review.title}`}
                            className="h-8 w-8"
                          >
                            <Share2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("reviews.share")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteReviewId(review.id)}
                            disabled={deleteReviewMutation.isPending}
                            aria-label={`Delete review ${review.title}`}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{tCommon("delete")}</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {reviews.map((review: Review) => (
              <div key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <a
                    href={`/review/${review.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {review.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={review.status} />
                    {review.deadline && <DeadlineBadge deadline={review.deadline} />}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2 space-y-1">
                  {review.reviewers.map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                      {r.viewedAt ? (
                        <span title={t("reviews.viewedAgo", { time: formatTimeAgo(r.viewedAt) })}>
                          <Eye className="w-3 h-3 text-green-600" />
                        </span>
                      ) : (
                        <span title={t("reviews.notViewedYet")}>
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        </span>
                      )}
                      <span className="truncate">{r.email}</span>
                      {r.timeSpentMs && r.timeSpentMs > 0 && (
                        <span className="text-xs text-gray-500 flex items-center gap-0.5" title={`Time spent: ${formatTimeSpent(r.timeSpentMs)}`}>
                          <Clock className="w-3 h-3" />
                          {formatTimeSpent(r.timeSpentMs)}
                        </span>
                      )}
                      {r.status === "PENDING" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => pokeMutation.mutate({ reviewId: review.id, reviewerId: r.id })}
                              disabled={pokeMutation.isPending}
                              aria-label={t("reviews.sendReminder")}
                              className="h-6 w-6"
                            >
                              <Bell className="w-3 h-3" aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("reviews.sendReminder")}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                  {/* Remind All button when multiple reviewers pending - Mobile */}
                  {review.reviewers.filter(r => r.status === "PENDING").length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        review.reviewers
                          .filter(r => r.status === "PENDING")
                          .forEach(r => pokeMutation.mutate({ reviewId: review.id, reviewerId: r.id }));
                      }}
                      disabled={pokeMutation.isPending}
                      className="mt-2 text-xs w-full"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      {t("reviews.remindAll", { count: review.reviewers.filter(r => r.status === "PENDING").length })}
                    </Button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShareReviewId(review.id)}
                          aria-label={`Share review ${review.title}`}
                          className="h-8 w-8"
                        >
                          <Share2 className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("reviews.share")}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteReviewId(review.id)}
                          disabled={deleteReviewMutation.isPending}
                          aria-label={`Delete review ${review.title}`}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{tCommon("delete")}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{t("reviews.noReviews")}</p>
        </Card>
      )}

      {/* Create Review Modal */}
      <Credenza open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <CredenzaContent className="max-w-2xl">
          {createStep === "template" ? (
            <>
              <CredenzaHeader>
                <CredenzaTitle>{t("createModal.title")}</CredenzaTitle>
                <CredenzaDescription>
                  {t("createModal.templateDescription")}
                </CredenzaDescription>
              </CredenzaHeader>
              <CredenzaBody>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {REVIEW_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      onClick={() => handleSelectTemplate(template)}
                      className="h-auto p-4 flex flex-col items-start text-left hover:border-primary hover:bg-primary/5"
                    >
                      <div className="text-primary mb-2">
                        {TEMPLATE_ICONS[template.icon] ?? <File className="w-6 h-6" />}
                      </div>
                      <span className="font-semibold">{template.name}</span>
                      <span className="text-sm text-muted-foreground mt-1 font-normal">
                        {template.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CredenzaBody>
            </>
          ) : (
            <>
              <CredenzaHeader>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCreateStep("template")}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CredenzaTitle className="flex items-center gap-2">
                    {selectedTemplate && TEMPLATE_ICONS[selectedTemplate.icon]}
                    {selectedTemplate?.name ?? "New Review"}
                  </CredenzaTitle>
                </div>
              </CredenzaHeader>
              <CredenzaBody>
                <form onSubmit={handleCreateReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("createModal.titleLabel")}</Label>
                    <Input
                      id="title"
                      type="text"
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewerEmail">
                      {t("createModal.reviewerEmailLabel")}
                    </Label>
                    <Input
                      id="reviewerEmail"
                      type="email"
                      value={newReview.reviewerEmail}
                      onChange={(e) =>
                        setNewReview({ ...newReview, reviewerEmail: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      {t("createModal.deadlineLabel")}
                    </Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={newReview.deadline}
                      onChange={(e) =>
                        setNewReview({ ...newReview, deadline: e.target.value })
                      }
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("createModal.deadlineHint")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">{t("createModal.contentLabel")}</Label>
                    <RichTextEditor
                      content={newReview.content}
                      onChange={(_html, markdown) =>
                        setNewReview({ ...newReview, content: markdown })
                      }
                      placeholder={t("createModal.contentPlaceholder")}
                      minHeight="250px"
                    />
                  </div>

                  <CredenzaFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      {t("createModal.cancel")}
                    </Button>
                    <Button type="submit" disabled={createReviewMutation.isPending}>
                      {createReviewMutation.isPending
                        ? t("createModal.creating")
                        : t("createModal.create")}
                    </Button>
                  </CredenzaFooter>
                </form>
              </CredenzaBody>
            </>
          )}
        </CredenzaContent>
      </Credenza>

      {/* Share Modal */}
      <ShareModal
        reviewId={shareReviewId ?? ""}
        open={!!shareReviewId}
        onOpenChange={(open) => !open && setShareReviewId(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={!!deleteReviewId}
        onOpenChange={(open) => !open && setDeleteReviewId(null)}
        onConfirm={() => {
          if (deleteReviewId) {
            deleteReviewMutation.mutate({ id: deleteReviewId });
            setDeleteReviewId(null);
          }
        }}
        title={tCommon("delete")}
        message={t("reviews.deleteConfirm")}
        confirmLabel={tCommon("delete")}
        cancelLabel={tCommon("cancel")}
        variant="danger"
        isLoading={deleteReviewMutation.isPending}
      />
    </div>
    </TooltipProvider>
  );
}

