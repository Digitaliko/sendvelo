import { z } from "zod";

/**
 * Slack Interaction Payload Schema
 * Validates incoming webhook payloads from Slack interactions.
 */
export const SlackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().optional(),
  team_id: z.string().optional(),
});

export const SlackActionSchema = z.object({
  action_id: z.string(),
  block_id: z.string().optional(),
  value: z.string(),
  type: z.string().optional(),
});

export const SlackInteractionPayloadSchema = z.object({
  type: z.enum(["block_actions", "view_submission", "shortcut"]),
  user: SlackUserSchema,
  trigger_id: z.string().optional(),
  actions: z.array(SlackActionSchema).optional(),
  response_url: z.string().optional(),
  message: z
    .object({
      ts: z.string(),
      text: z.string().optional(),
    })
    .optional(),
});

export type SlackInteractionPayload = z.infer<typeof SlackInteractionPayloadSchema>;

/**
 * Slack Action Value Schema
 * For the JSON embedded in action.value
 */
export const SlackReviewActionValueSchema = z.object({
  reviewId: z.string(),
  reviewerEmail: z.string().email(),
});

export type SlackReviewActionValue = z.infer<typeof SlackReviewActionValueSchema>;

/**
 * Stripe Webhook Event Schema (simplified)
 * Full validation happens via Stripe SDK, this is for type safety.
 */
export const StripeWebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
  livemode: z.boolean(),
  created: z.number(),
});

export type StripeWebhookEvent = z.infer<typeof StripeWebhookEventSchema>;

/**
 * Stripe Checkout Session Schema
 */
export const StripeCheckoutSessionSchema = z.object({
  id: z.string(),
  customer: z.string().nullable().optional(),
  subscription: z.string().nullable().optional(),
  metadata: z
    .object({
      userId: z.string().optional(),
    })
    .optional(),
});

export type StripeCheckoutSession = z.infer<typeof StripeCheckoutSessionSchema>;

/**
 * Stripe Subscription Schema
 */
export const StripeSubscriptionSchema = z.object({
  id: z.string(),
  customer: z.string(),
  status: z.enum([
    "active",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "paused",
    "trialing",
    "unpaid",
  ]),
  items: z.object({
    data: z.array(
      z.object({
        price: z.object({
          id: z.string(),
        }),
      })
    ),
  }),
  metadata: z
    .object({
      userId: z.string().optional(),
    })
    .optional(),
});

export type StripeSubscription = z.infer<typeof StripeSubscriptionSchema>;
