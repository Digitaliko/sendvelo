# Thumbway ChatGPT App Store Strategy
## Use Cases, Metadata & Discovery Optimization

**Last Updated:** December 22, 2024
**Based on:** OpenAI Apps SDK Official Guidelines
**Status:** Ready for Implementation

---

## Table of Contents

1. [Use Case Definition](#use-case-definition)
2. [Golden Prompt Set](#golden-prompt-set)
3. [Tool Metadata Optimization](#tool-metadata-optimization)
4. [Discovery Strategy](#discovery-strategy)
5. [Implementation Checklist](#implementation-checklist)

---

## Use Case Definition

### **Primary Use Cases (By Research Phase)**

Based on OpenAI's recommended approach: **Qualitative → Quantitative → System Analysis**

#### **Phase 1: Qualitative Research (User Jobs-to-be-Done)**

**Use Case 1: Freelancer → Client Approval**
- **Job:** Get client approval on ChatGPT-generated proposals/deliverables
- **Pain:** Email chains are slow, unprofessional, hard to track
- **Goal:** Send proposal for approval without leaving ChatGPT
- **Success:** Client approves in < 1 hour vs 2 days

**Use Case 2: Marketing Team → Blog Approval**
- **Job:** Get CMO + Legal approval on blog posts before publishing
- **Pain:** Google Docs comments messy, stakeholders miss notifications
- **Goal:** Multi-stakeholder approval in one workflow
- **Success:** All stakeholders approve in < 4 hours

**Use Case 3: Sales Rep → Multi-Stage Approval**
- **Job:** Get Sales Director, Finance, Legal approval on enterprise deals
- **Pain:** Sequential email chains, losing track of who approved what
- **Goal:** Structured approval workflow (Director → Finance + Legal)
- **Success:** Deal approval in < 1 day vs 1 week

**Use Case 4: Product Manager → PRD Review**
- **Job:** Get feedback from Engineering, Design, Exec on product specs
- **Pain:** Feedback scattered across Slack, email, Notion
- **Goal:** Centralized feedback from all stakeholders
- **Success:** Consolidated feedback in one place, trackable status

**Use Case 5: Content Writer → Editorial Approval**
- **Job:** Get editor approval on article drafts
- **Pain:** Version control nightmare (email attachments, Google Docs)
- **Goal:** Clean revision loop with version history
- **Success:** Track v1, v2, v3 with feedback on each

---

#### **Phase 2: Quantitative Research (Prompt Analysis)**

**Direct Prompts** (User explicitly mentions approval/review):
1. "Send this proposal to john@acme.com for approval"
2. "Get feedback on this email from my team"
3. "Share this with sarah@company.com and mike@company.com for review"
4. "Send to my client for approval"
5. "Request approval from legal@company.com on this contract"

**Indirect Prompts** (User intent without mentioning approval):
1. "I need my boss to sign off on this before I send it"
2. "Can you share this with my team?"
3. "My client needs to see this - how do I send it?"
4. "I want feedback from Sarah before publishing"
5. "Legal needs to review this contract"
6. "Send this to john@acme.com" (simple sharing intent)

**Negative Prompts** (Should NOT trigger Thumbway):
1. "Schedule a meeting with john@acme.com" → Calendar tool
2. "Email this to john@acme.com" → Email tool
3. "Search for approval workflows" → Web search
4. "What's the status of my Jira ticket?" → Jira integration
5. "Remind me to get approval tomorrow" → Reminder tool

**Boundary Cases** (Need clarification):
1. "Share this with my team" → Could be approval or just FYI
   - Thumbway should ask: "Do you want approval or just sharing?"
2. "Send to legal@company.com" → Approval or just info?
   - Thumbway should default to approval, offer "just share" option

---

#### **Phase 3: System Analysis (Constraints)**

**Inline Visibility Requirements:**
- Review status (pending, approved, rejected)
- Who has approved, who's pending
- Latest comments/feedback
- Quick link to review page

**Write Access Boundaries:**
- ✅ Create review → No confirmation needed
- ✅ Add comment → No confirmation needed
- ⚠️ Send reminder → Confirm first ("Send reminder to Sarah?")
- ❌ Delete review → Requires web app (destructive action)

**State Persistence Needs:**
- Remember reviewers per content type (legal content → legal@company.com)
- Draft reviews (user creating multi-part approval workflow)
- Conversation context (update existing review from chat)

---

## Golden Prompt Set

### **Test Suite for Metadata Optimization**

Following OpenAI's recommendation: "Create evaluation prompts across three categories"

#### **Direct Prompts (Minimum 5)**

✅ **Should trigger Thumbway:**

1. "Send this blog post to sarah@company.com for approval"
   - **Expected:** `send_for_review` tool called
   - **Confidence:** High

2. "Get approval from legal@company.com and finance@company.com on this contract"
   - **Expected:** `send_for_review` with multiple reviewers
   - **Confidence:** High

3. "Share this proposal with john@acme.com and ask for feedback"
   - **Expected:** `send_for_review` tool called
   - **Confidence:** High

4. "Send to mike@company.com for review"
   - **Expected:** `send_for_review` tool called
   - **Confidence:** High

5. "Request approval from my team on this email draft"
   - **Expected:** `send_for_review` tool called
   - **Confidence:** Medium (needs clarification on team members)

#### **Indirect Prompts (Minimum 5)**

✅ **Should trigger Thumbway:**

1. "My boss needs to sign off on this before I can proceed"
   - **Expected:** Thumbway asks for boss's email
   - **Confidence:** Medium

2. "I need Sarah's feedback on this before publishing"
   - **Expected:** Thumbway asks for Sarah's email
   - **Confidence:** Medium

3. "Can you help me get this approved by my client?"
   - **Expected:** Thumbway asks for client email
   - **Confidence:** High

4. "Legal needs to review this contract before we sign"
   - **Expected:** Thumbway asks for legal team email
   - **Confidence:** Medium

5. "I want my team to weigh in on this strategy"
   - **Expected:** Thumbway asks for team emails
   - **Confidence:** Low (could be discussion, not approval)

#### **Negative Prompts (Should NOT trigger)**

❌ **Should NOT trigger Thumbway:**

1. "Schedule a meeting with john@acme.com to discuss this"
   - **Expected:** Calendar tool
   - **Precision Test:** Thumbway should NOT activate

2. "Email this document to sarah@company.com"
   - **Expected:** Email tool
   - **Precision Test:** Thumbway should NOT activate

3. "Search for approval workflow best practices"
   - **Expected:** Web search
   - **Precision Test:** Thumbway should NOT activate

4. "Create a reminder to get approval next week"
   - **Expected:** Reminder tool
   - **Precision Test:** Thumbway should NOT activate

5. "What's the weather in New York?"
   - **Expected:** Weather tool
   - **Precision Test:** Thumbway should NOT activate

---

### **Precision/Recall Targets**

**Precision:** 90%+ (Thumbway only activates when it should)
**Recall:** 85%+ (Thumbway activates for most approval intents)

**Test Weekly:**
- Run golden prompt set through ChatGPT
- Track which prompts correctly trigger Thumbway
- Adjust metadata based on results

---

## Tool Metadata Optimization

### **Current MCP Tool Definition (v1.0)**

```json
{
  "name": "send_for_review",
  "description": "Send content for review and approval",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "content": { "type": "string" },
      "reviewerEmail": { "type": "string" }
    }
  }
}
```

**Problems:**
- ❌ Description doesn't start with "Use this when..."
- ❌ No negative cases ("Do not use for...")
- ❌ Single reviewer only
- ❌ No parameter examples
- ❌ No behavioral hints

---

### **Optimized MCP Tool Definition (v2.0)**

Following OpenAI's guidelines: **Name = domain + action**, **Description = "Use this when..." + negative cases**

```json
{
  "name": "approval.send_for_review",
  "description": "Use this when the user wants to send content (proposals, emails, documents, blog posts, contracts, etc.) to one or more people for approval, feedback, or sign-off. The reviewers will receive an email with a link to review and approve/reject the content. Do NOT use this for: scheduling meetings, sending regular emails without approval needed, sharing files without feedback request, or creating reminders.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Title or subject of the content being reviewed. Example: 'Q4 Marketing Proposal', 'Client Contract for Acme Corp', 'Blog Post: AI Feature Launch'",
        "examples": ["Website Redesign Proposal", "Email Campaign Draft", "Product Requirements Document"]
      },
      "content": {
        "type": "string",
        "description": "The full content to be reviewed. Can be text, markdown, HTML, or any written material that needs approval."
      },
      "reviewers": {
        "type": "array",
        "description": "List of people who should review and approve this content. Include email addresses and optionally names. Examples: [{\"email\": \"john@acme.com\", \"name\": \"John Smith\"}]",
        "items": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "description": "Email address of the reviewer. Example: 'sarah@company.com'"
            },
            "name": {
              "type": "string",
              "description": "Optional name of the reviewer. Example: 'Sarah Chen'"
            },
            "order": {
              "type": "number",
              "description": "Order in sequential workflow. 0 = parallel (all can review at once), 1+ = sequential (must approve in order). Example: Legal reviews first (order=1), then Finance (order=2)",
              "default": 0,
              "examples": [0, 1, 2]
            },
            "required": {
              "type": "boolean",
              "description": "Whether this reviewer's approval is required. Default: true",
              "default": true
            }
          },
          "required": ["email"]
        },
        "minItems": 1,
        "maxItems": 10
      },
      "workflowType": {
        "type": "string",
        "enum": ["parallel", "sequential"],
        "description": "How reviewers should approve. 'parallel' = all can review at once (default). 'sequential' = must approve in order specified.",
        "default": "parallel",
        "examples": ["parallel", "sequential"]
      },
      "message": {
        "type": "string",
        "description": "Optional message to reviewers explaining what they're reviewing and what feedback you're looking for. Example: 'Please review pricing section and legal terms'",
        "examples": [
          "Please review for brand voice consistency",
          "Focus on the pricing section - does this look fair?",
          "Need your approval by EOD for tomorrow's launch"
        ]
      }
    },
    "required": ["title", "content", "reviewers"]
  },
  "readOnlyHint": false,
  "destructiveHint": false,
  "openWorldHint": true
}
```

**Improvements:**
- ✅ Description starts with "Use this when..."
- ✅ Negative cases explicitly stated
- ✅ Multiple reviewers supported
- ✅ Every parameter documented with examples
- ✅ Behavioral hints included
- ✅ Name follows `domain.action` pattern

---

### **Additional Tools (Full Suite)**

#### **Tool 2: Get Review Status**

```json
{
  "name": "approval.get_status",
  "description": "Use this when the user wants to check the status of a review they sent (whether it's been approved, who has reviewed it, what feedback was given). Do NOT use for: checking email status, calendar events, or unrelated status queries.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "reviewId": {
        "type": "string",
        "description": "ID of the review to check. If user doesn't specify, show their most recent reviews.",
        "examples": ["clx123abc", "latest", "all"]
      }
    }
  },
  "readOnlyHint": true,
  "destructiveHint": false
}
```

#### **Tool 3: Update Review**

```json
{
  "name": "approval.update_review",
  "description": "Use this when the user wants to update content that's already been sent for review (e.g., after receiving feedback requesting changes). Creates a new version and optionally re-sends to specific reviewers. Do NOT use for: editing unrelated documents, updating calendar events, or general content editing.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "reviewId": {
        "type": "string",
        "description": "ID of the review to update"
      },
      "content": {
        "type": "string",
        "description": "Updated content (new version)"
      },
      "changes": {
        "type": "string",
        "description": "Summary of what changed. Example: 'Updated pricing from $20K to $15K per Legal feedback'",
        "examples": [
          "Fixed typos in introduction",
          "Added pricing breakdown section",
          "Changed delivery timeline from 6 to 8 weeks"
        ]
      },
      "resendTo": {
        "type": "array",
        "description": "Optional: specific reviewers to re-send to. If omitted, sends to all reviewers.",
        "items": { "type": "string", "format": "email" },
        "examples": [["legal@company.com"], ["sarah@company.com", "mike@company.com"]]
      }
    },
    "required": ["reviewId", "content"]
  },
  "readOnlyHint": false,
  "destructiveHint": false
}
```

#### **Tool 4: List My Reviews**

```json
{
  "name": "approval.list_reviews",
  "description": "Use this when the user wants to see all their reviews or filter by status (pending, approved, rejected). Do NOT use for: listing files, emails, calendar events, or other non-review items.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["all", "pending", "approved", "rejected", "changes_requested"],
        "description": "Filter reviews by status. Default: 'all'",
        "default": "all"
      },
      "limit": {
        "type": "number",
        "description": "Number of reviews to return. Default: 10",
        "default": 10,
        "minimum": 1,
        "maximum": 50
      }
    }
  },
  "readOnlyHint": true,
  "destructiveHint": false
}
```

#### **Tool 5: Add Comment**

```json
{
  "name": "approval.add_comment",
  "description": "Use this when the user wants to add a comment or note to a review (either as creator or reviewer). Do NOT use for: general note-taking, email replies, or chat messages.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "reviewId": {
        "type": "string",
        "description": "ID of the review to comment on"
      },
      "comment": {
        "type": "string",
        "description": "The comment text",
        "examples": [
          "Please review the pricing section specifically",
          "Updated based on your feedback",
          "Thanks for the quick approval!"
        ]
      }
    },
    "required": ["reviewId", "comment"]
  },
  "readOnlyHint": false,
  "destructiveHint": false
}
```

---

## Discovery Strategy

### **How ChatGPT Chooses Thumbway**

Based on OpenAI docs: *"The assistant chooses your app when your tool metadata, descriptions, and past usage align with the user's prompt and memories."*

**Optimization Factors:**

#### **1. Tool Name Alignment**
```
User: "Send this for approval"
→ Keyword "approval" matches tool name "approval.send_for_review"
→ Higher likelihood of selection
```

#### **2. Description Clarity**
```
User: "Get feedback from my team"
→ Description mentions "approval, feedback, or sign-off"
→ Semantic match increases selection
```

#### **3. Past Usage**
```
User previously: "Send to sarah@company.com for approval"
→ Thumbway was called successfully
→ ChatGPT learns this pattern
→ Next time user says "send to Sarah", higher likelihood
```

#### **4. User Memories**
```
ChatGPT remembers:
- User frequently sends proposals for approval
- User's usual reviewers: legal@company.com, cmo@company.com
- User prefers parallel workflows

Next time:
User: "Send this proposal"
→ ChatGPT may auto-suggest: "Send to legal@ and cmo@?"
```

---

### **Discovery Optimization Tactics**

#### **Tactic 1: Keyword Optimization in Descriptions**

**Keywords to include:**
- approval, review, feedback, sign-off
- stakeholder, client, team, manager, legal
- proposal, contract, email, blog, document
- send, share, request, get

**Example description:**
> "Use this when the user wants to send **content** (**proposals**, **emails**, **documents**, **blog posts**, **contracts**, etc.) to one or more **people** for **approval**, **feedback**, or **sign-off**."

**Why:** These keywords match common user intents

---

#### **Tactic 2: Negative Case Precision**

**Explicit negatives prevent mis-activation:**
> "Do NOT use this for: **scheduling meetings**, sending **regular emails** without approval needed, **sharing files** without feedback request, or creating **reminders**."

**Why:** Prevents Thumbway from competing with Calendar, Email, or Reminder tools

---

#### **Tactic 3: Usage Pattern Reinforcement**

**Encourage repeat usage:**
- After successful approval, ChatGPT says: "John approved! Want to send another review?"
- After user checks status, ChatGPT suggests: "Need to update this review based on feedback?"

**Why:** Builds user habit, reinforces tool selection pattern

---

#### **Tactic 4: Smart Defaults from Context**

**Remember reviewers:**
```
User (first time): "Send to legal@company.com"
→ Thumbway stores: legal reviews = legal@company.com

User (later): "Send this contract for legal review"
→ ChatGPT auto-fills: "Send to legal@company.com?"
→ User: "Yes"
→ Faster workflow, reinforces usage
```

---

## Implementation Checklist

### **Phase 1: Metadata Optimization (Week 1)**

- [ ] **Update Tool Descriptions**
  - [ ] Rewrite all tool descriptions with "Use this when..." format
  - [ ] Add negative cases to each tool
  - [ ] Add examples to every parameter

- [ ] **Golden Prompt Set Testing**
  - [ ] Create test suite with 5 direct, 5 indirect, 5 negative prompts
  - [ ] Manually test in ChatGPT
  - [ ] Track precision/recall metrics
  - [ ] Adjust descriptions based on results

- [ ] **Tool Name Optimization**
  - [ ] Rename tools: `approval.send_for_review`, `approval.get_status`, etc.
  - [ ] Ensure names follow `domain.action` pattern

- [ ] **Behavioral Hints**
  - [ ] Add `readOnlyHint`, `destructiveHint`, `openWorldHint` to all tools
  - [ ] Document which actions need confirmation

---

### **Phase 2: Enhanced Tool Suite (Week 2)**

- [ ] **Multi-Reviewer Support**
  - [ ] Update `send_for_review` to accept array of reviewers
  - [ ] Add `workflowType` parameter (parallel vs sequential)
  - [ ] Add `order` field for sequential workflows

- [ ] **New Tools**
  - [ ] Implement `approval.get_status`
  - [ ] Implement `approval.update_review`
  - [ ] Implement `approval.list_reviews`
  - [ ] Implement `approval.add_comment`

- [ ] **Parameter Documentation**
  - [ ] Add examples to every parameter
  - [ ] Document enums (workflowType, status, etc.)
  - [ ] Add min/max constraints where applicable

---

### **Phase 3: Discovery Optimization (Week 3)**

- [ ] **Usage Pattern Learning**
  - [ ] Track which reviewers user sends to most often
  - [ ] Store content type → reviewer mappings
  - [ ] Suggest reviewers based on content analysis

- [ ] **Smart Defaults**
  - [ ] Auto-suggest reviewers based on past usage
  - [ ] Remember workflow preferences (parallel vs sequential)
  - [ ] Default message templates per content type

- [ ] **Conversation Continuity**
  - [ ] After approval, suggest next actions ("Update and resend?")
  - [ ] After rejection, suggest revision workflow
  - [ ] After partial approval, show who's pending

---

### **Phase 4: Monitoring & Iteration (Ongoing)**

- [ ] **Weekly Analytics Review**
  - [ ] Track tool call frequency
  - [ ] Identify mis-activations (false positives)
  - [ ] Identify missed activations (false negatives)

- [ ] **Metadata Iteration**
  - [ ] Adjust descriptions based on user feedback
  - [ ] Add new keywords based on common prompts
  - [ ] Refine negative cases to improve precision

- [ ] **User Feedback Loop**
  - [ ] Survey users: "Did Thumbway work as expected?"
  - [ ] Collect failed use cases
  - [ ] Prioritize fixes based on frequency

---

## App Store Listing (Optimized)

### **App Name**
**Thumbway - Team Approval for AI Content**

**Why:**
- "Thumbway" = brand
- "Team Approval" = primary use case keyword
- "AI Content" = target content type

---

### **Tagline (Short Description)**
**"Get stakeholder approval on ChatGPT content in minutes, not days"**

**Why:**
- Clear value prop (speed: minutes vs days)
- Keywords: approval, ChatGPT, content, stakeholder
- 68 characters (fits most platforms)

---

### **Long Description**

```
Thumbway is the approval platform for teams creating content in ChatGPT.

When ChatGPT generates your proposal, blog post, email, or strategy, Thumbway gets stakeholder approval instantly—without leaving ChatGPT.

✅ Send for approval in one command
📧 Reviewers get email with approve/reject buttons
👥 Multiple reviewers (parallel or sequential workflows)
💬 Comments and feedback in one thread
📊 Track all reviews in your dashboard
🔄 Version history for revision cycles

Perfect for:
- Freelancers sending client proposals
- Marketing teams getting CMO + Legal approval on blog posts
- Sales teams getting stakeholder sign-off on deals
- Product managers getting feedback on PRDs
- Anyone who needs approval on AI-generated content

How it works:
1. ChatGPT writes your content
2. Say "Send to john@acme.com for approval"
3. Reviewers click link and approve/reject
4. Get real-time updates in ChatGPT
5. Ship approved content

Pricing:
- Free: 5 reviews/month
- Pro: $15/month unlimited reviews
- Team: $99/month for 5-20 people

Try it free - no credit card required.
```

**Why:**
- Leads with use case (approval platform for ChatGPT content)
- Clear how-it-works in 5 steps
- Social proof (perfect for X, Y, Z)
- Pricing transparency
- Keywords: approval, ChatGPT, content, team, stakeholder, feedback

---

### **Screenshots (App Store)**

**Screenshot 1: ChatGPT Integration**
```
[Screenshot of ChatGPT conversation]
User: "Send this proposal to john@acme.com for approval"
ChatGPT: "✅ Sent! John will receive an email to review and approve."
```
Caption: "Send for approval in one command - stay in ChatGPT"

**Screenshot 2: Review Page**
```
[Screenshot of clean review page with Approve/Reject buttons]
```
Caption: "Reviewers see professional approval page with one-click approve"

**Screenshot 3: Dashboard**
```
[Screenshot of dashboard showing multiple reviews with statuses]
```
Caption: "Track all reviews in one place - see who approved, who's pending"

**Screenshot 4: Multi-Reviewer**
```
[Screenshot showing 2/3 approved, 1 pending]
```
Caption: "Multiple reviewers - parallel or sequential workflows"

**Screenshot 5: Comments**
```
[Screenshot of feedback thread]
```
Caption: "Centralized feedback - no more scattered email chains"

---

## Success Metrics

### **Discovery Metrics (Week 1-4)**
- [ ] Tool activation rate: 80%+ of approval intents trigger Thumbway
- [ ] Precision: 90%+ (no false activations)
- [ ] Recall: 85%+ (catches most approval intents)

### **Usage Metrics (Month 1-3)**
- [ ] 80% of reviews created via ChatGPT (vs web app)
- [ ] Average 5 reviews/user/month
- [ ] 85%+ approval completion rate (reviewers respond)

### **Growth Metrics (Month 3-6)**
- [ ] 50% of new users from ChatGPT App Store (vs direct web)
- [ ] Featured in "Productivity" category
- [ ] 4.5+ star rating with 100+ reviews

---

## Next Steps

1. **This Week:**
   - [ ] Update all MCP tool metadata with new descriptions
   - [ ] Create golden prompt set (15 prompts: 5 direct, 5 indirect, 5 negative)
   - [ ] Test in ChatGPT and measure precision/recall

2. **Next Week:**
   - [ ] Implement multi-reviewer support in `send_for_review` tool
   - [ ] Add new tools: `get_status`, `update_review`, `list_reviews`
   - [ ] Iterate on metadata based on test results

3. **Week 3:**
   - [ ] Submit updated app to ChatGPT App Directory
   - [ ] Monitor activation metrics
   - [ ] Collect user feedback and iterate

**Ready to implement?** Say the word and I'll start with the metadata updates.

---

## Appendix: Research Sources

- [OpenAI Apps SDK: Plan Use Case](https://developers.openai.com/apps-sdk/plan/use-case)
- [OpenAI Apps SDK: Optimize Metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata)
