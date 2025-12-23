/**
 * Landing Page Config Generator
 *
 * Generates 60+ landing page config files with keyword-optimized content.
 * Run with: npx tsx scripts/generate-landing-pages.ts
 */

import * as fs from "fs";
import * as path from "path";

interface PageDefinition {
  slug: string;
  category: string;
  title: string;
  headline: string;
  highlightedText?: string;
  subheadline: string;
  description: string;
  keywords: string[];
  problems: Array<{ icon: string; title: string; description: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  comparison?: {
    competitorName: string;
    rows: Array<{ feature: string; thumbway: boolean | string; competitor: boolean | string }>;
  };
}

// Base template for common sections
const baseTestimonials = [
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
];

const baseBenefits = [
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
];

const baseHowItWorks = [
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
];

// Page definitions organized by category
const pageDefinitions: PageDefinition[] = [
  // AUDIENCES (10 pages)
  {
    slug: "freelancers",
    category: "audience",
    title: "Approval Workflow for Freelancers | Thumbway",
    headline: "Stop Chasing Clients for",
    highlightedText: "Approvals",
    subheadline: "Get instant feedback on proposals, contracts, and deliverables. No more waiting days for a simple 'yes'.",
    description: "Thumbway helps freelancers get faster client approvals directly from ChatGPT.",
    keywords: ["freelancer approval tool", "client approval for freelancers", "proposal approval software", "freelance workflow"],
    problems: [
      { icon: "Clock", title: "Client Ghosting", description: "Sent a proposal 3 days ago? Still waiting for a response." },
      { icon: "Mail", title: "Email Black Hole", description: "Your proposals get buried in overflowing client inboxes." },
      { icon: "Eye", title: "Zero Visibility", description: "No idea if they've even opened your proposal." },
    ],
    features: [
      { icon: "Eye", title: "Engagement Tracking", description: "Know exactly when clients view your proposals." },
      { icon: "Bell", title: "Auto-Reminders", description: "Automatic follow-ups prevent ghosting." },
      { icon: "ThumbsUp", title: "One-Tap Approval", description: "Clients approve with a single tap on mobile." },
      { icon: "Zap", title: "ChatGPT Integration", description: "Send for approval without leaving ChatGPT." },
      { icon: "FileText", title: "Professional Pages", description: "Beautiful, branded approval pages." },
      { icon: "Shield", title: "Audit Trail", description: "Complete history of all approvals." },
    ],
    faqs: [
      { question: "Do my clients need a Thumbway account?", answer: "No! Clients receive a magic link via email and can approve with one click. No signup required." },
      { question: "Can I track if my client viewed my proposal?", answer: "Yes! Thumbway shows you exactly when clients open and view your proposals, so you know the best time to follow up." },
      { question: "Is there a free plan for freelancers?", answer: "Yes, our Free tier includes 5 approvals per month - perfect for getting started." },
      { question: "Can I send proposals created outside ChatGPT?", answer: "Currently Thumbway works directly with ChatGPT. Copy your content into ChatGPT, then send for approval." },
    ],
  },
  {
    slug: "marketing-teams",
    category: "audience",
    title: "Content Approval for Marketing Teams | Thumbway",
    headline: "Ship Content Faster with",
    highlightedText: "Instant Approvals",
    subheadline: "Stop losing hours to email approval chains. Get stakeholder sign-off in minutes, not days.",
    description: "Marketing teams use Thumbway to accelerate content approvals and hit deadlines.",
    keywords: ["marketing approval workflow", "content approval software", "marketing team tools", "content sign-off"],
    problems: [
      { icon: "Clock", title: "Deadline Pressure", description: "92% of marketing teams miss deadlines due to slow approvals." },
      { icon: "Users", title: "Too Many Stakeholders", description: "Getting 5 people to agree on a single email is exhausting." },
      { icon: "Mail", title: "Email Thread Chaos", description: "Version 7_final_FINAL_v2.docx sound familiar?" },
    ],
    features: [
      { icon: "Users", title: "Multi-Reviewer Support", description: "Parallel, sequential, or any-one-approves workflows." },
      { icon: "Slack", title: "Slack Integration", description: "Approve content directly from Slack." },
      { icon: "RefreshCw", title: "Version Control", description: "Track all versions with side-by-side comparison." },
      { icon: "BarChart", title: "Team Analytics", description: "See who's the bottleneck in your approval process." },
      { icon: "Bell", title: "Smart Notifications", description: "Batch notifications to prevent fatigue." },
      { icon: "Zap", title: "Instant Updates", description: "Real-time status updates for the whole team." },
    ],
    faqs: [
      { question: "Can multiple people approve the same content?", answer: "Yes! Thumbway supports multi-reviewer workflows including parallel approvals, sequential chains, and any-one-approves scenarios." },
      { question: "Does it integrate with Slack?", answer: "Yes, our Team tier includes Slack integration. Reviewers can approve directly from Slack without visiting a separate page." },
      { question: "How do we handle revisions?", answer: "Thumbway tracks all versions automatically. When you send a revised version, reviewers see a clear comparison." },
      { question: "What's the pricing for teams?", answer: "Our Team tier is $49/month for unlimited team members - no per-user pricing." },
    ],
  },
  {
    slug: "sales-teams",
    category: "audience",
    title: "Proposal Approval for Sales Teams | Thumbway",
    headline: "Close Deals Faster with",
    highlightedText: "Instant Proposal Approvals",
    subheadline: "Get client sign-off on proposals in minutes. Speed up your sales cycle and increase close rates.",
    description: "Sales teams use Thumbway to accelerate proposal approvals and close more deals.",
    keywords: ["sales proposal approval", "proposal sign-off software", "sales workflow tools", "deal acceleration"],
    problems: [
      { icon: "Clock", title: "Slow Close Rates", description: "Proposals sitting in inboxes while deals go cold." },
      { icon: "Target", title: "Lost Momentum", description: "By the time they respond, they've forgotten why they were excited." },
      { icon: "DollarSign", title: "Revenue Delay", description: "Every day waiting is a day without revenue." },
    ],
    features: [
      { icon: "Zap", title: "Instant Delivery", description: "Proposals sent directly from ChatGPT to client inbox." },
      { icon: "Eye", title: "View Tracking", description: "Know when prospects open your proposal." },
      { icon: "Smartphone", title: "Mobile Approval", description: "Clients approve on the go with one tap." },
      { icon: "Bell", title: "Follow-up Automation", description: "Smart reminders keep deals moving." },
      { icon: "FileCheck", title: "E-signatures Ready", description: "Approved proposals ready for signature." },
      { icon: "BarChart", title: "Pipeline Visibility", description: "Track all pending approvals in one view." },
    ],
    faqs: [
      { question: "How quickly do clients typically respond?", answer: "Most clients respond within 2 hours when using Thumbway vs 2+ days with email. The mobile-friendly approval page makes it easy to respond immediately." },
      { question: "Can I track which parts of the proposal they read?", answer: "Yes, engagement tracking shows how long they spent on each section of your proposal." },
      { question: "Does it integrate with our CRM?", answer: "We're building CRM integrations. For now, you can track approvals in Thumbway and manually update your CRM." },
      { question: "What if they need to discuss with their team?", answer: "They can add comments and forward the approval link to colleagues. Everyone's feedback is tracked." },
    ],
  },
  {
    slug: "agencies",
    category: "audience",
    title: "Client Approval Platform for Agencies | Thumbway",
    headline: "Manage Client Approvals",
    highlightedText: "Across All Projects",
    subheadline: "Stop juggling email threads across multiple clients. One platform for all your approval workflows.",
    description: "Agencies use Thumbway to streamline client approvals across multiple projects.",
    keywords: ["agency approval tool", "client approval platform", "agency workflow", "multi-client approval"],
    problems: [
      { icon: "Layers", title: "Multiple Clients", description: "Tracking approvals across 10+ clients is a nightmare." },
      { icon: "Clock", title: "Revision Cycles", description: "Agencies spend 25-40% of project time on revisions." },
      { icon: "Users", title: "Client Stakeholders", description: "Each client has 3-5 people who need to approve." },
    ],
    features: [
      { icon: "Layers", title: "Multi-Project Dashboard", description: "See all pending approvals across clients." },
      { icon: "Users", title: "Client Workspaces", description: "Organize approvals by client or project." },
      { icon: "Shield", title: "White-Label Option", description: "Remove Thumbway branding (Business tier)." },
      { icon: "FileText", title: "Brand Guidelines", description: "Custom approval pages per client." },
      { icon: "BarChart", title: "Client Reports", description: "Show clients how quickly you deliver." },
      { icon: "Award", title: "Professional Experience", description: "Impress clients with polished approval UX." },
    ],
    faqs: [
      { question: "Can we white-label the approval pages?", answer: "Yes! Our Business tier includes custom branding options. Remove 'Powered by Thumbway' and add your agency's logo." },
      { question: "How do we organize multiple clients?", answer: "Create separate workspaces for each client. Team members can be assigned to specific workspaces." },
      { question: "Can clients see each other's approvals?", answer: "No, client data is completely isolated. Each client only sees their own approval requests." },
      { question: "What's the pricing for agencies?", answer: "Most agencies use our Team ($49/mo) or Business ($99/mo) tier. Both include unlimited team members." },
    ],
  },
  {
    slug: "consultants",
    category: "audience",
    title: "Proposal Approval for Consultants | Thumbway",
    headline: "Get Client Buy-In",
    highlightedText: "Without the Wait",
    subheadline: "Send proposals, strategies, and recommendations for approval in seconds. Know when clients engage.",
    description: "Consultants use Thumbway to get faster client approvals on proposals and deliverables.",
    keywords: ["consultant approval tool", "consulting proposal software", "client sign-off", "consulting workflow"],
    problems: [
      { icon: "Clock", title: "Long Approval Cycles", description: "Waiting weeks for clients to review your strategy." },
      { icon: "Eye", title: "Uncertain Engagement", description: "Did they read the 50-page deck or just skim it?" },
      { icon: "DollarSign", title: "Delayed Billing", description: "Can't invoice until they approve the work." },
    ],
    features: [
      { icon: "Eye", title: "Read Receipts", description: "Know exactly when and how long they reviewed." },
      { icon: "MessageSquare", title: "Inline Comments", description: "Clients can comment on specific sections." },
      { icon: "FileText", title: "Document Support", description: "Proposals, strategies, recommendations." },
      { icon: "ThumbsUp", title: "Simple Approval", description: "One-click approve or request changes." },
      { icon: "Shield", title: "Audit Trail", description: "Complete history for project records." },
      { icon: "Zap", title: "ChatGPT Native", description: "Generate and send from one place." },
    ],
    faqs: [
      { question: "Can I track time spent on each section?", answer: "Yes, engagement tracking shows how long clients spent reviewing each part of your document." },
      { question: "What if they need changes?", answer: "Clients can request changes with specific comments. You'll be notified immediately and can send a revised version." },
      { question: "Can I use this for ongoing retainer work?", answer: "Absolutely. Many consultants use Thumbway for monthly reports, strategy updates, and deliverable approvals." },
      { question: "Is there a free trial?", answer: "Yes, start with our Free tier (5 approvals/month) or try Starter free for 14 days." },
    ],
  },
  {
    slug: "small-business",
    category: "audience",
    title: "Approval Workflow for Small Business | Thumbway",
    headline: "Simple Approvals for",
    highlightedText: "Busy Teams",
    subheadline: "No complex software. No per-user pricing. Just fast approvals that keep your business moving.",
    description: "Small businesses use Thumbway for simple, affordable approval workflows.",
    keywords: ["small business approval tool", "simple approval software", "affordable approval workflow", "smb tools"],
    problems: [
      { icon: "DollarSign", title: "Expensive Tools", description: "Enterprise software costs $500+/month for features you don't need." },
      { icon: "Settings", title: "Complex Setup", description: "Weeks of configuration just to send an approval." },
      { icon: "Users", title: "Per-User Pricing", description: "Every new team member increases your bill." },
    ],
    features: [
      { icon: "Zap", title: "5-Minute Setup", description: "Install and send your first approval in minutes." },
      { icon: "DollarSign", title: "Flat Pricing", description: "No per-user fees. Add unlimited team members." },
      { icon: "Smartphone", title: "Mobile Ready", description: "Works on any device, no app required." },
      { icon: "Lock", title: "Secure", description: "Enterprise-grade security without enterprise cost." },
      { icon: "ThumbsUp", title: "Simple UX", description: "Anyone can use it, no training needed." },
      { icon: "Award", title: "Free Tier", description: "Start free, upgrade when you need more." },
    ],
    faqs: [
      { question: "What makes Thumbway different from other approval tools?", answer: "Thumbway is ChatGPT-native, meaning you generate and send approvals without switching tools. Plus, flat pricing means unlimited team members." },
      { question: "Do we need technical expertise to set up?", answer: "No! If you can use ChatGPT, you can use Thumbway. Setup takes 5 minutes." },
      { question: "What's included in the Free tier?", answer: "5 approvals/month, email notifications, ChatGPT integration, and basic engagement tracking." },
      { question: "Can we upgrade later?", answer: "Yes, upgrade anytime. Your approval history and settings are preserved." },
    ],
  },
  {
    slug: "startups",
    category: "audience",
    title: "Content Approval for Startups | Thumbway",
    headline: "Move Fast",
    highlightedText: "Without Breaking Things",
    subheadline: "Get stakeholder alignment on content, proposals, and decisions in minutes. Built for speed.",
    description: "Startups use Thumbway to move fast while keeping stakeholders aligned.",
    keywords: ["startup approval tool", "fast approval software", "startup workflow", "agile approval"],
    problems: [
      { icon: "Rocket", title: "Speed is Everything", description: "Every hour waiting for approval is an hour behind competition." },
      { icon: "Users", title: "Lean Teams", description: "No bandwidth for complex approval workflows." },
      { icon: "DollarSign", title: "Budget Constraints", description: "Can't justify $500/month enterprise tools." },
    ],
    features: [
      { icon: "Zap", title: "Instant Send", description: "One command sends content for approval." },
      { icon: "Rocket", title: "Same-Day Approvals", description: "Most approvals completed in under an hour." },
      { icon: "DollarSign", title: "Startup Pricing", description: "Free tier + affordable paid plans." },
      { icon: "Code", title: "API Access", description: "Build custom workflows (Business tier)." },
      { icon: "Bot", title: "AI-Native", description: "Built for the ChatGPT generation." },
      { icon: "TrendingUp", title: "Scale With You", description: "From 2 people to 200, same tool." },
    ],
    faqs: [
      { question: "Is there a startup discount?", answer: "Our Free tier is generous (5 approvals/month) and Starter at $19/month is already startup-friendly. Contact us for special consideration." },
      { question: "Can we use this for investor updates?", answer: "Absolutely! Many founders use Thumbway to get quick feedback on investor updates before sending to their full list." },
      { question: "Does it scale as we grow?", answer: "Yes, from solo founder to 200-person company - Thumbway grows with you. No per-user pricing means no surprise bills." },
      { question: "Is there API access?", answer: "Yes, our Business tier includes API access for custom integrations and automated workflows." },
    ],
  },
  {
    slug: "enterprise",
    category: "audience",
    title: "Enterprise Approval Workflow | Thumbway",
    headline: "AI Content Governance at",
    highlightedText: "Enterprise Scale",
    subheadline: "Audit trails, SSO, compliance-ready workflows. Control AI-generated content without slowing teams down.",
    description: "Enterprise teams use Thumbway for secure, compliant approval workflows.",
    keywords: ["enterprise approval workflow", "ai content governance", "compliance approval", "enterprise software"],
    problems: [
      { icon: "Shield", title: "Compliance Requirements", description: "Every AI-generated document needs proper approval trails." },
      { icon: "Lock", title: "Security Concerns", description: "Sensitive content needs enterprise-grade protection." },
      { icon: "Users", title: "Scale Challenges", description: "Thousands of approvals per month across departments." },
    ],
    features: [
      { icon: "Lock", title: "SSO/SAML", description: "Single sign-on with your identity provider." },
      { icon: "Shield", title: "Audit Logs", description: "Complete, exportable approval history." },
      { icon: "Database", title: "Data Residency", description: "Choose where your data is stored." },
      { icon: "Users", title: "Role-Based Access", description: "Granular permissions by team or project." },
      { icon: "FileCheck", title: "Compliance Ready", description: "SOC 2, GDPR, HIPAA-friendly workflows." },
      { icon: "Briefcase", title: "Dedicated Support", description: "Named account manager and priority support." },
    ],
    faqs: [
      { question: "Is Thumbway SOC 2 compliant?", answer: "We're pursuing SOC 2 Type II certification (target Q4 2025). Contact us for our current security documentation." },
      { question: "Can we get a custom contract?", answer: "Yes, Enterprise customers receive custom contracts including SLAs, DPAs, and security addendums." },
      { question: "What about data residency?", answer: "Enterprise tier includes data residency options. Specify US, EU, or other regions as required." },
      { question: "How do we get started?", answer: "Contact our sales team for a demo and custom pricing based on your requirements." },
    ],
  },
  {
    slug: "remote-teams",
    category: "audience",
    title: "Async Approval for Remote Teams | Thumbway",
    headline: "Async Approvals That",
    highlightedText: "Respect Time Zones",
    subheadline: "No more waiting for meetings to get sign-off. Approve content asynchronously, any time zone.",
    description: "Remote teams use Thumbway for timezone-friendly async approvals.",
    keywords: ["remote team approval", "async approval workflow", "distributed team tools", "timezone approval"],
    problems: [
      { icon: "Globe", title: "Timezone Hell", description: "Waiting 16 hours for someone in Singapore to wake up." },
      { icon: "Calendar", title: "Meeting Overload", description: "Scheduling syncs just to get a simple approval." },
      { icon: "Clock", title: "Context Switching", description: "Losing flow state to jump on approval calls." },
    ],
    features: [
      { icon: "Globe", title: "Async-First", description: "Designed for asynchronous workflows." },
      { icon: "Bell", title: "Smart Notifications", description: "Respect working hours and timezone settings." },
      { icon: "Smartphone", title: "Mobile Approval", description: "Approve from anywhere, any device." },
      { icon: "MessageSquare", title: "Threaded Comments", description: "Async discussions without meetings." },
      { icon: "Clock", title: "No Deadlines Required", description: "Auto-reminders keep things moving." },
      { icon: "Slack", title: "Slack Integration", description: "Approve without leaving your workflow." },
    ],
    faqs: [
      { question: "How do notifications work across time zones?", answer: "Reviewers can set their working hours. Notifications are batched and delivered at appropriate times." },
      { question: "Can we set approval deadlines?", answer: "Yes, but it's optional. Auto-reminders gently nudge reviewers without creating urgency." },
      { question: "Does it work with Slack?", answer: "Yes! Team tier includes Slack integration. Approve directly from Slack notifications." },
      { question: "What if someone is on vacation?", answer: "Set up backup approvers or use any-one-approves workflows to prevent blockers." },
    ],
  },
  {
    slug: "solopreneurs",
    category: "audience",
    title: "Approval Tool for Solopreneurs | Thumbway",
    headline: "Professional Approvals",
    highlightedText: "Without the Agency Price",
    subheadline: "Look like an agency. Work like a solopreneur. Get client approvals that build trust.",
    description: "Solopreneurs use Thumbway to deliver professional approval experiences to clients.",
    keywords: ["solopreneur tools", "one-person business", "freelancer approval", "client management"],
    problems: [
      { icon: "Users", title: "One-Person Show", description: "You're the strategist, creator, and project manager." },
      { icon: "Award", title: "Credibility Gap", description: "Clients wonder if you can handle their project." },
      { icon: "Clock", title: "Time Scarcity", description: "Every hour on admin is an hour not earning." },
    ],
    features: [
      { icon: "Award", title: "Professional Pages", description: "Branded approval pages that impress." },
      { icon: "Zap", title: "One-Command Send", description: "Zero admin overhead." },
      { icon: "Eye", title: "Client Insights", description: "Know when they're engaged." },
      { icon: "DollarSign", title: "Free Tier", description: "Start free, upgrade when you grow." },
      { icon: "ThumbsUp", title: "Simple UX", description: "Clients approve in seconds." },
      { icon: "Shield", title: "Audit Trail", description: "Protect yourself with approval records." },
    ],
    faqs: [
      { question: "Is the Free tier really free?", answer: "Yes! 5 approvals/month, no credit card required, no strings attached." },
      { question: "Can I customize the approval pages?", answer: "Basic branding is available on all tiers. Advanced customization on Team tier and above." },
      { question: "What if I get more than 5 clients?", answer: "Upgrade to Starter ($19/month) for unlimited approvals. Still cheaper than a single coffee per day." },
      { question: "Do clients see I'm using Thumbway?", answer: "Yes, unless you upgrade to Business tier which offers white-label options." },
    ],
  },

  // SOLUTIONS (12 pages)
  {
    slug: "content-approval-workflow",
    category: "solution",
    title: "Content Approval Workflow Software | Thumbway",
    headline: "Content Approval Workflow",
    highlightedText: "That Actually Works",
    subheadline: "Stop chasing stakeholders for feedback. Get approval on AI-generated content in minutes, not days.",
    description: "Streamline your content approval workflow with Thumbway's ChatGPT-native platform.",
    keywords: ["content approval workflow", "content approval software", "approval workflow automation", "ChatGPT content approval"],
    problems: [
      { icon: "Clock", title: "Endless Waiting", description: "Stakeholders take days to respond to approval requests." },
      { icon: "Mail", title: "Email Chaos", description: "Approval threads get lost in overflowing inboxes." },
      { icon: "Users", title: "Too Many Tools", description: "Copy from ChatGPT, paste to Docs, share via email." },
    ],
    features: [
      { icon: "Zap", title: "ChatGPT Integration", description: "Native integration via MCP protocol." },
      { icon: "Smartphone", title: "Mobile Approval", description: "Clients approve on any device with one tap." },
      { icon: "Users", title: "No Signup Required", description: "Reviewers never need an account." },
      { icon: "Eye", title: "Engagement Tracking", description: "See when content is viewed." },
      { icon: "Bell", title: "Auto Reminders", description: "Automatic follow-ups keep things moving." },
      { icon: "Shield", title: "Audit Trail", description: "Complete history of all approvals." },
    ],
    faqs: [
      { question: "What types of content can I approve?", answer: "Any text content: blog posts, emails, proposals, social media, press releases, and more." },
      { question: "How does the ChatGPT integration work?", answer: "Thumbway uses MCP (Model Context Protocol) to integrate directly with ChatGPT. Just say 'send for approval' and we handle the rest." },
      { question: "Is there a free tier?", answer: "Yes! 5 approvals per month for free. Perfect for trying Thumbway before committing." },
      { question: "Can multiple people approve the same content?", answer: "Yes, Thumbway supports multi-reviewer workflows including parallel, sequential, or any-one-approves." },
    ],
  },
  {
    slug: "document-approval-workflow",
    category: "solution",
    title: "Document Approval Workflow | Thumbway",
    headline: "Document Approvals",
    highlightedText: "Simplified",
    subheadline: "Get sign-off on proposals, contracts, and documents faster than ever. No more email back-and-forth.",
    description: "Thumbway streamlines document approval workflows for faster turnaround.",
    keywords: ["document approval workflow", "document sign-off", "approval process", "document management"],
    problems: [
      { icon: "FileText", title: "Version Chaos", description: "final_v2_REALLY_FINAL.docx confusion." },
      { icon: "Clock", title: "Slow Turnaround", description: "Documents sit in review queues for days." },
      { icon: "Eye", title: "No Visibility", description: "Unknown if reviewers even opened the document." },
    ],
    features: [
      { icon: "FileText", title: "Clean Preview", description: "Documents rendered beautifully for review." },
      { icon: "RefreshCw", title: "Version Control", description: "Track all versions automatically." },
      { icon: "MessageSquare", title: "Inline Comments", description: "Reviewers comment on specific sections." },
      { icon: "ThumbsUp", title: "Simple Actions", description: "Approve, reject, or request changes." },
      { icon: "Eye", title: "Read Tracking", description: "See when and how long they reviewed." },
      { icon: "Shield", title: "Secure Sharing", description: "Magic links with expiration." },
    ],
    faqs: [
      { question: "What document formats are supported?", answer: "Thumbway works with text content from ChatGPT. For formatted documents, paste the content into ChatGPT first." },
      { question: "Can reviewers download the document?", answer: "Yes, reviewers can view and copy the content. Full download options coming soon." },
      { question: "How is version history tracked?", answer: "Each time you send a revised version, Thumbway creates a new version linked to the original request." },
      { question: "Is there e-signature integration?", answer: "Not yet, but it's on our roadmap. For now, approved documents are ready for your e-signature tool." },
    ],
  },
  {
    slug: "approval-workflow-software",
    category: "solution",
    title: "Approval Workflow Software | Thumbway",
    headline: "Approval Workflow Software",
    highlightedText: "Built for AI",
    subheadline: "The first approval tool designed for the AI content generation era. Fast, simple, ChatGPT-native.",
    description: "Thumbway is the modern approval workflow software built for AI-generated content.",
    keywords: ["approval workflow software", "approval automation", "workflow management", "approval tool"],
    problems: [
      { icon: "Settings", title: "Complex Tools", description: "Enterprise software with steep learning curves." },
      { icon: "DollarSign", title: "High Cost", description: "$500+/month for features you don't need." },
      { icon: "Bot", title: "Not AI-Ready", description: "Built before the AI content revolution." },
    ],
    features: [
      { icon: "Bot", title: "AI-Native", description: "Built specifically for AI-generated content." },
      { icon: "Zap", title: "5-Minute Setup", description: "No complex configuration required." },
      { icon: "DollarSign", title: "Affordable", description: "Starting at $0/month. No per-user fees." },
      { icon: "Smartphone", title: "Modern UX", description: "Mobile-first, clean, intuitive." },
      { icon: "Globe", title: "Works Anywhere", description: "Web-based, no installation needed." },
      { icon: "TrendingUp", title: "Scales With You", description: "From 1 to 1000 users, same simple tool." },
    ],
    faqs: [
      { question: "How is Thumbway different from other approval software?", answer: "Thumbway is the only approval tool that lives inside ChatGPT. Generate content and send for approval without switching tools." },
      { question: "Do I need technical skills to set up?", answer: "No! If you can use ChatGPT, you can use Thumbway. Setup takes about 5 minutes." },
      { question: "What's the pricing model?", answer: "Flat monthly pricing (no per-user fees): Free ($0), Starter ($19), Team ($49), Business ($99)." },
      { question: "Can I try before buying?", answer: "Yes! Start with our Free tier (5 approvals/month) or get a 14-day trial of paid features." },
    ],
  },
  {
    slug: "client-approval-process",
    category: "solution",
    title: "Streamline Your Client Approval Process | Thumbway",
    headline: "Client Approvals",
    highlightedText: "Made Simple",
    subheadline: "Stop the email back-and-forth. Give clients a frictionless way to approve your work.",
    description: "Thumbway makes client approvals fast and frictionless with one-click sign-off.",
    keywords: ["client approval process", "client sign-off", "approval workflow", "client feedback"],
    problems: [
      { icon: "Mail", title: "Email Overload", description: "Approval requests buried in client inboxes." },
      { icon: "Clock", title: "Delayed Feedback", description: "Days waiting for a simple yes or no." },
      { icon: "Lock", title: "Signup Friction", description: "Clients don't want another account." },
    ],
    features: [
      { icon: "ThumbsUp", title: "One-Click Approval", description: "Clients approve with a single click." },
      { icon: "Lock", title: "No Signup Required", description: "Magic links, no account needed." },
      { icon: "Smartphone", title: "Mobile Optimized", description: "Perfect on any device." },
      { icon: "Award", title: "Professional Look", description: "Branded approval pages." },
      { icon: "Bell", title: "Smart Reminders", description: "Gentle nudges prevent ghosting." },
      { icon: "MessageSquare", title: "Easy Feedback", description: "Comments without email threads." },
    ],
    faqs: [
      { question: "Do clients need to create an account?", answer: "No! Clients receive a magic link and can approve or comment without any signup." },
      { question: "Can I customize the approval page?", answer: "Yes, add your logo and brand colors on Team tier and above." },
      { question: "What if clients have feedback?", answer: "Clients can add comments, request changes, or approve. You're notified instantly." },
      { question: "Is it mobile-friendly?", answer: "Absolutely. The approval page is optimized for one-tap approval on mobile devices." },
    ],
  },
  {
    slug: "speed-up-approval-process",
    category: "solution",
    title: "How to Speed Up Your Approval Process | Thumbway",
    headline: "Speed Up Your",
    highlightedText: "Approval Process 10x",
    subheadline: "Go from 2-day approval cycles to 2-minute turnaround. Here's how.",
    description: "Learn how Thumbway can accelerate your approval process by 95%.",
    keywords: ["speed up approval process", "faster approvals", "approval efficiency", "reduce approval time"],
    problems: [
      { icon: "Clock", title: "2-Day Average", description: "Most content waits 48+ hours for approval." },
      { icon: "Mail", title: "Lost in Email", description: "Approval requests compete with 100+ daily emails." },
      { icon: "Users", title: "Bottleneck People", description: "One slow approver delays everything." },
    ],
    features: [
      { icon: "Zap", title: "Instant Delivery", description: "Content delivered directly to approvers." },
      { icon: "Smartphone", title: "One-Tap Approval", description: "Mobile-first design enables quick response." },
      { icon: "Bell", title: "Smart Reminders", description: "Automated follow-ups keep momentum." },
      { icon: "Users", title: "Parallel Approvals", description: "Multiple approvers at once." },
      { icon: "BarChart", title: "Bottleneck Analytics", description: "Identify and fix slow points." },
      { icon: "Eye", title: "Real-Time Status", description: "Always know where approvals stand." },
    ],
    faqs: [
      { question: "How much faster is Thumbway really?", answer: "Our users report 95% reduction in approval time - from an average of 48 hours to under 2 hours." },
      { question: "What makes approvals faster?", answer: "Mobile-friendly pages, one-tap approval, no login required, and smart reminder sequences." },
      { question: "Can I see who's holding up approvals?", answer: "Yes! Analytics show average approval time per reviewer so you can identify bottlenecks." },
      { question: "What if an approver is out of office?", answer: "Set up backup approvers or use any-one-approves workflows to prevent blocks." },
    ],
  },
  {
    slug: "multi-stakeholder-approval",
    category: "solution",
    title: "Multi-Stakeholder Approval Made Simple | Thumbway",
    headline: "Multi-Stakeholder",
    highlightedText: "Approvals Simplified",
    subheadline: "Need 5 people to sign off? No problem. Manage complex approval workflows with ease.",
    description: "Thumbway handles multi-stakeholder approval workflows with parallel and sequential options.",
    keywords: ["multi-stakeholder approval", "multiple approvers", "approval chain", "group approval"],
    problems: [
      { icon: "Users", title: "Too Many Approvers", description: "Getting 5 people to agree is like herding cats." },
      { icon: "Clock", title: "Sequential Delays", description: "Waiting for Person A before Person B can review." },
      { icon: "Mail", title: "Coordination Chaos", description: "Managing multiple email threads per approval." },
    ],
    features: [
      { icon: "Users", title: "Parallel Approvals", description: "All approvers review simultaneously." },
      { icon: "Layers", title: "Sequential Chains", description: "Ordered approval workflows when needed." },
      { icon: "Check", title: "Any-One-Approves", description: "First approval completes the request." },
      { icon: "Eye", title: "Status Dashboard", description: "See who has approved, who's pending." },
      { icon: "Bell", title: "Targeted Reminders", description: "Only nudge those who haven't responded." },
      { icon: "MessageSquare", title: "Consolidated Feedback", description: "All comments in one place." },
    ],
    faqs: [
      { question: "What approval workflows are supported?", answer: "Parallel (everyone at once), sequential (ordered chain), and any-one-approves (first approval wins)." },
      { question: "Can I mix workflow types?", answer: "Not in the same request currently. Choose the workflow type that fits each approval." },
      { question: "How do I track who's approved?", answer: "The status dashboard shows each approver's status in real-time with timestamps." },
      { question: "What if someone rejects?", answer: "You're notified immediately with their feedback. Address concerns and resend for approval." },
    ],
  },
  {
    slug: "approval-bottleneck",
    category: "solution",
    title: "Eliminate Approval Bottlenecks | Thumbway",
    headline: "Eliminate",
    highlightedText: "Approval Bottlenecks",
    subheadline: "Identify and fix the slow points in your approval process. Ship content faster.",
    description: "Thumbway helps you identify and eliminate approval bottlenecks with analytics.",
    keywords: ["approval bottleneck", "slow approvals", "approval efficiency", "workflow optimization"],
    problems: [
      { icon: "Clock", title: "Unknown Delays", description: "Where is the approval stuck? No idea." },
      { icon: "Users", title: "Repeat Offenders", description: "The same person is always the slowest." },
      { icon: "BarChart", title: "No Visibility", description: "Can't improve what you can't measure." },
    ],
    features: [
      { icon: "BarChart", title: "Approval Analytics", description: "Average time per approver, per project." },
      { icon: "Users", title: "Bottleneck Reports", description: "See who's slowing things down." },
      { icon: "Bell", title: "Escalation Rules", description: "Auto-remind or escalate slow approvals." },
      { icon: "TrendingUp", title: "Trend Tracking", description: "Are approvals getting faster or slower?" },
      { icon: "Eye", title: "Real-Time Status", description: "Always know where things stand." },
      { icon: "Target", title: "SLA Tracking", description: "Set and track approval time targets." },
    ],
    faqs: [
      { question: "How do I identify bottlenecks?", answer: "Analytics show average approval time per person. The slowest approvers are highlighted." },
      { question: "Can I set approval deadlines?", answer: "Yes, set expected response times and get alerts when approvals are overdue." },
      { question: "What if the bottleneck is a senior stakeholder?", answer: "Data helps make the case. Show them the impact of delays on project timelines." },
      { question: "Does this require the Team tier?", answer: "Basic analytics are available on all tiers. Advanced bottleneck reporting is on Team and above." },
    ],
  },
  {
    slug: "email-approval-chaos",
    category: "solution",
    title: "End Email Approval Chaos | Thumbway",
    headline: "End Email",
    highlightedText: "Approval Chaos",
    subheadline: "No more lost approval threads. No more 'did you see my email?' Follow-ups. Just clean, tracked approvals.",
    description: "Thumbway replaces chaotic email approval threads with organized, trackable workflows.",
    keywords: ["email approval alternative", "approval tracking", "replace email approvals", "organized approvals"],
    problems: [
      { icon: "Mail", title: "Lost Threads", description: "Approval emails buried under 100 new messages." },
      { icon: "Search", title: "Can't Find History", description: "'Search: approval' returns 500 results." },
      { icon: "RefreshCw", title: "Version Confusion", description: "Which attachment was the latest?" },
    ],
    features: [
      { icon: "Inbox", title: "One Place", description: "All approvals organized in one dashboard." },
      { icon: "Search", title: "Easy Search", description: "Find any approval by title, date, or status." },
      { icon: "RefreshCw", title: "Version History", description: "Clear version tracking for each request." },
      { icon: "Eye", title: "Status Tracking", description: "Always know: approved, pending, or rejected." },
      { icon: "Shield", title: "Audit Trail", description: "Complete history with timestamps." },
      { icon: "Bell", title: "Smart Notifications", description: "Email only when needed, not for every action." },
    ],
    faqs: [
      { question: "Do approvers still get email?", answer: "Yes, approvers receive an email with a link to the approval page. But feedback is captured in Thumbway, not scattered in replies." },
      { question: "Can I search past approvals?", answer: "Yes! Search by title, approver, date range, or status. Much easier than searching email." },
      { question: "What about existing email approval threads?", answer: "Start fresh with Thumbway. For historical reference, your email archives remain untouched." },
      { question: "Will approvers have to change their habits?", answer: "Minimally. They still get an email - they just click a link instead of hitting 'Reply'." },
    ],
  },
  {
    slug: "client-ghosting",
    category: "solution",
    title: "Stop Client Ghosting on Approvals | Thumbway",
    headline: "Stop Clients From",
    highlightedText: "Ghosting Your Proposals",
    subheadline: "Know when they view. Know when they're ready. Never wonder if they received it again.",
    description: "Thumbway's engagement tracking prevents client ghosting on proposals and approvals.",
    keywords: ["client ghosting", "proposal tracking", "client follow-up", "engagement tracking"],
    problems: [
      { icon: "Eye", title: "No Read Receipts", description: "Did they even open it? Who knows." },
      { icon: "Clock", title: "Awkward Follow-Ups", description: "'Just checking if you got my email?' Cringe." },
      { icon: "AlertCircle", title: "Lost Deals", description: "Silence kills proposals." },
    ],
    features: [
      { icon: "Eye", title: "View Notifications", description: "Get notified when they open your proposal." },
      { icon: "Clock", title: "Time Tracking", description: "See how long they spent reviewing." },
      { icon: "Bell", title: "Auto Follow-Ups", description: "Smart reminders you don't have to write." },
      { icon: "TrendingUp", title: "Engagement Scoring", description: "Know who's hot and who's cold." },
      { icon: "Calendar", title: "Best Time to Follow Up", description: "Data-driven follow-up timing." },
      { icon: "MessageSquare", title: "Easy Response", description: "Make it effortless for them to respond." },
    ],
    faqs: [
      { question: "How does view tracking work?", answer: "When the client opens the approval link, we track the view and notify you. You'll also see time spent on the page." },
      { question: "Is view tracking shown to clients?", answer: "No, clients just see a clean approval page. They don't know you're tracking engagement." },
      { question: "Can I set up automatic follow-ups?", answer: "Yes! Configure reminder sequences: e.g., 24h, 48h, 1 week. Smart messages encourage response." },
      { question: "What if they viewed but didn't approve?", answer: "That's valuable intel! You know they're interested. Follow up with a personal touch." },
    ],
  },
  {
    slug: "proposal-tracking",
    category: "solution",
    title: "Track Proposals and Get Faster Approvals | Thumbway",
    headline: "Track Proposals",
    highlightedText: "From Send to Signed",
    subheadline: "Full visibility into every proposal. Know when they view, share, and approve.",
    description: "Thumbway provides complete proposal tracking with real-time status updates.",
    keywords: ["proposal tracking", "proposal management", "track proposals", "proposal status"],
    problems: [
      { icon: "Eye", title: "Blind Spot", description: "Zero visibility after hitting 'send'." },
      { icon: "Layers", title: "Multiple Proposals", description: "Tracking 20+ proposals in a spreadsheet." },
      { icon: "Clock", title: "Follow-Up Guessing", description: "When is the right time to reach out?" },
    ],
    features: [
      { icon: "LayoutGrid", title: "Proposal Dashboard", description: "All proposals in one view." },
      { icon: "Eye", title: "Real-Time Tracking", description: "View, share, and approval events." },
      { icon: "BarChart", title: "Pipeline Analytics", description: "Conversion rates and trends." },
      { icon: "Bell", title: "Event Notifications", description: "Instant alerts on key actions." },
      { icon: "Filter", title: "Smart Filters", description: "By status, client, date, value." },
      { icon: "Download", title: "Export Reports", description: "Data for your reporting needs." },
    ],
    faqs: [
      { question: "Can I see all my pending proposals in one place?", answer: "Yes! The dashboard shows all proposals with status, last activity, and days pending." },
      { question: "What events are tracked?", answer: "Opens, time spent, shares (when forwarded), comments, and final approval/rejection." },
      { question: "Can I export proposal data?", answer: "Yes, export to CSV for your own reporting or CRM updates (Team tier and above)." },
      { question: "Is there a mobile app?", answer: "The dashboard is fully responsive. Access from any device's browser - no app needed." },
    ],
  },
  {
    slug: "content-review-workflow",
    category: "solution",
    title: "Content Review Workflow | Thumbway",
    headline: "Content Review",
    highlightedText: "Workflow That Works",
    subheadline: "Simple review workflows for marketing, sales, and creative teams. No complex setup.",
    description: "Thumbway provides simple content review workflows for teams of all sizes.",
    keywords: ["content review workflow", "review process", "content feedback", "review workflow"],
    problems: [
      { icon: "Settings", title: "Complex Tools", description: "Enterprise software with 100+ settings." },
      { icon: "Clock", title: "Setup Time", description: "Weeks of configuration before first use." },
      { icon: "DollarSign", title: "Hidden Costs", description: "Per-user pricing adds up fast." },
    ],
    features: [
      { icon: "Zap", title: "Quick Setup", description: "First review in under 5 minutes." },
      { icon: "ThumbsUp", title: "Simple Actions", description: "Approve, reject, or request changes." },
      { icon: "MessageSquare", title: "Inline Feedback", description: "Comments on specific sections." },
      { icon: "Users", title: "Flexible Reviewers", description: "Add anyone via email." },
      { icon: "RefreshCw", title: "Version Tracking", description: "Automatic history of changes." },
      { icon: "DollarSign", title: "Flat Pricing", description: "Unlimited team members included." },
    ],
    faqs: [
      { question: "How is this different from Google Docs comments?", answer: "Thumbway provides structured approve/reject actions, engagement tracking, and organized history - not scattered comments." },
      { question: "Can external reviewers participate?", answer: "Yes! Anyone with an email can review. No signup required." },
      { question: "Is there a version comparison view?", answer: "Yes, when you send revisions, reviewers can see what changed since last version." },
      { question: "Can I customize the review workflow?", answer: "Choose parallel, sequential, or any-one-approves. Add as many reviewers as needed." },
    ],
  },
  {
    slug: "ai-content-governance",
    category: "solution",
    title: "AI Content Governance Platform | Thumbway",
    headline: "AI Content Governance",
    highlightedText: "Made Simple",
    subheadline: "Control, track, and approve AI-generated content. The compliance layer for the AI era.",
    description: "Thumbway provides AI content governance with approval trails and compliance features.",
    keywords: ["AI content governance", "AI content approval", "AI compliance", "content governance"],
    problems: [
      { icon: "Bot", title: "AI Everywhere", description: "Teams generating content with ChatGPT daily." },
      { icon: "Shield", title: "No Oversight", description: "AI content going out without human review." },
      { icon: "FileCheck", title: "Compliance Gaps", description: "No audit trail of what was approved." },
    ],
    features: [
      { icon: "Bot", title: "ChatGPT Native", description: "Governance built into the AI workflow." },
      { icon: "Shield", title: "Human-in-the-Loop", description: "Every piece reviewed before publish." },
      { icon: "FileCheck", title: "Audit Trails", description: "Complete record of approvals." },
      { icon: "Lock", title: "Access Controls", description: "Who can approve what content." },
      { icon: "BarChart", title: "Compliance Reports", description: "Exportable approval history." },
      { icon: "Eye", title: "Content Tracking", description: "See all AI content in review." },
    ],
    faqs: [
      { question: "What is AI content governance?", answer: "It's ensuring all AI-generated content is reviewed and approved by humans before use, with full audit trails." },
      { question: "Why is this important for compliance?", answer: "Regulators are increasingly concerned about AI content. Audit trails prove human oversight and accountability." },
      { question: "Does this slow down AI workflows?", answer: "No! Thumbway is designed for speed. Most approvals happen in minutes, not days." },
      { question: "Is this enterprise-only?", answer: "No! Start free. Enterprise features (SSO, advanced audit) are available on Business tier." },
    ],
  },
];

// Add more pages for use-cases, industries, integrations, comparisons, and features
const useCasePages: PageDefinition[] = [
  {
    slug: "chatgpt-proposals",
    category: "use-case",
    title: "Get Approval on ChatGPT Proposals | Thumbway",
    headline: "ChatGPT Proposals",
    highlightedText: "Approved Instantly",
    subheadline: "Generate proposals with ChatGPT, send for approval in one command. Close deals faster.",
    description: "Use Thumbway to get instant approval on proposals created with ChatGPT.",
    keywords: ["ChatGPT proposals", "AI proposal approval", "proposal workflow", "ChatGPT business"],
    problems: [
      { icon: "FileText", title: "Great Proposals", description: "ChatGPT creates amazing proposals." },
      { icon: "Clock", title: "Slow Approval", description: "But then they sit in email for days." },
      { icon: "Copy", title: "Copy-Paste Hell", description: "Export, format, attach, send, wait." },
    ],
    features: [
      { icon: "Zap", title: "One Command", description: "'Send to client@email.com for approval'" },
      { icon: "ThumbsUp", title: "Instant Delivery", description: "Client receives beautiful approval page." },
      { icon: "Smartphone", title: "Mobile Ready", description: "Clients approve on any device." },
      { icon: "Eye", title: "View Tracking", description: "Know when they read your proposal." },
      { icon: "Bell", title: "Auto Follow-Up", description: "Smart reminders keep deals moving." },
      { icon: "MessageSquare", title: "Easy Feedback", description: "Comments without email threads." },
    ],
    faqs: [
      { question: "Do I need to install anything in ChatGPT?", answer: "Yes, Thumbway is available in the ChatGPT plugin/action store. One-time install takes 2 minutes." },
      { question: "Can I customize the proposal appearance?", answer: "Basic branding is available. Advanced customization on Team tier and above." },
      { question: "What if the client wants changes?", answer: "They can request changes with comments. You're notified, make edits in ChatGPT, and resend." },
      { question: "Can I use this for contracts too?", answer: "Yes! Any content from ChatGPT can be sent for approval." },
    ],
  },
  {
    slug: "blog-post-approval",
    category: "use-case",
    title: "Blog Post Approval Workflow | Thumbway",
    headline: "Blog Post Approvals",
    highlightedText: "Streamlined",
    subheadline: "Get stakeholder sign-off on AI-generated blog posts before publishing. Fast and organized.",
    description: "Streamline your blog post approval workflow with Thumbway.",
    keywords: ["blog post approval", "content approval", "blog workflow", "editorial approval"],
    problems: [
      { icon: "FileText", title: "AI-Drafted Posts", description: "ChatGPT drafts great blog content." },
      { icon: "Users", title: "Multiple Reviewers", description: "Editor, legal, brand, stakeholders." },
      { icon: "Clock", title: "Publication Delays", description: "Waiting days for final sign-off." },
    ],
    features: [
      { icon: "Users", title: "Multi-Reviewer", description: "Route to all stakeholders at once." },
      { icon: "MessageSquare", title: "Inline Comments", description: "Feedback on specific sections." },
      { icon: "RefreshCw", title: "Version Tracking", description: "Clear revision history." },
      { icon: "Check", title: "Final Approval", description: "One clear sign-off to publish." },
      { icon: "Calendar", title: "Deadline Tracking", description: "Hit your publishing schedule." },
      { icon: "Zap", title: "ChatGPT Native", description: "Draft and send without switching tools." },
    ],
    faqs: [
      { question: "Can multiple editors review simultaneously?", answer: "Yes! Use parallel approval to get feedback from all reviewers at once." },
      { question: "How do we handle revisions?", answer: "Make edits in ChatGPT, send revised version. Reviewers see clear version history." },
      { question: "Can we set a publication deadline?", answer: "Yes, add expected dates. Auto-reminders help hit your schedule." },
      { question: "Is there an editorial calendar view?", answer: "Coming soon! For now, use filters to view posts by status and date." },
    ],
  },
  {
    slug: "social-media-approval",
    category: "use-case",
    title: "Social Media Content Approval | Thumbway",
    headline: "Social Media Approvals",
    highlightedText: "Without the Chaos",
    subheadline: "Get sign-off on social posts before they go live. Fast approvals for fast-moving content.",
    description: "Thumbway helps marketing teams get quick approvals on social media content.",
    keywords: ["social media approval", "social content workflow", "marketing approval", "social media sign-off"],
    problems: [
      { icon: "Clock", title: "Time-Sensitive", description: "Social content needs quick turnaround." },
      { icon: "Users", title: "Stakeholder Buy-In", description: "Legal, brand, leadership sign-off." },
      { icon: "Smartphone", title: "Mobile Reviewers", description: "Stakeholders aren't at desks." },
    ],
    features: [
      { icon: "Zap", title: "Quick Send", description: "Send for approval in seconds." },
      { icon: "Smartphone", title: "Mobile First", description: "Approve from anywhere." },
      { icon: "Clock", title: "Fast Turnaround", description: "Most approvals under 30 minutes." },
      { icon: "ThumbsUp", title: "One-Tap Approve", description: "Minimal friction for approvers." },
      { icon: "Layers", title: "Batch Approval", description: "Approve multiple posts at once." },
      { icon: "Bell", title: "Urgent Flags", description: "Mark time-sensitive content." },
    ],
    faqs: [
      { question: "Can we approve multiple posts at once?", answer: "Send them as separate requests. Batch approval feature coming soon." },
      { question: "How fast do approvers typically respond?", answer: "With mobile-optimized pages and push notifications, most respond within 30 minutes." },
      { question: "Can I mark something as urgent?", answer: "Yes! Urgent flags send immediate notifications and highlight the request." },
      { question: "Does it integrate with social scheduling tools?", answer: "Not directly yet. Copy approved content to your scheduling tool after approval." },
    ],
  },
];

// Industries
const industryPages: PageDefinition[] = [
  {
    slug: "technology",
    category: "industry",
    title: "Approval Workflow for Tech Companies | Thumbway",
    headline: "Content Approval for",
    highlightedText: "Tech Companies",
    subheadline: "Fast-moving tech teams need fast approvals. Ship product content, docs, and announcements faster.",
    description: "Tech companies use Thumbway to accelerate content approvals.",
    keywords: ["tech content approval", "software company workflow", "tech team tools", "product content approval"],
    problems: [
      { icon: "Rocket", title: "Ship Fast", description: "Tech moves fast. Approvals shouldn't slow you down." },
      { icon: "FileText", title: "Technical Content", description: "Docs, release notes, product updates." },
      { icon: "Users", title: "Cross-Functional", description: "Product, engineering, marketing, legal." },
    ],
    features: [
      { icon: "Zap", title: "Speed First", description: "Built for velocity-focused teams." },
      { icon: "Code", title: "API Access", description: "Integrate with your dev workflow." },
      { icon: "Users", title: "Parallel Reviews", description: "All stakeholders at once." },
      { icon: "Slack", title: "Slack Native", description: "Approve where you work." },
      { icon: "Bot", title: "AI Native", description: "Built for AI-generated content." },
      { icon: "TrendingUp", title: "Scales", description: "From startup to enterprise." },
    ],
    faqs: [
      { question: "Does Thumbway have an API?", answer: "Yes! Business tier includes full API access for custom integrations." },
      { question: "Can we integrate with GitHub?", answer: "GitHub integration is on our roadmap. Use webhooks in the meantime." },
      { question: "Is there SSO support?", answer: "Yes, Business tier includes SSO/SAML support." },
      { question: "How do you handle sensitive product information?", answer: "Enterprise-grade security with encrypted storage, access controls, and audit logs." },
    ],
  },
];

// Integrations
const integrationPages: PageDefinition[] = [
  {
    slug: "chatgpt",
    category: "integration",
    title: "ChatGPT Approval Integration | Thumbway",
    headline: "Native ChatGPT",
    highlightedText: "Approval Integration",
    subheadline: "The only approval tool that lives inside ChatGPT. Generate content, send for approval, track status - all in one place.",
    description: "Thumbway's native ChatGPT integration lets you send approvals without leaving the chat.",
    keywords: ["ChatGPT integration", "ChatGPT approval", "ChatGPT workflow", "AI approval integration"],
    problems: [
      { icon: "Copy", title: "Copy-Paste Pain", description: "Generate in ChatGPT, paste elsewhere, email, wait." },
      { icon: "RefreshCw", title: "Context Switching", description: "Jumping between tools kills productivity." },
      { icon: "Clock", title: "Wasted Time", description: "Hours spent on approval logistics." },
    ],
    features: [
      { icon: "Bot", title: "MCP Protocol", description: "Official ChatGPT integration standard." },
      { icon: "Zap", title: "One Command", description: "'Send this to john@client.com for approval'" },
      { icon: "Eye", title: "Status in Chat", description: "Check approval status in ChatGPT." },
      { icon: "RefreshCw", title: "Revision Loop", description: "Edit and resend without leaving chat." },
      { icon: "MessageSquare", title: "Feedback Display", description: "See approver comments in ChatGPT." },
      { icon: "Shield", title: "Secure", description: "Enterprise-grade security." },
    ],
    faqs: [
      { question: "How do I install the ChatGPT integration?", answer: "Find Thumbway in the ChatGPT GPT Store or Actions menu. One-click install, 2-minute setup." },
      { question: "Does it work with ChatGPT Plus and Free?", answer: "Yes, Thumbway works with all ChatGPT tiers that support plugins/actions." },
      { question: "Can I check approval status in ChatGPT?", answer: "Yes! Ask 'What's the status of my pending approvals?' to see all open requests." },
      { question: "Is my content secure?", answer: "Yes, enterprise-grade encryption. Your content is never used for AI training." },
    ],
  },
  {
    slug: "slack",
    category: "integration",
    title: "Slack Approval Notifications | Thumbway",
    headline: "Approve Directly",
    highlightedText: "From Slack",
    subheadline: "No more tab switching. Get notified and approve content right from your Slack workspace.",
    description: "Thumbway's Slack integration brings approvals to where your team already works.",
    keywords: ["Slack approval", "Slack integration", "Slack workflow", "approve in Slack"],
    problems: [
      { icon: "Mail", title: "Email Overload", description: "Approval emails lost in the noise." },
      { icon: "RefreshCw", title: "Tab Switching", description: "Interrupting flow to check approvals." },
      { icon: "Clock", title: "Delayed Response", description: "Approvals wait while email piles up." },
    ],
    features: [
      { icon: "Bell", title: "Slack Notifications", description: "New approvals posted to channels." },
      { icon: "ThumbsUp", title: "One-Click Approve", description: "Approve directly from Slack." },
      { icon: "MessageSquare", title: "Comments in Thread", description: "Discussion without leaving Slack." },
      { icon: "Users", title: "Channel Routing", description: "Different approvals to different channels." },
      { icon: "Eye", title: "Status Updates", description: "See approval progress in real-time." },
      { icon: "Settings", title: "Custom Notifications", description: "Control what triggers alerts." },
    ],
    faqs: [
      { question: "Can I approve without leaving Slack?", answer: "Yes! Click the approve button directly in Slack - no need to open a browser." },
      { question: "Which Slack channels get notifications?", answer: "You configure this. Route different types of approvals to different channels." },
      { question: "Is Slack integration included in all plans?", answer: "Slack integration is available on Team tier ($49/month) and above." },
      { question: "Can I add comments via Slack?", answer: "Yes, reply in the Slack thread. Comments sync back to Thumbway." },
    ],
  },
  {
    slug: "email",
    category: "integration",
    title: "Email-Based Approval Workflow | Thumbway",
    headline: "Email That Works",
    highlightedText: "For Approvals",
    subheadline: "Approvers get email, click a link, approve in seconds. No account needed. Clean and tracked.",
    description: "Thumbway uses email for notifications while capturing everything in an organized system.",
    keywords: ["email approval", "email workflow", "approval notifications", "email sign-off"],
    problems: [
      { icon: "Mail", title: "Email Chaos", description: "Approval threads scattered everywhere." },
      { icon: "Search", title: "Lost History", description: "Can't find who approved what." },
      { icon: "Users", title: "Account Fatigue", description: "Approvers don't want another login." },
    ],
    features: [
      { icon: "Mail", title: "Email Notifications", description: "Clean emails that get noticed." },
      { icon: "Lock", title: "Magic Links", description: "No account required for approvers." },
      { icon: "ThumbsUp", title: "One-Click Action", description: "Approve right from the link." },
      { icon: "FileCheck", title: "Organized History", description: "All approvals tracked centrally." },
      { icon: "Bell", title: "Smart Reminders", description: "Follow-ups that work." },
      { icon: "Smartphone", title: "Mobile Optimized", description: "Perfect on any device." },
    ],
    faqs: [
      { question: "Do approvers need to create an account?", answer: "No! They receive an email with a magic link. Click and approve - no signup needed." },
      { question: "Can approvers reply via email?", answer: "They should click the link to approve. Email replies are tracked but action requires the link." },
      { question: "How do you prevent approval link forwarding?", answer: "Links can be set to single-use or expire after a set time (7 days default)." },
      { question: "What email provider do you use?", answer: "We use Postmark for reliable, fast email delivery with excellent deliverability." },
    ],
  },
];

// Comparisons
const comparisonPages: PageDefinition[] = [
  {
    slug: "email",
    category: "comparison",
    title: "Thumbway vs Email for Approvals | Comparison",
    headline: "Thumbway vs Email",
    highlightedText: "for Approvals",
    subheadline: "Why scattered email threads are costing you time, deals, and sanity.",
    description: "See why teams choose Thumbway over email for managing approvals.",
    keywords: ["Thumbway vs email", "email approval alternative", "better than email", "approval tool comparison"],
    problems: [
      { icon: "Mail", title: "Email is Free", description: "But the hidden costs are enormous." },
      { icon: "Search", title: "No Tracking", description: "Did they even open it?" },
      { icon: "Clock", title: "Slow Response", description: "Buried under 100 other emails." },
    ],
    features: [
      { icon: "Eye", title: "View Tracking", description: "Know when they open and read." },
      { icon: "ThumbsUp", title: "One-Click Approval", description: "Not buried in reply threads." },
      { icon: "Search", title: "Easy to Find", description: "Searchable, organized history." },
      { icon: "Bell", title: "Smart Reminders", description: "Automated follow-ups." },
      { icon: "Users", title: "Multi-Approver", description: "Organized multi-stakeholder workflows." },
      { icon: "BarChart", title: "Analytics", description: "See what's working." },
    ],
    faqs: [
      { question: "Email is free, why pay for Thumbway?", answer: "Time is money. If Thumbway saves 10 hours/month at $50/hour, that's $500/month. Thumbway costs $15-99/month." },
      { question: "Can approvers still use email?", answer: "Yes! They receive an email and click a link. They don't need to change tools." },
      { question: "What about existing email threads?", answer: "Start fresh with Thumbway for new approvals. Your email history remains untouched." },
      { question: "Is it hard to switch from email?", answer: "No! Setup takes 5 minutes. Your first approval can go out today." },
    ],
    comparison: {
      competitorName: "Email",
      rows: [
        { feature: "View/open tracking", thumbway: true, competitor: false },
        { feature: "One-click approval", thumbway: true, competitor: false },
        { feature: "Organized history", thumbway: true, competitor: false },
        { feature: "Automated reminders", thumbway: true, competitor: false },
        { feature: "Multi-approver workflow", thumbway: true, competitor: false },
        { feature: "Mobile optimized", thumbway: true, competitor: "Varies" },
        { feature: "Analytics", thumbway: true, competitor: false },
        { feature: "No account needed", thumbway: true, competitor: true },
        { feature: "Price", thumbway: "$0-99/mo", competitor: "Free" },
      ],
    },
  },
  {
    slug: "asana",
    category: "comparison",
    title: "Thumbway vs Asana | Approval Workflow Comparison",
    headline: "Thumbway vs Asana",
    highlightedText: "for Approvals",
    subheadline: "Why a dedicated approval tool beats complex project management software.",
    description: "Compare Thumbway to Asana for content approval workflows.",
    keywords: ["Thumbway vs Asana", "Asana alternative", "approval workflow", "project management alternative"],
    problems: [
      { icon: "Settings", title: "Complexity", description: "Asana is powerful but complex." },
      { icon: "DollarSign", title: "Per-User Pricing", description: "$10-25/user/month adds up." },
      { icon: "Clock", title: "Setup Time", description: "Weeks to configure workflows." },
    ],
    features: [
      { icon: "Zap", title: "5-Minute Setup", description: "vs weeks of configuration." },
      { icon: "DollarSign", title: "Flat Pricing", description: "Unlimited users on all plans." },
      { icon: "Bot", title: "ChatGPT Native", description: "Built for AI workflows." },
      { icon: "ThumbsUp", title: "Simple UX", description: "Approvals, not project management." },
      { icon: "Lock", title: "No Account", description: "Approvers don't need accounts." },
      { icon: "Smartphone", title: "Mobile First", description: "One-tap approvals." },
    ],
    faqs: [
      { question: "Is Thumbway a project management replacement?", answer: "No! Thumbway handles approvals. Use it alongside Asana, or instead of Asana for simple approval needs." },
      { question: "What about per-user pricing?", answer: "Thumbway has flat monthly pricing. Add unlimited team members without increasing cost." },
      { question: "Can I import from Asana?", answer: "Not currently. Thumbway is designed for net-new approval workflows." },
      { question: "Which is better for my team?", answer: "If you mainly need approvals, Thumbway is simpler and cheaper. If you need full project management, consider using both." },
    ],
    comparison: {
      competitorName: "Asana",
      rows: [
        { feature: "ChatGPT integration", thumbway: true, competitor: false },
        { feature: "Setup time", thumbway: "5 minutes", competitor: "Weeks" },
        { feature: "No account for approvers", thumbway: true, competitor: false },
        { feature: "Mobile approval UX", thumbway: "One-tap", competitor: "Complex" },
        { feature: "Pricing model", thumbway: "Flat monthly", competitor: "Per-user" },
        { feature: "Cost for 10 users", thumbway: "$49/mo", competitor: "$250/mo" },
        { feature: "Focus", thumbway: "Approvals", competitor: "Projects" },
        { feature: "Learning curve", thumbway: "Minutes", competitor: "Days" },
      ],
    },
  },
];

// Features
const featurePages: PageDefinition[] = [
  {
    slug: "mobile-approval",
    category: "feature",
    title: "One-Tap Mobile Approval | Thumbway",
    headline: "Approve Anywhere",
    highlightedText: "With One Tap",
    subheadline: "Mobile-first approval pages that make saying 'yes' effortless. No pinching, zooming, or frustration.",
    description: "Thumbway's mobile-optimized approval pages enable one-tap approvals from any device.",
    keywords: ["mobile approval", "mobile-friendly approval", "approve on phone", "mobile workflow"],
    problems: [
      { icon: "Smartphone", title: "Clunky Mobile", description: "Most approval tools are desktop-only." },
      { icon: "ThumbsUp", title: "Tiny Buttons", description: "Approval buttons you can't click." },
      { icon: "Clock", title: "Delayed Response", description: "'I'll approve when I'm at my desk.'" },
    ],
    features: [
      { icon: "Smartphone", title: "Mobile First", description: "Designed for phone screens." },
      { icon: "ThumbsUp", title: "Big Tap Target", description: "Easy to hit on any device." },
      { icon: "Zap", title: "Fast Load", description: "Under 2 seconds on mobile." },
      { icon: "Eye", title: "Clean Preview", description: "Content optimized for mobile reading." },
      { icon: "Globe", title: "Any Device", description: "Works on iOS, Android, any browser." },
      { icon: "Lock", title: "Secure", description: "Magic links with expiration." },
    ],
    faqs: [
      { question: "Is there a mobile app?", answer: "No app needed! Approval pages are fully responsive web pages that work in any mobile browser." },
      { question: "How fast do pages load on mobile?", answer: "Under 2 seconds on average mobile connections. Optimized for performance." },
      { question: "Can I add to home screen?", answer: "Yes! PWA support allows 'Add to Home Screen' for quick access." },
      { question: "What about offline approval?", answer: "Approvals require internet connection, but the form is lightweight for poor connections." },
    ],
  },
  {
    slug: "engagement-tracking",
    category: "feature",
    title: "Real-Time Engagement Tracking | Thumbway",
    headline: "Know When They're",
    highlightedText: "Engaged",
    subheadline: "Real-time notifications when approvers view your content. No more wondering if they received it.",
    description: "Thumbway's engagement tracking shows when content is viewed and how long reviewers spend.",
    keywords: ["engagement tracking", "view tracking", "read receipts", "approval tracking"],
    problems: [
      { icon: "Eye", title: "Blind Spot", description: "No idea if they've seen it." },
      { icon: "Clock", title: "Awkward Follow-Up", description: "'Did you get my email?'" },
      { icon: "TrendingUp", title: "No Insights", description: "Can't prioritize hot vs cold leads." },
    ],
    features: [
      { icon: "Eye", title: "View Notifications", description: "Instant alert when they open." },
      { icon: "Clock", title: "Time Tracking", description: "How long they spent reviewing." },
      { icon: "TrendingUp", title: "Engagement Score", description: "Prioritize most engaged." },
      { icon: "Calendar", title: "Best Time", description: "Data on when to follow up." },
      { icon: "BarChart", title: "Section Analytics", description: "Which parts got attention." },
      { icon: "Bell", title: "Smart Alerts", description: "Notifications that matter." },
    ],
    faqs: [
      { question: "How does view tracking work?", answer: "When the approval link is opened, we track the view. You get notified in real-time." },
      { question: "Can approvers see I'm tracking?", answer: "No, the tracking is invisible to reviewers. They just see a clean approval page." },
      { question: "What metrics are tracked?", answer: "Open time, total time spent, number of views, and section engagement (coming soon)." },
      { question: "Is this GDPR compliant?", answer: "Yes, basic analytics don't require consent. We don't track personal data beyond the approval action." },
    ],
  },
  {
    slug: "no-signup-approval",
    category: "feature",
    title: "No-Signup Guest Approvals | Thumbway",
    headline: "No Account",
    highlightedText: "No Problem",
    subheadline: "Reviewers click a link and approve. No signup, no login, no friction. Magic link simplicity.",
    description: "Thumbway's magic links let anyone approve without creating an account.",
    keywords: ["no signup approval", "magic link approval", "guest approval", "frictionless approval"],
    problems: [
      { icon: "Lock", title: "Account Fatigue", description: "'Another login to remember? No thanks.'" },
      { icon: "Users", title: "External Reviewers", description: "Clients don't want accounts in your tool." },
      { icon: "Clock", title: "Signup Friction", description: "Every step reduces completion." },
    ],
    features: [
      { icon: "Link", title: "Magic Links", description: "Unique, secure links per reviewer." },
      { icon: "Lock", title: "No Account", description: "Zero signup required." },
      { icon: "Shield", title: "Secure", description: "Links expire, can be single-use." },
      { icon: "ThumbsUp", title: "One-Click Action", description: "Open link, click approve." },
      { icon: "Globe", title: "Works Anywhere", description: "Any browser, any device." },
      { icon: "Users", title: "Unlimited Reviewers", description: "Add anyone via email." },
    ],
    faqs: [
      { question: "How are magic links secured?", answer: "Links are unique per reviewer, expire after 7 days (configurable), and can be set to single-use." },
      { question: "Can links be forwarded?", answer: "Yes, but the action (approve/reject) is attributed to the original recipient. Consider single-use links for sensitive content." },
      { question: "What if someone loses the link?", answer: "You can resend the approval request, generating a new magic link." },
      { question: "Is this secure for sensitive content?", answer: "Yes! Links are cryptographically secure. For extra security, use single-use links and short expiration." },
    ],
  },
  {
    slug: "auto-reminders",
    category: "feature",
    title: "Automatic Approval Reminders | Thumbway",
    headline: "Never Chase",
    highlightedText: "Approvals Again",
    subheadline: "Smart reminder sequences that gently nudge reviewers. You focus on work, we handle follow-ups.",
    description: "Thumbway's auto-reminder feature prevents ghosting with smart, configurable follow-ups.",
    keywords: ["approval reminders", "automatic follow-up", "reminder sequence", "prevent ghosting"],
    problems: [
      { icon: "Clock", title: "Manual Follow-Ups", description: "Writing 'just checking in' emails." },
      { icon: "Calendar", title: "Forgetting", description: "Approvals slipping through cracks." },
      { icon: "AlertCircle", title: "Annoying People", description: "Fear of being too pushy." },
    ],
    features: [
      { icon: "Bell", title: "Auto Reminders", description: "Scheduled follow-ups you configure." },
      { icon: "Calendar", title: "Custom Timing", description: "24h, 48h, 1 week, your choice." },
      { icon: "MessageSquare", title: "Smart Messages", description: "Friendly, non-annoying nudges." },
      { icon: "Settings", title: "Configurable", description: "Turn on/off per request." },
      { icon: "X", title: "Stop on Action", description: "Reminders end when they respond." },
      { icon: "BarChart", title: "Effectiveness", description: "See which reminders work." },
    ],
    faqs: [
      { question: "What's the default reminder sequence?", answer: "24 hours, then 48 hours, then 1 week. Fully customizable on paid tiers." },
      { question: "Can I customize reminder messages?", answer: "Coming soon! For now, we use friendly, tested templates." },
      { question: "Will reminders annoy my clients?", answer: "Our reminders are designed to be gentle and helpful. Most reviewers appreciate the nudge." },
      { question: "Can I disable reminders for specific requests?", answer: "Yes! Toggle reminders on/off per approval request." },
    ],
  },
  {
    slug: "multi-reviewer",
    category: "feature",
    title: "Multi-Reviewer Approval Workflows | Thumbway",
    headline: "Complex Approvals",
    highlightedText: "Made Simple",
    subheadline: "Parallel, sequential, or any-one-approves. Handle multi-stakeholder sign-off with ease.",
    description: "Thumbway supports complex multi-reviewer approval workflows including parallel and sequential.",
    keywords: ["multi-reviewer approval", "parallel approval", "sequential approval", "approval workflow"],
    problems: [
      { icon: "Users", title: "Multiple Approvers", description: "5 people need to sign off." },
      { icon: "Layers", title: "Order Matters", description: "Sometimes approvals must be sequential." },
      { icon: "Check", title: "Any-One Okay", description: "Sometimes first approval wins." },
    ],
    features: [
      { icon: "Users", title: "Parallel", description: "Everyone reviews simultaneously." },
      { icon: "Layers", title: "Sequential", description: "Ordered approval chain." },
      { icon: "Check", title: "Any-One-Approves", description: "First approval completes." },
      { icon: "Eye", title: "Status Dashboard", description: "See who's pending." },
      { icon: "Bell", title: "Targeted Reminders", description: "Only nudge non-responders." },
      { icon: "MessageSquare", title: "Consolidated Feedback", description: "All comments in one view." },
    ],
    faqs: [
      { question: "What's the difference between parallel and sequential?", answer: "Parallel: all review at once. Sequential: A must approve before B sees it. Both supported." },
      { question: "What is any-one-approves?", answer: "First approval completes the request. Great when you need sign-off from 1 of 3 people." },
      { question: "Can I mix workflow types?", answer: "Not in the same request currently. Choose the type that fits each approval." },
      { question: "What if one person is out of office?", answer: "Use any-one-approves for flexibility, or set up backup approvers." },
    ],
  },
];

// Combine all pages
const allPages = [
  ...pageDefinitions,
  ...useCasePages,
  ...industryPages,
  ...integrationPages,
  ...comparisonPages,
  ...featurePages,
];

function generateConfigFile(page: PageDefinition): string {
  const categoryMap: Record<string, string> = {
    audience: "audience",
    solution: "solution",
    "use-case": "use-case",
    industry: "industry",
    integration: "integration",
    comparison: "comparison",
    feature: "feature",
  };

  const exportName = page.slug
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

  let config = `import type { LandingPageConfig } from "../schema";

export const ${exportName}: LandingPageConfig = {
  slug: "${page.slug}",
  category: "${categoryMap[page.category]}",
  status: "published",
  priority: 0.8,

  seo: {
    title: "${page.title}",
    description: "${page.description}",
    keywords: [${page.keywords.map((k) => `"${k}"`).join(", ")}],
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
      ${page.highlightedText ? `badge: "ChatGPT-Native Approval",` : ""}
      headline: "${page.headline}",
      ${page.highlightedText ? `highlightedText: "${page.highlightedText}",` : ""}
      subheadline: "${page.subheadline}",
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
${page.problems
  .map(
    (p) =>
      `        {
          icon: "${p.icon}",
          title: "${p.title}",
          description: "${p.description}",
        },`
  )
  .join("\n")}
      ],
    },

    solution: {
      headline: "The Solution",
      description: "${page.description}",
      features: [
${page.features
  .slice(0, 3)
  .map(
    (f) =>
      `        {
          icon: "${f.icon}",
          title: "${f.title}",
          description: "${f.description}",
        },`
  )
  .join("\n")}
      ],
    },

    features: {
      headline: "Everything You Need",
      layout: "grid-3",
      features: [
${page.features
  .map(
    (f) =>
      `        {
          icon: "${f.icon}",
          title: "${f.title}",
          description: "${f.description}",
        },`
  )
  .join("\n")}
      ],
    },

    howItWorks: {
      headline: "How It Works",
      steps: [
${baseHowItWorks
  .map(
    (s) =>
      `        {
          step: ${s.step},
          title: "${s.title}",
          description: "${s.description}",
          icon: "${s.icon}",
        },`
  )
  .join("\n")}
      ],
    },

    benefits: {
      headline: "Why Teams Choose Thumbway",
      benefits: [
${baseBenefits
  .map(
    (b) =>
      `        {
          icon: "${b.icon}",
          title: "${b.title}",
          description: "${b.description}",
          ${b.stat ? `stat: { value: "${b.stat.value}", suffix: "${b.stat.suffix}", label: "${b.stat.label}" },` : ""}
        },`
  )
  .join("\n")}
      ],
    },

    testimonials: {
      headline: "Loved by Professionals",
      testimonials: [
${baseTestimonials
  .map(
    (t) =>
      `        {
          quote: "${t.quote}",
          author: "${t.author}",
          role: "${t.role}",
          company: "${t.company}",
          rating: ${t.rating},
        },`
  )
  .join("\n")}
      ],
    },

    pricing: {
      headline: "Simple, Transparent Pricing",
      subheadline: "Start free. Upgrade when you need more.",
      highlightedTier: "starter",
    },
`;

  // Add comparison section if available
  if (page.comparison) {
    config += `
    comparison: {
      headline: "Feature Comparison",
      competitorName: "${page.comparison.competitorName}",
      rows: [
${page.comparison.rows
  .map(
    (r) =>
      `        {
          feature: "${r.feature}",
          thumbway: ${typeof r.thumbway === "boolean" ? r.thumbway : `"${r.thumbway}"`},
          competitor: ${typeof r.competitor === "boolean" ? r.competitor : `"${r.competitor}"`},
        },`
  )
  .join("\n")}
      ],
      conclusion: "Thumbway: Built for approvals. Simple, fast, affordable.",
    },
`;
  }

  config += `
    faq: {
      headline: "Frequently Asked Questions",
      faqs: [
${page.faqs
  .map(
    (f) =>
      `        {
          question: "${f.question}",
          answer: "${f.answer.replace(/"/g, '\\"')}",
        },`
  )
  .join("\n")}
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
    "pricing",${page.comparison ? '\n    "comparison",' : ""}
    "faq",
    "cta",
  ],
};
`;

  return config;
}

function getCategoryFolder(category: string): string {
  const folderMap: Record<string, string> = {
    audience: "audiences",
    solution: "solutions",
    "use-case": "use-cases",
    industry: "industries",
    integration: "integrations",
    comparison: "comparisons",
    feature: "features",
  };
  return folderMap[category] || category;
}

function main() {
  const baseDir = path.join(__dirname, "../src/config/landing-pages");

  console.log("Generating landing page configs...\n");

  let generated = 0;

  for (const page of allPages) {
    const folder = getCategoryFolder(page.category);
    const folderPath = path.join(baseDir, folder);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, `${page.slug}.ts`);
    const content = generateConfigFile(page);

    fs.writeFileSync(filePath, content);
    console.log(`  Created: ${folder}/${page.slug}.ts`);
    generated++;
  }

  console.log(`\nGenerated ${generated} landing page configs!`);
  console.log("\nNext: Run 'pnpm build' to verify all files compile correctly.");
}

main();
