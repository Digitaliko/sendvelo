# Tool Justifications for OpenAI Apps Submission
## Thumbway - Annotation Explanations

---

## Tool: `send_for_review`

### Read Only: NO

**Justification:**

This tool is NOT read-only because it **modifies external state**:

1. **Creates database records** - New review and reviewer entries
2. **Sends emails** - Transactional emails to reviewers via Postmark
3. **Increments usage counters** - Updates user's monthly review count

The tool does:
- Create new review records in the database
- Create reviewer records with access tokens
- Send email notifications to all reviewers
- Log activity for audit trail

---

### Open World: YES

**Justification:**

This tool **interacts with the external world**:

1. **Sends emails to user-provided addresses** - Emails go to arbitrary external recipients
2. **Creates publicly accessible content** - Reviews can be viewed via public links
3. **Notifies external parties** - Reviewers outside the ChatGPT session receive notifications

The tool interacts with:
- Postmark email service (sends to external recipients)
- External email inboxes (recipients view content)
- Public web (review pages accessible via links)

---

### Destructive: NO

**Justification:**

This tool is **non-destructive** because:

1. **Creates new content only** - Does not modify or delete existing data
2. **Additive operation** - Adds reviews, doesn't remove anything
3. **No data loss risk** - Cannot overwrite or destroy existing reviews
4. **Reversible via cancel** - Reviews can be cancelled if needed

---

## Tool: `check_approval_status`

### Read Only: YES

**Justification:**

This tool is read-only because it **only retrieves data**:

1. **Queries database** - Fetches review status, no modifications
2. **Returns view only** - Displays data in widget, no side effects
3. **No external calls** - Does not send emails or notifications

The tool does not:
- Modify review status
- Send notifications
- Update any records
- Interact with external systems

---

### Open World: NO

**Justification:**

This tool operates in a **closed environment**:

1. **Internal database only** - Queries own PostgreSQL database
2. **No external API calls** - Does not fetch from external services
3. **No user-provided URLs** - Does not access arbitrary endpoints
4. **Sandboxed data** - Only accesses user's own reviews

---

### Destructive: NO

**Justification:**

This tool is **non-destructive** because:

1. **Read-only operation** - Cannot modify or delete data
2. **Query only** - SELECT operations, no UPDATE/DELETE
3. **No side effects** - Viewing status changes nothing

---

## Tool: `list_pending_reviews`

### Read Only: YES

**Justification:**

This tool is read-only because it **only retrieves lists**:

1. **Fetches review list** - Query operation only
2. **No modifications** - Does not change review states
3. **Display only** - Returns data for widget rendering

---

### Open World: NO

**Justification:**

- Internal database queries only
- No external service calls
- No user-provided URLs accessed

---

### Destructive: NO

**Justification:**

- Query operation only
- Cannot modify or delete reviews
- No side effects

---

## Tool: `update_review_version`

### Read Only: NO

**Justification:**

This tool **modifies data**:

1. **Creates new version** - Adds version record to database
2. **Updates review** - Modifies review metadata
3. **Resets reviewer status** - Pending reviewers need to re-review

---

### Open World: YES

**Justification:**

1. **Sends notifications** - Emails reviewers about the update
2. **External recipients** - Notifies people outside ChatGPT session

---

### Destructive: NO

**Justification:**

1. **Preserves history** - Old versions are kept, not deleted
2. **Additive** - Creates new version, doesn't destroy old
3. **Reversible** - Can create another version if needed

---

## Tool: `manage_reviewers`

### Read Only: NO

**Justification:**

This tool **modifies reviewer list**:

1. **Add action** - Creates new reviewer records
2. **Remove action** - Deletes reviewer records (pending only)
3. **Remind action** - Sends reminder emails

---

### Open World: YES

**Justification:**

1. **Sends emails** - Add/remind actions send emails to external recipients
2. **External notification** - Reviewers outside ChatGPT receive emails

---

### Destructive: NO

**Justification:**

1. **Remove is limited** - Can only remove PENDING reviewers
2. **Cannot remove decided** - Reviewers who responded are protected
3. **Add is reversible** - Can remove added reviewers

---

## Tool: `generate_nudge`

### Read Only: NO

**Justification:**

This tool **can send emails**:

1. **Draft mode** - Returns preview (read-only behavior)
2. **Send mode** - `sendImmediately: true` sends actual emails
3. **Logs activity** - Creates activity log entries

---

### Open World: YES

**Justification:**

1. **Sends emails** - When `sendImmediately: true`, emails go to external recipients
2. **AI-generated content** - Nudge message is sent externally

---

### Destructive: NO

**Justification:**

