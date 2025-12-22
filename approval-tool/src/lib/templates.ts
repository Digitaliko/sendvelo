/**
 * Review Templates
 *
 * Pre-built templates for common review types.
 * Helps users get started quickly with structured content.
 */

export interface ReviewTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultTitle: string;
  defaultContent: string;
  suggestedReviewers: string[];
}

export const REVIEW_TEMPLATES: ReviewTemplate[] = [
  {
    id: "blog-post",
    name: "Blog Post",
    icon: "FileText",
    description: "Content review for blog articles",
    defaultTitle: "Blog Post: [Title]",
    defaultContent: `## Article Title
[Your article title]

## Summary
[Brief 2-3 sentence summary of the article]

## Full Content
[Paste your article content here]

## Key Points to Review
- Accuracy of information
- Tone and voice alignment
- SEO optimization
- Call-to-action effectiveness`,
    suggestedReviewers: [],
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: "Share2",
    description: "Quick approval for social posts",
    defaultTitle: "Social Post: [Platform] - [Date]",
    defaultContent: `## Platform
[Twitter / LinkedIn / Instagram / Facebook]

## Post Content
[Your post copy here]

## Image/Media
[Link to image or describe the visual]

## Hashtags
[List hashtags]

## Scheduled Time
[Date and time]`,
    suggestedReviewers: [],
  },
  {
    id: "design-asset",
    name: "Design Asset",
    icon: "Palette",
    description: "Creative and design review",
    defaultTitle: "Design Review: [Asset Name]",
    defaultContent: `## Asset Type
[Logo / Banner / Ad Creative / Email Template]

## Preview Link
[Figma / Google Drive / Direct link]

## Design Brief
[What this asset is for]

## Review Checklist
- [ ] Brand guidelines compliance
- [ ] Color accuracy
- [ ] Typography correct
- [ ] Responsive versions included`,
    suggestedReviewers: [],
  },
  {
    id: "proposal",
    name: "Client Proposal",
    icon: "Briefcase",
    description: "Proposal or quote for client approval",
    defaultTitle: "Proposal: [Client Name] - [Project]",
    defaultContent: `## Project Overview
[Brief description of the proposed work]

## Scope of Work
[Detailed breakdown of deliverables]

## Timeline
[Project milestones and dates]

## Investment
[Pricing breakdown]

## Terms
[Payment terms, revisions included, etc.]`,
    suggestedReviewers: [],
  },
  {
    id: "email-campaign",
    name: "Email Campaign",
    icon: "Mail",
    description: "Email marketing content review",
    defaultTitle: "Email: [Campaign Name]",
    defaultContent: `## Subject Line
[Your subject line]

## Preview Text
[Preview text that appears in inbox]

## Email Body
[Full email content]

## Call to Action
[Primary CTA button text and link]

## Audience
[Who is receiving this email]

## Send Date
[Scheduled send date/time]`,
    suggestedReviewers: [],
  },
  {
    id: "press-release",
    name: "Press Release",
    icon: "Newspaper",
    description: "PR and communications review",
    defaultTitle: "Press Release: [Headline]",
    defaultContent: `## Headline
[Your press release headline]

## Subheadline
[Supporting headline]

## Body
[Full press release content]

## Quotes
[Spokesperson quotes]

## Boilerplate
[Company description]

## Contact Information
[PR contact details]`,
    suggestedReviewers: [],
  },
  {
    id: "blank",
    name: "Blank",
    icon: "File",
    description: "Start from scratch",
    defaultTitle: "",
    defaultContent: "",
    suggestedReviewers: [],
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): ReviewTemplate | undefined {
  return REVIEW_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all templates except blank
 */
export function getTemplateOptions(): ReviewTemplate[] {
  return REVIEW_TEMPLATES.filter((t) => t.id !== "blank");
}
