import type { LandingPageConfig } from "../schema";

export const technology: LandingPageConfig = {
  slug: "technology",
  category: "industry",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Approval Workflow for Tech Companies | Thumbway",
    description: "Tech companies use Thumbway to accelerate content approvals.",
    keywords: ["tech content approval", "software company workflow", "tech team tools", "product content approval"],
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
      headline: "Content Approval for",
      highlightedText: "Tech Companies",
      subheadline: "Fast-moving tech teams need fast approvals. Ship product content, docs, and announcements faster.",
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
          icon: "Rocket",
          title: "Ship Fast",
          description: "Tech moves fast. Approvals shouldn't slow you down.",
        },
        {
          icon: "FileText",
          title: "Technical Content",
          description: "Docs, release notes, product updates.",
        },
        {
          icon: "Users",
          title: "Cross-Functional",
          description: "Product, engineering, marketing, legal.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Tech companies use Thumbway to accelerate content approvals.",
      features: [
        {
          icon: "Zap",
          title: "Speed First",
          description: "Built for velocity-focused teams.",
        },
        {
          icon: "Code",
          title: "API Access",
          description: "Integrate with your dev workflow.",
        },
        {
          icon: "Users",
          title: "Parallel Reviews",
          description: "All stakeholders at once.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "Speed First",
          description: "Built for velocity-focused teams.",
        },
        {
          icon: "Code",
          title: "API Access",
          description: "Integrate with your dev workflow.",
        },
        {
          icon: "Users",
          title: "Parallel Reviews",
          description: "All stakeholders at once.",
        },
        {
          icon: "Slack",
          title: "Slack Native",
          description: "Approve where you work.",
        },
        {
          icon: "Bot",
          title: "AI Native",
          description: "Built for AI-generated content.",
        },
        {
          icon: "TrendingUp",
          title: "Scales",
          description: "From startup to enterprise.",
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
          question: "Does Thumbway have an API?",
          answer: "Yes! Business tier includes full API access for custom integrations.",
        },
        {
          question: "Can we integrate with GitHub?",
          answer: "GitHub integration is on our roadmap. Use webhooks in the meantime.",
        },
        {
          question: "Is there SSO support?",
          answer: "Yes, Business tier includes SSO/SAML support.",
        },
        {
          question: "How do you handle sensitive product information?",
          answer: "Enterprise-grade security with encrypted storage, access controls, and audit logs.",
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
