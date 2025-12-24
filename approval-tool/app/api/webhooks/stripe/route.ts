import { env } from "@/env";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getTierFromPriceId } from "@/lib/stripe-prices";
import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";
import { captureException } from "@/lib/error-tracking";

const CheckoutSessionSchema = z.object({
  id: z.string(),
  object: z.literal("checkout.session"),
  mode: z.string(),
  customer: z.union([z.string(), z.object({ id: z.string() })]).nullable(),
  customer_details: z.object({ email: z.string().email() }).nullable().optional(),
  metadata: z.record(z.string()).nullable().optional(),
});

const SubscriptionSchema = z.object({
  object: z.literal("subscription"),
  customer: z.union([z.string(), z.object({ id: z.string() })]),
  status: z.string(),
  items: z.object({
    data: z.array(
      z.object({
        price: z.object({ id: z.string() }),
      })
    ),
  }),
});

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
    captureException(
      err instanceof Error ? err : new Error("Webhook signature verification failed"),
      { extra: { hasSignature: !!signature } }
    );
    return Response.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sessionResult = CheckoutSessionSchema.safeParse(event.data.object);
        if (!sessionResult.success) {
          captureException(new Error("Invalid checkout session data"), {
            extra: { errors: sessionResult.error.errors, event: event.type },
          });
          break;
        }

        const session = sessionResult.data;
        if (session.mode === "subscription" && session.customer) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id;

          const userEmail =
            session.customer_details?.email ?? session.metadata?.userEmail;

          if (!userEmail) {
            captureException(new Error("No email found in checkout session"), {
              extra: { sessionId: session.id },
            });
            break;
          }

          const lineItems = await stripe?.checkout.sessions.listLineItems(session.id);
          const priceId = lineItems?.data[0]?.price?.id;

          if (!priceId) {
            captureException(new Error("No price ID found in checkout session"), {
              extra: { sessionId: session.id },
            });
            break;
          }

          const tier = getTierFromPriceId(priceId);

          if (!tier) {
            captureException(new Error("Unknown price ID"), {
              extra: { priceId, sessionId: session.id },
            });
            break;
          }

          await prisma.user.update({
            where: { email: userEmail },
            data: {
              stripeCustomerId: customerId,
              subscriptionTier: tier,
              subscriptionStatus: "active",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscriptionResult = SubscriptionSchema.safeParse(event.data.object);
        if (!subscriptionResult.success) {
          captureException(new Error("Invalid subscription data"), {
            extra: { errors: subscriptionResult.error.errors, event: event.type },
          });
          break;
        }

        const subscription = subscriptionResult.data;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          captureException(new Error("User not found for customer"), {
            extra: { customerId },
          });
          break;
        }

        const status =
          subscription.status === "active" ||
          subscription.status === "trialing"
            ? "active"
            : subscription.status === "past_due"
              ? "past_due"
              : "canceled";

        const priceId = subscription.items.data[0]?.price.id;
        let tier: "STARTER" | "TEAM" | "BUSINESS" | "FREE" = "FREE";

        if (priceId && (status === "active" || status === "past_due")) {
          const mappedTier = getTierFromPriceId(priceId);
          tier = mappedTier ?? "STARTER";
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: status,
            subscriptionTier: tier,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionResult = SubscriptionSchema.safeParse(event.data.object);
        if (!subscriptionResult.success) {
          captureException(new Error("Invalid subscription data"), {
            extra: { errors: subscriptionResult.error.errors, event: event.type },
          });
          break;
        }

        const subscription = subscriptionResult.data;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          captureException(new Error("User not found for customer"), {
            extra: { customerId },
          });
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: "FREE",
            subscriptionStatus: "canceled",
          },
        });
        break;
      }

      default:
    }

    return Response.json({ received: true });
  } catch (error) {
    captureException(
      error instanceof Error ? error : new Error("Webhook handler failed"),
      { extra: { eventType: event.type } }
    );
    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