1. **Additive** - Sends reminders, doesn't delete data
2. **No data modification** - Reviewer status unchanged
3. **Reversible** - Sending a reminder has no permanent negative effect

---

## Tool: `get_share_details`

### Read Only: YES

**Justification:**

This tool **only retrieves sharing information**:

1. **Fetches share settings** - Query operation
2. **Returns export data** - Content for export widget
3. **No modifications** - Does not change sharing settings

---

### Open World: NO

**Justification:**

- Internal database query only
- No external API calls
- Returns URLs but does not fetch from them

---

### Destructive: NO

**Justification:**

- Query operation only
- Cannot modify sharing settings
- No side effects

---

## Tool: `update_public_access`

### Read Only: NO

**Justification:**

This tool **modifies sharing settings**:

1. **Updates access level** - Changes publicAccessLevel field
2. **Affects who can view** - Modifies access permissions

---

### Open World: NO

**Justification:**

1. **Internal operation** - Updates database record only
2. **No external notifications** - Does not email anyone
3. **No external API calls** - Database update only

---

### Destructive: NO

**Justification:**

1. **Reversible** - Can change access level back
2. **No data loss** - Review content unchanged
3. **Setting change** - Just permission modification

---

## Tool: `status_summary`

### Read Only: YES

**Justification:**

This tool **only generates summaries**:

1. **Queries database** - Fetches review data
2. **Generates text** - Creates natural language summary
3. **No modifications** - Does not change any data

---

### Open World: NO

**Justification:**

- Internal database query only
- Summary generation is server-side
- No external service calls

---

### Destructive: NO

**Justification:**

- Query and format operation only
- Cannot modify review data
- No side effects

---

## Tool: `cancel_review`

### Read Only: NO

**Justification:**

This tool **modifies review state**:

1. **Updates status** - Changes review status to CANCELLED
2. **Stops workflow** - Pending reviewers no longer expected to respond

---

### Open World: NO

**Justification:**

1. **Internal operation** - Database update only
2. **No notifications** - Does not email reviewers about cancellation
3. **Database change** - Status field modification only

---

### Destructive: YES

**Justification:**

This tool is **destructive** because:

1. **Significant action** - Cancelling a review is a major workflow change
2. **Cannot be undone** - Cancelled reviews cannot be un-cancelled
3. **Stops all pending** - All pending reviewers are effectively dismissed
4. **Permanent state change** - Review moves to terminal state

**Mitigation**:
- Confirmation may be required in UI
- Action is logged for audit trail
- Review content is preserved (not deleted)

---

## Summary Table

| Tool | Read Only | Open World | Destructive | Risk Level |
|------|-----------|------------|-------------|------------|
| `send_for_review` | NO | YES | NO | Medium |
| `check_approval_status` | YES | NO | NO | Low |
| `list_pending_reviews` | YES | NO | NO | Low |
| `update_review_version` | NO | YES | NO | Medium |
| `manage_reviewers` | NO | YES | NO | Medium |
| `generate_nudge` | NO | YES | NO | Medium |
| `get_share_details` | YES | NO | NO | Low |
| `update_public_access` | NO | NO | NO | Low |
| `status_summary` | YES | NO | NO | Low |
| `cancel_review` | NO | NO | YES | Medium |

---

## Short Justifications (200 char limit for submission form)

### `send_for_review`

**Read Only: No**
```
Creates review records and sends email notifications to reviewers. Modifies database state and triggers external email delivery via Postmark. Not a query operation.
```

**Open World: Yes**
```
Sends emails to user-provided email addresses (external recipients). Creates publicly accessible review pages. Interacts with external email systems.
```

**Destructive: No**
```
Creates new reviews only, does not modify or delete existing data. Additive operation that can be cancelled later if needed. No data loss possible.
```

---

### `check_approval_status`

**Read Only: Yes**
```
Queries database for review status and engagement data. Returns information for display only. No modifications to reviews, no emails sent, no side effects.
```

**Open World: No**
```
Internal database query only. Does not access external services, user-provided URLs, or send any external communications. Fully sandboxed operation.
```

**Destructive: No**
```
Query operation only. Cannot modify, delete, or affect review data in any way. Viewing status has no side effects on the review workflow.
```

---

### `cancel_review`

**Read Only: No**
```
Updates review status to CANCELLED. Modifies database record. Stops the approval workflow for all pending reviewers.
```

**Open World: No**
```
Internal database update only. Does not send notifications to reviewers about cancellation. No external service calls.
```

**Destructive: Yes**
```
Cancelling a review is a significant, irreversible action. The review moves to a terminal state and pending reviewers are dismissed. Cannot be undone.
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-23
**For**: Thumbway ChatGPT Apps Submission
