import type { LandingPageConfig } from "../schema";

export const multiReviewer: LandingPageConfig = {
  slug: "multi-reviewer",
  category: "feature",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Multi-Reviewer Approval Workflows | Thumbway",
    description: "Thumbway supports complex multi-reviewer approval workflows including parallel and sequential.",
    keywords: ["multi-reviewer approval", "parallel approval", "sequential approval", "approval workflow"],
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
      headline: "Complex Approvals",
      highlightedText: "Made Simple",
      subheadline: "Parallel, sequential, or any-one-approves. Handle multi-stakeholder sign-off with ease.",
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
          title: "Multiple Approvers",
          description: "5 people need to sign off.",
        },
        {
          icon: "Layers",
          title: "Order Matters",
          description: "Sometimes approvals must be sequential.",
        },
        {
          icon: "Check",
          title: "Any-One Okay",
          description: "Sometimes first approval wins.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway supports complex multi-reviewer approval workflows including parallel and sequential.",
      features: [
        {
          icon: "Users",
          title: "Parallel",
          description: "Everyone reviews simultaneously.",
        },
        {
          icon: "Layers",
          title: "Sequential",
          description: "Ordered approval chain.",
        },
        {
          icon: "Check",
          title: "Any-One-Approves",
          description: "First approval completes.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Users",
          title: "Parallel",
          description: "Everyone reviews simultaneously.",
        },
        {
          icon: "Layers",
          title: "Sequential",
          description: "Ordered approval chain.",
        },
        {
          icon: "Check",
          title: "Any-One-Approves",
          description: "First approval completes.",
        },
        {
          icon: "Eye",
          title: "Status Dashboard",
          description: "See who's pending.",
        },
        {
          icon: "Bell",
          title: "Targeted Reminders",
          description: "Only nudge non-responders.",
        },
        {
          icon: "MessageSquare",
          title: "Consolidated Feedback",
          description: "All comments in one view.",
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
          question: "What's the difference between parallel and sequential?",
          answer: "Parallel: all review at once. Sequential: A must approve before B sees it. Both supported.",
        },
        {
          question: "What is any-one-approves?",
          answer: "First approval completes the request. Great when you need sign-off from 1 of 3 people.",
        },
        {
          question: "Can I mix workflow types?",
          answer: "Not in the same request currently. Choose the type that fits each approval.",
        },
        {
          question: "What if one person is out of office?",
          answer: "Use any-one-approves for flexibility, or set up backup approvers.",
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
