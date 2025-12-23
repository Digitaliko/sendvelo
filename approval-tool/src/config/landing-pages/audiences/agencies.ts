import type { LandingPageConfig } from "../schema";

export const agencies: LandingPageConfig = {
  slug: "agencies",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Client Approval Platform for Agencies | Thumbway",
    description: "Agencies use Thumbway to streamline client approvals across multiple projects.",
    keywords: ["agency approval tool", "client approval platform", "agency workflow", "multi-client approval"],
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
      headline: "Manage Client Approvals",
      highlightedText: "Across All Projects",
      subheadline: "Stop juggling email threads across multiple clients. One platform for all your approval workflows.",
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
          icon: "Layers",
          title: "Multiple Clients",
          description: "Tracking approvals across 10+ clients is a nightmare.",
        },
        {
          icon: "Clock",
          title: "Revision Cycles",
          description: "Agencies spend 25-40% of project time on revisions.",
        },
        {
          icon: "Users",
          title: "Client Stakeholders",
          description: "Each client has 3-5 people who need to approve.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Agencies use Thumbway to streamline client approvals across multiple projects.",
      features: [
        {
          icon: "Layers",
          title: "Multi-Project Dashboard",
          description: "See all pending approvals across clients.",
        },
        {
          icon: "Users",
          title: "Client Workspaces",
          description: "Organize approvals by client or project.",
        },
        {
          icon: "Shield",
          title: "White-Label Option",
          description: "Remove Thumbway branding (Business tier).",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Layers",
          title: "Multi-Project Dashboard",
          description: "See all pending approvals across clients.",
        },
        {
          icon: "Users",
          title: "Client Workspaces",
          description: "Organize approvals by client or project.",
        },
        {
          icon: "Shield",
          title: "White-Label Option",
          description: "Remove Thumbway branding (Business tier).",
        },
        {
          icon: "FileText",
          title: "Brand Guidelines",
          description: "Custom approval pages per client.",
        },
        {
          icon: "BarChart",
          title: "Client Reports",
          description: "Show clients how quickly you deliver.",
        },
        {
          icon: "Award",
          title: "Professional Experience",
          description: "Impress clients with polished approval UX.",
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
          question: "Can we white-label the approval pages?",
          answer: "Yes! Our Business tier includes custom branding options. Remove 'Powered by Thumbway' and add your agency's logo.",
        },
        {
          question: "How do we organize multiple clients?",
          answer: "Create separate workspaces for each client. Team members can be assigned to specific workspaces.",
        },
        {
          question: "Can clients see each other's approvals?",
          answer: "No, client data is completely isolated. Each client only sees their own approval requests.",
        },
        {
          question: "What's the pricing for agencies?",
          answer: "Most agencies use our Team ($49/mo) or Business ($99/mo) tier. Both include unlimited team members.",
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
