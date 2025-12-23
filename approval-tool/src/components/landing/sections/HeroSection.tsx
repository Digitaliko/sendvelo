import Link from "next/link";
import Image from "next/image";
import type { HeroSection as HeroSectionData } from "@/config/landing-pages/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsGrid } from "../shared/StatsCounter";
import { Icon } from "../shared/Icon";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  data: HeroSectionData;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {data.badge && (
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm font-medium"
              >
                {data.badge}
              </Badge>
            )}

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {data.headline}
              {data.highlightedText && (
                <>
                  <br />
                  <span className="text-primary">{data.highlightedText}</span>
                </>
              )}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0">
              {data.subheadline}
            </p>

            {data.description && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {data.description}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className={cn(
                  "h-12 px-8 text-base",
                  data.primaryCta.variant === "primary" && "shadow-lg shadow-primary/25"
                )}
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
                  className="h-12 px-8 text-base"
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

            {data.stats && data.stats.length > 0 && (
              <div className="mt-12">
                <StatsGrid stats={data.stats} variant="inline" />
              </div>
            )}
          </div>

          {/* Image/Video */}
          {(data.image || data.videoUrl) && (
            <div className="relative">
              {data.image && !data.videoUrl && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl border">
                  <Image
                    src={data.image.src}
                    alt={data.image.alt}
                    width={data.image.width ?? 600}
                    height={data.image.height ?? 400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              )}

              {data.videoUrl && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl border aspect-video">
                  <iframe
                    src={data.videoUrl}
                    title="Product demo video"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-xl bg-primary/10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
