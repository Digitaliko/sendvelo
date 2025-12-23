import type { LandingPageConfig } from "../schema";

export const email: LandingPageConfig = {
  slug: "email",
  category: "comparison",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Thumbway vs Email for Approvals | Comparison",
    description: "See why teams choose Thumbway over email for managing approvals.",
    keywords: ["Thumbway vs email", "email approval alternative", "better than email", "approval tool comparison"],
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
      headline: "Thumbway vs Email",
      highlightedText: "for Approvals",
      subheadline: "Why scattered email threads are costing you time, deals, and sanity.",
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
          icon: "Mail",
          title: "Email is Free",
          description: "But the hidden costs are enormous.",
        },
        {
          icon: "Search",
          title: "No Tracking",
          description: "Did they even open it?",
        },
        {
          icon: "Clock",
          title: "Slow Response",
          description: "Buried under 100 other emails.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "See why teams choose Thumbway over email for managing approvals.",
      features: [
        {
          icon: "Eye",
          title: "View Tracking",
          description: "Know when they open and read.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Approval",
          description: "Not buried in reply threads.",
        },
        {
          icon: "Search",
          title: "Easy to Find",
          description: "Searchable, organized history.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Eye",
          title: "View Tracking",
          description: "Know when they open and read.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Approval",
          description: "Not buried in reply threads.",
        },
        {
          icon: "Search",
          title: "Easy to Find",
          description: "Searchable, organized history.",
        },
        {
          icon: "Bell",
          title: "Smart Reminders",
          description: "Automated follow-ups.",
        },
        {
          icon: "Users",
          title: "Multi-Approver",
          description: "Organized multi-stakeholder workflows.",
        },
        {
          icon: "BarChart",
          title: "Analytics",
          description: "See what's working.",
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

    comparison: {
      headline: "Feature Comparison",
      competitorName: "Email",
      rows: [
        {
          feature: "View/open tracking",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "One-click approval",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Organized history",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Automated reminders",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Multi-approver workflow",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Mobile optimized",
          thumbway: true,
          competitor: "Varies",
        },
        {
          feature: "Analytics",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "No account needed",
          thumbway: true,
          competitor: true,
        },
        {
          feature: "Price",
          thumbway: "$0-99/mo",
          competitor: "Free",
        },
      ],
      conclusion: "Thumbway: Built for approvals. Simple, fast, affordable.",
    },

    faq: {
      headline: "Frequently Asked Questions",
      faqs: [
        {
          question: "Email is free, why pay for Thumbway?",
          answer: "Time is money. If Thumbway saves 10 hours/month at $50/hour, that's $500/month. Thumbway costs $15-99/month.",
        },
        {
          question: "Can approvers still use email?",
          answer: "Yes! They receive an email and click a link. They don't need to change tools.",
        },
        {
          question: "What about existing email threads?",
          answer: "Start fresh with Thumbway for new approvals. Your email history remains untouched.",
        },
        {
          question: "Is it hard to switch from email?",
          answer: "No! Setup takes 5 minutes. Your first approval can go out today.",
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
    "comparison",
    "faq",
    "cta",
  ],
};
