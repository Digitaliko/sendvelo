import Link from "next/link";
import { Check } from "lucide-react";
import type { CTASection as CTASectionData } from "@/config/landing-pages/schema";
import { Button } from "@/components/ui/button";
import { Icon } from "../shared/Icon";

interface CTASectionProps {
  data: CTASectionData;
}

export function CTASection({ data }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          {data.headline}
        </h2>

        {data.subheadline && (
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {data.subheadline}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base shadow-lg"
            asChild
          >
            <Link href={data.primaryCta.href}>
              {data.primaryCta.icon && (
                <Icon name={data.primaryCta.icon} size={20} className="mr-2" />
              )}
              {data.primaryCta.text}
            </Link>
          </Button>

          {data.secondaryCta && (
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href={data.secondaryCta.href}>
                {data.secondaryCta.icon && (
                  <Icon name={data.secondaryCta.icon} size={20} className="mr-2" />
                )}
                {data.secondaryCta.text}
              </Link>
            </Button>
          )}
        </div>

        {data.trustBadges && data.trustBadges.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/70">
            {data.trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
