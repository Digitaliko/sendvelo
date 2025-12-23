import type { LandingPageConfig } from "../schema";

export const aiContentGovernance: LandingPageConfig = {
  slug: "ai-content-governance",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "AI Content Governance Platform | Thumbway",
    description: "Thumbway provides AI content governance with approval trails and compliance features.",
    keywords: ["AI content governance", "AI content approval", "AI compliance", "content governance"],
    structuredData: {
      type: "SoftwareApplication",
      aggregateRating: {
        ratingValue: 4.8,
        reviewCount: 127,
      },
    },
  },

  sections: {
    hero: {
      badge: "ChatGPT-Native Approval",
      headline: "AI Content Governance",
      highlightedText: "Made Simple",
      subheadline: "Control, track, and approve AI-generated content. The compliance layer for the AI era.",
      primaryCta: {
        text: "Start Free",
        href: "/signup",
        variant: "primary",
      },
      secondaryCta: {
        text: "See How It Works",
        href: "#how-it-works",
        variant: "outline",
      },
      stats: [
        { value: "95", suffix: "%", label: "Faster Approvals" },
        { value: "10K", suffix: "+", label: "Content Approved" },
        { value: "4.8", suffix: "/5", label: "User Rating" },
      ],
    },

    problem: {
      headline: "The Problem",
      problems: [
        {
          icon: "Bot",
          title: "AI Everywhere",
          description: "Teams generating content with ChatGPT daily.",
        },
        {
          icon: "Shield",
          title: "No Oversight",
          description: "AI content going out without human review.",
        },
        {
          icon: "FileCheck",
          title: "Compliance Gaps",
          description: "No audit trail of what was approved.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway provides AI content governance with approval trails and compliance features.",
      features: [
        {
          icon: "Bot",
          title: "ChatGPT Native",
          description: "Governance built into the AI workflow.",
        },
        {
          icon: "Shield",
          title: "Human-in-the-Loop",
          description: "Every piece reviewed before publish.",
        },
        {
          icon: "FileCheck",
          title: "Audit Trails",
          description: "Complete record of approvals.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Bot",
          title: "ChatGPT Native",
          description: "Governance built into the AI workflow.",
        },
        {
          icon: "Shield",
          title: "Human-in-the-Loop",
          description: "Every piece reviewed before publish.",
        },
        {
          icon: "FileCheck",
          title: "Audit Trails",
          description: "Complete record of approvals.",
        },
        {
          icon: "Lock",
          title: "Access Controls",
          description: "Who can approve what content.",
        },
        {
          icon: "BarChart",
          title: "Compliance Reports",
          description: "Exportable approval history.",
        },
        {
          icon: "Eye",
          title: "Content Tracking",
          description: "See all AI content in review.",
        },
      ],
    },

    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Generate Content in ChatGPT",
          description: "Create your proposal, blog post, or email using ChatGPT.",
          icon: "MessageSquare",
        },
        {
          step: 2,
          title: "Send for Approval",
          description: "Say 'Send this to john@client.com for approval' and Thumbway does the rest.",
          icon: "Send",
        },
        {
          step: 3,
          title: "Client Approves in Seconds",
          description: "Client receives an email, clicks the link, and approves with one tap.",
          icon: "ThumbsUp",
        },
        {
          step: 4,
          title: "You Get Notified Instantly",
          description: "Receive instant notification when your content is approved or feedback is given.",
          icon: "Bell",
        },
      ],
    },

    benefits: {
      headline: "Why Teams Choose Thumbway",
      benefits: [
        {
          icon: "Clock",
          title: "95% Faster Approvals",
          description: "Go from 2 days to 2 minutes for content approval.",
          stat: { value: "95", suffix: "%", label: "faster" },
        },
        {
          icon: "BarChart",
          title: "10+ Hours Saved Monthly",
          description: "Stop chasing clients and tracking approvals manually.",
          stat: { value: "10", suffix: "hrs", label: "saved/month" },
        },
        {
          icon: "Star",
          title: "Professional Experience",
          description: "Impress clients with clean, branded approval pages.",
          
        },
      ],
    },

    testimonials: {
      headline: "Loved by Professionals",
      testimonials: [
        {
          quote: "Thumbway cut our approval time from 2 days to 20 minutes. Game changer.",
          author: "Sarah Chen",
          role: "Marketing Manager",
          company: "TechStartup Inc",
          rating: 5,
        },
        {
          quote: "Finally, a tool that stays in ChatGPT. No more copy-paste nightmares.",
          author: "Mike Johnson",
          role: "Freelance Consultant",
          company: "Independent",
          rating: 5,
        },
        {
          quote: "Our clients love the clean approval pages. Very professional.",
          author: "Emma Davis",
          role: "Agency Director",
          company: "Creative Agency",
          rating: 5,
        },
      ],
    },

    pricing: {
      headline: "Simple, Transparent Pricing",
      subheadline: "Start free. Upgrade when you need more.",
      highlightedTier: "starter",
    },

    faq: {
      headline: "Frequently Asked Questions",
      faqs: [
        {
          question: "What is AI content governance?",
          answer: "It's ensuring all AI-generated content is reviewed and approved by humans before use, with full audit trails.",
        },
        {
          question: "Why is this important for compliance?",
          answer: "Regulators are increasingly concerned about AI content. Audit trails prove human oversight and accountability.",
        },
        {
          question: "Does this slow down AI workflows?",
          answer: "No! Thumbway is designed for speed. Most approvals happen in minutes, not days.",
        },
        {
          question: "Is this enterprise-only?",
          answer: "No! Start free. Enterprise features (SSO, advanced audit) are available on Business tier.",
        },
      ],
    },

    cta: {
      headline: "Ready to Speed Up Your Approvals?",
      subheadline: "Join thousands of professionals getting faster approvals with Thumbway.",
      primaryCta: {
        text: "Start Free Today",
        href: "/signup",
        variant: "primary",
      },
      secondaryCta: {
        text: "See How It Works",
        href: "#how-it-works",
        variant: "outline",
      },
      trustBadges: ["No credit card required", "5 free approvals/month", "Cancel anytime"],
    },
  },

  sectionOrder: [
    "hero",
    "problem",
    "solution",
    "howItWorks",
    "features",
    "benefits",
    "testimonials",
    "pricing",
    "faq",
    "cta",
  ],
};
