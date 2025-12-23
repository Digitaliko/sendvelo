import type { LandingPageConfig } from "../schema";

export const socialMediaApproval: LandingPageConfig = {
  slug: "social-media-approval",
  category: "use-case",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Social Media Content Approval | Thumbway",
    description: "Thumbway helps marketing teams get quick approvals on social media content.",
    keywords: ["social media approval", "social content workflow", "marketing approval", "social media sign-off"],
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
      headline: "Social Media Approvals",
      highlightedText: "Without the Chaos",
      subheadline: "Get sign-off on social posts before they go live. Fast approvals for fast-moving content.",
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
          title: "Time-Sensitive",
          description: "Social content needs quick turnaround.",
        },
        {
          icon: "Users",
          title: "Stakeholder Buy-In",
          description: "Legal, brand, leadership sign-off.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Reviewers",
          description: "Stakeholders aren't at desks.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway helps marketing teams get quick approvals on social media content.",
      features: [
        {
          icon: "Zap",
          title: "Quick Send",
          description: "Send for approval in seconds.",
        },
        {
          icon: "Smartphone",
          title: "Mobile First",
          description: "Approve from anywhere.",
        },
        {
          icon: "Clock",
          title: "Fast Turnaround",
          description: "Most approvals under 30 minutes.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "Quick Send",
          description: "Send for approval in seconds.",
        },
        {
          icon: "Smartphone",
          title: "Mobile First",
          description: "Approve from anywhere.",
        },
        {
          icon: "Clock",
          title: "Fast Turnaround",
          description: "Most approvals under 30 minutes.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Tap Approve",
          description: "Minimal friction for approvers.",
        },
        {
          icon: "Layers",
          title: "Batch Approval",
          description: "Approve multiple posts at once.",
        },
        {
          icon: "Bell",
          title: "Urgent Flags",
          description: "Mark time-sensitive content.",
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
          question: "Can we approve multiple posts at once?",
          answer: "Send them as separate requests. Batch approval feature coming soon.",
        },
        {
          question: "How fast do approvers typically respond?",
          answer: "With mobile-optimized pages and push notifications, most respond within 30 minutes.",
        },
        {
          question: "Can I mark something as urgent?",
          answer: "Yes! Urgent flags send immediate notifications and highlight the request.",
        },
        {
          question: "Does it integrate with social scheduling tools?",
          answer: "Not directly yet. Copy approved content to your scheduling tool after approval.",
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
