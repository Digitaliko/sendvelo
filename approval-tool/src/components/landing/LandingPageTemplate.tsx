import type { LandingPageConfig, SectionKey } from "@/config/landing-pages/schema";
import { defaultSectionOrder } from "@/config/landing-pages";
import { LandingLayout } from "./layouts/LandingLayout";
import * as Sections from "./sections";

interface LandingPageTemplateProps {
  config: LandingPageConfig;
}

const sectionComponents: Record<SectionKey, React.ComponentType<{ data: unknown }>> = {
  hero: Sections.HeroSection as React.ComponentType<{ data: unknown }>,
  problem: Sections.ProblemSection as React.ComponentType<{ data: unknown }>,
  solution: Sections.SolutionSection as React.ComponentType<{ data: unknown }>,
  features: Sections.FeaturesSection as React.ComponentType<{ data: unknown }>,
  howItWorks: Sections.HowItWorksSection as React.ComponentType<{ data: unknown }>,
  benefits: Sections.BenefitsSection as React.ComponentType<{ data: unknown }>,
  socialProof: Sections.SocialProofSection as React.ComponentType<{ data: unknown }>,
  testimonials: Sections.TestimonialsSection as React.ComponentType<{ data: unknown }>,
  pricing: Sections.PricingSection as React.ComponentType<{ data: unknown }>,
  comparison: Sections.ComparisonSection as React.ComponentType<{ data: unknown }>,
  faq: Sections.FAQSection as React.ComponentType<{ data: unknown }>,
  cta: Sections.CTASection as React.ComponentType<{ data: unknown }>,
};

export function LandingPageTemplate({ config }: LandingPageTemplateProps) {
  const { sections, sectionOrder } = config;

  // Use custom section order if provided, otherwise use default
  const order = sectionOrder ?? defaultSectionOrder;

  return (
    <LandingLayout>
      {order.map((sectionKey) => {
        const sectionData = sections[sectionKey];

        // Skip if section data is not defined
        if (!sectionData) return null;

        const SectionComponent = sectionComponents[sectionKey];

        if (!SectionComponent) {
          console.warn(`Section component not found for key: ${sectionKey}`);
          return null;
        }

        return <SectionComponent key={sectionKey} data={sectionData} />;
      })}
    </LandingLayout>
  );
}
