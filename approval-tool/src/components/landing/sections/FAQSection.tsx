"use client";

import type { FAQSection as FAQSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  data: FAQSectionData;
}

export function FAQSection({ data }: FAQSectionProps) {
  return (
    <SectionWrapper id="faq" variant="muted" size="narrow">
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
        {data.faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg border bg-background px-6"
          >
            <AccordionTrigger className="hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
