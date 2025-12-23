import type { LandingPageConfig } from "../schema";

export const consultants: LandingPageConfig = {
  slug: "consultants",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Proposal Approval for Consultants | Thumbway",
    description: "Consultants use Thumbway to get faster client approvals on proposals and deliverables.",
    keywords: ["consultant approval tool", "consulting proposal software", "client sign-off", "consulting workflow"],
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
      headline: "Get Client Buy-In",
      highlightedText: "Without the Wait",
      subheadline: "Send proposals, strategies, and recommendations for approval in seconds. Know when clients engage.",
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
          icon: "Clock",
          title: "Long Approval Cycles",
          description: "Waiting weeks for clients to review your strategy.",
        },
        {
          icon: "Eye",
          title: "Uncertain Engagement",
          description: "Did they read the 50-page deck or just skim it?",
        },
        {
          icon: "DollarSign",
          title: "Delayed Billing",
          description: "Can't invoice until they approve the work.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Consultants use Thumbway to get faster client approvals on proposals and deliverables.",
      features: [
        {
          icon: "Eye",
          title: "Read Receipts",
          description: "Know exactly when and how long they reviewed.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Clients can comment on specific sections.",
        },
        {
          icon: "FileText",
          title: "Document Support",
          description: "Proposals, strategies, recommendations.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Eye",
          title: "Read Receipts",
          description: "Know exactly when and how long they reviewed.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Clients can comment on specific sections.",
        },
        {
          icon: "FileText",
          title: "Document Support",
          description: "Proposals, strategies, recommendations.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple Approval",
          description: "One-click approve or request changes.",
        },
        {
          icon: "Shield",
          title: "Audit Trail",
          description: "Complete history for project records.",
        },
        {
          icon: "Zap",
          title: "ChatGPT Native",
          description: "Generate and send from one place.",
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
          question: "Can I track time spent on each section?",
          answer: "Yes, engagement tracking shows how long clients spent reviewing each part of your document.",
        },
        {
          question: "What if they need changes?",
          answer: "Clients can request changes with specific comments. You'll be notified immediately and can send a revised version.",
        },
        {
          question: "Can I use this for ongoing retainer work?",
          answer: "Absolutely. Many consultants use Thumbway for monthly reports, strategy updates, and deliverable approvals.",
        },
        {
          question: "Is there a free trial?",
          answer: "Yes, start with our Free tier (5 approvals/month) or try Starter free for 14 days.",
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
