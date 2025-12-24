"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EmailApprovePage() {
  const t = useTranslations("approve");
  const params = useParams();
  const searchParams = useSearchParams();

  const reviewId = (Array.isArray(params.reviewId) ? params.reviewId[0] : params.reviewId) ?? "";
  const reviewerId = (Array.isArray(params.reviewerId) ? params.reviewerId[0] : params.reviewerId) ?? "";
  const token = searchParams.get("token") ?? "";
  const decision = searchParams.get("decision");

  if (!reviewId || !reviewerId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4" aria-hidden="true">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("invalidLink")}</h1>
          <p className="mt-2 text-gray-600">{t("invalidLinkDesc")}</p>
        </div>
      </div>
    );
  }

  if (decision && !["approve", "reject"].includes(decision)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4" aria-hidden="true">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("invalidRequest")}</h1>
          <p className="mt-2 text-gray-600">{t("invalidRequestDesc")}</p>
        </div>
      </div>
    );
  }

  const [status, setStatus] = useState<"pending_confirmation" | "loading" | "success" | "error" | "invalid">(
    decision ? "pending_confirmation" : "invalid"
  );
  const [errorMessage, setErrorMessage] = useState(
    !decision ? t("invalidDecision") : ""
  );
  const [finalDecision, setFinalDecision] = useState<"APPROVED" | "REJECTED" | null>(null);

  const submitMutation = api.review.submitDecisionFromEmail.useMutation({
    onSuccess: (data) => {
      setFinalDecision(data.decision);
      setStatus("success");
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setStatus("error");
    },
  });

  const handleConfirmDecision = () => {
    if (!decision || !["approve", "reject"].includes(decision)) {
      setStatus("invalid");
      setErrorMessage(t("invalidDecision"));
      return;
    }

    setStatus("loading");
    submitMutation.mutate({
      reviewId,
      reviewerId,
      token,
      decision: decision === "approve" ? "APPROVED" : "REJECTED",
    });
  };

  const isApproved = finalDecision === "APPROVED";
  const isApproveAction = decision === "approve";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "pending_confirmation" && (
          <>
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isApproveAction ? "bg-green-100" : "bg-red-100"
              }`}
              aria-hidden="true"
            >
              {isApproveAction ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isApproveAction ? t("confirmApproval") : t("confirmRejection")}
            </h1>
            <p className="mt-2 text-gray-600">
              {t("confirmDecisionDesc")}
            </p>
            <button
              onClick={handleConfirmDecision}
              className={`mt-6 inline-block px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                isApproveAction
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isApproveAction ? t("confirmApprovalButton") : t("confirmRejectionButton")}
            </button>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-4 block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {t("viewFullReview")}
            </a>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-blue-100 mb-4" role="status" aria-label="Processing">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("processing")}</h1>
            <p className="mt-2 text-gray-600">{t("processingDesc")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isApproved ? "bg-green-100" : "bg-red-100"
              }`}
              role="img"
              aria-label={isApproved ? "Success" : "Rejected"}
            >
              {isApproved ? (
                <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isApproved ? t("approvedTitle") : t("rejectedTitle")}
            </h1>
            <p className="mt-2 text-gray-600">
              {t("decisionRecorded")}
            </p>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-6 inline-block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {t("viewReviewDetails")}
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-yellow-100 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {errorMessage.includes("already") ? t("alreadyDecided") : t("errorTitle")}
            </h1>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-6 inline-block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {t("viewReview")}
            </a>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("invalidLink")}</h1>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
