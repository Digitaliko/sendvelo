import type { LandingPageConfig } from "../schema";

export const solopreneurs: LandingPageConfig = {
  slug: "solopreneurs",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Approval Tool for Solopreneurs | Thumbway",
    description: "Solopreneurs use Thumbway to deliver professional approval experiences to clients.",
    keywords: ["solopreneur tools", "one-person business", "freelancer approval", "client management"],
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
      headline: "Professional Approvals",
      highlightedText: "Without the Agency Price",
      subheadline: "Look like an agency. Work like a solopreneur. Get client approvals that build trust.",
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
          icon: "Users",
          title: "One-Person Show",
          description: "You're the strategist, creator, and project manager.",
        },
        {
          icon: "Award",
          title: "Credibility Gap",
          description: "Clients wonder if you can handle their project.",
        },
        {
          icon: "Clock",
          title: "Time Scarcity",
          description: "Every hour on admin is an hour not earning.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Solopreneurs use Thumbway to deliver professional approval experiences to clients.",
      features: [
        {
          icon: "Award",
          title: "Professional Pages",
          description: "Branded approval pages that impress.",
        },
        {
          icon: "Zap",
          title: "One-Command Send",
          description: "Zero admin overhead.",
        },
        {
          icon: "Eye",
          title: "Client Insights",
          description: "Know when they're engaged.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Award",
          title: "Professional Pages",
          description: "Branded approval pages that impress.",
        },
        {
          icon: "Zap",
          title: "One-Command Send",
          description: "Zero admin overhead.",
        },
        {
          icon: "Eye",
          title: "Client Insights",
          description: "Know when they're engaged.",
        },
        {
          icon: "DollarSign",
          title: "Free Tier",
          description: "Start free, upgrade when you grow.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple UX",
          description: "Clients approve in seconds.",
        },
        {
          icon: "Shield",
          title: "Audit Trail",
          description: "Protect yourself with approval records.",
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
          question: "Is the Free tier really free?",
          answer: "Yes! 5 approvals/month, no credit card required, no strings attached.",
        },
        {
          question: "Can I customize the approval pages?",
          answer: "Basic branding is available on all tiers. Advanced customization on Team tier and above.",
        },
        {
          question: "What if I get more than 5 clients?",
          answer: "Upgrade to Starter ($19/month) for unlimited approvals. Still cheaper than a single coffee per day.",
        },
        {
          question: "Do clients see I'm using Thumbway?",
          answer: "Yes, unless you upgrade to Business tier which offers white-label options.",
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
