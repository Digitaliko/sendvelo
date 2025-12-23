import { z } from "zod";

// Icon names from Lucide React
export const iconSchema = z.enum([
  "Zap",
  "Clock",
  "CheckCircle",
  "Users",
  "Shield",
  "Smartphone",
  "Mail",
  "MessageSquare",
  "BarChart",
  "Lock",
  "Globe",
  "Star",
  "ThumbsUp",
  "Send",
  "Eye",
  "Bell",
  "Settings",
  "Briefcase",
  "FileText",
  "Target",
  "TrendingUp",
  "Award",
  "Layers",
  "RefreshCw",
  "Link",
  "Check",
  "X",
  "ArrowRight",
  "Play",
  "Calendar",
  "DollarSign",
  "Percent",
  "AlertCircle",
  "Info",
  "HelpCircle",
  "ChevronDown",
  "ChevronRight",
  "ExternalLink",
  "Download",
  "Upload",
  "Share2",
  "Copy",
  "Edit",
  "Trash",
  "Plus",
  "Minus",
  "Search",
  "Filter",
  "SortAsc",
  "SortDesc",
  "Grid",
  "List",
  "LayoutGrid",
  "Columns",
  "Rows",
  "Table",
  "PieChart",
  "LineChart",
  "Activity",
  "Gauge",
  "Rocket",
  "Sparkles",
  "Wand2",
  "Bot",
  "MessageCircle",
  "MessagesSquare",
  "Inbox",
  "Archive",
  "FolderOpen",
  "FileCheck",
  "FilePlus",
  "FileX",
  "Paperclip",
  "Image",
  "Video",
  "Mic",
  "Volume2",
  "Headphones",
  "Monitor",
  "Laptop",
  "Tablet",
  "Phone",
  "Wifi",
  "Cloud",
  "Database",
  "Server",
  "Code",
  "Terminal",
  "GitBranch",
  "Github",
  "Slack",
  "Chrome",
  "Figma",
]);

export type IconName = z.infer<typeof iconSchema>;

// Reusable component schemas
const ctaButtonSchema = z.object({
  text: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
  icon: iconSchema.optional(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string(),
  image: imageSchema.optional(),
  rating: z.number().min(1).max(5).optional(),
});

const featureSchema = z.object({
  icon: iconSchema,
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const statSchema = z.object({
  value: z.string(),
  label: z.string(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

const comparisonRowSchema = z.object({
  feature: z.string(),
  thumbway: z.union([z.boolean(), z.string()]),
  competitor: z.union([z.boolean(), z.string()]),
});

const problemItemSchema = z.object({
  icon: iconSchema,
  title: z.string(),
  description: z.string(),
});

const stepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: iconSchema.optional(),
  image: imageSchema.optional(),
});

const benefitSchema = z.object({
  icon: iconSchema,
  title: z.string(),
  description: z.string(),
  stat: statSchema.optional(),
});

// Section schemas
const heroSectionSchema = z.object({
  badge: z.string().optional(),
  headline: z.string(),
  highlightedText: z.string().optional(),
  subheadline: z.string(),
  description: z.string().optional(),
  primaryCta: ctaButtonSchema,
  secondaryCta: ctaButtonSchema.optional(),
  image: imageSchema.optional(),
  videoUrl: z.string().optional(),
  stats: z.array(statSchema).optional(),
});

const problemSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    problems: z.array(problemItemSchema),
  })
  .optional();

const solutionSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    features: z.array(featureSchema),
  })
  .optional();

const featuresSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    features: z.array(featureSchema),
    layout: z.enum(["grid-3", "grid-2", "list"]).default("grid-3"),
  })
  .optional();

const howItWorksSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    steps: z.array(stepSchema),
  })
  .optional();

const benefitsSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    benefits: z.array(benefitSchema),
  })
  .optional();

const socialProofSectionSchema = z
  .object({
    headline: z.string().optional(),
    logos: z.array(imageSchema).optional(),
    stats: z.array(statSchema).optional(),
  })
  .optional();

const testimonialsSectionSchema = z
  .object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    testimonials: z.array(testimonialSchema),
  })
  .optional();

const pricingSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    highlightedTier: z.enum(["free", "starter", "team", "business"]).optional(),
    showAnnualToggle: z.boolean().optional(),
  })
  .optional();

const comparisonSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    competitorName: z.string(),
    competitorLogo: imageSchema.optional(),
    rows: z.array(comparisonRowSchema),
    conclusion: z.string().optional(),
  })
  .optional();

const faqSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    faqs: z.array(faqSchema),
  })
  .optional();

const ctaSectionSchema = z
  .object({
    headline: z.string(),
    subheadline: z.string().optional(),
    primaryCta: ctaButtonSchema,
    secondaryCta: ctaButtonSchema.optional(),
    trustBadges: z.array(z.string()).optional(),
  })
  .optional();

// SEO Schema
const seoSchema = z.object({
  title: z.string().max(70),
  description: z.string().max(160),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogImage: imageSchema.optional(),
  noIndex: z.boolean().optional(),
  structuredData: z
    .object({
      type: z.enum(["SoftwareApplication", "WebPage", "FAQPage", "Product"]),
      aggregateRating: z
        .object({
          ratingValue: z.number(),
          reviewCount: z.number(),
        })
        .optional(),
    })
    .optional(),
});

// Sections object schema
const sectionsSchema = z.object({
  hero: heroSectionSchema,
  problem: problemSectionSchema,
  solution: solutionSectionSchema,
  features: featuresSectionSchema,
  howItWorks: howItWorksSectionSchema,
  benefits: benefitsSectionSchema,
  socialProof: socialProofSectionSchema,
  testimonials: testimonialsSectionSchema,
  pricing: pricingSectionSchema,
  comparison: comparisonSectionSchema,
  faq: faqSectionSchema,
  cta: ctaSectionSchema,
});

// Section order type
const sectionKeySchema = z.enum([
  "hero",
  "problem",
  "solution",
  "features",
  "howItWorks",
  "benefits",
  "socialProof",
  "testimonials",
  "pricing",
  "comparison",
  "faq",
  "cta",
]);

// Landing page category
export const landingPageCategorySchema = z.enum([
  "solution",
  "audience",
  "use-case",
  "industry",
  "integration",
  "comparison",
  "feature",
]);

export type LandingPageCategory = z.infer<typeof landingPageCategorySchema>;

// Main landing page schema
export const landingPageSchema = z.object({
  slug: z.string(),
  category: landingPageCategorySchema,
  status: z.enum(["draft", "published", "archived"]).default("published"),
  priority: z.number().min(0).max(1).default(0.7),
  lastModified: z.string().datetime().optional(),
  seo: seoSchema,
  sections: sectionsSchema,
  sectionOrder: z.array(sectionKeySchema).optional(),
});

// Export types
export type LandingPageConfig = z.infer<typeof landingPageSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type ProblemSection = NonNullable<z.infer<typeof problemSectionSchema>>;
export type SolutionSection = NonNullable<z.infer<typeof solutionSectionSchema>>;
export type FeaturesSection = NonNullable<z.infer<typeof featuresSectionSchema>>;
export type HowItWorksSection = NonNullable<z.infer<typeof howItWorksSectionSchema>>;
export type BenefitsSection = NonNullable<z.infer<typeof benefitsSectionSchema>>;
export type SocialProofSection = NonNullable<z.infer<typeof socialProofSectionSchema>>;
export type TestimonialsSection = NonNullable<z.infer<typeof testimonialsSectionSchema>>;
export type PricingSection = NonNullable<z.infer<typeof pricingSectionSchema>>;
export type ComparisonSection = NonNullable<z.infer<typeof comparisonSectionSchema>>;
export type FAQSection = NonNullable<z.infer<typeof faqSectionSchema>>;
export type CTASection = NonNullable<z.infer<typeof ctaSectionSchema>>;
export type SEOConfig = z.infer<typeof seoSchema>;
export type CTAButton = z.infer<typeof ctaButtonSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type Stat = z.infer<typeof statSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Benefit = z.infer<typeof benefitSchema>;
export type ComparisonRow = z.infer<typeof comparisonRowSchema>;
export type SectionKey = z.infer<typeof sectionKeySchema>;
