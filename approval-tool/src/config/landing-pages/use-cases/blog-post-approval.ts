import type { LandingPageConfig } from "../schema";

export const blogPostApproval: LandingPageConfig = {
  slug: "blog-post-approval",
  category: "use-case",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Blog Post Approval Workflow | Thumbway",
    description: "Streamline your blog post approval workflow with Thumbway.",
    keywords: ["blog post approval", "content approval", "blog workflow", "editorial approval"],
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
      headline: "Blog Post Approvals",
      highlightedText: "Streamlined",
      subheadline: "Get stakeholder sign-off on AI-generated blog posts before publishing. Fast and organized.",
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
          icon: "FileText",
          title: "AI-Drafted Posts",
          description: "ChatGPT drafts great blog content.",
        },
        {
          icon: "Users",
          title: "Multiple Reviewers",
          description: "Editor, legal, brand, stakeholders.",
        },
        {
          icon: "Clock",
          title: "Publication Delays",
          description: "Waiting days for final sign-off.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Streamline your blog post approval workflow with Thumbway.",
      features: [
        {
          icon: "Users",
          title: "Multi-Reviewer",
          description: "Route to all stakeholders at once.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Feedback on specific sections.",
        },
        {
          icon: "RefreshCw",
          title: "Version Tracking",
          description: "Clear revision history.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Users",
          title: "Multi-Reviewer",
          description: "Route to all stakeholders at once.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Feedback on specific sections.",
        },
        {
          icon: "RefreshCw",
          title: "Version Tracking",
          description: "Clear revision history.",
        },
        {
          icon: "Check",
          title: "Final Approval",
          description: "One clear sign-off to publish.",
        },
        {
          icon: "Calendar",
          title: "Deadline Tracking",
          description: "Hit your publishing schedule.",
        },
        {
          icon: "Zap",
          title: "ChatGPT Native",
          description: "Draft and send without switching tools.",
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
          question: "Can multiple editors review simultaneously?",
          answer: "Yes! Use parallel approval to get feedback from all reviewers at once.",
        },
        {
          question: "How do we handle revisions?",
          answer: "Make edits in ChatGPT, send revised version. Reviewers see clear version history.",
        },
        {
          question: "Can we set a publication deadline?",
          answer: "Yes, add expected dates. Auto-reminders help hit your schedule.",
        },
        {
          question: "Is there an editorial calendar view?",
          answer: "Coming soon! For now, use filters to view posts by status and date.",
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
