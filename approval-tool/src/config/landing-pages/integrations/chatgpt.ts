import type { LandingPageConfig } from "../schema";

export const chatgpt: LandingPageConfig = {
  slug: "chatgpt",
  category: "integration",
  status: "published",
  priority: 0.8,

  seo: {
    title: "ChatGPT Approval Integration | Thumbway",
    description: "Thumbway's native ChatGPT integration lets you send approvals without leaving the chat.",
    keywords: ["ChatGPT integration", "ChatGPT approval", "ChatGPT workflow", "AI approval integration"],
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
      headline: "Native ChatGPT",
      highlightedText: "Approval Integration",
      subheadline: "The only approval tool that lives inside ChatGPT. Generate content, send for approval, track status - all in one place.",
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
          icon: "Copy",
          title: "Copy-Paste Pain",
          description: "Generate in ChatGPT, paste elsewhere, email, wait.",
        },
        {
          icon: "RefreshCw",
          title: "Context Switching",
          description: "Jumping between tools kills productivity.",
        },
        {
          icon: "Clock",
          title: "Wasted Time",
          description: "Hours spent on approval logistics.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's native ChatGPT integration lets you send approvals without leaving the chat.",
      features: [
        {
          icon: "Bot",
          title: "MCP Protocol",
          description: "Official ChatGPT integration standard.",
        },
        {
          icon: "Zap",
          title: "One Command",
          description: "'Send this to john@client.com for approval'",
        },
        {
          icon: "Eye",
          title: "Status in Chat",
          description: "Check approval status in ChatGPT.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Bot",
          title: "MCP Protocol",
          description: "Official ChatGPT integration standard.",
        },
        {
          icon: "Zap",
          title: "One Command",
          description: "'Send this to john@client.com for approval'",
        },
        {
          icon: "Eye",
          title: "Status in Chat",
          description: "Check approval status in ChatGPT.",
        },
        {
          icon: "RefreshCw",
          title: "Revision Loop",
          description: "Edit and resend without leaving chat.",
        },
        {
          icon: "MessageSquare",
          title: "Feedback Display",
          description: "See approver comments in ChatGPT.",
        },
        {
          icon: "Shield",
          title: "Secure",
          description: "Enterprise-grade security.",
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
          question: "How do I install the ChatGPT integration?",
          answer: "Find Thumbway in the ChatGPT GPT Store or Actions menu. One-click install, 2-minute setup.",
        },
        {
          question: "Does it work with ChatGPT Plus and Free?",
          answer: "Yes, Thumbway works with all ChatGPT tiers that support plugins/actions.",
        },
        {
          question: "Can I check approval status in ChatGPT?",
          answer: "Yes! Ask 'What's the status of my pending approvals?' to see all open requests.",
        },
        {
          question: "Is my content secure?",
          answer: "Yes, enterprise-grade encryption. Your content is never used for AI training.",
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
