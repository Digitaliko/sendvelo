import type { LandingPageConfig } from "../schema";

export const asana: LandingPageConfig = {
  slug: "asana",
  category: "comparison",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Thumbway vs Asana | Approval Workflow Comparison",
    description: "Compare Thumbway to Asana for content approval workflows.",
    keywords: ["Thumbway vs Asana", "Asana alternative", "approval workflow", "project management alternative"],
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
      headline: "Thumbway vs Asana",
      highlightedText: "for Approvals",
      subheadline: "Why a dedicated approval tool beats complex project management software.",
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
          title: "Complexity",
          description: "Asana is powerful but complex.",
        },
        {
          icon: "DollarSign",
          title: "Per-User Pricing",
          description: "$10-25/user/month adds up.",
        },
        {
          icon: "Clock",
          title: "Setup Time",
          description: "Weeks to configure workflows.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Compare Thumbway to Asana for content approval workflows.",
      features: [
        {
          icon: "Zap",
          title: "5-Minute Setup",
          description: "vs weeks of configuration.",
        },
        {
          icon: "DollarSign",
          title: "Flat Pricing",
          description: "Unlimited users on all plans.",
        },
        {
          icon: "Bot",
          title: "ChatGPT Native",
          description: "Built for AI workflows.",
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
          description: "vs weeks of configuration.",
        },
        {
          icon: "DollarSign",
          title: "Flat Pricing",
          description: "Unlimited users on all plans.",
        },
        {
          icon: "Bot",
          title: "ChatGPT Native",
          description: "Built for AI workflows.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple UX",
          description: "Approvals, not project management.",
        },
        {
          icon: "Lock",
          title: "No Account",
          description: "Approvers don't need accounts.",
        },
        {
          icon: "Smartphone",
          title: "Mobile First",
          description: "One-tap approvals.",
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
      competitorName: "Asana",
      rows: [
        {
          feature: "ChatGPT integration",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Setup time",
          thumbway: "5 minutes",
          competitor: "Weeks",
        },
        {
          feature: "No account for approvers",
          thumbway: true,
          competitor: false,
        },
        {
          feature: "Mobile approval UX",
          thumbway: "One-tap",
          competitor: "Complex",
        },
        {
          feature: "Pricing model",
          thumbway: "Flat monthly",
          competitor: "Per-user",
        },
        {
          feature: "Cost for 10 users",
          thumbway: "$49/mo",
          competitor: "$250/mo",
        },
        {
          feature: "Focus",
          thumbway: "Approvals",
          competitor: "Projects",
        },
        {
          feature: "Learning curve",
          thumbway: "Minutes",
          competitor: "Days",
        },
      ],
      conclusion: "Thumbway: Built for approvals. Simple, fast, affordable.",
    },

    faq: {
      headline: "Frequently Asked Questions",
      faqs: [
        {
          question: "Is Thumbway a project management replacement?",
          answer: "No! Thumbway handles approvals. Use it alongside Asana, or instead of Asana for simple approval needs.",
        },
        {
          question: "What about per-user pricing?",
          answer: "Thumbway has flat monthly pricing. Add unlimited team members without increasing cost.",
        },
        {
          question: "Can I import from Asana?",
          answer: "Not currently. Thumbway is designed for net-new approval workflows.",
        },
        {
          question: "Which is better for my team?",
          answer: "If you mainly need approvals, Thumbway is simpler and cheaper. If you need full project management, consider using both.",
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
