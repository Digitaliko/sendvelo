import type { Stat } from "@/config/landing-pages/schema";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  stat: Stat;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatsCounter({
  stat,
  className,
  size = "md",
}: StatsCounterProps) {
  const sizeStyles = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl lg:text-6xl",
  };

  return (
    <div className={cn("text-center", className)}>
      <div className={cn("font-bold tracking-tight", sizeStyles[size])}>
        {stat.prefix}
        {stat.value}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
    </div>
  );
}

interface StatsGridProps {
  stats: Stat[];
  className?: string;
  variant?: "inline" | "grid";
}

export function StatsGrid({
  stats,
  className,
  variant = "inline",
}: StatsGridProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap justify-center gap-8 lg:gap-16", className)}>
        {stats.map((stat, index) => (
          <StatsCounter key={index} stat={stat} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-8 md:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatsCounter key={index} stat={stat} />
      ))}
    </div>
  );
}
