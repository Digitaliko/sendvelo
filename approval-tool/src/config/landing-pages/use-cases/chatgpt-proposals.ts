import type { LandingPageConfig } from "../schema";

export const chatgptProposals: LandingPageConfig = {
  slug: "chatgpt-proposals",
  category: "use-case",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Get Approval on ChatGPT Proposals | Thumbway",
    description: "Use Thumbway to get instant approval on proposals created with ChatGPT.",
    keywords: ["ChatGPT proposals", "AI proposal approval", "proposal workflow", "ChatGPT business"],
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
      headline: "ChatGPT Proposals",
      highlightedText: "Approved Instantly",
      subheadline: "Generate proposals with ChatGPT, send for approval in one command. Close deals faster.",
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
          icon: "FileText",
          title: "Great Proposals",
          description: "ChatGPT creates amazing proposals.",
        },
        {
          icon: "Clock",
          title: "Slow Approval",
          description: "But then they sit in email for days.",
        },
        {
          icon: "Copy",
          title: "Copy-Paste Hell",
          description: "Export, format, attach, send, wait.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Use Thumbway to get instant approval on proposals created with ChatGPT.",
      features: [
        {
          icon: "Zap",
          title: "One Command",
          description: "'Send to client@email.com for approval'",
        },
        {
          icon: "ThumbsUp",
          title: "Instant Delivery",
          description: "Client receives beautiful approval page.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Ready",
          description: "Clients approve on any device.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "One Command",
          description: "'Send to client@email.com for approval'",
        },
        {
          icon: "ThumbsUp",
          title: "Instant Delivery",
          description: "Client receives beautiful approval page.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Ready",
          description: "Clients approve on any device.",
        },
        {
          icon: "Eye",
          title: "View Tracking",
          description: "Know when they read your proposal.",
        },
        {
          icon: "Bell",
          title: "Auto Follow-Up",
          description: "Smart reminders keep deals moving.",
        },
        {
          icon: "MessageSquare",
          title: "Easy Feedback",
          description: "Comments without email threads.",
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
          question: "Do I need to install anything in ChatGPT?",
          answer: "Yes, Thumbway is available in the ChatGPT plugin/action store. One-time install takes 2 minutes.",
        },
        {
          question: "Can I customize the proposal appearance?",
          answer: "Basic branding is available. Advanced customization on Team tier and above.",
        },
        {
          question: "What if the client wants changes?",
          answer: "They can request changes with comments. You're notified, make edits in ChatGPT, and resend.",
        },
        {
          question: "Can I use this for contracts too?",
          answer: "Yes! Any content from ChatGPT can be sent for approval.",
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
