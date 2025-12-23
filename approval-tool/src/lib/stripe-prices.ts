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
  PRO: {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO ?? null,
    name: "Pro",
    price: 15,
    interval: "month" as const,
    reviewsPerMonth: -1,
    features: [
      "Unlimited reviews",
      "Email notifications",
      "Comments & feedback",
      "Priority support",
    ],
  },
} as const;
