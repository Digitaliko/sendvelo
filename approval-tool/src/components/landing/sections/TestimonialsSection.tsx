import Image from "next/image";
import { Star } from "lucide-react";
import type { TestimonialsSection as TestimonialsSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";

interface TestimonialsSectionProps {
  data: TestimonialsSectionData;
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <SectionWrapper variant="muted">
      <SectionHeader
        headline={data.headline ?? "What Our Customers Say"}
        subheadline={data.subheadline}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col rounded-xl border bg-background p-6"
          >
            {/* Rating */}
            {testimonial.rating && (
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Quote */}
            <blockquote className="flex-1 text-muted-foreground">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="mt-6 flex items-center gap-4">
              {testimonial.image ? (
                <Image
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
