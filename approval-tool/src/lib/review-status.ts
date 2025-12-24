import type { ReviewStatus, WorkflowType, ReviewerStatus } from "@prisma/client";
import { REVIEW_STATUS, REVIEWER_STATUS, WORKFLOW_TYPE, STATUS_FILTER_MAP } from "@/lib/constants";

export type ReviewerForStatusCalc = {
  status: ReviewerStatus;
};

export function calculateReviewStatus(
  reviewers: ReviewerForStatusCalc[],
  workflowType: WorkflowType,
  latestDecision?: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
  currentStatus: ReviewStatus = REVIEW_STATUS.PENDING
): ReviewStatus {
  const approved = reviewers.filter((r) => r.status === REVIEWER_STATUS.APPROVED).length;
  const rejected = reviewers.filter((r) => r.status === REVIEWER_STATUS.REJECTED).length;
  const changesRequested = reviewers.filter((r) => r.status === REVIEWER_STATUS.CHANGES_REQUESTED).length;
  const total = reviewers.length;

  if (workflowType === WORKFLOW_TYPE.ANY_ONE) {
    if (latestDecision) {
      return latestDecision;
    }
    if (approved > 0) return REVIEW_STATUS.APPROVED;
    if (rejected > 0) return REVIEW_STATUS.REJECTED;
    if (changesRequested > 0) return REVIEW_STATUS.CHANGES_REQUESTED;
    return currentStatus;
  }

  if (rejected > 0) return REVIEW_STATUS.REJECTED;
  if (changesRequested > 0) return REVIEW_STATUS.CHANGES_REQUESTED;
  if (approved === total && total > 0) return REVIEW_STATUS.APPROVED;
  if (approved > 0) return REVIEW_STATUS.PARTIALLY_APPROVED;

  return currentStatus;
}

export { STATUS_FILTER_MAP };

export function normalizeStatusFilter(status: string | undefined): ReviewStatus | undefined {
  if (!status || status === "all") return undefined;
  return STATUS_FILTER_MAP[status.toLowerCase()];
}
