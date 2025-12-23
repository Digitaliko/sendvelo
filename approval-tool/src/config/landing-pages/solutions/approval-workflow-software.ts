import type { LandingPageConfig } from "../schema";

export const approvalWorkflowSoftware: LandingPageConfig = {
  slug: "approval-workflow-software",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Approval Workflow Software | Thumbway",
    description: "Thumbway is the modern approval workflow software built for AI-generated content.",
    keywords: ["approval workflow software", "approval automation", "workflow management", "approval tool"],
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
      headline: "Approval Workflow Software",
      highlightedText: "Built for AI",
      subheadline: "The first approval tool designed for the AI content generation era. Fast, simple, ChatGPT-native.",
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
          description: "Enterprise software with steep learning curves.",
        },
        {
          icon: "DollarSign",
          title: "High Cost",
          description: "$500+/month for features you don't need.",
        },
        {
          icon: "Bot",
          title: "Not AI-Ready",
          description: "Built before the AI content revolution.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway is the modern approval workflow software built for AI-generated content.",
      features: [
        {
          icon: "Bot",
          title: "AI-Native",
          description: "Built specifically for AI-generated content.",
        },
        {
          icon: "Zap",
          title: "5-Minute Setup",
          description: "No complex configuration required.",
        },
        {
          icon: "DollarSign",
          title: "Affordable",
          description: "Starting at $0/month. No per-user fees.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Bot",
          title: "AI-Native",
          description: "Built specifically for AI-generated content.",
        },
        {
          icon: "Zap",
          title: "5-Minute Setup",
          description: "No complex configuration required.",
        },
        {
          icon: "DollarSign",
          title: "Affordable",
          description: "Starting at $0/month. No per-user fees.",
        },
        {
          icon: "Smartphone",
          title: "Modern UX",
          description: "Mobile-first, clean, intuitive.",
        },
        {
          icon: "Globe",
          title: "Works Anywhere",
          description: "Web-based, no installation needed.",
        },
        {
          icon: "TrendingUp",
          title: "Scales With You",
          description: "From 1 to 1000 users, same simple tool.",
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
          question: "How is Thumbway different from other approval software?",
          answer: "Thumbway is the only approval tool that lives inside ChatGPT. Generate content and send for approval without switching tools.",
        },
        {
          question: "Do I need technical skills to set up?",
          answer: "No! If you can use ChatGPT, you can use Thumbway. Setup takes about 5 minutes.",
        },
        {
          question: "What's the pricing model?",
          answer: "Flat monthly pricing (no per-user fees): Free ($0), Starter ($19), Team ($49), Business ($99).",
        },
        {
          question: "Can I try before buying?",
          answer: "Yes! Start with our Free tier (5 approvals/month) or get a 14-day trial of paid features.",
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
