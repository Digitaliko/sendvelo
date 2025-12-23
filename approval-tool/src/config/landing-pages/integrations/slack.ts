import type { LandingPageConfig } from "../schema";

export const slack: LandingPageConfig = {
  slug: "slack",
  category: "integration",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Slack Approval Notifications | Thumbway",
    description: "Thumbway's Slack integration brings approvals to where your team already works.",
    keywords: ["Slack approval", "Slack integration", "Slack workflow", "approve in Slack"],
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
      headline: "Approve Directly",
      highlightedText: "From Slack",
      subheadline: "No more tab switching. Get notified and approve content right from your Slack workspace.",
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
          icon: "Mail",
          title: "Email Overload",
          description: "Approval emails lost in the noise.",
        },
        {
          icon: "RefreshCw",
          title: "Tab Switching",
          description: "Interrupting flow to check approvals.",
        },
        {
          icon: "Clock",
          title: "Delayed Response",
          description: "Approvals wait while email piles up.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's Slack integration brings approvals to where your team already works.",
      features: [
        {
          icon: "Bell",
          title: "Slack Notifications",
          description: "New approvals posted to channels.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Approve",
          description: "Approve directly from Slack.",
        },
        {
          icon: "MessageSquare",
          title: "Comments in Thread",
          description: "Discussion without leaving Slack.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Bell",
          title: "Slack Notifications",
          description: "New approvals posted to channels.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Approve",
          description: "Approve directly from Slack.",
        },
        {
          icon: "MessageSquare",
          title: "Comments in Thread",
          description: "Discussion without leaving Slack.",
        },
        {
          icon: "Users",
          title: "Channel Routing",
          description: "Different approvals to different channels.",
        },
        {
          icon: "Eye",
          title: "Status Updates",
          description: "See approval progress in real-time.",
        },
        {
          icon: "Settings",
          title: "Custom Notifications",
          description: "Control what triggers alerts.",
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
          question: "Can I approve without leaving Slack?",
          answer: "Yes! Click the approve button directly in Slack - no need to open a browser.",
        },
        {
          question: "Which Slack channels get notifications?",
          answer: "You configure this. Route different types of approvals to different channels.",
        },
        {
          question: "Is Slack integration included in all plans?",
          answer: "Slack integration is available on Team tier ($49/month) and above.",
        },
        {
          question: "Can I add comments via Slack?",
          answer: "Yes, reply in the Slack thread. Comments sync back to Thumbway.",
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
