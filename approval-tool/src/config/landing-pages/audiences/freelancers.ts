import type { LandingPageConfig } from "../schema";

export const freelancers: LandingPageConfig = {
  slug: "freelancers",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Approval Workflow for Freelancers | Thumbway",
    description: "Thumbway helps freelancers get faster client approvals directly from ChatGPT.",
    keywords: ["freelancer approval tool", "client approval for freelancers", "proposal approval software", "freelance workflow"],
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
      headline: "Stop Chasing Clients for",
      highlightedText: "Approvals",
      subheadline: "Get instant feedback on proposals, contracts, and deliverables. No more waiting days for a simple 'yes'.",
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
          title: "Client Ghosting",
          description: "Sent a proposal 3 days ago? Still waiting for a response.",
        },
        {
          icon: "Mail",
          title: "Email Black Hole",
          description: "Your proposals get buried in overflowing client inboxes.",
        },
        {
          icon: "Eye",
          title: "Zero Visibility",
          description: "No idea if they've even opened your proposal.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway helps freelancers get faster client approvals directly from ChatGPT.",
      features: [
        {
          icon: "Eye",
          title: "Engagement Tracking",
          description: "Know exactly when clients view your proposals.",
        },
        {
          icon: "Bell",
          title: "Auto-Reminders",
          description: "Automatic follow-ups prevent ghosting.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Tap Approval",
          description: "Clients approve with a single tap on mobile.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Eye",
          title: "Engagement Tracking",
          description: "Know exactly when clients view your proposals.",
        },
        {
          icon: "Bell",
          title: "Auto-Reminders",
          description: "Automatic follow-ups prevent ghosting.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Tap Approval",
          description: "Clients approve with a single tap on mobile.",
        },
        {
          icon: "Zap",
          title: "ChatGPT Integration",
          description: "Send for approval without leaving ChatGPT.",
        },
        {
          icon: "FileText",
          title: "Professional Pages",
          description: "Beautiful, branded approval pages.",
        },
        {
          icon: "Shield",
          title: "Audit Trail",
          description: "Complete history of all approvals.",
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
          question: "Do my clients need a Thumbway account?",
          answer: "No! Clients receive a magic link via email and can approve with one click. No signup required.",
        },
        {
          question: "Can I track if my client viewed my proposal?",
          answer: "Yes! Thumbway shows you exactly when clients open and view your proposals, so you know the best time to follow up.",
        },
        {
          question: "Is there a free plan for freelancers?",
          answer: "Yes, our Free tier includes 5 approvals per month - perfect for getting started.",
        },
        {
          question: "Can I send proposals created outside ChatGPT?",
          answer: "Currently Thumbway works directly with ChatGPT. Copy your content into ChatGPT, then send for approval.",
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
