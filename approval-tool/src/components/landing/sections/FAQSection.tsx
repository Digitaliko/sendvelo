"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQSection as FAQSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  data: FAQSectionData;
}

export function FAQSection({ data }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="faq" variant="muted" size="narrow">
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="space-y-4">
        {data.faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border bg-background"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-4 text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="px-6 pb-4 text-muted-foreground">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
