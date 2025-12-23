import type { LandingPageConfig } from "../schema";

export const salesTeams: LandingPageConfig = {
  slug: "sales-teams",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Proposal Approval for Sales Teams | Thumbway",
    description: "Sales teams use Thumbway to accelerate proposal approvals and close more deals.",
    keywords: ["sales proposal approval", "proposal sign-off software", "sales workflow tools", "deal acceleration"],
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
      headline: "Close Deals Faster with",
      highlightedText: "Instant Proposal Approvals",
      subheadline: "Get client sign-off on proposals in minutes. Speed up your sales cycle and increase close rates.",
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
          title: "Slow Close Rates",
          description: "Proposals sitting in inboxes while deals go cold.",
        },
        {
          icon: "Target",
          title: "Lost Momentum",
          description: "By the time they respond, they've forgotten why they were excited.",
        },
        {
          icon: "DollarSign",
          title: "Revenue Delay",
          description: "Every day waiting is a day without revenue.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Sales teams use Thumbway to accelerate proposal approvals and close more deals.",
      features: [
        {
          icon: "Zap",
          title: "Instant Delivery",
          description: "Proposals sent directly from ChatGPT to client inbox.",
        },
        {
          icon: "Eye",
          title: "View Tracking",
          description: "Know when prospects open your proposal.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Clients approve on the go with one tap.",
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
          description: "Proposals sent directly from ChatGPT to client inbox.",
        },
        {
          icon: "Eye",
          title: "View Tracking",
          description: "Know when prospects open your proposal.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Clients approve on the go with one tap.",
        },
        {
          icon: "Bell",
          title: "Follow-up Automation",
          description: "Smart reminders keep deals moving.",
        },
        {
          icon: "FileCheck",
          title: "E-signatures Ready",
          description: "Approved proposals ready for signature.",
        },
        {
          icon: "BarChart",
          title: "Pipeline Visibility",
          description: "Track all pending approvals in one view.",
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
          question: "How quickly do clients typically respond?",
          answer: "Most clients respond within 2 hours when using Thumbway vs 2+ days with email. The mobile-friendly approval page makes it easy to respond immediately.",
        },
        {
          question: "Can I track which parts of the proposal they read?",
          answer: "Yes, engagement tracking shows how long they spent on each section of your proposal.",
        },
        {
          question: "Does it integrate with our CRM?",
          answer: "We're building CRM integrations. For now, you can track approvals in Thumbway and manually update your CRM.",
        },
        {
          question: "What if they need to discuss with their team?",
          answer: "They can add comments and forward the approval link to colleagues. Everyone's feedback is tracked.",
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
