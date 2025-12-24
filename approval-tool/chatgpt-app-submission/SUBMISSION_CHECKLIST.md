# OpenAI Apps Submission Checklist
## Thumbway

---

## Pre-Submission Tasks

### 1. Domain Verification

- [ ] Ensure MCP server is accessible at `https://thumbway.com/mcp`
- [ ] Verify OAuth endpoints are live:
  - [ ] Authorization: `https://thumbway.com/api/auth/authorize`
  - [ ] Token: `https://thumbway.com/api/auth/token`
- [ ] Test widget pages are accessible:
  - [ ] `/widget/review-status`
  - [ ] `/widget/reviews-dashboard`
  - [ ] `/widget/review-created`
  - [ ] `/widget/nudge-preview`
  - [ ] `/widget/export`
  - [ ] `/widget/reviewer-management`

**Test Commands:**
```bash
# Test MCP endpoint
curl -X POST https://thumbway.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/list"}'

# Should return list of 10 tools
```

---

### 2. Tool Annotations (200 character limit)

Copy these short answers into the OpenAI submission form:

#### `send_for_review`

**Read Only: No**
```
Creates review records and sends email notifications to reviewers. Modifies database state and triggers external email delivery. Not a query operation.
```

**Open World: Yes**
```
Sends emails to user-provided email addresses. Creates publicly accessible review pages. Interacts with external email systems via Postmark.
```

**Destructive: No**
```
Creates new reviews only, does not delete existing data. Additive operation that can be cancelled later. No data loss possible.
```

---

#### `check_approval_status`

**Read Only: Yes**
```
Queries database for review status and engagement data. Returns information for display only. No modifications, no emails, no side effects.
```

**Open World: No**
```
Internal database query only. Does not access external services or user-provided URLs. Fully sandboxed operation.
```

**Destructive: No**
```
Query operation only. Cannot modify or delete review data. Viewing status has no side effects.
```

---

#### `cancel_review`

**Read Only: No**
```
Updates review status to CANCELLED. Modifies database record. Stops the approval workflow for pending reviewers.
```

**Open World: No**
```
Internal database update only. Does not send notifications. No external service calls.
```

**Destructive: Yes**
```
Cancelling is irreversible. Review moves to terminal state. Pending reviewers dismissed. Cannot be undone.
```

**Full justifications available in:** `TOOL_JUSTIFICATIONS.md`

---

### 3. Environment Variables

**Production Setup:**

```bash
# Required for MCP
NEXT_PUBLIC_APP_URL=https://thumbway.com
DATABASE_URL=postgresql://...

# Email (Postmark)
POSTMARK_API_KEY=...

# Auth (Better Auth)
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://thumbway.com

# Stripe (for subscriptions - not used in ChatGPT)
STRIPE_SECRET_KEY=...
```

---

### 4. OAuth Configuration

**OAuth 2.0 with PKCE:**

```json
{
  "authorization_endpoint": "https://thumbway.com/api/auth/authorize",
  "token_endpoint": "https://thumbway.com/api/auth/token",
  "scopes": ["reviews:read", "reviews:write"],
  "client_id": "[Generated during registration]",
  "response_type": "code",
  "code_challenge_method": "S256"
}
```

---

### 5. Demo Account Setup

- [ ] Create `demo@thumbway.com` account
- [ ] Pre-populate with sample reviews:
  - [ ] 1 Approved review
  - [ ] 1 Pending review (with engagement data)
  - [ ] 1 Rejected review
- [ ] Document credentials for submission form
- [ ] Test login flow works

---

### 6. Build & Deploy

```bash
# 1. Build
pnpm build

# 2. Verify no errors
# Check: "Compiled successfully"

# 3. Deploy to production
# (Railway/Vercel deployment)

# 4. Verify endpoints
curl https://thumbway.com/mcp -X POST \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/list"}'
```

---

### 7. Testing Checklist

**Before Submission:**

- [ ] All 10 tools return correct responses
- [ ] OAuth flow completes successfully
- [ ] Widgets render in ChatGPT
- [ ] Email delivery works (test send_for_review)
- [ ] Engagement tracking works (viewedAt updates)
- [ ] Export functionality works
- [ ] Error handling returns clear messages

**ChatGPT Integration Test:**

1. Open ChatGPT settings → Connectors → Add MCP server
2. Enter URL: `https://thumbway.com/mcp`
3. Complete OAuth authorization
4. Test prompts:
   - "Send this proposal to test@example.com for approval"
   - "Check the status of my proposal"
   - "Show me my pending reviews"
   - "Remind test@example.com about my review"
5. Verify:
   - Tools are called correctly
   - Widgets render properly
   - Emails are sent
   - Status updates work

---

## Submission Form Answers

### App Info

**App Name:** Thumbway

**Subtitle (30 chars max):**
```
Get content approved fast
```

**Description:**
```
[Use VERSION 1 from APP_DESCRIPTION_SHORT.md - 75 words]
```

**Category:** Productivity

---

### MCP Server

**MCP Server URL:** `https://thumbway.com/mcp`

**Requires Authentication:** Yes (OAuth 2.0)

---

### Demo Account

```
Email: demo@thumbway.com
Password: [Secure password]
```

---

### Tool Annotations

*(See Section 2 above for copy-paste annotations)*

---

### Screenshots

Upload these (see SCREENSHOTS_SUBMISSION.md for details):
1. Review Status Widget (approval progress)
2. Reviews Dashboard (list of reviews)
3. Send for Review confirmation
4. Nudge Preview Widget
5. Export Widget

---

## Important Reminders

1. **OAuth must work** - Test full auth cycle before submission
2. **Demo account must be pre-populated** - Reviewers need data to test
3. **All 10 tools must be functional** - No disabled tools
4. **Widgets must render** - Test in actual ChatGPT
5. **Emails must send** - Test with real email addresses

---

## Post-Submission

- [ ] Monitor email for review status updates
- [ ] Check dashboard daily for status changes
- [ ] Prepare for questions (reviewers may ask for clarification)
- [ ] Have support team ready for user inquiries post-launch

---

**Last Updated:** 2025-12-23
**Ready for Submission:** ~70% (see blockers in COMPLIANCE_ANALYSIS.md)
