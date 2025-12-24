# ChatGPT App Submission Form - Clean Version
## Thumbway

**Last Updated**: 2025-12-23

---

## App Info

### Logo Icon
- **Format**: SVG (64 x 64 px)
- **Requirements**: Square, no borders or rounded corners (circular cropping applied automatically)
- **Status**: TO CREATE

---

### App Name
```
Thumbway
```

---

### Subtitle
*(Maximum 30 characters)*

```
Get content approved fast
```

**Character count**: 24/30

---

### Description

```
Thumbway brings approval workflows to ChatGPT. Send content for review, track who's seen it, and get sign-off without leaving your conversation.

Simply describe what needs approval: "Send this proposal to sarah@client.com for sign-off." Your reviewer gets an email with your content, and you can track their engagement in real-time.

Core Features:
- Send any content for approval to up to 10 reviewers
- Track engagement (who viewed, when, how long they spent)
- AI-generated nudge messages for non-responders
- Three workflow types: parallel, sequential, any-one approval
- Export approved content with sign-off metadata
- Interactive widgets showing approval progress

Perfect for freelancers, small teams, and anyone tired of chasing approvals via email.

Get started: Just ask ChatGPT to "send this for approval to client@email.com" or "check the status of my proposal review."
```

**Word count**: ~115 words

---

### Category
```
Productivity
```

---

### Developer
```
Sendvelo s.r.o.
```

---

### Website URL
```
https://thumbway.com
```

---

### Customer Support URL or Email Address
```
support@thumbway.com
```

---

### Privacy Policy URL
```
https://thumbway.com/privacy-policy
```

**Status**: VERIFY - Must include ChatGPT app-specific section

---

### Terms of Service URL
```
https://thumbway.com/terms-of-service
```

---

### Demo Recording URL
*(Record a video demonstrating your app's functionality using Developer Mode)*

```
https://thumbway.com/chatgpt/demo
```

**Status**: TO CREATE

**Demo must show**:
- Sending content for review
- Checking approval status widget
- Nudge generation
- Reviewer management
- Export functionality

---

### App Commerce & Purchasing

**Does your app involve sales?**

```
☐ No
```

*Free tier available (5 reviews/month). Subscriptions via website only.*

---

## MCP Server Details

### MCP Server URL
```
https://thumbway.com/mcp
```

---

### OAuth Configuration

**Does your app require authentication?**

```
☑ Yes
```

**OAuth 2.0 Details**:
- Authorization URL: `https://thumbway.com/api/auth/authorize`
- Token URL: `https://thumbway.com/api/auth/token`
- Scopes: `reviews:read`, `reviews:write`

**Demo Account for Reviewers**:
```
Email: demo@thumbway.com
Password: [To be created]
```

---

### Content Security Policy (CSP)

```json
{
  "frame_domains": null,
  "fetch_domains": [
    "https://thumbway.com"
  ]
}
```

---

## Tools Included (10 Tools)

### Tool 1: `send_for_review`

**Description**:
```
Send content for approval to one or more reviewers. Supports parallel, sequential, or any-one approval workflows. Shows confirmation widget with next actions.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: false`, `openWorldHint: true`

---

### Tool 2: `check_approval_status`

**Description**:
```
Check the current status of a review, including which reviewers have approved and engagement data. Shows an interactive widget with approval progress.
```

**Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`

---

### Tool 3: `list_pending_reviews`

**Description**:
```
List your reviews filtered by status (pending, approved, rejected, or all). Shows an interactive dashboard widget.
```

**Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`

---

### Tool 4: `update_review_version`

**Description**:
```
Update a review with new content, creating a new version. Useful for addressing feedback. Notifies reviewers of the update.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: false`, `openWorldHint: true`

---

### Tool 5: `manage_reviewers`

**Description**:
```
Add, remove, or send reminders to reviewers on an existing review. Shows interactive reviewer management widget.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: false`, `openWorldHint: true`

---

### Tool 6: `generate_nudge`

**Description**:
```
Generate an AI-crafted follow-up message to nudge pending reviewers. Shows preview widget to review and edit before sending.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: false`, `openWorldHint: true`

---

### Tool 7: `get_share_details`

**Description**:
```
Get the current sharing settings for a review, including public access level, share link, and export options.
```

**Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`

---

### Tool 8: `update_public_access`

**Description**:
```
Update the public access level for a review. Controls who can view, comment on, or approve via the public link.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: false`, `openWorldHint: false`

---

### Tool 9: `status_summary`

**Description**:
```
Get a natural language summary of a review's approval status with smart suggestions. Shows an interactive status widget.
```

**Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`

---

### Tool 10: `cancel_review`

**Description**:
```
Cancel a review by ID or title. Stops all pending reviewers and marks the review as cancelled.
```

**Annotations**: `readOnlyHint: false`, `destructiveHint: true`, `openWorldHint: false`

---

## Pre-Submission Checklist

### Critical (Must Complete Before Submission)

- [ ] **Organization Verification Complete** (OpenAI Platform Dashboard)
- [ ] **Owner Role Confirmed** (submitter must have Owner role)
- [ ] **Privacy Policy Updated** (includes ChatGPT app-specific section)
- [ ] **Demo Video Created** (2-5 min, shows all major features)
- [ ] **Logo Icon Designed** (64x64px SVG)
- [ ] **Demo Account Created** (pre-populated with sample reviews)

### Recommended (Should Complete Before Submission)

- [ ] **CSP Domains Verified** (all external fetch domains listed)
- [ ] **Tool Descriptions Tested** (run test cases, verify tool selection)
- [ ] **URLs Live and Accessible** (website, privacy, terms, support)
- [ ] **MCP Server Stable** (uptime tested)
- [ ] **OAuth Flow Tested** (full auth cycle works)

---

## Submission Readiness Status

| Item | Status | Blocker? |
|------|--------|----------|
| Organization Verification | UNKNOWN | YES |
| Privacy Policy | NEEDS UPDATE | YES |
| Demo Video | NOT CREATED | YES |
| Logo Icon | NOT CREATED | YES |
| Demo Account | NOT CREATED | YES |
| App Name | READY | No |
| Subtitle | READY | No |
| Description | READY | No |
| Category | READY | No |
| Developer Info | READY | No |
| Commerce | READY (No) | No |
| MCP Server | READY | No |
| OAuth | READY | No |
| CSP | READY | No |
| Tools Defined | READY (10 tools) | No |

**Overall Status**: ~60% Ready

**Blockers**: 5 critical items

---

## Quick Reference

### Unique Value Proposition
- **The ONLY approval workflow app in ChatGPT App Store**
- Fills gap between creation (Canva, Figma) and collaboration (Slack, Notion)
- Solves: "Did you see my email?" follow-up chaos

### Key Messaging
- **Pain Point**: "Approval chaos - endless email chains, lost sign-offs"
- **Solution**: "Get content approved without leaving ChatGPT"
- **Value**: "Track engagement, nudge non-responders, prove sign-off"

### Policy Compliance
- OAuth required (adds complexity but necessary for user data)
- openWorldHint: true for email-sending tools (honest annotation)
- Free tier = no commerce complications

---

**For detailed reasoning and compliance analysis, see**: `SUBMISSION_FORM.md`
**For test cases, see**: `TEST_CASES_SUBMISSION.md`
**For compliance check, see**: `COMPLIANCE_ANALYSIS.md`
