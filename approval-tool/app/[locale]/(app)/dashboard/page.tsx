"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { STRIPE_PRICES } from "@/lib/stripe-prices";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { REVIEW_TEMPLATES, type ReviewTemplate } from "@/lib/templates";
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
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShareModal } from "@/components/share-modal";

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
      addToast("success", "Review created", "Your review has been sent to reviewers");
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
      addToast("error", "Failed to create review", error.message);
    },
  });

  const deleteReviewMutation = api.review.delete.useMutation({
    onSuccess: () => {
      refetch();
      addToast("success", "Review deleted");
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
      addToast("error", "Failed to delete review", error.message);
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
  });

  const handleSelectTemplate = (template: ReviewTemplate) => {
    setSelectedTemplate(template);
    setNewReview({
      title: template.defaultTitle,
      content: template.defaultContent,
      reviewerEmail: "",
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
      });
      setNewReview({ title: "", content: "", reviewerEmail: "" });
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
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  const tier = profile?.subscriptionTier ?? "FREE";
  const remaining =
    tier === "FREE" ? 5 - (profile?.reviewsThisMonth ?? 0) : "unlimited";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {t("stats.totalReviews")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.total ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {t("stats.pending")}
          </h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats?.pending ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {t("stats.subscription")}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-gray-900 capitalize">
              {tier.toLowerCase()}
            </p>
            {tier === "FREE" ? (
              <button
                onClick={() =>
                  createCheckoutMutation.mutate({
                    priceId: STRIPE_PRICES.PRO.id || "",
                  })
                }
                disabled={createCheckoutMutation.isPending}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                {t("subscription.upgrade")}
              </button>
            ) : (
              <button
                onClick={() => createPortalMutation.mutate()}
                disabled={createPortalMutation.isPending}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t("subscription.manage")}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {remaining === "unlimited"
              ? t("subscription.unlimited")
              : t("subscription.reviewsRemaining", { count: remaining })}
          </p>
        </div>
      </div>

      {/* Header with Search/Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("reviews.title")}
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("createReview")}
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search reviews"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">{t("filters.allStatus")}</option>
            <option value="pending">{t("filters.pending")}</option>
            <option value="approved">{t("filters.approved")}</option>
            <option value="rejected">{t("filters.rejected")}</option>
            <option value="changes_requested">{t("filters.changesRequested")}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {review.reviewers.map((r) => r.email).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setShareReviewId(review.id)}
                        className="text-gray-500 hover:text-blue-600 p-1"
                        aria-label={`Share review ${review.title}`}
                      >
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(t("reviews.deleteConfirm"))) {
                            deleteReviewMutation.mutate({ id: review.id });
                          }
                        }}
                        disabled={deleteReviewMutation.isPending}
                        className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Delete review ${review.title}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
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
                  <StatusBadge status={review.status} />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {review.reviewers.map((r) => r.email).join(", ")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShareReviewId(review.id)}
                      className="text-gray-500 hover:text-blue-600 p-1"
                      aria-label={`Share review ${review.title}`}
                    >
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t("reviews.deleteConfirm"))) {
                          deleteReviewMutation.mutate({ id: review.id });
                        }
                      }}
                      disabled={deleteReviewMutation.isPending}
                      className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete review ${review.title}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-gray-600">{t("reviews.noReviews")}</p>
        </div>
      )}

      {/* Create Review Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {createStep === "template" ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 id="modal-title" className="text-xl font-bold text-gray-900">
                        {t("createModal.title")}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("createModal.templateDescription")}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                      aria-label="Close modal"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {REVIEW_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="text-blue-600 mb-2">
                        {TEMPLATE_ICONS[template.icon] ?? <File className="w-6 h-6" />}
                      </div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCreateStep("template")}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {selectedTemplate && TEMPLATE_ICONS[selectedTemplate.icon]}
                        {selectedTemplate?.name ?? "New Review"}
                      </h3>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateReview} className="p-6 space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("createModal.titleLabel")}
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reviewerEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("createModal.reviewerEmailLabel")}
                    </label>
                    <input
                      id="reviewerEmail"
                      type="email"
                      value={newReview.reviewerEmail}
                      onChange={(e) =>
                        setNewReview({ ...newReview, reviewerEmail: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("createModal.contentLabel")}
                    </label>
                    <textarea
                      id="content"
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                      }
                      required
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports Markdown formatting
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      {t("createModal.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={createReviewMutation.isPending}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                    >
                      {createReviewMutation.isPending
                        ? t("createModal.creating")
                        : t("createModal.create")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        reviewId={shareReviewId ?? ""}
        open={!!shareReviewId}
        onOpenChange={(open) => !open && setShareReviewId(null)}
      />
    </div>
  );
}

