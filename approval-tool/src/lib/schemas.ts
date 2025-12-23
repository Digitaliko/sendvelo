import { z } from "zod";

export const WorkflowTypeSchema = z.enum(["PARALLEL", "SEQUENTIAL", "ANY_ONE"]);
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>;

export const ReviewStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CHANGES_REQUESTED",
  "PARTIALLY_APPROVED",
  "CANCELED",
]);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const ReviewerStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CHANGES_REQUESTED",
]);
export type ReviewerStatus = z.infer<typeof ReviewerStatusSchema>;

export const ContentFormatSchema = z.enum(["PLAIN_TEXT", "MARKDOWN", "HTML"]);
export type ContentFormat = z.infer<typeof ContentFormatSchema>;

export const DecisionSchema = z.enum(["approved", "rejected", "changes_requested"]);
export type Decision = z.infer<typeof DecisionSchema>;

export const DecisionUpperSchema = z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]);
export type DecisionUpper = z.infer<typeof DecisionUpperSchema>;

export const ReviewersEmailSchema = z.array(z.string().email()).min(1).max(10);

export const CreateReviewInputSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  reviewers: ReviewersEmailSchema,
  workflowType: WorkflowTypeSchema.default("PARALLEL"),
  organizationId: z.string().optional(),
  contentFormat: ContentFormatSchema.default("MARKDOWN"),
});
export type CreateReviewInput = z.infer<typeof CreateReviewInputSchema>;

export const SubmitDecisionInputSchema = z.object({
  slug: z.string(),
  token: z.string(),
  decision: DecisionSchema,
  comments: z.string().max(5000).optional(),
});
export type SubmitDecisionInput = z.infer<typeof SubmitDecisionInputSchema>;

export const EmailDecisionSchema = z.enum(["APPROVED", "REJECTED"]);
export type EmailDecision = z.infer<typeof EmailDecisionSchema>;

export const SubmitDecisionFromEmailInputSchema = z.object({
  reviewId: z.string(),
  reviewerId: z.string(),
  token: z.string(),
  decision: EmailDecisionSchema,
});
export type SubmitDecisionFromEmailInput = z.infer<typeof SubmitDecisionFromEmailInputSchema>;

export const GetMyReviewsInputSchema = z.object({
  status: z.enum(["all", "pending", "approved", "rejected", "changes_requested"]).optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
}).optional();
export type GetMyReviewsInput = z.infer<typeof GetMyReviewsInputSchema>;

export const GetBySlugInputSchema = z.object({
  slug: z.string(),
  token: z.string().optional(),
});
export type GetBySlugInput = z.infer<typeof GetBySlugInputSchema>;

export const AddCommentInputSchema = z.object({
  slug: z.string(),
  token: z.string().optional(),
  content: z.string().min(1).max(5000),
});
export type AddCommentInput = z.infer<typeof AddCommentInputSchema>;

export const StatusFilterSchema = z.enum([
  "all",
  "pending",
  "approved",
  "rejected",
  "changes_requested",
]);
export type StatusFilter = z.infer<typeof StatusFilterSchema>;

// Auth Schemas
export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type SignInInput = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignUpInput = z.infer<typeof SignUpSchema>;

// Share Modal Schemas
export const PublicAccessLevelSchema = z.enum([
  "NONE",
  "VIEW_ONLY",
  "VIEW_COMMENT",
  "FULL_ACCESS",
]);
export type PublicAccessLevel = z.infer<typeof PublicAccessLevelSchema>;

export const UpdatePublicAccessInputSchema = z.object({
  reviewId: z.string(),
  accessLevel: PublicAccessLevelSchema,
});
export type UpdatePublicAccessInput = z.infer<typeof UpdatePublicAccessInputSchema>;

export const AddReviewersInputSchema = z.object({
  reviewId: z.string(),
  emails: z.array(z.string().email()).min(1).max(10),
});
export type AddReviewersInput = z.infer<typeof AddReviewersInputSchema>;

export const RemoveReviewerInputSchema = z.object({
  reviewId: z.string(),
  reviewerId: z.string(),
});
export type RemoveReviewerInput = z.infer<typeof RemoveReviewerInputSchema>;

export const ResendInvitationInputSchema = z.object({
  reviewId: z.string(),
  reviewerId: z.string(),
});
export type ResendInvitationInput = z.infer<typeof ResendInvitationInputSchema>;

export const GetShareDetailsInputSchema = z.object({
  reviewId: z.string(),
});
export type GetShareDetailsInput = z.infer<typeof GetShareDetailsInputSchema>;
