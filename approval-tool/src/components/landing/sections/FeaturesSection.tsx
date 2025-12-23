import type { FeaturesSection as FeaturesSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { FeatureGrid } from "../shared/FeatureCard";

interface FeaturesSectionProps {
  data: FeaturesSectionData;
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const columnMap = {
    "grid-3": 3 as const,
    "grid-2": 2 as const,
    list: 2 as const,
  };

  return (
    <SectionWrapper id="features" variant="muted">
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />
      <FeatureGrid
        features={data.features}
        columns={columnMap[data.layout ?? "grid-3"]}
        variant="bordered"
      />
    </SectionWrapper>
  );
}
