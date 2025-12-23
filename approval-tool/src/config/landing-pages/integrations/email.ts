import type { LandingPageConfig } from "../schema";

export const email: LandingPageConfig = {
  slug: "email",
  category: "integration",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Email-Based Approval Workflow | Thumbway",
    description: "Thumbway uses email for notifications while capturing everything in an organized system.",
    keywords: ["email approval", "email workflow", "approval notifications", "email sign-off"],
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
      headline: "Email That Works",
      highlightedText: "For Approvals",
      subheadline: "Approvers get email, click a link, approve in seconds. No account needed. Clean and tracked.",
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
          title: "Email Chaos",
          description: "Approval threads scattered everywhere.",
        },
        {
          icon: "Search",
          title: "Lost History",
          description: "Can't find who approved what.",
        },
        {
          icon: "Users",
          title: "Account Fatigue",
          description: "Approvers don't want another login.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway uses email for notifications while capturing everything in an organized system.",
      features: [
        {
          icon: "Mail",
          title: "Email Notifications",
          description: "Clean emails that get noticed.",
        },
        {
          icon: "Lock",
          title: "Magic Links",
          description: "No account required for approvers.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Action",
          description: "Approve right from the link.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Mail",
          title: "Email Notifications",
          description: "Clean emails that get noticed.",
        },
        {
          icon: "Lock",
          title: "Magic Links",
          description: "No account required for approvers.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Action",
          description: "Approve right from the link.",
        },
        {
          icon: "FileCheck",
          title: "Organized History",
          description: "All approvals tracked centrally.",
        },
        {
          icon: "Bell",
          title: "Smart Reminders",
          description: "Follow-ups that work.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Optimized",
          description: "Perfect on any device.",
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
          question: "Do approvers need to create an account?",
          answer: "No! They receive an email with a magic link. Click and approve - no signup needed.",
        },
        {
          question: "Can approvers reply via email?",
          answer: "They should click the link to approve. Email replies are tracked but action requires the link.",
        },
        {
          question: "How do you prevent approval link forwarding?",
          answer: "Links can be set to single-use or expire after a set time (7 days default).",
        },
        {
          question: "What email provider do you use?",
          answer: "We use Postmark for reliable, fast email delivery with excellent deliverability.",
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
