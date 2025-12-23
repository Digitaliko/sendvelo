import type { LandingPageConfig } from "../schema";

export const remoteTeams: LandingPageConfig = {
  slug: "remote-teams",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Async Approval for Remote Teams | Thumbway",
    description: "Remote teams use Thumbway for timezone-friendly async approvals.",
    keywords: ["remote team approval", "async approval workflow", "distributed team tools", "timezone approval"],
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
      headline: "Async Approvals That",
      highlightedText: "Respect Time Zones",
      subheadline: "No more waiting for meetings to get sign-off. Approve content asynchronously, any time zone.",
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
          icon: "Globe",
          title: "Timezone Hell",
          description: "Waiting 16 hours for someone in Singapore to wake up.",
        },
        {
          icon: "Calendar",
          title: "Meeting Overload",
          description: "Scheduling syncs just to get a simple approval.",
        },
        {
          icon: "Clock",
          title: "Context Switching",
          description: "Losing flow state to jump on approval calls.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Remote teams use Thumbway for timezone-friendly async approvals.",
      features: [
        {
          icon: "Globe",
          title: "Async-First",
          description: "Designed for asynchronous workflows.",
        },
        {
          icon: "Bell",
          title: "Smart Notifications",
          description: "Respect working hours and timezone settings.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Approve from anywhere, any device.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Globe",
          title: "Async-First",
          description: "Designed for asynchronous workflows.",
        },
        {
          icon: "Bell",
          title: "Smart Notifications",
          description: "Respect working hours and timezone settings.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Approve from anywhere, any device.",
        },
        {
          icon: "MessageSquare",
          title: "Threaded Comments",
          description: "Async discussions without meetings.",
        },
        {
          icon: "Clock",
          title: "No Deadlines Required",
          description: "Auto-reminders keep things moving.",
        },
        {
          icon: "Slack",
          title: "Slack Integration",
          description: "Approve without leaving your workflow.",
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
          question: "How do notifications work across time zones?",
          answer: "Reviewers can set their working hours. Notifications are batched and delivered at appropriate times.",
        },
        {
          question: "Can we set approval deadlines?",
          answer: "Yes, but it's optional. Auto-reminders gently nudge reviewers without creating urgency.",
        },
        {
          question: "Does it work with Slack?",
          answer: "Yes! Team tier includes Slack integration. Approve directly from Slack notifications.",
        },
        {
          question: "What if someone is on vacation?",
          answer: "Set up backup approvers or use any-one-approves workflows to prevent blockers.",
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
