import type { LandingPageConfig } from "../schema";

export const approvalBottleneck: LandingPageConfig = {
  slug: "approval-bottleneck",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Eliminate Approval Bottlenecks | Thumbway",
    description: "Thumbway helps you identify and eliminate approval bottlenecks with analytics.",
    keywords: ["approval bottleneck", "slow approvals", "approval efficiency", "workflow optimization"],
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
      headline: "Eliminate",
      highlightedText: "Approval Bottlenecks",
      subheadline: "Identify and fix the slow points in your approval process. Ship content faster.",
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
          title: "Unknown Delays",
          description: "Where is the approval stuck? No idea.",
        },
        {
          icon: "Users",
          title: "Repeat Offenders",
          description: "The same person is always the slowest.",
        },
        {
          icon: "BarChart",
          title: "No Visibility",
          description: "Can't improve what you can't measure.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway helps you identify and eliminate approval bottlenecks with analytics.",
      features: [
        {
          icon: "BarChart",
          title: "Approval Analytics",
          description: "Average time per approver, per project.",
        },
        {
          icon: "Users",
          title: "Bottleneck Reports",
          description: "See who's slowing things down.",
        },
        {
          icon: "Bell",
          title: "Escalation Rules",
          description: "Auto-remind or escalate slow approvals.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "BarChart",
          title: "Approval Analytics",
          description: "Average time per approver, per project.",
        },
        {
          icon: "Users",
          title: "Bottleneck Reports",
          description: "See who's slowing things down.",
        },
        {
          icon: "Bell",
          title: "Escalation Rules",
          description: "Auto-remind or escalate slow approvals.",
        },
        {
          icon: "TrendingUp",
          title: "Trend Tracking",
          description: "Are approvals getting faster or slower?",
        },
        {
          icon: "Eye",
          title: "Real-Time Status",
          description: "Always know where things stand.",
        },
        {
          icon: "Target",
          title: "SLA Tracking",
          description: "Set and track approval time targets.",
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
          question: "How do I identify bottlenecks?",
          answer: "Analytics show average approval time per person. The slowest approvers are highlighted.",
        },
        {
          question: "Can I set approval deadlines?",
          answer: "Yes, set expected response times and get alerts when approvals are overdue.",
        },
        {
          question: "What if the bottleneck is a senior stakeholder?",
          answer: "Data helps make the case. Show them the impact of delays on project timelines.",
        },
        {
          question: "Does this require the Team tier?",
          answer: "Basic analytics are available on all tiers. Advanced bottleneck reporting is on Team and above.",
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
