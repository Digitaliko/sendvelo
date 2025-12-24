import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { sendReviewDecisionEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { env } from "@/env";
import { getTranslations } from "next-intl/server";
import { ContentRenderer } from "@/components/content-renderer";
import { StatusBadge, ReviewerStatusBadge } from "@/components/ui/status-badge";
import { DeadlineBadge } from "@/components/ui/deadline-badge";
import { PublicDecisionForm } from "@/components/public-decision-form";
import { EngagementTracker } from "@/components/engagement-tracker";
import type { ContentFormat } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

  // Access control based on publicAccessLevel
  const publicAccessLevel = review.publicAccessLevel;
  const hasValidToken = !!currentReviewer;

  // Check if user can access this review
  const canView = hasValidToken || publicAccessLevel !== "NONE";
  const canComment = hasValidToken || publicAccessLevel === "VIEW_COMMENT" || publicAccessLevel === "FULL_ACCESS";
  const canDecidePublic = publicAccessLevel === "FULL_ACCESS";

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{t("accessRestricted")}</h1>
          <p className="text-gray-600">
            {t("accessRestrictedDesc")}
          </p>
        </div>
      </div>
    );
  }

  // Track view for authenticated reviewer
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

  // Track anonymous view
  if (!currentReviewer && publicAccessLevel !== "NONE") {
    await prisma.review.update({
      where: { id: review.id },
      data: { publicViewCount: { increment: 1 } },
    });
  }

  const latestVersion = review.versions[0];
  const content = latestVersion?.content ?? "";
  const contentFormat = (latestVersion?.contentFormat ?? "MARKDOWN") as ContentFormat;
  const canDecide = currentReviewer && currentReviewer.status === "PENDING";
  const isPublicViewer = !currentReviewer && publicAccessLevel !== "NONE";
  const isDecided = review.status !== "PENDING" && review.status !== "PARTIALLY_APPROVED";
  const canSubmitPublicDecision = isPublicViewer && canDecidePublic && !isDecided;

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

  const publicDecisionLabels = {
    approve: t("approve"),
    reject: t("reject"),
    requestChanges: t("requestChanges"),
    commentsLabel: t("commentsLabel"),
    commentsPlaceholder: t("commentsPlaceholder"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    submitting: t("submitting"),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Engagement tracking */}
      {currentReviewer && <EngagementTracker accessToken={currentReviewer.accessToken} />}

      {/* Mobile-fixed bottom action bar for authenticated reviewers */}
      {canDecide && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 safe-area-inset-bottom" role="toolbar" aria-label="Review actions">
          <form action={handleDecision} className="space-y-2">
            <input type="hidden" name="token" value={token || ""} />
            {/* Primary action - Approve */}
            <Button
              type="submit"
              name="decision"
              value="approved"
              size="lg"
              className="w-full py-4 rounded-xl text-lg bg-green-600 hover:bg-green-700 active:scale-95 transition-transform touch-manipulation"
              aria-label="Approve review"
            >
              {t("approve")}
            </Button>
            {/* Secondary actions - Reject and Request Changes */}
            <div className="flex gap-2">
              <Button
                type="submit"
                name="decision"
                value="rejected"
                variant="destructive"
                className="flex-1 py-3 rounded-xl active:scale-95 transition-transform touch-manipulation"
                aria-label="Reject review"
              >
                {t("reject")}
              </Button>
              <Button
                type="submit"
                name="decision"
                value="changes_requested"
                className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 active:scale-95 transition-transform touch-manipulation"
                aria-label="Request changes"
              >
                {t("requestChanges")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile-fixed bottom action bar for public decisions */}
      {canSubmitPublicDecision && (
        <PublicDecisionForm
          slug={slug}
          isMobile={true}
          labels={publicDecisionLabels}
        />
      )}

      {/* Content with bottom padding for fixed bar */}
      <div className={(canDecide || canSubmitPublicDecision) ? "pb-28 md:pb-0" : ""}>
        {/* Header - Sticky on mobile */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{review.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={review.status} />
              {review.deadline && <DeadlineBadge deadline={review.deadline} />}
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
                {t("alreadyDecided")} {currentReviewer.status.toLowerCase().replace("_", " ")}
              </p>
              {currentReviewer.comments && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>{t("comments")}</strong> {currentReviewer.comments}
                </p>
              )}
            </div>
          )}

          {/* Public Viewer Notice */}
          {isPublicViewer && !canSubmitPublicDecision && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                {canComment
                  ? t("publicViewerCanComment")
                  : t("publicViewerViewOnly")}
              </p>
            </div>
          )}

          {/* Public Decision Notice */}
          {canSubmitPublicDecision && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                {t("publicDecisionNotice")}
              </p>
            </div>
          )}

          {/* Review Content - Card style */}
          <Card className="p-4 md:p-6 mb-6">
            <ContentRenderer content={content} format={contentFormat} />
          </Card>

          {/* Reviewer List */}
          {review.reviewers.length > 1 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {t("reviewers")} ({review.reviewers.filter(r => r.status !== "PENDING").length}/{review.reviewers.length})
              </h2>
              <div className="space-y-2">
                {review.reviewers.map((r) => (
                  <Card
                    key={r.id}
                    className="flex items-center justify-between p-3"
                  >
                    <span className="text-sm">{r.email}</span>
                    <ReviewerStatusBadge status={r.status} />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Decision Form - Desktop only */}
          {canDecide && (
            <Card className="hidden md:block p-6 mb-6">
              <form action={handleDecision} className="space-y-6">
                <input type="hidden" name="token" value={token || ""} />

                <div className="space-y-2">
                  <Label htmlFor="comments">{t("commentsLabel")}</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    rows={4}
                    placeholder={t("commentsPlaceholder")}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    name="decision"
                    value="approved"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {t("approve")}
                  </Button>
                  <Button
                    type="submit"
                    name="decision"
                    value="changes_requested"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    {t("requestChanges")}
                  </Button>
                  <Button
                    type="submit"
                    name="decision"
                    value="rejected"
                    variant="destructive"
                    className="flex-1"
                  >
                    {t("reject")}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Public Decision Form - Desktop only */}
          {canSubmitPublicDecision && (
            <div className="hidden md:block">
              <PublicDecisionForm
                slug={slug}
                isMobile={false}
                labels={publicDecisionLabels}
              />
            </div>
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
                Thumbway
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
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
