import type { LandingPageConfig } from "../schema";

export const multiStakeholderApproval: LandingPageConfig = {
  slug: "multi-stakeholder-approval",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Multi-Stakeholder Approval Made Simple | Thumbway",
    description: "Thumbway handles multi-stakeholder approval workflows with parallel and sequential options.",
    keywords: ["multi-stakeholder approval", "multiple approvers", "approval chain", "group approval"],
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
      headline: "Multi-Stakeholder",
      highlightedText: "Approvals Simplified",
      subheadline: "Need 5 people to sign off? No problem. Manage complex approval workflows with ease.",
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
          title: "Too Many Approvers",
          description: "Getting 5 people to agree is like herding cats.",
        },
        {
          icon: "Clock",
          title: "Sequential Delays",
          description: "Waiting for Person A before Person B can review.",
        },
        {
          icon: "Mail",
          title: "Coordination Chaos",
          description: "Managing multiple email threads per approval.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway handles multi-stakeholder approval workflows with parallel and sequential options.",
      features: [
        {
          icon: "Users",
          title: "Parallel Approvals",
          description: "All approvers review simultaneously.",
        },
        {
          icon: "Layers",
          title: "Sequential Chains",
          description: "Ordered approval workflows when needed.",
        },
        {
          icon: "Check",
          title: "Any-One-Approves",
          description: "First approval completes the request.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Users",
          title: "Parallel Approvals",
          description: "All approvers review simultaneously.",
        },
        {
          icon: "Layers",
          title: "Sequential Chains",
          description: "Ordered approval workflows when needed.",
        },
        {
          icon: "Check",
          title: "Any-One-Approves",
          description: "First approval completes the request.",
        },
        {
          icon: "Eye",
          title: "Status Dashboard",
          description: "See who has approved, who's pending.",
        },
        {
          icon: "Bell",
          title: "Targeted Reminders",
          description: "Only nudge those who haven't responded.",
        },
        {
          icon: "MessageSquare",
          title: "Consolidated Feedback",
          description: "All comments in one place.",
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
          question: "What approval workflows are supported?",
          answer: "Parallel (everyone at once), sequential (ordered chain), and any-one-approves (first approval wins).",
        },
        {
          question: "Can I mix workflow types?",
          answer: "Not in the same request currently. Choose the workflow type that fits each approval.",
        },
        {
          question: "How do I track who's approved?",
          answer: "The status dashboard shows each approver's status in real-time with timestamps.",
        },
        {
          question: "What if someone rejects?",
          answer: "You're notified immediately with their feedback. Address concerns and resend for approval.",
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
