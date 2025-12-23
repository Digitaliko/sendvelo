import type { LandingPageConfig } from "../schema";

export const proposalTracking: LandingPageConfig = {
  slug: "proposal-tracking",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Track Proposals and Get Faster Approvals | Thumbway",
    description: "Thumbway provides complete proposal tracking with real-time status updates.",
    keywords: ["proposal tracking", "proposal management", "track proposals", "proposal status"],
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
      headline: "Track Proposals",
      highlightedText: "From Send to Signed",
      subheadline: "Full visibility into every proposal. Know when they view, share, and approve.",
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
          icon: "Eye",
          title: "Blind Spot",
          description: "Zero visibility after hitting 'send'.",
        },
        {
          icon: "Layers",
          title: "Multiple Proposals",
          description: "Tracking 20+ proposals in a spreadsheet.",
        },
        {
          icon: "Clock",
          title: "Follow-Up Guessing",
          description: "When is the right time to reach out?",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway provides complete proposal tracking with real-time status updates.",
      features: [
        {
          icon: "LayoutGrid",
          title: "Proposal Dashboard",
          description: "All proposals in one view.",
        },
        {
          icon: "Eye",
          title: "Real-Time Tracking",
          description: "View, share, and approval events.",
        },
        {
          icon: "BarChart",
          title: "Pipeline Analytics",
          description: "Conversion rates and trends.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "LayoutGrid",
          title: "Proposal Dashboard",
          description: "All proposals in one view.",
        },
        {
          icon: "Eye",
          title: "Real-Time Tracking",
          description: "View, share, and approval events.",
        },
        {
          icon: "BarChart",
          title: "Pipeline Analytics",
          description: "Conversion rates and trends.",
        },
        {
          icon: "Bell",
          title: "Event Notifications",
          description: "Instant alerts on key actions.",
        },
        {
          icon: "Filter",
          title: "Smart Filters",
          description: "By status, client, date, value.",
        },
        {
          icon: "Download",
          title: "Export Reports",
          description: "Data for your reporting needs.",
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
          question: "Can I see all my pending proposals in one place?",
          answer: "Yes! The dashboard shows all proposals with status, last activity, and days pending.",
        },
        {
          question: "What events are tracked?",
          answer: "Opens, time spent, shares (when forwarded), comments, and final approval/rejection.",
        },
        {
          question: "Can I export proposal data?",
          answer: "Yes, export to CSV for your own reporting or CRM updates (Team tier and above).",
        },
        {
          question: "Is there a mobile app?",
          answer: "The dashboard is fully responsive. Access from any device's browser - no app needed.",
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
