import { Check, X } from "lucide-react";
import Image from "next/image";
import type { ComparisonSection as ComparisonSectionData } from "@/config/landing-pages/schema";
import { SectionWrapper, SectionHeader } from "../shared/SectionWrapper";
import { cn } from "@/lib/utils";

interface ComparisonSectionProps {
  data: ComparisonSectionData;
}

export function ComparisonSection({ data }: ComparisonSectionProps) {
  return (
    <SectionWrapper>
      <SectionHeader
        headline={data.headline}
        subheadline={data.subheadline}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4 text-left font-medium">Feature</th>
              <th className="border-b p-4 text-center font-medium">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">T</span>
                  </div>
                  <span>Thumbway</span>
                </div>
              </th>
              <th className="border-b p-4 text-center font-medium">
                <div className="flex items-center justify-center gap-2">
                  {data.competitorLogo ? (
                    <Image
                      src={data.competitorLogo.src}
                      alt={data.competitorLogo.alt}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                      <span className="text-sm font-bold text-muted-foreground">
                        {data.competitorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span>{data.competitorName}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                <td className="border-b p-4 text-sm">{row.feature}</td>
                <td className="border-b p-4 text-center">
                  <ComparisonValue value={row.thumbway} variant="thumbway" />
                </td>
                <td className="border-b p-4 text-center">
                  <ComparisonValue value={row.competitor} variant="competitor" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.conclusion && (
        <div className="mt-8 rounded-lg border bg-primary/5 p-6 text-center">
          <p className="text-lg font-medium">{data.conclusion}</p>
        </div>
      )}
    </SectionWrapper>
  );
}

function ComparisonValue({
  value,
  variant,
}: {
  value: boolean | string;
  variant: "thumbway" | "competitor";
}) {
  if (typeof value === "boolean") {
    if (value) {
      return (
        <div
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full",
            variant === "thumbway" ? "bg-green-100 text-green-600" : "bg-muted"
          )}
        >
          <Check className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <X className="h-4 w-4" />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "text-sm",
        variant === "thumbway" ? "font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  );
}
