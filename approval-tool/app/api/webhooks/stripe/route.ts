import { env } from "@/env";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler
 *
 * Handles subscription lifecycle events from Stripe:
 * - checkout.session.completed (new subscription)
 * - customer.subscription.updated (plan change, renewal)
 * - customer.subscription.deleted (cancellation)
 */

export async function POST(request: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    console.warn("Stripe not configured, ignoring webhook");
    return Response.json({ received: true }, { status: 200 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.customer) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id;

          // Find user by email (from metadata or customer email)
          const userEmail =
            session.customer_details?.email ?? session.metadata?.userEmail;

          if (!userEmail) {
            console.error("No email found in checkout session");
            break;
          }

          // Update user with Stripe customer ID and subscription
          await prisma.user.update({
            where: { email: userEmail },
            data: {
              stripeCustomerId: customerId,
              subscriptionTier: "STARTER",
              subscriptionStatus: "active",
            },
          });

          // Subscription activated successfully
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`User not found for customer ${customerId}`);
          break;
        }

        // Update subscription status
        const status =
          subscription.status === "active" ||
          subscription.status === "trialing"
            ? "active"
            : subscription.status === "past_due"
              ? "past_due"
              : "canceled";

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: status,
            subscriptionTier:
              status === "active" || status === "past_due" ? "STARTER" : "FREE",
          },
        });

        // Subscription updated successfully
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`User not found for customer ${customerId}`);
          break;
        }

        // Downgrade to free tier
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: "FREE",
            subscriptionStatus: "canceled",
          },
        });

        // Subscription canceled successfully
        break;
      }

      default:
        // Unhandled event type (no action needed)
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
