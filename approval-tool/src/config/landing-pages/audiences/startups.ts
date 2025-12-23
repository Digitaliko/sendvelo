import type { LandingPageConfig } from "../schema";

export const startups: LandingPageConfig = {
  slug: "startups",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Content Approval for Startups | Thumbway",
    description: "Startups use Thumbway to move fast while keeping stakeholders aligned.",
    keywords: ["startup approval tool", "fast approval software", "startup workflow", "agile approval"],
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
      headline: "Move Fast",
      highlightedText: "Without Breaking Things",
      subheadline: "Get stakeholder alignment on content, proposals, and decisions in minutes. Built for speed.",
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
          icon: "Rocket",
          title: "Speed is Everything",
          description: "Every hour waiting for approval is an hour behind competition.",
        },
        {
          icon: "Users",
          title: "Lean Teams",
          description: "No bandwidth for complex approval workflows.",
        },
        {
          icon: "DollarSign",
          title: "Budget Constraints",
          description: "Can't justify $500/month enterprise tools.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Startups use Thumbway to move fast while keeping stakeholders aligned.",
      features: [
        {
          icon: "Zap",
          title: "Instant Send",
          description: "One command sends content for approval.",
        },
        {
          icon: "Rocket",
          title: "Same-Day Approvals",
          description: "Most approvals completed in under an hour.",
        },
        {
          icon: "DollarSign",
          title: "Startup Pricing",
          description: "Free tier + affordable paid plans.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "Instant Send",
          description: "One command sends content for approval.",
        },
        {
          icon: "Rocket",
          title: "Same-Day Approvals",
          description: "Most approvals completed in under an hour.",
        },
        {
          icon: "DollarSign",
          title: "Startup Pricing",
          description: "Free tier + affordable paid plans.",
        },
        {
          icon: "Code",
          title: "API Access",
          description: "Build custom workflows (Business tier).",
        },
        {
          icon: "Bot",
          title: "AI-Native",
          description: "Built for the ChatGPT generation.",
        },
        {
          icon: "TrendingUp",
          title: "Scale With You",
          description: "From 2 people to 200, same tool.",
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
          question: "Is there a startup discount?",
          answer: "Our Free tier is generous (5 approvals/month) and Starter at $19/month is already startup-friendly. Contact us for special consideration.",
        },
        {
          question: "Can we use this for investor updates?",
          answer: "Absolutely! Many founders use Thumbway to get quick feedback on investor updates before sending to their full list.",
        },
        {
          question: "Does it scale as we grow?",
          answer: "Yes, from solo founder to 200-person company - Thumbway grows with you. No per-user pricing means no surprise bills.",
        },
        {
          question: "Is there API access?",
          answer: "Yes, our Business tier includes API access for custom integrations and automated workflows.",
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
