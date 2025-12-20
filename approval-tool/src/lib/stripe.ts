import Stripe from "stripe";
import { env } from "@/env";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    })
  : null;

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
    id: env.STRIPE_PRICE_ID_PRO, // Set this in .env after creating in Stripe
    name: "Pro",
    price: 15,
    interval: "month" as const,
    reviewsPerMonth: -1, // unlimited
    features: [
      "Unlimited reviews",
      "Email notifications",
      "Comments & feedback",
      "Priority support",
    ],
  },
} as const;

export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  return await stripe.subscriptions.cancel(subscriptionId);
}
