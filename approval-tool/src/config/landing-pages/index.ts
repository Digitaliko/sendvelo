import {
  type LandingPageConfig,
  type LandingPageCategory,
  landingPageSchema,
} from "./schema";

// Registry to hold all landing page configs
const landingPageRegistry: Map<string, LandingPageConfig> = new Map();

// Register a landing page config
export function registerLandingPage(config: LandingPageConfig): void {
  const key = `${config.category}:${config.slug}`;
  const validated = landingPageSchema.parse(config);
  landingPageRegistry.set(key, validated);
}

// Get a landing page by category and slug
export function getLandingPageBySlug(
  category: LandingPageCategory,
  slug: string
): LandingPageConfig | undefined {
  return landingPageRegistry.get(`${category}:${slug}`);
}

// Get all landing pages
export function getAllLandingPages(): LandingPageConfig[] {
  return Array.from(landingPageRegistry.values());
}

// Get all landing pages by category
export function getLandingPagesByCategory(
  category: LandingPageCategory
): LandingPageConfig[] {
  return getAllLandingPages().filter((page) => page.category === category);
}

// Get all slugs for a category (for generateStaticParams)
export function getLandingPageSlugs(category: LandingPageCategory): string[] {
  return getLandingPagesByCategory(category).map((page) => page.slug);
}

// Get all published landing pages
export function getPublishedLandingPages(): LandingPageConfig[] {
  return getAllLandingPages().filter((page) => page.status === "published");
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

// Re-export schema types
export * from "./schema";

// Import and register all landing page configs
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

// Register all configs
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

allConfigs.forEach(registerLandingPage);
