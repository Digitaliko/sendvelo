import type { ReviewStatus, WorkflowType, ReviewerStatus } from "@prisma/client";

export type ReviewerForStatusCalc = {
  status: ReviewerStatus;
};

export function calculateReviewStatus(
  reviewers: ReviewerForStatusCalc[],
  workflowType: WorkflowType,
  latestDecision?: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
  currentStatus: ReviewStatus = "PENDING"
): ReviewStatus {
  const approved = reviewers.filter((r) => r.status === "APPROVED").length;
  const rejected = reviewers.filter((r) => r.status === "REJECTED").length;
  const changesRequested = reviewers.filter((r) => r.status === "CHANGES_REQUESTED").length;
  const total = reviewers.length;

  if (workflowType === "ANY_ONE") {
    if (latestDecision) {
      return latestDecision;
    }
    if (approved > 0) return "APPROVED";
    if (rejected > 0) return "REJECTED";
    if (changesRequested > 0) return "CHANGES_REQUESTED";
    return currentStatus;
  }

  if (rejected > 0) return "REJECTED";
  if (changesRequested > 0) return "CHANGES_REQUESTED";
  if (approved === total && total > 0) return "APPROVED";
  if (approved > 0) return "PARTIALLY_APPROVED";

  return currentStatus;
}

export const STATUS_FILTER_MAP: Record<string, ReviewStatus> = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  changes_requested: "CHANGES_REQUESTED",
  partially_approved: "PARTIALLY_APPROVED",
  canceled: "CANCELED",
};

export function normalizeStatusFilter(status: string | undefined): ReviewStatus | undefined {
  if (!status || status === "all") return undefined;
  return STATUS_FILTER_MAP[status.toLowerCase()];
}
