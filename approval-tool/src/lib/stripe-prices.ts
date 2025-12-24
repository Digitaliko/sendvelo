import { env } from "@/env";

export const STRIPE_PRICES = {
  FREE: {
    id: null,
    name: "Free",
    price: 0,
    interval: null,
    reviewsPerMonth: 5,
    features: [
      "5 reviews/month",
      "Email notifications",
      "Basic support",
    ],
  },
  STARTER: {
    id: env.STRIPE_PRICE_ID_PRO ?? null,
    name: "Starter",
    price: 19,
    interval: "month" as const,
    reviewsPerMonth: -1,
    features: [
      "Unlimited reviews",
      "3 team members",
      "Email notifications",
      "Comments & feedback",
      "Priority support",
    ],
  },
  PRO: {
    id: env.STRIPE_PRICE_ID_PRO ?? null,
    name: "Starter",
    price: 19,
    interval: "month" as const,
    reviewsPerMonth: -1,
    features: [
      "Unlimited reviews",
      "3 team members",
      "Email notifications",
      "Comments & feedback",
      "Priority support",
    ],
  },
  TEAM: {
    id: env.STRIPE_PRICE_ID_TEAM ?? null,
    name: "Team",
    price: 49,
    interval: "month" as const,
    reviewsPerMonth: -1,
    features: [
      "Unlimited reviews",
      "Unlimited team members",
      "Slack integration",
      "Email notifications",
      "Comments & feedback",
      "Priority support",
    ],
  },
  BUSINESS: {
    id: env.STRIPE_PRICE_ID_BUSINESS ?? null,
    name: "Business",
    price: 99,
    interval: "month" as const,
    reviewsPerMonth: -1,
    features: [
      "Unlimited reviews",
      "Unlimited team members",
      "Slack integration",
      "SSO (Single Sign-On)",
      "Advanced audit logs",
      "API access",
      "Dedicated support",
    ],
  },
} as const;

export function getTierFromPriceId(priceId: string): "STARTER" | "TEAM" | "BUSINESS" | null {
  if (priceId === STRIPE_PRICES.STARTER.id) return "STARTER";
  if (priceId === STRIPE_PRICES.TEAM.id) return "TEAM";
  if (priceId === STRIPE_PRICES.BUSINESS.id) return "BUSINESS";
  return null;
}
