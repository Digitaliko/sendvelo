import type { LandingPageConfig } from "../schema";

export const clientGhosting: LandingPageConfig = {
  slug: "client-ghosting",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Stop Client Ghosting on Approvals | Thumbway",
    description: "Thumbway's engagement tracking prevents client ghosting on proposals and approvals.",
    keywords: ["client ghosting", "proposal tracking", "client follow-up", "engagement tracking"],
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
      headline: "Stop Clients From",
      highlightedText: "Ghosting Your Proposals",
      subheadline: "Know when they view. Know when they're ready. Never wonder if they received it again.",
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
          title: "No Read Receipts",
          description: "Did they even open it? Who knows.",
        },
        {
          icon: "Clock",
          title: "Awkward Follow-Ups",
          description: "'Just checking if you got my email?' Cringe.",
        },
        {
          icon: "AlertCircle",
          title: "Lost Deals",
          description: "Silence kills proposals.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's engagement tracking prevents client ghosting on proposals and approvals.",
      features: [
        {
          icon: "Eye",
          title: "View Notifications",
          description: "Get notified when they open your proposal.",
        },
        {
          icon: "Clock",
          title: "Time Tracking",
          description: "See how long they spent reviewing.",
        },
        {
          icon: "Bell",
          title: "Auto Follow-Ups",
          description: "Smart reminders you don't have to write.",
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
          description: "Get notified when they open your proposal.",
        },
        {
          icon: "Clock",
          title: "Time Tracking",
          description: "See how long they spent reviewing.",
        },
        {
          icon: "Bell",
          title: "Auto Follow-Ups",
          description: "Smart reminders you don't have to write.",
        },
        {
          icon: "TrendingUp",
          title: "Engagement Scoring",
          description: "Know who's hot and who's cold.",
        },
        {
          icon: "Calendar",
          title: "Best Time to Follow Up",
          description: "Data-driven follow-up timing.",
        },
        {
          icon: "MessageSquare",
          title: "Easy Response",
          description: "Make it effortless for them to respond.",
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
          answer: "When the client opens the approval link, we track the view and notify you. You'll also see time spent on the page.",
        },
        {
          question: "Is view tracking shown to clients?",
          answer: "No, clients just see a clean approval page. They don't know you're tracking engagement.",
        },
        {
          question: "Can I set up automatic follow-ups?",
          answer: "Yes! Configure reminder sequences: e.g., 24h, 48h, 1 week. Smart messages encourage response.",
        },
        {
          question: "What if they viewed but didn't approve?",
          answer: "That's valuable intel! You know they're interested. Follow up with a personal touch.",
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
