import type { LandingPageConfig } from "../schema";

export const emailApprovalChaos: LandingPageConfig = {
  slug: "email-approval-chaos",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "End Email Approval Chaos | Thumbway",
    description: "Thumbway replaces chaotic email approval threads with organized, trackable workflows.",
    keywords: ["email approval alternative", "approval tracking", "replace email approvals", "organized approvals"],
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
      headline: "End Email",
      highlightedText: "Approval Chaos",
      subheadline: "No more lost approval threads. No more 'did you see my email?' Follow-ups. Just clean, tracked approvals.",
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
          title: "Lost Threads",
          description: "Approval emails buried under 100 new messages.",
        },
        {
          icon: "Search",
          title: "Can't Find History",
          description: "'Search: approval' returns 500 results.",
        },
        {
          icon: "RefreshCw",
          title: "Version Confusion",
          description: "Which attachment was the latest?",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway replaces chaotic email approval threads with organized, trackable workflows.",
      features: [
        {
          icon: "Inbox",
          title: "One Place",
          description: "All approvals organized in one dashboard.",
        },
        {
          icon: "Search",
          title: "Easy Search",
          description: "Find any approval by title, date, or status.",
        },
        {
          icon: "RefreshCw",
          title: "Version History",
          description: "Clear version tracking for each request.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Inbox",
          title: "One Place",
          description: "All approvals organized in one dashboard.",
        },
        {
          icon: "Search",
          title: "Easy Search",
          description: "Find any approval by title, date, or status.",
        },
        {
          icon: "RefreshCw",
          title: "Version History",
          description: "Clear version tracking for each request.",
        },
        {
          icon: "Eye",
          title: "Status Tracking",
          description: "Always know: approved, pending, or rejected.",
        },
        {
          icon: "Shield",
          title: "Audit Trail",
          description: "Complete history with timestamps.",
        },
        {
          icon: "Bell",
          title: "Smart Notifications",
          description: "Email only when needed, not for every action.",
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
          question: "Do approvers still get email?",
          answer: "Yes, approvers receive an email with a link to the approval page. But feedback is captured in Thumbway, not scattered in replies.",
        },
        {
          question: "Can I search past approvals?",
          answer: "Yes! Search by title, approver, date range, or status. Much easier than searching email.",
        },
        {
          question: "What about existing email approval threads?",
          answer: "Start fresh with Thumbway. For historical reference, your email archives remain untouched.",
        },
        {
          question: "Will approvers have to change their habits?",
          answer: "Minimally. They still get an email - they just click a link instead of hitting 'Reply'.",
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
