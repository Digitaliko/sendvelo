import type { LandingPageConfig } from "../schema";

export const marketingTeams: LandingPageConfig = {
  slug: "marketing-teams",
  category: "audience",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Content Approval for Marketing Teams | Thumbway",
    description: "Marketing teams use Thumbway to accelerate content approvals and hit deadlines.",
    keywords: ["marketing approval workflow", "content approval software", "marketing team tools", "content sign-off"],
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
      headline: "Ship Content Faster with",
      highlightedText: "Instant Approvals",
      subheadline: "Stop losing hours to email approval chains. Get stakeholder sign-off in minutes, not days.",
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
          title: "Deadline Pressure",
          description: "92% of marketing teams miss deadlines due to slow approvals.",
        },
        {
          icon: "Users",
          title: "Too Many Stakeholders",
          description: "Getting 5 people to agree on a single email is exhausting.",
        },
        {
          icon: "Mail",
          title: "Email Thread Chaos",
          description: "Version 7_final_FINAL_v2.docx sound familiar?",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Marketing teams use Thumbway to accelerate content approvals and hit deadlines.",
      features: [
        {
          icon: "Users",
          title: "Multi-Reviewer Support",
          description: "Parallel, sequential, or any-one-approves workflows.",
        },
        {
          icon: "Slack",
          title: "Slack Integration",
          description: "Approve content directly from Slack.",
        },
        {
          icon: "RefreshCw",
          title: "Version Control",
          description: "Track all versions with side-by-side comparison.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Users",
          title: "Multi-Reviewer Support",
          description: "Parallel, sequential, or any-one-approves workflows.",
        },
        {
          icon: "Slack",
          title: "Slack Integration",
          description: "Approve content directly from Slack.",
        },
        {
          icon: "RefreshCw",
          title: "Version Control",
          description: "Track all versions with side-by-side comparison.",
        },
        {
          icon: "BarChart",
          title: "Team Analytics",
          description: "See who's the bottleneck in your approval process.",
        },
        {
          icon: "Bell",
          title: "Smart Notifications",
          description: "Batch notifications to prevent fatigue.",
        },
        {
          icon: "Zap",
          title: "Instant Updates",
          description: "Real-time status updates for the whole team.",
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
          question: "Can multiple people approve the same content?",
          answer: "Yes! Thumbway supports multi-reviewer workflows including parallel approvals, sequential chains, and any-one-approves scenarios.",
        },
        {
          question: "Does it integrate with Slack?",
          answer: "Yes, our Team tier includes Slack integration. Reviewers can approve directly from Slack without visiting a separate page.",
        },
        {
          question: "How do we handle revisions?",
          answer: "Thumbway tracks all versions automatically. When you send a revised version, reviewers see a clear comparison.",
        },
        {
          question: "What's the pricing for teams?",
          answer: "Our Team tier is $49/month for unlimited team members - no per-user pricing.",
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
