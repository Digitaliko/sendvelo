import type { LandingPageConfig } from "../schema";

export const noSignupApproval: LandingPageConfig = {
  slug: "no-signup-approval",
  category: "feature",
  status: "published",
  priority: 0.8,

  seo: {
    title: "No-Signup Guest Approvals | Thumbway",
    description: "Thumbway's magic links let anyone approve without creating an account.",
    keywords: ["no signup approval", "magic link approval", "guest approval", "frictionless approval"],
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
      headline: "No Account",
      highlightedText: "No Problem",
      subheadline: "Reviewers click a link and approve. No signup, no login, no friction. Magic link simplicity.",
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
          icon: "Lock",
          title: "Account Fatigue",
          description: "'Another login to remember? No thanks.'",
        },
        {
          icon: "Users",
          title: "External Reviewers",
          description: "Clients don't want accounts in your tool.",
        },
        {
          icon: "Clock",
          title: "Signup Friction",
          description: "Every step reduces completion.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's magic links let anyone approve without creating an account.",
      features: [
        {
          icon: "Link",
          title: "Magic Links",
          description: "Unique, secure links per reviewer.",
        },
        {
          icon: "Lock",
          title: "No Account",
          description: "Zero signup required.",
        },
        {
          icon: "Shield",
          title: "Secure",
          description: "Links expire, can be single-use.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Link",
          title: "Magic Links",
          description: "Unique, secure links per reviewer.",
        },
        {
          icon: "Lock",
          title: "No Account",
          description: "Zero signup required.",
        },
        {
          icon: "Shield",
          title: "Secure",
          description: "Links expire, can be single-use.",
        },
        {
          icon: "ThumbsUp",
          title: "One-Click Action",
          description: "Open link, click approve.",
        },
        {
          icon: "Globe",
          title: "Works Anywhere",
          description: "Any browser, any device.",
        },
        {
          icon: "Users",
          title: "Unlimited Reviewers",
          description: "Add anyone via email.",
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
          question: "How are magic links secured?",
          answer: "Links are unique per reviewer, expire after 7 days (configurable), and can be set to single-use.",
        },
        {
          question: "Can links be forwarded?",
          answer: "Yes, but the action (approve/reject) is attributed to the original recipient. Consider single-use links for sensitive content.",
        },
        {
          question: "What if someone loses the link?",
          answer: "You can resend the approval request, generating a new magic link.",
        },
        {
          question: "Is this secure for sensitive content?",
          answer: "Yes! Links are cryptographically secure. For extra security, use single-use links and short expiration.",
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
