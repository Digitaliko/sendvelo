import Image from "next/image";
import type { SolutionSection as SolutionSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { Icon } from "../shared/Icon";

interface SolutionSectionProps {
  data: SolutionSectionData;
}

export function SolutionSection({ data }: SolutionSectionProps) {
  return (
    <SectionWrapper variant="gradient">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* Content */}
        <div>
          <SectionHeader
            headline={data.headline}
            subheadline={data.subheadline}
            alignment="left"
          />

          {data.description && (
            <p className="mb-8 text-muted-foreground">
              {data.description}
            </p>
          )}

          <div className="space-y-6">
            {data.features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={feature.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        {data.image && (
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl border bg-background shadow-2xl">
              <Image
                src={data.image.src}
                alt={data.image.alt}
                width={data.image.width ?? 600}
                height={data.image.height ?? 400}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-xl bg-primary/10" />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
