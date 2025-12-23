# Thumbway Implementation Plan
## ChatGPT-Native + Standalone Web App

**Last Updated:** December 22, 2024
**Status:** Ready for Implementation
**Owner:** Product Team

---

## Table of Contents

1. [Target Audience](#target-audience)
2. [Product Vision](#product-vision)
3. [How It Works: ChatGPT Integration](#how-it-works-chatgpt-integration)
4. [Use Cases & User Flows](#use-cases--user-flows)
5. [Table Stakes Features](#table-stakes-features)
6. [ChatGPT-Native USP](#chatgpt-native-usp)
7. [Standalone Web App Features](#standalone-web-app-features)
8. [Better Auth Organization Integration](#better-auth-organization-integration)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Technical Architecture](#technical-architecture)

---

## Target Audience

### **Primary Market Segments (Ranked by Revenue Potential)**

#### **1. Small Teams (ICP #1 - 60% of revenue)**
**Profile:**
- 5-20 person teams
- Startups, agencies, small businesses
- Marketing teams, product teams, sales teams
- Already using ChatGPT for content creation

**Pain Points:**
- Stakeholder alignment on AI-generated content is slow
- Email approval chains are messy and hard to track
- No centralized approval workflow
- Google Docs comments get lost
- Version control nightmare during revisions

**Value Proposition:**
> "Reduce approval time from 2 days to 5 minutes. Get CMO, Legal, and stakeholder sign-off without leaving ChatGPT."

**ARPU:** $99/month (Team tier)
**Size:** 500K+ teams globally
**Target:** 50 teams in first 6 months

---

#### **2. Solo Professionals (ICP #2 - 30% of revenue)**
**Profile:**
- Freelancers, consultants, solopreneurs
- Client-facing professionals
- Agencies of one, independent contractors
- Heavy ChatGPT users

**Pain Points:**
- Client approval via email is unprofessional
- Proposals get lost in inbox
- Hard to track who approved what
- No clean approval record for accountability

**Value Proposition:**
> "Send professional client proposals for approval without leaving ChatGPT. Get responses in minutes, not days."

**ARPU:** $15/month (Pro tier)
**Size:** 5M+ ChatGPT users who do client work
**Target:** 100 solo users in first 3 months

---

#### **3. Mid-Market Teams (ICP #3 - 10% of revenue, future)**
**Profile:**
- 20-100 person organizations
- Multiple departments (Marketing, Legal, Finance, Product)
- Compliance requirements
- Need audit trails and workflows

**Pain Points:**
- Complex approval workflows (sequential, multi-stage)
- Compliance and audit requirements
- Need analytics and reporting
- Require SSO and security features

**Value Proposition:**
> "Enterprise-grade approval workflows for AI content. Compliance, audit trails, and team analytics at startup pricing."

**ARPU:** $500-2000/month (Enterprise tier)
**Size:** 50K+ companies
**Target:** 5-10 mid-market customers in year 1 (Q4 2025+)

---

### **Buyer Personas**

#### **Persona 1: Sarah - Marketing Coordinator**
**Demographics:**
- Age: 28
- Role: Marketing Coordinator at 15-person startup
- Tools: ChatGPT, Slack, Notion, Google Workspace
- Budget authority: $99/mo (no approval needed)

**Day in the Life:**
- Writes 3-5 blog posts per week using ChatGPT
- Needs CMO approval on all content
- Legal reviews anything making claims
- Currently uses Google Docs comments (hates it)

**Quote:**
> "I spend more time chasing approvals than writing content. Email threads are a nightmare."

**Thumbway Use Case:**
1. ChatGPT writes blog post
2. "Send to cmo@company.com and legal@company.com for approval"
3. Both approve in Slack
4. Publish same day

**Success Metric:** Reduces approval time from 2 days to 4 hours

---

#### **Persona 2: Mike - Freelance Designer**
**Demographics:**
- Age: 35
- Role: Freelance Brand Designer
- Clients: 5-10 active clients
- Tools: ChatGPT, Figma, Adobe Creative Suite
- Budget: $15/mo from first client payment

**Day in the Life:**
- Uses ChatGPT to write proposals and client briefs
- Sends 2-3 proposals per week
- Needs clean, professional approval process
- Currently uses email (clients forget to respond)

**Quote:**
> "Clients forget to respond to emails. I need a way to make approval feel official and easy."

**Thumbway Use Case:**
1. ChatGPT writes project proposal
2. "Send to client@acmecorp.com for approval"
3. Client gets professional approval page
4. Approves in 30 minutes (vs 3 days of email)

**Success Metric:** Gets paid faster (faster approvals = faster invoicing)

---

#### **Persona 3: Tom - Sales Manager**
**Demographics:**
- Age: 42
- Role: Sales Manager at 50-person SaaS company
- Team: 8 sales reps reporting to him
- Tools: Salesforce, Slack, ChatGPT, HubSpot
- Budget authority: $500/mo

**Day in the Life:**
- Reviews 10-15 sales proposals per week
- Needs Finance and Legal sign-off on enterprise deals
- Currently uses email threads (loses track of who approved)
- Wants visibility into team's proposal pipeline

**Quote:**
> "I need to know: did Legal approve this deal? Did Finance see the pricing? I can't track this in email."

**Thumbway Use Case:**
1. Sales rep uses ChatGPT to create proposal
2. "Send to sales-manager@, finance@, legal@ for approval. Sales manager first, then finance and legal in parallel"
3. Tom approves in Slack
4. Finance and Legal notified automatically
5. Dashboard shows all pending approvals

**Success Metric:** Close deals 3x faster (1 week → 2 days)

---

## Product Vision

### The Two-Mode Experience

**Mode 1: ChatGPT-Native (The Hook)**
> "Create in ChatGPT → Approve in seconds → Back to ChatGPT"
- Users stay in their creative flow
- Zero context switching
- Instant stakeholder feedback
- **Target:** 80% of reviews created via ChatGPT

**Mode 2: Standalone Web App (The Hub)**
> "Your approval command center"
- Manage all reviews in one place
- Team collaboration and analytics
- Power features for managers
- **Target:** Daily check-in for status tracking

### Core Insight
> "ChatGPT is where content is born. Thumbway is where it gets approved. The web app is where teams manage the process."

---

## How It Works: ChatGPT Integration

### **Flow 1: Solo Professional → Client Approval**

**Scenario:** Freelancer sends proposal to client

```
👤 User (in ChatGPT):
"Write a proposal for website redesign project, $15K budget, 6 week timeline"

🤖 ChatGPT:
[Generates detailed proposal]

👤 User:
"Send this to john@acmecorp.com for approval"

🔧 Thumbway MCP Tool:
✅ Review created: "Website Redesign Proposal"
📧 Email sent to john@acmecorp.com
🔗 Review link: thumbway.com/review/abc123

📬 John receives email:
"[Your Name] sent you a proposal for review"
[View & Approve] button

👤 John (clicks link):
→ Sees proposal in clean, professional layout
→ Clicks "✅ Approve"
→ Adds comment: "Looks good, let's proceed!"

🔔 Notification to User (in ChatGPT):
"John approved your proposal! 🎉"
[View feedback]

👤 User (in ChatGPT):
"Show me John's feedback"

🤖 ChatGPT + Thumbway:
"John said: 'Looks good, let's proceed!'"
"Your proposal was approved on Dec 22, 2024 at 2:30 PM"
```

**Time saved:** 2 days → 5 minutes

---

### **Flow 2: Marketing Team → Blog Approval**

**Scenario:** Marketing coordinator gets approval from CMO + Legal

```
👤 Sarah (Marketing, in ChatGPT):
"Write a blog post about our new AI feature launch, 800 words, SEO optimized"

🤖 ChatGPT:
[Generates blog post]

👤 Sarah:
"Send this to mike@company.com (CMO) and legal@company.com for approval"

🔧 Thumbway MCP Tool:
✅ Review created: "AI Feature Launch Blog Post"
📧 Emails sent to Mike (CMO) & Legal team
👥 2 reviewers required

📱 Mike (on phone, clicks email):
→ Reviews blog post
→ ✅ Approves: "Great work Sarah!"

⚖️ Legal (at desk):
→ Reviews blog post
→ 💬 Requests change: "Remove the claim about '10x faster' - need data to back that up"

🔔 Sarah gets notification (in ChatGPT):
"Legal requested changes on your blog post"
[View feedback]

👤 Sarah (in ChatGPT):
"Update the blog post: change '10x faster' to 'significantly faster' based on legal feedback"

🤖 ChatGPT:
[Updates blog post]

👤 Sarah:
"Send the updated version to legal@company.com"

🔧 Thumbway:
✅ New version sent (v2)
🔗 Legal sees diff: v1 → v2

⚖️ Legal:
→ Sees changes highlighted
→ ✅ Approves

🔔 Sarah (in ChatGPT):
"All approvals complete! ✅✅"
[Export to WordPress] [Download] [Copy HTML]

👤 Sarah:
"Export to WordPress"

✅ Blog post published!
```

**Time saved:** 2-3 days of email threads → 1 hour

---

### **Flow 3: Sales Team → Multi-Stakeholder Proposal**

**Scenario:** Sales rep needs Sales Director + Finance + Legal approval

```
👤 Tom (Sales, in ChatGPT):
"Create enterprise SaaS proposal for Acme Corp: 100 seats, $50K annual, custom onboarding"

🤖 ChatGPT:
[Generates detailed proposal with pricing, timeline, terms]

👤 Tom:
"Send this to sales-director@company.com, finance@company.com, and legal@company.com for approval. Sales director must approve first, then finance and legal can review in parallel"

🔧 Thumbway MCP Tool:
✅ Review created with WORKFLOW:
  Step 1: Sales Director (required)
  Step 2: Finance + Legal (parallel, both required)

📧 Email sent to Sales Director only (others notified they're next)

👔 Sales Director:
→ ✅ Approves
→ "Pricing looks good, proceed"

🔔 Automatic trigger:
📧 Finance + Legal now notified (Step 2 unlocked)

💰 Finance:
→ 💬 Requests change: "Can we do quarterly billing instead of annual?"

⚖️ Legal:
→ ✅ Approves contract terms

🔔 Tom (in ChatGPT):
"Finance requested a change: quarterly billing"

👤 Tom:
"Update proposal to quarterly billing: 4 payments of $12,500"

🤖 ChatGPT:
[Updates proposal]

👤 Tom:
"Send updated version to finance@company.com only"

🔧 Thumbway:
✅ Version 2 sent to Finance
(Sales Director & Legal already approved, no need to re-send)

💰 Finance:
→ ✅ Approves v2

🎉 Thumbway:
"All approvals complete! ✅✅✅"

👤 Tom (in ChatGPT):
"Generate DocuSign link for this approved proposal"

🔧 Thumbway Integration:
→ Exports to DocuSign
→ Sends to Acme Corp for signature

✅ Deal closed!
```

**Time saved:** 1 week of coordination → 2 hours

---

## Use Cases & User Flows

### **Primary Use Cases**

| Persona | Content Type | Reviewers | Frequency | Pain Point |
|---------|-------------|-----------|-----------|------------|
| **Freelancer** | Client proposals | 1 (client) | Weekly | Email gets lost, unprofessional |
| **Marketing Coordinator** | Blog posts, social | 2-3 (CMO, Legal, Brand) | Daily | Email threads messy, slow |
| **Sales Rep** | Proposals, quotes | 2-4 (Director, Finance, Legal) | Daily | Complex approval chains |
| **Product Manager** | PRDs, specs | 3-5 (Eng, Design, Exec) | Weekly | Feedback scattered across tools |
| **Content Writer** | Articles, whitepapers | 2-3 (Editor, SME, Legal) | Daily | Version control nightmare |
| **Agency Creative** | Client deliverables | 1-2 (Client, Account Manager) | Daily | Client approval bottleneck |

---

### **User Journey Map**

#### **Journey 1: First-Time User (ChatGPT Discovery)**

```
1. Discovery (ChatGPT App Store)
   → Sees: "Get approval for ChatGPT content instantly"
   → Clicks: Install Thumbway

2. Installation
   → ChatGPT: "Connect Thumbway to get started"
   → User clicks → OAuth flow → Connects Google/GitHub
   → Lands on: thumbway.com/welcome

3. First Review (In ChatGPT)
   → ChatGPT: "Try it! Say 'Send this to someone@email.com for approval'"
   → User: "Send this draft email to my colleague for feedback"
   → Thumbway: ✅ Sent! Check your dashboard: thumbway.com/dashboard

4. Dashboard Discovery (Web App)
   → User clicks link
   → Sees: Clean dashboard with 1 pending review
   → Status: "Waiting for Sarah's approval"
   → Realizes: "Oh, I can manage everything here!"

5. Approval Notification
   → 10 min later: Email notification "Sarah approved!"
   → User goes back to ChatGPT
   → ChatGPT shows: "Sarah approved! Want to continue editing?"

6. Aha Moment
   → User: "This is way better than email. I can stay in ChatGPT!"
   → Checks dashboard: Sees history, comments, timestamps
   → Upgrades to Pro: "I need unlimited reviews"
```

**Key Touchpoints:**
- ChatGPT (creation & updates)
- Email (reviewer notifications)
- Web app (management & history)

---

#### **Journey 2: Team Admin (Web App Discovery)**

```
1. Discovery (Product Hunt / LinkedIn)
   → Sees: "Team approval for ChatGPT content"
   → Clicks: Try Free

2. Sign Up (Web App First)
   → Lands: thumbway.com
   → Creates account
   → Sees: "Connect ChatGPT" or "Create Review Manually"

3. Manual Review Creation (Testing)
   → Pastes content: "Draft of marketing email"
   → Adds reviewers: team@company.com
   → Clicks: Send for Review
   → Email sent

4. ChatGPT Discovery
   → Sees banner: "Create reviews faster in ChatGPT"
   → Clicks: Install Thumbway in ChatGPT
   → Tries it: "Wow, this is much faster!"

5. Team Onboarding
   → Invites team: "Add team members to workspace"
   → 3 teammates join
   → Activity feed shows: Team reviews in one place

6. Team Adoption
   → Week 1: 5 reviews
   → Week 2: 20 reviews (team using it daily)
   → Week 3: Upgrades to Team tier ($99/mo)
   → Manager sees: Analytics on approval velocity
```

---

## Table Stakes Features

### **Critical Path Features (Without these, we're DOA)**

These are **required** to be competitive in the approval tool market:

#### **1. Multiple Reviewers** ✅
**Why:** Teams need 2-5 people to approve content

**Status:** ✅ Using Better Auth Organization Plugin
- Built-in member management
- Role-based access (owner, admin, member)
- Invitation system included

**Implementation:**
```typescript
// Better Auth handles this automatically!
const org = await authClient.organization.create({
  name: "Marketing Team"
});

await authClient.organization.inviteMember({
  email: "sarah@company.com",
  role: "member",
  organizationId: org.id
});
```

---

#### **2. Comments & Feedback** ✅
**Why:** Reviewers need to explain rejections or suggest changes

**Implementation:**
- Comments table (custom, not in Better Auth)
- Database: `comments` table (with userId, reviewId, content, timestamp)
- Notifications: Email creator when comment added
- ChatGPT integration: Show comments in ChatGPT

---

#### **3. Review Status Tracking** ✅
**Why:** Users need to know: pending, approved, rejected, changes requested

**Statuses:**
- **Pending:** No one reviewed yet
- **Partially Approved:** 2/3 approved
- **Changes Requested:** At least 1 requested changes
- **Approved:** All approved
- **Rejected:** At least 1 rejected

---

#### **4. Email Notifications** ✅
**Why:** Reviewers don't live in Thumbway, they need to be notified

**Current:** Using Postmark
**Better Auth Integration:** Can hook into invitation emails

---

#### **5. Version History** 🔄
**Why:** Content changes during revision cycles

**Implementation:**
- Database: `review_versions` table
- Each update creates new version
- UI: "Version 1 → Version 2 (what changed?)"
- Diff view: Highlight changes

---

#### **6. Review History & Dashboard** ✅
**Why:** Users need to see all past reviews

**Current:** Basic dashboard exists
**Needs:** Filters by organization, team member, status

---

#### **7. Mobile-Friendly Review Pages** ✅
**Why:** 60% of reviewers on mobile

**Current:** Already responsive with Tailwind

---

## ChatGPT-Native USP

### **What Makes Us Different (The Moat)**

These features ONLY work because of ChatGPT integration:

#### **USP 1: One-Command Send** ✅
**The Magic:**
```
👤 User: "Send this to john@acme.com for approval"
✅ Done. No forms, no copy-paste, no new tabs.
```

**vs Competitors:**
ApproveThis.com: 8 steps, 2 minutes
Thumbway: 1 step, 5 seconds

---

#### **USP 2: Status Updates in ChatGPT** ✅
**The Magic:**
```
👤 User: "Did John approve my proposal?"
🤖 ChatGPT: "Yes! John approved at 3:15 PM. He said: 'Looks great!'"
```

---

#### **USP 3: Revision Loop in ChatGPT** ✅
**The Magic:**
```
🔔 "Sarah requested changes"
👤: "What did Sarah say?"
🤖: "Sarah said: 'Change pricing to $15K'"
👤: "Update the proposal with $15K pricing"
🤖: [Updates proposal]
👤: "Send updated version to Sarah"
✅ Done. Never left ChatGPT.
```

---

#### **USP 4: AI Context Awareness** 🔄
**The Magic:**
ChatGPT remembers what was sent, who reviewed, what feedback was given

---

#### **USP 5: Smart Reviewer Suggestions** 🔄
**The Magic:**
```
👤: "Send this legal contract for approval"
🤖: "I see this is legal. Send to legal@yourcompany.com (your usual legal reviewer)?"
```

---

## Standalone Web App Features

### **Why Users Visit the Web App**

Even with ChatGPT integration, users need the web app for:

1. **Dashboard** - See all reviews at a glance
2. **Manual creation** - Sometimes easier to paste content
3. **Team management** - Admin tasks (using Better Auth)
4. **Analytics** - Manager insights
5. **Settings** - Account management
6. **Mobile** - When not at computer

---

### **Web App Feature Set**

#### **1. Dashboard (Home Page)**
- Stats cards (pending, approved, rejected)
- Recent reviews list
- Quick actions
- Filters by organization/team
- Search

#### **2. Organization Dashboard** ✅ (Better Auth)
- Member list
- Invite members (Better Auth invitation system)
- Organization settings
- Team activity feed

#### **3. Review Detail Page**
- Review status and metadata
- Reviewer list with individual statuses
- Full content view
- Comment thread
- Version history
- Actions (edit, export, delete)

#### **4. Review Templates**
- Save review settings as template
- Use from ChatGPT: "Send using my blog post template"
- Organization-wide templates

#### **5. Team Workspace** ✅ (Better Auth)
- Members management (Better Auth)
- Role management (owner, admin, member)
- Team activity feed
- Team reviews
- Team settings

#### **6. Analytics (Manager View)**
- Reviews sent this month
- Approval rate
- Average approval time
- Top reviewers (by speed)
- Bottleneck identification

---

## Better Auth Organization Integration

### **What Better Auth Gives Us (Built-In)**

✅ **Organizations (Workspaces)**
- Users can create multiple organizations
- Custom name, slug, logo, metadata
- Active organization switching

✅ **Members & Roles**
- Built-in roles: `owner`, `admin`, `member`
- Custom roles with permissions
- Invite/add/remove members
- Update member roles

✅ **Invitations**
- Email-based invitations
- Accept/reject/cancel
- Expiration dates
- Custom email templates

✅ **Teams (Optional Hierarchy)**
- Create teams within organizations
- Team-specific members
- Team switching
- Limit teams per org

✅ **Role-Based Access Control (RBAC)**
- Granular permissions
- Custom permission resources
- Dynamic role creation
- Permission checking APIs

---

### **Implementation Steps**

#### **Step 1: Add Organization Plugin**

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  // ... existing config

  plugins: [
    oidcProvider({ loginPage: "/signin" }),

    // ✅ NEW: Organization Plugin
    organization({
      // Only Pro/Team tier can create orgs
      allowUserToCreateOrganization: async (user) => {
        const sub = await prisma.user.findUnique({
          where: { id: user.id },
          select: { stripeSubscriptionId: true }
        });
        return !!sub?.stripeSubscriptionId;
      },

      organizationLimit: 5,
      creatorRole: "owner",

      // Enable teams
      teams: {
        enabled: true,
        maximumTeams: 10,
      },

      // Custom invitation emails
      async sendInvitationEmail(data) {
        const inviteLink = `${env.BETTER_AUTH_URL}/accept-invite/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `Join ${data.organization.name} on Thumbway`,
          html: `<p>${data.inviter.name} invited you to join ${data.organization.name}</p>
                 <a href="${inviteLink}">Accept Invitation</a>`
        });
      },

      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
    }),
  ],
});
```

#### **Step 2: Run Migrations**

```bash
pnpm @better-auth/cli migrate
```

This creates:
- `organization` table
- `member` table
- `invitation` table
- `team` table (if teams enabled)
- `teamMember` table (if teams enabled)

#### **Step 3: Update Review Schema**

```prisma
model Review {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String
  status      ReviewStatus @default(PENDING)

  creatorId   String
  creator     User     @relation(fields: [creatorId], references: [id])

  // ✅ NEW: Link to organization
  organizationId String?
  organization   organization? @relation(fields: [organizationId], references: [id])

  reviewers   Reviewer[]
  comments    Comment[]
  versions    ReviewVersion[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([organizationId])
}
```

#### **Step 4: Add Client Plugin**

```typescript
// src/trpc/react.tsx
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    organizationClient() // ✅ Add this
  ]
});
```

---

### **Usage Examples**

#### **Create Organization**
```typescript
const org = await authClient.organization.create({
  name: "My Marketing Team",
  slug: "my-marketing-team",
});
```

#### **Invite Team Member**
```typescript
await authClient.organization.inviteMember({
  email: "sarah@company.com",
  role: "member",
  organizationId: currentOrg.id,
});
// Better Auth sends email automatically!
```

#### **List Members**
```typescript
const members = await authClient.organization.listMembers({
  organizationId: currentOrg.id,
});
```

#### **Get Active Organization in Server**
```typescript
const session = await auth.api.getSession({ headers: await headers() });
const activeOrgId = session?.session.activeOrganizationId;

const reviews = await prisma.review.findMany({
  where: { organizationId: activeOrgId }
});
```

---

### **What We Still Need to Build**

❌ **Custom Tables:**
- `Reviewer` (many-to-many reviews ↔ members)
- `Comment` (review feedback)
- `ReviewVersion` (version history)

❌ **Features:**
- Team activity feed
- Team templates
- Team analytics
- Slack integration

**Time Saved:** 7-9 weeks (Better Auth handles all auth/member/invite logic)

---

## Implementation Roadmap

### **REVISED TIMELINE (Using Better Auth)**

**Total Time:** 4 weeks instead of 12 weeks 🎉

---

### **Week 1: Foundation + Organization Setup**
**Goal:** Set up Better Auth organizations and core multi-reviewer features

#### Days 1-2: Better Auth Organization Plugin
- [ ] **Add organization plugin to auth.ts**
  - Configure allowUserToCreateOrganization
  - Enable teams feature
  - Set up invitation emails

- [ ] **Run migrations**
  - `pnpm @better-auth/cli migrate`
  - Verify organization, member, invitation tables created

- [ ] **Add organizationClient to frontend**
  - Update trpc/react.tsx
  - Add organization switcher component

#### Days 3-4: Database Schema Updates
- [ ] **Update Review model**
  - Add `organizationId` field
  - Create Reviewer model (many-to-many)
  - Create Comment model
  - Create ReviewVersion model

- [ ] **Update tRPC routers**
  - Filter reviews by active organization
  - Add reviewers to review creation
  - Update review status calculation

#### Day 5: UI Polish
- [ ] **Toast notifications (Sonner)**
  - Replace all alert() calls
  - Success/error toasts

- [ ] **Loading states**
  - Skeleton loaders for dashboard
  - Loading spinners

- [ ] **Error boundaries**
  - App-level error boundary
  - Graceful error messages

**Deliverable:** Organizations working, multi-reviewer support, polished UX

---

### **Week 2: Team Features + ChatGPT Enhancement**
**Goal:** Complete team functionality and enhance ChatGPT integration

#### Days 1-2: Organization Dashboard
- [ ] **Organization management UI**
  - Create organization flow
  - Organization switcher
  - Organization settings page

- [ ] **Member management**
  - Invite member UI (uses Better Auth)
  - Member list with roles
  - Remove member functionality

#### Days 3-4: Enhanced MCP Tools
- [ ] **Update send_for_review tool**
  - Multi-reviewer support
  - Workflow type (parallel/sequential)
  - Parse multiple emails from ChatGPT

- [ ] **Add new MCP tools**
  - `approval.get_status` - check review status
  - `approval.update_review` - create new version
  - `approval.list_reviews` - show user's reviews

#### Day 5: Team Activity Feed
- [ ] **Activity tracking**
  - Track all team actions
  - Real-time feed on dashboard
  - Filters by person, action type

**Deliverable:** Complete team experience, enhanced ChatGPT workflow

---

### **Week 3: Comments + Version History**
**Goal:** Handle revision cycles professionally

#### Days 1-2: Comments System
- [ ] **Comment model implementation**
  - Create comment form
  - Comment thread display
  - Email notifications on new comments

- [ ] **ChatGPT integration**
  - Show comments in ChatGPT
  - Add comment from ChatGPT
  - "What did Sarah say?" query

#### Days 3-5: Version History
- [ ] **Version tracking**
  - Create ReviewVersion model
  - Store each update as version
  - Link to parent review

- [ ] **Diff view**
  - Show v1 → v2 changes
  - Highlight what changed
  - "Legal approved v1, Finance needs v2"

- [ ] **Selective re-sending**
  - Send updated version to specific reviewers
  - Track who approved which version

**Deliverable:** Professional revision workflow, version control

---

### **Week 4: Slack Integration + Launch**
**Goal:** Viral growth through Slack, launch to public

#### Days 1-3: Slack Integration
- [ ] **Slack OAuth**
  - Connect Slack workspace
  - Choose default channel

- [ ] **Send to Slack**
  - Post review to channel
  - Action buttons (Approve, Request Changes)

- [ ] **Approve from Slack**
  - Handle button clicks
  - Update review status
  - Notify creator

- [ ] **Team notifications**
  - "Sarah approved the blog post" → #marketing
  - DM to creator on status change

#### Days 4-5: Launch Preparation
- [ ] **App Store optimization**
  - Update metadata with golden prompts
  - Add screenshots
  - Write compelling description

- [ ] **Analytics setup**
  - Vercel Analytics
  - Tool call tracking
  - Conversion funnels

- [ ] **Launch**
  - Submit to ChatGPT App Directory
  - Product Hunt launch
  - LinkedIn/Twitter announcement

**Deliverable:** Slack integration live, public launch

---

## Technical Architecture

### **System Diagram (Updated with Better Auth)**

```
┌─────────────────────────────────────────────────────┐
│                    ChatGPT                          │
│  ┌────────────────────────────────────────────┐    │
│  │  User creates content in conversation      │    │
│  │  "Send to john@acme.com for approval"      │    │
│  └────────────────┬───────────────────────────┘    │
│                   │                                 │
│                   ▼                                 │
│  ┌────────────────────────────────────────────┐    │
│  │         MCP Protocol (OAuth 2.1)           │    │
│  │  Tools: send_for_review, get_status, etc.  │    │
│  └────────────────┬───────────────────────────┘    │
└───────────────────┼─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│              Thumbway API (tRPC)                    │
│  ┌────────────────────────────────────────────┐    │
│  │  Routers:                                   │    │
│  │  - review.create (with organizationId)      │    │
│  │  - review.addReviewer                       │    │
│  │  - review.updateStatus                      │    │
│  │  - review.addComment                        │    │
│  │  - organization.* (Better Auth)             │    │
│  └────────────────┬───────────────────────────┘    │
└───────────────────┼─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│         Better Auth + Business Logic                │
│  ┌────────────────────────────────────────────┐    │
│  │  Better Auth Organization Plugin            │    │
│  │  - Organizations, Members, Invitations      │    │
│  │  - Teams, Roles, Permissions                │    │
│  │  - Invitation emails                        │    │
│  │                                             │    │
│  │  Custom Business Logic:                     │    │
│  │  - Review workflow logic                    │    │
│  │  - Comment notifications                    │    │
│  │  - Version tracking                         │    │
│  └────────────────┬───────────────────────────┘    │
└───────────────────┼─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│            Database (PostgreSQL + Prisma)           │
│  ┌────────────────────────────────────────────┐    │
│  │  Better Auth Tables (auto-created):         │    │
│  │  - organization                             │    │
│  │  - member                                   │    │
│  │  - invitation                               │    │
│  │  - team                                     │    │
│  │  - teamMember                               │    │
│  │                                             │    │
│  │  Custom Tables (we build):                  │    │
│  │  - users                                    │    │
│  │  - reviews (with organizationId)            │    │
│  │  - reviewers (many-to-many)                 │    │
│  │  - comments                                 │    │
│  │  - review_versions                          │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
           │                │                │
           ▼                ▼                ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│   Postmark     │ │  Slack API     │ │  Stripe API    │
│  (Email)       │ │  (Notifications)│ │  (Billing)     │
└────────────────┘ └────────────────┘ └────────────────┘
```

---

### **Database Schema (Complete)**

```prisma
// ===================================
// BETTER AUTH TABLES (Auto-Created)
// ===================================

model organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logo      String?
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members     member[]
  invitations invitation[]
  teams       team[]
  reviews     Review[]
}

model member {
  id             String   @id @default(cuid())
  userId         String
  organizationId String
  role           String   // owner, admin, member
  createdAt      DateTime @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([organizationId])
}

model invitation {
  id             String   @id @default(cuid())
  email          String
  inviterId      String
  organizationId String
  role           String
  status         String   // pending, accepted, rejected, canceled
  expiresAt      DateTime
  createdAt      DateTime @default(now())

  inviter      User         @relation(fields: [inviterId], references: [id], onDelete: Cascade)
  organization organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([email])
}

model team {
  id             String   @id @default(cuid())
  name           String
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  members      teamMember[]

  @@index([organizationId])
}

model teamMember {
  id        String   @id @default(cuid())
  teamId    String
  userId    String
  createdAt DateTime @default(now())

  team team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
}

// ===================================
// CUSTOM TABLES (We Build)
// ===================================

model Review {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String
  status      ReviewStatus @default(PENDING)

  creatorId   String
  creator     User     @relation(fields: [creatorId], references: [id])

  // Link to Better Auth organization
  organizationId String?
  organization   organization? @relation(fields: [organizationId], references: [id])

  reviewers   Reviewer[]
  comments    Comment[]
  versions    ReviewVersion[]

  workflowType WorkflowType @default(PARALLEL)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([status])
  @@index([creatorId])
  @@index([organizationId])
}

model Reviewer {
  id          String   @id @default(cuid())

  reviewId    String
  review      Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  email       String
  name        String?
  status      ReviewerStatus @default(PENDING)

  // Workflow order (0 = parallel, 1+ = sequential)
  order       Int      @default(0)
  required    Boolean  @default(true)

  approvedAt  DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([reviewId])
  @@index([email])
}

model Comment {
  id          String   @id @default(cuid())

  reviewId    String
  review      Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  // For non-users (reviewers without account)
  authorEmail String?
  authorName  String?

  content     String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([reviewId])
}

model ReviewVersion {
  id          String   @id @default(cuid())

  reviewId    String
  review      Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  version     Int
  content     String
  changes     String?  // Summary of changes

  createdAt   DateTime @default(now())

  @@index([reviewId])
  @@unique([reviewId, version])
}

enum ReviewStatus {
  PENDING
  PARTIALLY_APPROVED
  CHANGES_REQUESTED
  APPROVED
  REJECTED
}

enum ReviewerStatus {
  PENDING
  APPROVED
  REJECTED
  CHANGES_REQUESTED
}

enum WorkflowType {
  PARALLEL      // All must approve (any order)
  SEQUENTIAL    // Must approve in order
}
```

---

## Success Metrics

### **Week 1 (Foundation)**
- [ ] Better Auth organization plugin working
- [ ] Can create organizations and invite members
- [ ] Reviews linked to organizations
- [ ] Multi-reviewer support functional

### **Week 2 (Team Features)**
- [ ] 5 beta teams testing
- [ ] Organization dashboard complete
- [ ] Activity feed showing team collaboration
- [ ] ChatGPT multi-reviewer commands working

### **Week 3 (Revision Workflow)**
- [ ] Comments system functional
- [ ] Version history tracking all changes
- [ ] Diff view showing what changed
- [ ] Selective re-send working

### **Week 4 (Slack + Launch)**
- [ ] Slack integration live
- [ ] Approve from Slack working
- [ ] App submitted to ChatGPT App Directory
- [ ] Public launch (Product Hunt, social)

### **Month 1 (Post-Launch)**
- [ ] 500 users
- [ ] 10 teams paying ($99/mo)
- [ ] 20 solo Pro users ($15/mo)
- [ ] $1,300 MRR

### **Month 3**
- [ ] 2,000 users
- [ ] 50 teams
- [ ] 100 solo Pro
- [ ] $6,450 MRR

### **Month 6**
- [ ] 10,000 users
- [ ] 150 teams
- [ ] 500 solo Pro
- [ ] $22,350 MRR

---

## Next Steps

### **Immediate Actions (This Week):**

1. **✅ Review & Approve Plan**
   - Product team reviews this doc
   - Confirm Better Auth organization approach
   - Adjust timeline if needed

2. **Start Week 1, Day 1**
   - Add organization plugin to auth.ts
   - Run migrations
   - Verify organization tables created

3. **Parallel Tasks**
   - Design organization dashboard mockups
   - Write test cases for multi-reviewer workflow
   - Plan Slack OAuth flow

---

**Ready to implement?** Say the word and I'll start with Week 1, Day 1: Adding the Better Auth organization plugin.
