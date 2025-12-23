import type { LandingPageConfig } from "../schema";

export const contentReviewWorkflow: LandingPageConfig = {
  slug: "content-review-workflow",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Content Review Workflow | Thumbway",
    description: "Thumbway provides simple content review workflows for teams of all sizes.",
    keywords: ["content review workflow", "review process", "content feedback", "review workflow"],
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
      headline: "Content Review",
      highlightedText: "Workflow That Works",
      subheadline: "Simple review workflows for marketing, sales, and creative teams. No complex setup.",
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
          icon: "Settings",
          title: "Complex Tools",
          description: "Enterprise software with 100+ settings.",
        },
        {
          icon: "Clock",
          title: "Setup Time",
          description: "Weeks of configuration before first use.",
        },
        {
          icon: "DollarSign",
          title: "Hidden Costs",
          description: "Per-user pricing adds up fast.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway provides simple content review workflows for teams of all sizes.",
      features: [
        {
          icon: "Zap",
          title: "Quick Setup",
          description: "First review in under 5 minutes.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple Actions",
          description: "Approve, reject, or request changes.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Feedback",
          description: "Comments on specific sections.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "Quick Setup",
          description: "First review in under 5 minutes.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple Actions",
          description: "Approve, reject, or request changes.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Feedback",
          description: "Comments on specific sections.",
        },
        {
          icon: "Users",
          title: "Flexible Reviewers",
          description: "Add anyone via email.",
        },
        {
          icon: "RefreshCw",
          title: "Version Tracking",
          description: "Automatic history of changes.",
        },
        {
          icon: "DollarSign",
          title: "Flat Pricing",
          description: "Unlimited team members included.",
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
          question: "How is this different from Google Docs comments?",
          answer: "Thumbway provides structured approve/reject actions, engagement tracking, and organized history - not scattered comments.",
        },
        {
          question: "Can external reviewers participate?",
          answer: "Yes! Anyone with an email can review. No signup required.",
        },
        {
          question: "Is there a version comparison view?",
          answer: "Yes, when you send revisions, reviewers can see what changed since last version.",
        },
        {
          question: "Can I customize the review workflow?",
          answer: "Choose parallel, sequential, or any-one-approves. Add as many reviewers as needed.",
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
