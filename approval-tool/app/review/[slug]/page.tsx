import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { sendReviewDecisionEmail } from "@/lib/email";
import { env } from "@/env";
import { useTranslations } from "next-intl";

/**
 * Public Review Page
 *
 * Allows anyone with the link to approve or reject a review.
 * No authentication required.
 */

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const t = useTranslations("review");

  const review = await prisma.review.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  const isDecided = review.status !== "pending";

  async function handleDecision(formData: FormData) {
    "use server";

    const decision = formData.get("decision") as string;
    const comments = formData.get("comments") as string;

    if (!decision || !["approved", "rejected"].includes(decision)) {
      throw new Error("Invalid decision");
    }

    // Get review with creator info before update
    const reviewToUpdate = await prisma.review.findUnique({
      where: { slug },
      include: {
        creator: true,
      },
    });

    if (!reviewToUpdate) {
      throw new Error("Review not found");
    }

    // Update review
    await prisma.review.update({
      where: { slug },
      data: {
        status: decision,
        comments: comments || null,
      },
    });

    // Send email to creator
    if (reviewToUpdate.creator.email) {
      try {
        await sendReviewDecisionEmail({
          to: reviewToUpdate.creator.email,
          creatorName: reviewToUpdate.creator.name ?? reviewToUpdate.creator.email,
          title: reviewToUpdate.title,
          decision: decision as "approved" | "rejected",
          comments: comments || undefined,
          reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`,
        });
      } catch (error) {
        console.error("Failed to send decision email:", error);
      }
    }

    redirect(`/review/${slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-8">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {review.title}
            </h1>
            <p className="text-sm text-gray-500">
              {t("from")} {review.creator.name ?? review.creator.email}
            </p>
          </div>

          {/* Status Badge */}
          {isDecided && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                review.status === "approved"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  review.status === "approved"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {review.status === "approved"
                  ? t("approved")
                  : t("rejected")}
              </p>
              {review.comments && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>{t("comments")}</strong> {review.comments}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-800">
              {review.content}
            </div>
          </div>

          {/* Decision Form */}
          {!isDecided && (
            <form action={handleDecision} className="space-y-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  value="rejected"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200"
                >
                  {t("reject")}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
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
        </div>
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
