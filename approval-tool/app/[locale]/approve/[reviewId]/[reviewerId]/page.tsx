"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

/**
 * Email Approval Page
 *
 * Handles approve/reject from email links.
 * Requires user to click confirmation button to prevent CSRF attacks
 * from email prefetching or malicious forwards.
 */

export default function EmailApprovePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const reviewId = (Array.isArray(params.reviewId) ? params.reviewId[0] : params.reviewId) ?? "";
  const reviewerId = (Array.isArray(params.reviewerId) ? params.reviewerId[0] : params.reviewerId) ?? "";
  const token = searchParams.get("token") ?? "";
  const decision = searchParams.get("decision");

  // Validate parameters
  if (!reviewId || !reviewerId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4" aria-hidden="true">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid Link</h1>
          <p className="mt-2 text-gray-600">This approval link is invalid or expired. Please check your email for the correct link.</p>
        </div>
      </div>
    );
  }

  // Validate decision parameter
  if (decision && !["approve", "reject"].includes(decision)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4" aria-hidden="true">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid Request</h1>
          <p className="mt-2 text-gray-600">The decision parameter is invalid. Please use the link from your email.</p>
        </div>
      </div>
    );
  }

  const [status, setStatus] = useState<"pending_confirmation" | "loading" | "success" | "error" | "invalid">(
    decision ? "pending_confirmation" : "invalid"
  );
  const [errorMessage, setErrorMessage] = useState(
    !decision ? "Invalid approval link. Please use the link from your email." : ""
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
      setErrorMessage("Invalid approval link. Please use the link from your email.");
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
              Confirm {isApproveAction ? "Approval" : "Rejection"}
            </h1>
            <p className="mt-2 text-gray-600">
              Click the button below to confirm your decision.
            </p>
            <button
              onClick={handleConfirmDecision}
              className={`mt-6 inline-block px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                isApproveAction
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isApproveAction ? "Confirm Approval" : "Confirm Rejection"}
            </button>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-4 block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              View full review details instead
            </a>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-blue-100 mb-4" role="status" aria-label="Processing">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Processing...</h1>
            <p className="mt-2 text-gray-600">Submitting your decision</p>
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
              {isApproved ? "Approved!" : "Rejected"}
            </h1>
            <p className="mt-2 text-gray-600">
              Your decision has been recorded. You can close this page.
            </p>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-6 inline-block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              View full review details
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-yellow-100 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {errorMessage.includes("already") ? "Already Decided" : "Error"}
            </h1>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <a
              href={`/review/${encodeURIComponent(reviewId)}?token=${encodeURIComponent(token)}`}
              className="mt-6 inline-block text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              View review
            </a>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Invalid Link</h1>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
