# Test Cases - Ready to Copy-Paste
## Thumbway ChatGPT App

---

## POSITIVE TEST CASES

### Test Case 1: Send Content for Review

**Scenario:**
```
User wants to send a proposal for client approval
```

**User prompt:**
```
Send this proposal to sarah@client.com for approval: "We propose redesigning your website homepage with a modern layout, improved navigation, and mobile-first design. Budget: $5,000. Timeline: 4 weeks."
```

**Tool triggered:**
```
send_for_review
```

**Expected output:**
```
Interactive widget displays confirmation that review was created. Shows:
- Review title and content preview
- Reviewer email (sarah@client.com)
- Share link
- Quick actions (Check Status, Add Reviewer, Share Settings)
Widget displays successfully within 2-3 seconds.
```

---

### Test Case 2: Check Approval Status

**Scenario:**
```
User wants to check if their proposal was approved
```

**User prompt:**
```
Check the status of my website proposal review
```

**Tool triggered:**
```
check_approval_status
```

**Expected output:**
```
Interactive widget displays review status with:
- Overall status (PENDING/APPROVED/REJECTED)
- Approval progress bar
- List of reviewers with individual statuses
- Engagement data (viewed at, time spent)
- Timeline of events
- Smart suggestions for next actions
```

---

### Test Case 3: List All Pending Reviews

**Scenario:**
```
User wants to see all their pending reviews
```

**User prompt:**
```
Show me all my pending reviews
```

**Tool triggered:**
```
list_pending_reviews
```

**Expected output:**
```
Interactive dashboard widget displays:
- List of all pending reviews
- Status badges for each
- Reviewer progress
- Quick actions (View, Nudge, Cancel)
- Filter options
```

---

### Test Case 4: Generate AI Nudge Message

**Scenario:**
```
User wants to follow up with a non-responsive reviewer
```

**User prompt:**
```
Send a friendly reminder to sarah@client.com about my website proposal
```

**Tool triggered:**
```
generate_nudge
```

**Expected output:**
```
Widget displays AI-generated nudge message with:
- Draft message in friendly tone
- Reviewer engagement status (viewed/not viewed)
- Days since sent
- Edit capability
- Send/Cancel buttons
- Option to change tone (friendly/professional/urgent)
```

---

### Test Case 5: Manage Reviewers - Add

**Scenario:**
```
User wants to add another reviewer to an existing review
```

**User prompt:**
```
Add john@company.com as a reviewer to my website proposal
```

**Tool triggered:**
```
manage_reviewers
```

**Expected output:**
```
Widget displays reviewer management interface showing:
- Current reviewers with statuses
- New reviewer added confirmation
- Engagement metrics for each reviewer
- Actions (Nudge, Remove) per reviewer
- Add more reviewers option
```

---

### Test Case 6: Export Approved Content

**Scenario:**
```
User wants to share approved content with proof of approval
```

**User prompt:**
```
Get the share details for my approved marketing copy
```

**Tool triggered:**
```
get_share_details
```

**Expected output:**
```
Export widget displays:
- Content preview with latest version
- Approval status and metadata
- Approver names and timestamps
- Share link with access level settings
- Export options (Copy, Markdown, Email format)
```

---

### Test Case 7: Sequential Workflow

**Scenario:**
```
User wants approvals in a specific order
```

**User prompt:**
```
Send this contract for sequential approval: first to legal@company.com, then to cfo@company.com. Content: "Service Agreement for Project Alpha - $50,000 annual contract."
```

**Tool triggered:**
```
send_for_review
```

**Expected output:**
```
Confirmation widget shows:
- Sequential workflow enabled
- Order of reviewers (1. legal@, 2. cfo@)
- Note that second reviewer notified after first approves
- Review created successfully
```

---

### Test Case 8: Cancel a Review

**Scenario:**
```
User wants to cancel a review that's no longer needed
```

**User prompt:**
```
Cancel the website proposal review
```

**Tool triggered:**
```
cancel_review
```

**Expected output:**
```
Confirmation that review was cancelled:
- Review marked as CANCELLED
- All pending reviewers notified (optional)
- Cannot be undone warning acknowledged
```

---

## NEGATIVE TEST CASES

### Negative Test Case 1: Publishing Content

**Scenario:**
```
User wants to publish content directly to social media or website
```

**User prompt:**
```
Publish this blog post to my website: "10 Tips for Better Productivity"
```

**Why app should not trigger:**
```
Thumbway is for getting approval on content, not publishing it. Does not connect to websites, social media, or CMS platforms. User should use Thumbway to get approval BEFORE publishing via other means.
```

---

### Negative Test Case 2: Editing Documents

**Scenario:**
```
User wants to edit a document or collaborate in real-time
```

**User prompt:**
```
Let me edit this Google Doc with my team
```

**Why app should not trigger:**
```
Thumbway tracks approval workflows, not document editing. Does not integrate with Google Docs, Notion, or other editors. User should edit content first, then send for approval via Thumbway.
```

---

### Negative Test Case 3: Project Management

**Scenario:**
```
User wants to manage tasks or project timelines
```

**User prompt:**
```
Create a project plan with tasks and deadlines for the marketing campaign
```

**Why app should not trigger:**
```
Thumbway is for approval workflows, not project management. Does not create tasks, timelines, or Gantt charts. User should use project management tools for planning, then Thumbway for getting approvals on deliverables.
```

---

### Negative Test Case 4: Email Composition

**Scenario:**
```
User wants help writing an email (not getting approval on something)
```

**User prompt:**
```
Help me write a professional email to my boss about the budget increase
```

**Why app should not trigger:**
```
Thumbway sends content FOR approval, not general emails. If user wants to get approval on the email content before sending it to their boss, they should explicitly ask for approval. General email writing is ChatGPT's native capability.
```

---

### Negative Test Case 5: Analytics or Reporting

**Scenario:**
```
User wants analytics on their content performance
```

**User prompt:**
```
Show me analytics for how my content is performing this month
```

**Why app should not trigger:**
```
Thumbway tracks approval engagement (views, time spent), not content performance analytics. Does not measure impressions, clicks, conversions, or social engagement. Analytics on approval status (how many approved, pending) is available via list_pending_reviews.
```

---

## Quick Reference

**Positive Tests Coverage:**
- Test 1: Send for review (core feature)
- Test 2: Check status (core feature)
- Test 3: List reviews (dashboard)
- Test 4: Generate nudge (AI feature)
- Test 5: Manage reviewers (add/remove)
- Test 6: Export/share (approved content)
- Test 7: Sequential workflow (advanced)
- Test 8: Cancel review (lifecycle)

**Negative Tests Coverage:**
- Not for: Publishing content
- Not for: Document editing
- Not for: Project management
- Not for: General email writing
- Not for: Content analytics

**Tools Tested:**
- `send_for_review` (Tests 1, 7)
- `check_approval_status` (Test 2)
- `list_pending_reviews` (Test 3)
- `generate_nudge` (Test 4)
- `manage_reviewers` (Test 5)
- `get_share_details` (Test 6)
- `cancel_review` (Test 8)

**Tools Not Directly Tested:**
- `update_review_version` - Covered implicitly (revisions after feedback)
- `update_public_access` - Covered in share details flow
- `status_summary` - Similar to check_approval_status
