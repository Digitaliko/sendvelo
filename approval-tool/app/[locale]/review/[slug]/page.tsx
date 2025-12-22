import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { sendReviewDecisionEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import { getTranslations } from "next-intl/server";
import { ContentRenderer } from "@/components/content-renderer";
import type { ContentFormat } from "@prisma/client";

/**
 * Public Review Page
 *
 * Mobile-first design with fixed bottom action bar.
 * Allows reviewers with a token to approve or reject a review.
 */

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;
  const t = await getTranslations("review");

  const review = await prisma.review.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      reviewers: {
        orderBy: { order: "asc" },
      },
      versions: {
        orderBy: { version: "desc" },
        take: 1,
      },
      comments: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!review) {
    notFound();
  }

  // Get current reviewer if token provided
  const currentReviewer = token
    ? review.reviewers.find((r) => r.accessToken === token)
    : null;

  // Track view
  if (currentReviewer && !currentReviewer.viewedAt) {
    await prisma.reviewer.update({
      where: { id: currentReviewer.id },
      data: {
        viewedAt: new Date(),
        viewCount: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });
  }

  const latestVersion = review.versions[0];
  const content = latestVersion?.content ?? "";
  const contentFormat = (latestVersion?.contentFormat ?? "MARKDOWN") as ContentFormat;
  const canDecide = currentReviewer && currentReviewer.status === "PENDING";
  const isDecided = review.status !== "PENDING" && review.status !== "PARTIALLY_APPROVED";

  async function handleDecision(formData: FormData) {
    "use server";

    const decision = formData.get("decision") as string;
    const comments = formData.get("comments") as string;
    const reviewerToken = formData.get("token") as string;

    if (!decision || !["approved", "rejected", "changes_requested"].includes(decision)) {
      throw new Error("Invalid decision");
    }

    // Get review with all data
    const reviewToUpdate = await prisma.review.findUnique({
      where: { slug },
      include: {
        creator: true,
        reviewers: true,
      },
    });

    if (!reviewToUpdate) {
      throw new Error("Review not found");
    }

    // Find reviewer by token
    const reviewer = reviewToUpdate.reviewers.find((r) => r.accessToken === reviewerToken);
    if (!reviewer) {
      throw new Error("Invalid access token");
    }

    if (reviewer.status !== "PENDING") {
      throw new Error("You've already submitted your decision");
    }

    // Use transaction to prevent race conditions when multiple reviewers submit simultaneously
    await prisma.$transaction(async (tx) => {
      // Update reviewer status
      await tx.reviewer.update({
        where: { id: reviewer.id },
        data: {
          status: decision.toUpperCase() as "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
          comments: comments || null,
          decidedAt: new Date(),
        },
      });

      // Calculate new review status within same transaction
      const updatedReviewers = await tx.reviewer.findMany({
        where: { reviewId: reviewToUpdate.id },
      });

      let newStatus = reviewToUpdate.status;
      const approved = updatedReviewers.filter((r) => r.status === "APPROVED").length;
      const rejected = updatedReviewers.filter((r) => r.status === "REJECTED").length;
      const changesRequested = updatedReviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
      const total = updatedReviewers.length;

      if (reviewToUpdate.workflowType === "ANY_ONE") {
        if (decision === "approved") newStatus = "APPROVED";
        else if (decision === "rejected") newStatus = "REJECTED";
        else newStatus = "CHANGES_REQUESTED";
      } else {
        if (rejected > 0) newStatus = "REJECTED";
        else if (changesRequested > 0) newStatus = "CHANGES_REQUESTED";
        else if (approved === total) newStatus = "APPROVED";
        else if (approved > 0) newStatus = "PARTIALLY_APPROVED";
      }

      // Update review status
      if (newStatus !== reviewToUpdate.status) {
        await tx.review.update({
          where: { id: reviewToUpdate.id },
          data: { status: newStatus },
        });
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          action: decision === "approved" ? "REVIEW_APPROVED"
            : decision === "rejected" ? "REVIEW_REJECTED"
            : "REVIEW_CHANGES_REQUESTED",
          reviewId: reviewToUpdate.id,
          metadata: { reviewerEmail: reviewer.email, comments: comments || null },
        },
      });
    });

    // Send email to creator
    if (reviewToUpdate.creator.email) {
      try {
        await sendReviewDecisionEmail({
          to: reviewToUpdate.creator.email,
          creatorName: reviewToUpdate.creator.name ?? reviewToUpdate.creator.email,
          title: reviewToUpdate.title,
          decision: decision as "approved" | "rejected" | "changes_requested",
          reviewerEmail: reviewer.email,
          comments: comments || undefined,
          reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`,
        });
      } catch (error) {
        console.error("Failed to send decision email:", error);
      }
    }

    // Send Slack notification
    if (reviewToUpdate.organizationId) {
      await sendSlackNotification({
        organizationId: reviewToUpdate.organizationId,
        type: decision === "approved" ? "APPROVED" : decision === "rejected" ? "REJECTED" : "CHANGES_REQUESTED",
        data: {
          title: reviewToUpdate.title,
          reviewerEmail: reviewer.email,
          creatorName: reviewToUpdate.creator.name ?? reviewToUpdate.creator.email,
          reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`,
        },
      });
    }

    redirect(`/review/${encodeURIComponent(slug)}${reviewerToken ? `?token=${encodeURIComponent(reviewerToken)}` : ""}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-fixed bottom action bar */}
      {canDecide && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 safe-area-inset-bottom" role="toolbar" aria-label="Review actions">
          <form action={handleDecision} className="flex gap-3">
            <input type="hidden" name="token" value={token || ""} />
            <button
              type="submit"
              name="decision"
              value="rejected"
              className="flex-1 py-4 px-6 bg-red-500 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform touch-manipulation"
              aria-label="Reject review"
            >
              {t("reject")}
            </button>
            <button
              type="submit"
              name="decision"
              value="approved"
              className="flex-1 py-4 px-6 bg-green-500 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform touch-manipulation"
              aria-label="Approve review"
            >
              {t("approve")}
            </button>
          </form>
        </div>
      )}

      {/* Content with bottom padding for fixed bar */}
      <div className={canDecide ? "pb-28 md:pb-0" : ""}>
        {/* Header - Sticky on mobile */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{review.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={review.status} />
              <span className="text-sm text-gray-500">
                {t("from")} {review.creator.name ?? review.creator.email}
              </span>
              {latestVersion && latestVersion.version > 1 && (
                <span className="text-xs text-gray-400">
                  v{latestVersion.version}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Status Badge for Decided Reviews */}
          {isDecided && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                review.status === "APPROVED"
                  ? "bg-green-50 border border-green-200"
                  : review.status === "REJECTED"
                    ? "bg-red-50 border border-red-200"
                    : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  review.status === "APPROVED"
                    ? "text-green-800"
                    : review.status === "REJECTED"
                      ? "text-red-800"
                      : "text-yellow-800"
                }`}
              >
                {review.status === "APPROVED"
                  ? t("approved")
                  : review.status === "REJECTED"
                    ? t("rejected")
                    : t("changesRequested")}
              </p>
            </div>
          )}

          {/* Reviewer Status */}
          {currentReviewer && currentReviewer.status !== "PENDING" && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                You have already submitted your decision: {currentReviewer.status.toLowerCase().replace("_", " ")}
              </p>
              {currentReviewer.comments && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>{t("comments")}</strong> {currentReviewer.comments}
                </p>
              )}
            </div>
          )}

          {/* Review Content - Card style */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <ContentRenderer content={content} format={contentFormat} />
          </div>

          {/* Reviewer List */}
          {review.reviewers.length > 1 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t("reviewers")} ({review.reviewers.filter(r => r.status !== "PENDING").length}/{review.reviewers.length})
              </h2>
              <div className="space-y-2">
                {review.reviewers.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                  >
                    <span className="text-gray-900 text-sm">{r.email}</span>
                    <ReviewerStatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision Form - Desktop only */}
          {canDecide && (
            <form action={handleDecision} className="hidden md:block space-y-6 bg-white rounded-xl shadow-sm p-6 mb-6">
              <input type="hidden" name="token" value={token || ""} />

              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("commentsLabel")}
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("commentsPlaceholder")}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  name="decision"
                  value="approved"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
                >
                  {t("approve")}
                </button>
                <button
                  type="submit"
                  name="decision"
                  value="changes_requested"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
                >
                  {t("requestChanges")}
                </button>
                <button
                  type="submit"
                  name="decision"
                  value="rejected"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
                >
                  {t("reject")}
                </button>
              </div>
            </form>
          )}

          {/* Comments Section */}
          {review.comments.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t("commentsSection")}
              </h2>
              <div className="space-y-3">
                {review.comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-800">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {comment.authorName ?? comment.authorEmail ?? "Anonymous"} -{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              {t("footer")}{" "}
              <a
                href={env.NEXT_PUBLIC_APP_URL}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                SendVelo
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    PARTIALLY_APPROVED: { bg: "bg-blue-100", text: "text-blue-800", label: "Partial" },
    CHANGES_REQUESTED: { bg: "bg-orange-100", text: "text-orange-800", label: "Changes Requested" },
    CANCELED: { bg: "bg-gray-100", text: "text-gray-800", label: "Canceled" },
  };

  const c = config[status] ?? config.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function ReviewerStatusBadge({ status }: { status: string }) {
  const config: Record<string, { dot: string; label: string }> = {
    APPROVED: { dot: "bg-green-500", label: "Approved" },
    REJECTED: { dot: "bg-red-500", label: "Rejected" },
    PENDING: { dot: "bg-gray-300", label: "Pending" },
    CHANGES_REQUESTED: { dot: "bg-yellow-500", label: "Changes" },
  };

  const c = config[status] ?? config.PENDING;

  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { slug } = await params;

  const review = await prisma.review.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!review) {
    return {
      title: "Review Not Found",
    };
  }

  return {
    title: `Review: ${review.title}`,
    description: "Review and provide feedback on this content",
  };
}
