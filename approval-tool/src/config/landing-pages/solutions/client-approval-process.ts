import type { LandingPageConfig } from "../schema";

export const clientApprovalProcess: LandingPageConfig = {
  slug: "client-approval-process",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Streamline Your Client Approval Process | Thumbway",
    description: "Thumbway makes client approvals fast and frictionless with one-click sign-off.",
    keywords: ["client approval process", "client sign-off", "approval workflow", "client feedback"],
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
      headline: "Client Approvals",
      highlightedText: "Made Simple",
      subheadline: "Stop the email back-and-forth. Give clients a frictionless way to approve your work.",
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
          description: "Approval requests buried in client inboxes.",
        },
        {
          icon: "Clock",
          title: "Delayed Feedback",
          description: "Days waiting for a simple yes or no.",
        },
        {
          icon: "Lock",
          title: "Signup Friction",
          description: "Clients don't want another account.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway makes client approvals fast and frictionless with one-click sign-off.",
      features: [
        {
          icon: "ThumbsUp",
          title: "One-Click Approval",
          description: "Clients approve with a single click.",
        },
        {
          icon: "Lock",
          title: "No Signup Required",
          description: "Magic links, no account needed.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Optimized",
          description: "Perfect on any device.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "ThumbsUp",
          title: "One-Click Approval",
          description: "Clients approve with a single click.",
        },
        {
          icon: "Lock",
          title: "No Signup Required",
          description: "Magic links, no account needed.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Optimized",
          description: "Perfect on any device.",
        },
        {
          icon: "Award",
          title: "Professional Look",
          description: "Branded approval pages.",
        },
        {
          icon: "Bell",
          title: "Smart Reminders",
          description: "Gentle nudges prevent ghosting.",
        },
        {
          icon: "MessageSquare",
          title: "Easy Feedback",
          description: "Comments without email threads.",
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
          question: "Do clients need to create an account?",
          answer: "No! Clients receive a magic link and can approve or comment without any signup.",
        },
        {
          question: "Can I customize the approval page?",
          answer: "Yes, add your logo and brand colors on Team tier and above.",
        },
        {
          question: "What if clients have feedback?",
          answer: "Clients can add comments, request changes, or approve. You're notified instantly.",
        },
        {
          question: "Is it mobile-friendly?",
          answer: "Absolutely. The approval page is optimized for one-tap approval on mobile devices.",
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
