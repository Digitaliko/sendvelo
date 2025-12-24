import {
  type LandingPageConfig,
  type LandingPageCategory,
  landingPageSchema,
} from "./schema";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

// Registry to hold all landing page configs by locale
const landingPageRegistry: Map<string, LandingPageConfig> = new Map();

// Create a registry key with locale support
function createRegistryKey(
  locale: Locale,
  category: LandingPageCategory,
  slug: string
): string {
  return `${locale}:${category}:${slug}`;
}

// Register a landing page config for a specific locale
export function registerLandingPage(
  config: LandingPageConfig,
  locale: Locale = defaultLocale
): void {
  const key = createRegistryKey(locale, config.category, config.slug);
  const validated = landingPageSchema.parse(config);
  landingPageRegistry.set(key, validated);
}

// Get a landing page by category, slug, and locale (with fallback to default locale)
export function getLandingPageBySlug(
  category: LandingPageCategory,
  slug: string,
  locale: Locale = defaultLocale
): LandingPageConfig | undefined {
  // First try locale-specific config
  const localeKey = createRegistryKey(locale, category, slug);
  const localeConfig = landingPageRegistry.get(localeKey);
  if (localeConfig) return localeConfig;

  // Fall back to default locale
  if (locale !== defaultLocale) {
    const defaultKey = createRegistryKey(defaultLocale, category, slug);
    return landingPageRegistry.get(defaultKey);
  }

  return undefined;
}

// Get all landing pages for a specific locale
export function getAllLandingPages(locale: Locale = defaultLocale): LandingPageConfig[] {
  const prefix = `${locale}:`;
  const defaultPrefix = `${defaultLocale}:`;
  const results = new Map<string, LandingPageConfig>();

  // First add all default locale configs
  for (const [key, config] of landingPageRegistry) {
    if (key.startsWith(defaultPrefix)) {
      const categorySlug = key.slice(defaultPrefix.length);
      results.set(categorySlug, config);
    }
  }

  // Then override with locale-specific configs if available
  if (locale !== defaultLocale) {
    for (const [key, config] of landingPageRegistry) {
      if (key.startsWith(prefix)) {
        const categorySlug = key.slice(prefix.length);
        results.set(categorySlug, config);
      }
    }
  }

  return Array.from(results.values());
}

// Get all landing pages by category for a specific locale
export function getLandingPagesByCategory(
  category: LandingPageCategory,
  locale: Locale = defaultLocale
): LandingPageConfig[] {
  return getAllLandingPages(locale).filter((page) => page.category === category);
}

// Get all slugs for a category (for generateStaticParams)
export function getLandingPageSlugs(category: LandingPageCategory): string[] {
  // Return unique slugs from default locale (all locales have same slugs)
  return getLandingPagesByCategory(category, defaultLocale).map((page) => page.slug);
}

// Get all published landing pages for a specific locale
export function getPublishedLandingPages(locale: Locale = defaultLocale): LandingPageConfig[] {
  return getAllLandingPages(locale).filter((page) => page.status === "published");
}

// Get URL path for a landing page
export function getLandingPagePath(config: LandingPageConfig): string {
  const pathMap: Record<LandingPageCategory, string> = {
    solution: `/solutions/${config.slug}`,
    audience: `/for/${config.slug}`,
    "use-case": `/use-cases/${config.slug}`,
    industry: `/industries/${config.slug}`,
    integration: `/integrations/${config.slug}`,
    comparison: `/vs/${config.slug}`,
    feature: `/features/${config.slug}`,
  };
  return pathMap[config.category];
}

// Category to URL prefix mapping
export const categoryPathPrefixes: Record<LandingPageCategory, string> = {
  solution: "/solutions",
  audience: "/for",
  "use-case": "/use-cases",
  industry: "/industries",
  integration: "/integrations",
  comparison: "/vs",
  feature: "/features",
};

