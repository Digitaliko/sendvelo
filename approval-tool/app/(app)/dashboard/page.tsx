"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { STRIPE_PRICES } from "@/lib/stripe";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Review = RouterOutputs["review"]["getMyReviews"]["reviews"][number];

/**
 * Dashboard Page
 *
 * Shows user's reviews, subscription status, and allows creating new reviews.
 */

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } =
    api.user.getProfile.useQuery();

  const { data: reviewsData, isLoading: reviewsLoading, refetch } =
    api.review.getMyReviews.useQuery();

  const reviews = reviewsData?.reviews || [];

  const { data: stats } = api.review.getStats.useQuery();

  const createReviewMutation = api.review.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      // TODO: Add toast notification - toast.success(t("reviews.createSuccess"))
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
      alert(error.message || "Failed to create review");
    },
  });

  const deleteReviewMutation = api.review.delete.useMutation({
    onSuccess: () => {
      refetch();
      // TODO: Add toast notification - toast.success(t("reviews.deleteSuccess"))
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
      alert(error.message || "Failed to delete review");
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
      alert(error.message || "Failed to start checkout");
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
      alert(error.message || "Failed to open billing portal");
    },
  });

  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    reviewerEmail: "",
  });

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReviewMutation.mutateAsync(newReview);
      setNewReview({ title: "", content: "", reviewerEmail: "" });
    } catch (error) {
      // Error is already handled by onError callback
      // Keep form data so user can retry
    }
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

  const tier = profile?.subscriptionTier ?? "free";
  const remaining =
    tier === "free" ? 5 - (profile?.reviewsThisMonth ?? 0) : "unlimited";

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
              {tier}
            </p>
            {tier === "free" ? (
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("reviews.title")}
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          {t("createReview")}
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
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
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {review.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {review.reviewerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : review.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (confirm(t("reviews.deleteConfirm"))) {
                          deleteReviewMutation.mutate({ id: review.id });
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      {t("reviews.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-gray-600">{t("reviews.noReviews")}</p>
        </div>
      )}

      {/* Create Review Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t("createModal.title")}
            </h3>

            <form onSubmit={handleCreateReview} className="space-y-4">
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
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
          </div>
        </div>
      )}
    </div>
  );
}
