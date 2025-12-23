import type { LandingPageConfig } from "../schema";

export const contentApprovalWorkflow: LandingPageConfig = {
  slug: "content-approval-workflow",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Content Approval Workflow Software | Thumbway",
    description: "Streamline your content approval workflow with Thumbway's ChatGPT-native platform.",
    keywords: ["content approval workflow", "content approval software", "approval workflow automation", "ChatGPT content approval"],
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
      headline: "Content Approval Workflow",
      highlightedText: "That Actually Works",
      subheadline: "Stop chasing stakeholders for feedback. Get approval on AI-generated content in minutes, not days.",
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
          title: "Endless Waiting",
          description: "Stakeholders take days to respond to approval requests.",
        },
        {
          icon: "Mail",
          title: "Email Chaos",
          description: "Approval threads get lost in overflowing inboxes.",
        },
        {
          icon: "Users",
          title: "Too Many Tools",
          description: "Copy from ChatGPT, paste to Docs, share via email.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Streamline your content approval workflow with Thumbway's ChatGPT-native platform.",
      features: [
        {
          icon: "Zap",
          title: "ChatGPT Integration",
          description: "Native integration via MCP protocol.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Clients approve on any device with one tap.",
        },
        {
          icon: "Users",
          title: "No Signup Required",
          description: "Reviewers never need an account.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "Zap",
          title: "ChatGPT Integration",
          description: "Native integration via MCP protocol.",
        },
        {
          icon: "Smartphone",
          title: "Mobile Approval",
          description: "Clients approve on any device with one tap.",
        },
        {
          icon: "Users",
          title: "No Signup Required",
          description: "Reviewers never need an account.",
        },
        {
          icon: "Eye",
          title: "Engagement Tracking",
          description: "See when content is viewed.",
        },
        {
          icon: "Bell",
          title: "Auto Reminders",
          description: "Automatic follow-ups keep things moving.",
        },
        {
          icon: "Shield",
          title: "Audit Trail",
          description: "Complete history of all approvals.",
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
          question: "What types of content can I approve?",
          answer: "Any text content: blog posts, emails, proposals, social media, press releases, and more.",
        },
        {
          question: "How does the ChatGPT integration work?",
          answer: "Thumbway uses MCP (Model Context Protocol) to integrate directly with ChatGPT. Just say 'send for approval' and we handle the rest.",
        },
        {
          question: "Is there a free tier?",
          answer: "Yes! 5 approvals per month for free. Perfect for trying Thumbway before committing.",
        },
        {
          question: "Can multiple people approve the same content?",
          answer: "Yes, Thumbway supports multi-reviewer workflows including parallel, sequential, or any-one-approves.",
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