// Default section order
export const defaultSectionOrder = [
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
] as const;

// Get available locales for landing pages
export function getAvailableLocales(): Locale[] {
  return [...locales];
}

// Re-export schema types
export * from "./schema";

// Import and register all landing page configs (default locale - English)
// Audiences
import { freelancers } from "./audiences/freelancers";
import { marketingTeams } from "./audiences/marketing-teams";
import { salesTeams } from "./audiences/sales-teams";
import { agencies } from "./audiences/agencies";
import { consultants } from "./audiences/consultants";
import { smallBusiness } from "./audiences/small-business";
import { startups } from "./audiences/startups";
import { enterprise } from "./audiences/enterprise";
import { remoteTeams } from "./audiences/remote-teams";
import { solopreneurs } from "./audiences/solopreneurs";

// Solutions
import { contentApprovalWorkflow } from "./solutions/content-approval-workflow";
import { documentApprovalWorkflow } from "./solutions/document-approval-workflow";
import { approvalWorkflowSoftware } from "./solutions/approval-workflow-software";
import { clientApprovalProcess } from "./solutions/client-approval-process";
import { speedUpApprovalProcess } from "./solutions/speed-up-approval-process";
import { multiStakeholderApproval } from "./solutions/multi-stakeholder-approval";
import { approvalBottleneck } from "./solutions/approval-bottleneck";
import { emailApprovalChaos } from "./solutions/email-approval-chaos";
import { clientGhosting } from "./solutions/client-ghosting";
import { proposalTracking } from "./solutions/proposal-tracking";
import { contentReviewWorkflow } from "./solutions/content-review-workflow";
import { aiContentGovernance } from "./solutions/ai-content-governance";

// Use Cases
import { chatgptProposals } from "./use-cases/chatgpt-proposals";
import { blogPostApproval } from "./use-cases/blog-post-approval";
import { socialMediaApproval } from "./use-cases/social-media-approval";

// Industries
import { technology } from "./industries/technology";

// Integrations
import { chatgpt } from "./integrations/chatgpt";
import { slack } from "./integrations/slack";
import { email as emailIntegration } from "./integrations/email";

// Comparisons
import { email as vsEmail } from "./comparisons/email";
import { asana as vsAsana } from "./comparisons/asana";

// Features
import { mobileApproval } from "./features/mobile-approval";
import { engagementTracking } from "./features/engagement-tracking";
import { noSignupApproval } from "./features/no-signup-approval";
import { autoReminders } from "./features/auto-reminders";
import { multiReviewer } from "./features/multi-reviewer";

// Register all configs for default locale (English)
const allConfigs: LandingPageConfig[] = [
  // Audiences
  freelancers,
  marketingTeams,
  salesTeams,
  agencies,
  consultants,
  smallBusiness,
  startups,
  enterprise,
  remoteTeams,
  solopreneurs,
  // Solutions
  contentApprovalWorkflow,
  documentApprovalWorkflow,
  approvalWorkflowSoftware,
  clientApprovalProcess,
  speedUpApprovalProcess,
  multiStakeholderApproval,
  approvalBottleneck,
  emailApprovalChaos,
  clientGhosting,
  proposalTracking,
  contentReviewWorkflow,
  aiContentGovernance,
  // Use Cases
  chatgptProposals,
  blogPostApproval,
  socialMediaApproval,
  // Industries
  technology,
  // Integrations
  chatgpt,
  slack,
  emailIntegration,
  // Comparisons
  vsEmail,
  vsAsana,
  // Features
  mobileApproval,
  engagementTracking,
  noSignupApproval,
  autoReminders,
  multiReviewer,
];

// Register all English configs
allConfigs.forEach((config) => registerLandingPage(config, "en"));

// Import and register locale-specific configs
// SK (Slovak)
import "./locales/sk";
// IT (Italian)
import "./locales/it";
// DE (German)
import "./locales/de";
