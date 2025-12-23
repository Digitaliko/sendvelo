import type { HowItWorksSection as HowItWorksSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { Icon } from "../shared/Icon";
import Image from "next/image";

interface HowItWorksSectionProps {
  data: HowItWorksSectionData;
}

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  return (
    <SectionWrapper id="how-it-works">
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-8 top-0 bottom-0 hidden w-0.5 bg-border lg:left-1/2 lg:block lg:-translate-x-1/2" />

        <div className="space-y-12 lg:space-y-24">
          {data.steps.map((step, index) => (
            <div
              key={step.step}
              className={`relative flex flex-col gap-8 lg:flex-row lg:items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Step number badge */}
              <div className="absolute left-0 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground lg:left-1/2 lg:-translate-x-1/2">
                {step.step}
              </div>

              {/* Content */}
              <div className="ml-24 lg:ml-0 lg:w-1/2 lg:pr-16 lg:pl-16">
                <div className={index % 2 === 1 ? "lg:text-right" : ""}>
                  {step.icon && (
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={step.icon} size={24} />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="ml-24 lg:ml-0 lg:w-1/2">
                {step.image ? (
                  <div className="relative overflow-hidden rounded-xl border bg-muted shadow-lg">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      width={step.image.width ?? 500}
                      height={step.image.height ?? 300}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-xl border bg-muted/50">
                    <span className="text-4xl font-bold text-muted-foreground/30">
                      Step {step.step}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
