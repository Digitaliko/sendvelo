import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Feature } from "@/config/landing-pages/schema";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  feature: Feature;
  className?: string;
  variant?: "default" | "bordered" | "filled";
}

export function FeatureCard({
  feature,
  className,
  variant = "default",
}: FeatureCardProps) {
  const variantStyles = {
    default: "bg-background",
    bordered: "bg-background border border-border",
    filled: "bg-muted/50",
  };

  const content = (
    <div
      className={cn(
        "group rounded-xl p-6 transition-all",
        variantStyles[variant],
        feature.link && "hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon name={feature.icon} size={24} />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
      {feature.link && (
        <div className="mt-4 flex items-center text-sm font-medium text-primary">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );

  if (feature.link) {
    return <Link href={feature.link}>{content}</Link>;
  }

  return content;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "bordered" | "filled";
}

export function FeatureGrid({
  features,
  columns = 3,
  variant = "bordered",
}: FeatureGridProps) {
  const columnStyles = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", columnStyles[columns])}>
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} variant={variant} />
      ))}
    </div>
  );
}
