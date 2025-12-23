import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "gradient" | "dark";
  size?: "default" | "narrow" | "wide";
}

export function SectionWrapper({
  children,
  className,
  id,
  variant = "default",
  size = "default",
}: SectionWrapperProps) {
  const variantStyles = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient: "bg-gradient-to-b from-primary/5 via-background to-background",
    dark: "bg-primary text-primary-foreground",
  };

  const sizeStyles = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    wide: "max-w-[1400px]",
  };

  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-32",
        variantStyles[variant],
        className
      )}
    >
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizeStyles[size])}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  headline: string;
  subheadline?: string;
  className?: string;
  alignment?: "left" | "center";
}

export function SectionHeader({
  headline,
  subheadline,
  className,
  alignment = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        alignment === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {headline}
      </h2>
      {subheadline && (
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          {subheadline}
        </p>
      )}
    </div>
  );
}
