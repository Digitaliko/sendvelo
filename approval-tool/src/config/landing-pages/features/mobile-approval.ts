import type { LandingPageConfig } from "../schema";

export const mobileApproval: LandingPageConfig = {
  slug: "mobile-approval",
  category: "feature",
  status: "published",
  priority: 0.8,

  seo: {
    title: "One-Tap Mobile Approval | Thumbway",
    description: "Thumbway's mobile-optimized approval pages enable one-tap approvals from any device.",
    keywords: ["mobile approval", "mobile-friendly approval", "approve on phone", "mobile workflow"],
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
      headline: "Approve Anywhere",
      highlightedText: "With One Tap",
      subheadline: "Mobile-first approval pages that make saying 'yes' effortless. No pinching, zooming, or frustration.",
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
          icon: "Smartphone",
          title: "Clunky Mobile",
          description: "Most approval tools are desktop-only.",
        },
        {
          icon: "ThumbsUp",
          title: "Tiny Buttons",
          description: "Approval buttons you can't click.",
        },
        {
          icon: "Clock",
          title: "Delayed Response",
          description: "'I'll approve when I'm at my desk.'",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway's mobile-optimized approval pages enable one-tap approvals from any device.",
      features: [
        {
          icon: "Smartphone",
          title: "Mobile First",
          description: "Designed for phone screens.",
        },
        {
          icon: "ThumbsUp",
          title: "Big Tap Target",
          description: "Easy to hit on any device.",
        },
        {
          icon: "Zap",
          title: "Fast Load",
          description: "Under 2 seconds on mobile.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Smartphone",
          title: "Mobile First",
          description: "Designed for phone screens.",
        },
        {
          icon: "ThumbsUp",
          title: "Big Tap Target",
          description: "Easy to hit on any device.",
        },
        {
          icon: "Zap",
          title: "Fast Load",
          description: "Under 2 seconds on mobile.",
        },
        {
          icon: "Eye",
          title: "Clean Preview",
          description: "Content optimized for mobile reading.",
        },
        {
          icon: "Globe",
          title: "Any Device",
          description: "Works on iOS, Android, any browser.",
        },
        {
          icon: "Lock",
          title: "Secure",
          description: "Magic links with expiration.",
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
          question: "Is there a mobile app?",
          answer: "No app needed! Approval pages are fully responsive web pages that work in any mobile browser.",
        },
        {
          question: "How fast do pages load on mobile?",
          answer: "Under 2 seconds on average mobile connections. Optimized for performance.",
        },
        {
          question: "Can I add to home screen?",
          answer: "Yes! PWA support allows 'Add to Home Screen' for quick access.",
        },
        {
          question: "What about offline approval?",
          answer: "Approvals require internet connection, but the form is lightweight for poor connections.",
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
