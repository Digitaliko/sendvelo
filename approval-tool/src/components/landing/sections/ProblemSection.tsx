import type { ProblemSection as ProblemSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { Icon } from "../shared/Icon";

interface ProblemSectionProps {
  data: ProblemSectionData;
}

export function ProblemSection({ data }: ProblemSectionProps) {
  return (
    <SectionWrapper>
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="grid gap-8 md:grid-cols-3">
        {data.problems.map((problem, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-destructive/20 bg-destructive/5 p-6"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Icon name={problem.icon} size={24} />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{problem.title}</h3>
            <p className="text-muted-foreground">{problem.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
