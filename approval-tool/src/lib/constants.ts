import type { ReviewStatus, ReviewerStatus, WorkflowType, SubscriptionTier } from "@prisma/client";

export const REVIEW_STATUS: Record<string, ReviewStatus> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  PARTIALLY_APPROVED: "PARTIALLY_APPROVED",
  CANCELED: "CANCELED",
} as const;

export const REVIEWER_STATUS: Record<string, ReviewerStatus> = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
} as const;

export const WORKFLOW_TYPE: Record<string, WorkflowType> = {
  PARALLEL: "PARALLEL",
  SEQUENTIAL: "SEQUENTIAL",
  ANY_ONE: "ANY_ONE",
} as const;

export const SUBSCRIPTION_TIER: Record<string, SubscriptionTier> = {
  FREE: "FREE",
  STARTER: "STARTER",
  TEAM: "TEAM",
  BUSINESS: "BUSINESS",
} as const;

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIER.FREE]: {
    activeReviews: 3,
    teamMembers: 1,
    features: ["Email notifications", "Basic support"],
  },
  [SUBSCRIPTION_TIER.STARTER]: {
    activeReviews: -1,
    teamMembers: 3,
    features: ["Unlimited approvals", "3 team members", "Email notifications", "Priority support"],
  },
  [SUBSCRIPTION_TIER.TEAM]: {
    activeReviews: -1,
    teamMembers: -1,
    features: ["Unlimited approvals", "Unlimited team members", "Slack integration", "Priority support"],
  },
  [SUBSCRIPTION_TIER.BUSINESS]: {
    activeReviews: -1,
    teamMembers: -1,
    features: ["Everything in Team", "SSO", "Audit logs", "API access", "Dedicated support"],
  },
} as const;

export const REVIEW_STATUS_CONFIG: Record<ReviewStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string; label: string }> = {
  APPROVED: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100", label: "Approved" },
  REJECTED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100", label: "Rejected" },
  PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", label: "Pending" },
  PARTIALLY_APPROVED: { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-100", label: "Partial" },
  CHANGES_REQUESTED: { variant: "secondary", className: "bg-orange-100 text-orange-800 hover:bg-orange-100", label: "Changes Requested" },
  CANCELED: { variant: "outline", className: "bg-gray-100 text-gray-800 hover:bg-gray-100", label: "Canceled" },
};

export const REVIEWER_STATUS_CONFIG: Record<ReviewerStatus, { dotColor: string; label: string }> = {
  APPROVED: { dotColor: "bg-green-500", label: "Approved" },
  REJECTED: { dotColor: "bg-red-500", label: "Rejected" },
  PENDING: { dotColor: "bg-gray-300", label: "Pending" },
  CHANGES_REQUESTED: { dotColor: "bg-yellow-500", label: "Changes" },
};

export const STATUS_FILTER_MAP: Record<string, ReviewStatus> = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  changes_requested: "CHANGES_REQUESTED",
  partially_approved: "PARTIALLY_APPROVED",
  canceled: "CANCELED",
};
