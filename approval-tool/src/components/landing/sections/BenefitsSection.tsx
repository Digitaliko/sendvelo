import type { BenefitsSection as BenefitsSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { Icon } from "../shared/Icon";

interface BenefitsSectionProps {
  data: BenefitsSectionData;
}

export function BenefitsSection({ data }: BenefitsSectionProps) {
  return (
    <SectionWrapper>
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="grid gap-8 md:grid-cols-3">
        {data.benefits.map((benefit, index) => (
          <div
            key={index}
            className="relative rounded-xl border bg-background p-8 text-center"
          >
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name={benefit.icon} size={28} />
            </div>

            {benefit.stat && (
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">
                  {benefit.stat.prefix}
                  {benefit.stat.value}
                  {benefit.stat.suffix}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {benefit.stat.label}
                </span>
              </div>
            )}

            <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
