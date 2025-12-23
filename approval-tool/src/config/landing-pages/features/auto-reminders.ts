import type { LandingPageConfig } from "../schema";

export const autoReminders: LandingPageConfig = {
  slug: "auto-reminders",
  category: "feature",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Automatic Approval Reminders | Thumbway",
    description: "Thumbway's auto-reminder feature prevents ghosting with smart, configurable follow-ups.",
    keywords: ["approval reminders", "automatic follow-up", "reminder sequence", "prevent ghosting"],
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
      headline: "Never Chase",
      highlightedText: "Approvals Again",
      subheadline: "Smart reminder sequences that gently nudge reviewers. You focus on work, we handle follow-ups.",
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
          title: "Manual Follow-Ups",
          description: "Writing 'just checking in' emails.",
        },
        {
          icon: "Calendar",
          title: "Forgetting",
          description: "Approvals slipping through cracks.",
        },
        {
          icon: "AlertCircle",
          title: "Annoying People",
          description: "Fear of being too pushy.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's auto-reminder feature prevents ghosting with smart, configurable follow-ups.",
      features: [
        {
          icon: "Bell",
          title: "Auto Reminders",
          description: "Scheduled follow-ups you configure.",
        },
        {
          icon: "Calendar",
          title: "Custom Timing",
          description: "24h, 48h, 1 week, your choice.",
        },
        {
          icon: "MessageSquare",
          title: "Smart Messages",
          description: "Friendly, non-annoying nudges.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Bell",
          title: "Auto Reminders",
          description: "Scheduled follow-ups you configure.",
        },
        {
          icon: "Calendar",
          title: "Custom Timing",
          description: "24h, 48h, 1 week, your choice.",
        },
        {
          icon: "MessageSquare",
          title: "Smart Messages",
          description: "Friendly, non-annoying nudges.",
        },
        {
          icon: "Settings",
          title: "Configurable",
          description: "Turn on/off per request.",
        },
        {
          icon: "X",
          title: "Stop on Action",
          description: "Reminders end when they respond.",
        },
        {
          icon: "BarChart",
          title: "Effectiveness",
          description: "See which reminders work.",
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
          question: "What's the default reminder sequence?",
          answer: "24 hours, then 48 hours, then 1 week. Fully customizable on paid tiers.",
        },
        {
          question: "Can I customize reminder messages?",
          answer: "Coming soon! For now, we use friendly, tested templates.",
        },
        {
          question: "Will reminders annoy my clients?",
          answer: "Our reminders are designed to be gentle and helpful. Most reviewers appreciate the nudge.",
        },
        {
          question: "Can I disable reminders for specific requests?",
          answer: "Yes! Toggle reminders on/off per approval request.",
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
