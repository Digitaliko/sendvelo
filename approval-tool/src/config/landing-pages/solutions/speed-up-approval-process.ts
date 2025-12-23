import type { LandingPageConfig } from "../schema";

export const speedUpApprovalProcess: LandingPageConfig = {
  slug: "speed-up-approval-process",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "How to Speed Up Your Approval Process | Thumbway",
    description: "Learn how Thumbway can accelerate your approval process by 95%.",
    keywords: ["speed up approval process", "faster approvals", "approval efficiency", "reduce approval time"],
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
      headline: "Speed Up Your",
      highlightedText: "Approval Process 10x",
      subheadline: "Go from 2-day approval cycles to 2-minute turnaround. Here's how.",
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
          title: "2-Day Average",
          description: "Most content waits 48+ hours for approval.",
        },
        {
          icon: "Mail",
          title: "Lost in Email",
          description: "Approval requests compete with 100+ daily emails.",
        },
        {
          icon: "Users",
          title: "Bottleneck People",
          description: "One slow approver delays everything.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Learn how Thumbway can accelerate your approval process by 95%.",
      features: [
        {
          icon: "Zap",
          title: "Instant Delivery",
          description: "Content delivered directly to approvers.",
        },
        {
          icon: "Smartphone",
          title: "One-Tap Approval",
          description: "Mobile-first design enables quick response.",
        },
        {
          icon: "Bell",
          title: "Smart Reminders",
          description: "Automated follow-ups keep momentum.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "Instant Delivery",
          description: "Content delivered directly to approvers.",
        },
        {
          icon: "Smartphone",
          title: "One-Tap Approval",
          description: "Mobile-first design enables quick response.",
        },
        {
          icon: "Bell",
          title: "Smart Reminders",
          description: "Automated follow-ups keep momentum.",
        },
        {
          icon: "Users",
          title: "Parallel Approvals",
          description: "Multiple approvers at once.",
        },
        {
          icon: "BarChart",
          title: "Bottleneck Analytics",
          description: "Identify and fix slow points.",
        },
        {
          icon: "Eye",
          title: "Real-Time Status",
          description: "Always know where approvals stand.",
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
          question: "How much faster is Thumbway really?",
          answer: "Our users report 95% reduction in approval time - from an average of 48 hours to under 2 hours.",
        },
        {
          question: "What makes approvals faster?",
          answer: "Mobile-friendly pages, one-tap approval, no login required, and smart reminder sequences.",
        },
        {
          question: "Can I see who's holding up approvals?",
          answer: "Yes! Analytics show average approval time per reviewer so you can identify bottlenecks.",
        },
        {
          question: "What if an approver is out of office?",
          answer: "Set up backup approvers or use any-one-approves workflows to prevent blocks.",
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
