import type { LandingPageConfig } from "../schema";

export const smallBusiness: LandingPageConfig = {
  slug: "small-business",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Approval Workflow for Small Business | Thumbway",
    description: "Small businesses use Thumbway for simple, affordable approval workflows.",
    keywords: ["small business approval tool", "simple approval software", "affordable approval workflow", "smb tools"],
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
      headline: "Simple Approvals for",
      highlightedText: "Busy Teams",
      subheadline: "No complex software. No per-user pricing. Just fast approvals that keep your business moving.",
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
          icon: "DollarSign",
          title: "Expensive Tools",
          description: "Enterprise software costs $500+/month for features you don't need.",
        },
        {
          icon: "Settings",
          title: "Complex Setup",
          description: "Weeks of configuration just to send an approval.",
        },
        {
          icon: "Users",
          title: "Per-User Pricing",
          description: "Every new team member increases your bill.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Small businesses use Thumbway for simple, affordable approval workflows.",
      features: [
        {
          icon: "Zap",
          title: "5-Minute Setup",
          description: "Install and send your first approval in minutes.",
        },
        {
          icon: "DollarSign",
          title: "Flat Pricing",
          description: "No per-user fees. Add unlimited team members.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Ready",
          description: "Works on any device, no app required.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "5-Minute Setup",
          description: "Install and send your first approval in minutes.",
        },
        {
          icon: "DollarSign",
          title: "Flat Pricing",
          description: "No per-user fees. Add unlimited team members.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Ready",
          description: "Works on any device, no app required.",
        },
        {
          icon: "Lock",
          title: "Secure",
          description: "Enterprise-grade security without enterprise cost.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple UX",
          description: "Anyone can use it, no training needed.",
        },
        {
          icon: "Award",
          title: "Free Tier",
          description: "Start free, upgrade when you need more.",
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
          question: "What makes Thumbway different from other approval tools?",
          answer: "Thumbway is ChatGPT-native, meaning you generate and send approvals without switching tools. Plus, flat pricing means unlimited team members.",
        },
        {
          question: "Do we need technical expertise to set up?",
          answer: "No! If you can use ChatGPT, you can use Thumbway. Setup takes 5 minutes.",
        },
        {
          question: "What's included in the Free tier?",
          answer: "5 approvals/month, email notifications, ChatGPT integration, and basic engagement tracking.",
        },
        {
          question: "Can we upgrade later?",
          answer: "Yes, upgrade anytime. Your approval history and settings are preserved.",
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
