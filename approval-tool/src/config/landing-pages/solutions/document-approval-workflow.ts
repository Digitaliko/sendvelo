import type { LandingPageConfig } from "../schema";

export const documentApprovalWorkflow: LandingPageConfig = {
  slug: "document-approval-workflow",
  category: "solution",
  status: "published",
  priority: 0.8,

  seo: {
    title: "Document Approval Workflow | Thumbway",
    description: "Thumbway streamlines document approval workflows for faster turnaround.",
    keywords: ["document approval workflow", "document sign-off", "approval process", "document management"],
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
      headline: "Document Approvals",
      highlightedText: "Simplified",
      subheadline: "Get sign-off on proposals, contracts, and documents faster than ever. No more email back-and-forth.",
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
          title: "Version Chaos",
          description: "final_v2_REALLY_FINAL.docx confusion.",
        },
        {
          icon: "Clock",
          title: "Slow Turnaround",
          description: "Documents sit in review queues for days.",
        },
        {
          icon: "Eye",
          title: "No Visibility",
          description: "Unknown if reviewers even opened the document.",
        },
      ],
    },

    solution: {
      headline: "The Solution",
      description: "Thumbway streamlines document approval workflows for faster turnaround.",
      features: [
        {
          icon: "FileText",
          title: "Clean Preview",
          description: "Documents rendered beautifully for review.",
        },
        {
          icon: "RefreshCw",
          title: "Version Control",
          description: "Track all versions automatically.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Reviewers comment on specific sections.",
        },
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
        {
          icon: "FileText",
          title: "Clean Preview",
          description: "Documents rendered beautifully for review.",
        },
        {
          icon: "RefreshCw",
          title: "Version Control",
          description: "Track all versions automatically.",
        },
        {
          icon: "MessageSquare",
          title: "Inline Comments",
          description: "Reviewers comment on specific sections.",
        },
        {
          icon: "ThumbsUp",
          title: "Simple Actions",
          description: "Approve, reject, or request changes.",
        },
        {
          icon: "Eye",
          title: "Read Tracking",
          description: "See when and how long they reviewed.",
        },
        {
          icon: "Shield",
          title: "Secure Sharing",
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
          question: "What document formats are supported?",
          answer: "Thumbway works with text content from ChatGPT. For formatted documents, paste the content into ChatGPT first.",
        },
        {
          question: "Can reviewers download the document?",
          answer: "Yes, reviewers can view and copy the content. Full download options coming soon.",
        },
        {
          question: "How is version history tracked?",
          answer: "Each time you send a revised version, Thumbway creates a new version linked to the original request.",
        },
        {
          question: "Is there e-signature integration?",
          answer: "Not yet, but it's on our roadmap. For now, approved documents are ready for your e-signature tool.",
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
