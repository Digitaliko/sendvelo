import type { LandingPageConfig } from "../schema";

export const engagementTracking: LandingPageConfig = {
  slug: "engagement-tracking",
  category: "feature",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Real-Time Engagement Tracking | Thumbway",
    description: "Thumbway's engagement tracking shows when content is viewed and how long reviewers spend.",
    keywords: ["engagement tracking", "view tracking", "read receipts", "approval tracking"],
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
      headline: "Know When They're",
      highlightedText: "Engaged",
      subheadline: "Real-time notifications when approvers view your content. No more wondering if they received it.",
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
          icon: "Eye",
          title: "Blind Spot",
          description: "No idea if they've seen it.",
        },
        {
          icon: "Clock",
          title: "Awkward Follow-Up",
          description: "'Did you get my email?'",
        },
        {
          icon: "TrendingUp",
          title: "No Insights",
          description: "Can't prioritize hot vs cold leads.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's engagement tracking shows when content is viewed and how long reviewers spend.",
      features: [
        {
          icon: "Eye",
          title: "View Notifications",
          description: "Instant alert when they open.",
        },
        {
          icon: "Clock",
          title: "Time Tracking",
          description: "How long they spent reviewing.",
        },
        {
          icon: "TrendingUp",
          title: "Engagement Score",
          description: "Prioritize most engaged.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Eye",
          title: "View Notifications",
          description: "Instant alert when they open.",
        },
        {
          icon: "Clock",
          title: "Time Tracking",
          description: "How long they spent reviewing.",
        },
        {
          icon: "TrendingUp",
          title: "Engagement Score",
          description: "Prioritize most engaged.",
        },
        {
          icon: "Calendar",
          title: "Best Time",
          description: "Data on when to follow up.",
        },
        {
          icon: "BarChart",
          title: "Section Analytics",
          description: "Which parts got attention.",
        },
        {
          icon: "Bell",
          title: "Smart Alerts",
          description: "Notifications that matter.",
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
          question: "How does view tracking work?",
          answer: "When the approval link is opened, we track the view. You get notified in real-time.",
        },
        {
          question: "Can approvers see I'm tracking?",
          answer: "No, the tracking is invisible to reviewers. They just see a clean approval page.",
        },
        {
          question: "What metrics are tracked?",
          answer: "Open time, total time spent, number of views, and section engagement (coming soon).",
        },
        {
          question: "Is this GDPR compliant?",
          answer: "Yes, basic analytics don't require consent. We don't track personal data beyond the approval action.",
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
