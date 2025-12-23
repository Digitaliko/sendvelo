import Image from "next/image";
import type { SocialProofSection as SocialProofSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper } from "../shared/SectionWrapper";
import { StatsGrid } from "../shared/StatsCounter";

interface SocialProofSectionProps {
  data: SocialProofSectionData;
}

export function SocialProofSection({ data }: SocialProofSectionProps) {
  return (
    <SectionWrapper variant="muted" className="py-12 md:py-16">
      <div className="text-center">
        {data.headline && (
          <p className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {data.headline}
          </p>
        )}

        {data.logos && data.logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {data.logos.map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.alt}
                width={logo.width ?? 120}
                height={logo.height ?? 40}
                className="h-8 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        )}

        {data.stats && data.stats.length > 0 && (
          <div className="mt-12">
            <StatsGrid stats={data.stats} variant="inline" />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
