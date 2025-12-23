import Link from "next/link";
import { Check } from "lucide-react";
import type { PricingSection as PricingSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  data: PricingSectionData;
}

const pricingTiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying Thumbway",
    features: [
      "5 reviews per month",
      "Email notifications",
      "ChatGPT integration",
      "Basic engagement tracking",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "For solo professionals",
    features: [
      "Unlimited reviews",
      "Everything in Free",
      "Priority email support",
      "Comments on reviews",
      "Advanced engagement tracking",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For growing teams",
    features: [
      "Everything in Starter",
      "Unlimited team members",
      "Slack integration",
      "Team analytics",
      "Auto-reminders",
      "Sequential approvals",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=team",
  },
  {
    id: "business",
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For agencies & enterprises",
    features: [
      "Everything in Team",
      "SSO/SAML",
      "Audit logs",
      "API access",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export function PricingSection({ data }: PricingSectionProps) {
  const highlightedTier = data.highlightedTier ?? "starter";

  return (
    <SectionWrapper id="pricing">
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="grid gap-8 lg:grid-cols-4">
        {pricingTiers.map((tier) => {
          const isHighlighted = tier.id === highlightedTier;

          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-6",
                isHighlighted
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "bg-background"
              )}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isHighlighted ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
