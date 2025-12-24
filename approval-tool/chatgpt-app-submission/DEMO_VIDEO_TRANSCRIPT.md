# Thumbway - App Store Demo Video
## For OpenAI ChatGPT Apps Directory Submission

**Duration**: 2-3 minutes
**Audience**: OpenAI reviewers + potential users
**Goal**: Showcase approval workflow capabilities
**Tone**: Professional, focused, demonstrates core value

---

## INTRODUCTION (0:00 - 0:15)

> **[Screen: ChatGPT with a fresh conversation]**

**Narrator**:
"Thumbway brings approval workflows to ChatGPT. Stop the endless email chains - send content for review, track who's seen it, and get sign-off without leaving your conversation. Let me show you how it works."

---

## PROBLEM DEMONSTRATION (0:15 - 0:30)

> **[Screen: Shows typing a request in ChatGPT]**

**Narrator**:
"I've just written a proposal for my client. Normally, I'd copy this into an email, send it, then wait... wondering if they even opened it. Let's do this better."

> **[Types]**

```
Send this proposal to sarah@client.com for approval:

"We propose redesigning your website homepage with a modern layout, improved navigation, and mobile-first design. Budget: $5,000. Timeline: 4 weeks. This includes user research, wireframes, and two rounds of revisions."
```

> **[Hits Enter]**

---

## SEND FOR REVIEW (0:30 - 1:00)

> **[Screen: Review Created Widget appears]**

**Narrator**:
"And there it is. Thumbway created a review, sent an email to Sarah, and gave me a share link. Let's look at what just happened."

> **[Points to widget elements]**

**Narrator**:
"The widget shows:
- My proposal content
- Who I sent it to
- A shareable link
- Quick actions for what I might want to do next

Sarah received an email with a direct link to view and approve. No account needed - she just clicks and decides."

---

## CHECK STATUS (1:00 - 1:30)

> **[Screen: Types new message]**

**Narrator**:
"A few hours later, I want to check if Sarah has seen my proposal."

> **[Types]**

```
Check the status of my website proposal
```

> **[Review Status Widget appears]**

**Narrator**:
"This is where it gets interesting. I can see:
- Sarah viewed my proposal at 2:30 PM
- She spent 3 minutes and 42 seconds reviewing it
- Status is still pending - she hasn't decided yet

That engagement data tells me she's considering it. No more wondering 'did they even open my email?'"

---

## GENERATE NUDGE (1:30 - 2:00)

> **[Screen: Types new message]**

**Narrator**:
"It's been a couple days. I want to follow up, but I don't want to be pushy. Let's get some help."

> **[Types]**

```
Send a friendly reminder to Sarah about my proposal
```

> **[Nudge Preview Widget appears]**

**Narrator**:
"Thumbway generates an AI-crafted message based on context:
- How long it's been waiting
- Whether Sarah has viewed it
- The tone I asked for

I can edit this, change the tone to professional or urgent, or send it as-is. Let me send this friendly version."

> **[Clicks Send]**

**Narrator**:
"Done. Sarah gets a gentle nudge, and I didn't have to write 'just checking in' for the hundredth time."

---

## DASHBOARD VIEW (2:00 - 2:20)

> **[Screen: Types new message]**

**Narrator**:
"I can also see all my reviews at once."

> **[Types]**

```
Show me all my pending reviews
```

> **[Reviews Dashboard Widget appears]**

**Narrator**:
"My dashboard shows everything:
- Pending reviews awaiting decisions
- Approved items ready to ship
- Who's viewed what, who's ghosting me

One place to see my entire approval workflow."

---

## EXPORT APPROVED (2:20 - 2:40)

> **[Screen: Shows approved review]**

**Narrator**:
"When something gets approved, I can export it with proof."

> **[Types]**

```
Get the share details for my approved marketing copy
```

> **[Export Widget appears]**

**Narrator**:
"The export includes:
- The approved content
- Who approved it and when
- A shareable link with proof of sign-off

Copy as plain text, markdown, or formatted for email. Perfect for documentation or showing stakeholders that yes, the client actually approved this."

---

## WRAP UP (2:40 - 3:00)

> **[Screen: Returns to clean chat view]**

**Narrator**:
"Thumbway: send content for approval, track engagement, nudge non-responders, and export with proof of sign-off. All without leaving ChatGPT.

No more email chains. No more 'did you see my message?' No more lost approvals.

The missing piece between creating content and shipping it.

Try it now in the ChatGPT Apps Directory."

> **[Screen: Fades to title card]**

**[Title Card]**:
```
Thumbway

Send • Track • Approve

Available in ChatGPT Apps Directory
```

---

## PRODUCTION NOTES

### Critical Requirements for OpenAI Submission

**Must Show**:
1. `send_for_review` tool working
2. `check_approval_status` with engagement data
3. `generate_nudge` with AI message
4. `list_pending_reviews` dashboard
5. `get_share_details` export functionality
6. OAuth authentication (happens at start)
7. Interactive widgets
8. Natural language interaction

**Must NOT Show**:
- Any errors or loading failures
- Incomplete features
- Pricing or subscription upsells

### Screen Captures Needed

1. **OAuth login** (brief, shows authentication)
2. **Send for review** prompt and widget
3. **Review status widget** with engagement data
4. **Nudge preview widget** with AI message
5. **Dashboard widget** with multiple reviews
6. **Export widget** with approved content

### Pacing & Timing

**0:00-0:15**: Introduction + value prop
**0:15-0:30**: Problem + send for review prompt
**0:30-1:00**: Review created widget (core feature)
**1:00-1:30**: Check status with engagement data
**1:30-2:00**: Generate nudge (AI feature)
**2:00-2:20**: Dashboard overview
**2:20-2:40**: Export approved content
**2:40-3:00**: Wrap up + CTA

**Total**: 3:00 (within 2-5 minute target)

### Audio & Tone

- **Professional but approachable**
- **Emphasize value over features**:
  - "Track who's seen it" not "engagement analytics"
  - "Get sign-off" not "approval workflow management"
- **Use active voice**: "You send", "You see", "You export"
- **Pace**: Moderate (not rushed)
- **Energy**: Confident and clear

### Key Messaging to Emphasize

**Primary Value Prop**:
> "Send content for approval without leaving ChatGPT"

**Core Pain Point**:
> "No more 'did you see my email?' follow-ups"

**Solution**:
> "Track engagement, nudge non-responders, prove sign-off"

**Unique Position**:
> "The only approval workflow app in ChatGPT"

---

## Alternative 90-Second Version (Ultra-Concise)

If reviewers prefer shorter demos:

**0:00-0:15**: Intro + send for review → widget appears
**0:15-0:40**: Check status → show engagement data
**0:40-1:00**: Nudge → show AI message → send
**1:00-1:15**: Dashboard + export
**1:15-1:30**: "Approval workflows for ChatGPT. Try it now."

---

## Testing Checklist Before Recording

- [ ] OAuth flow works smoothly
- [ ] Send for review creates review and shows widget
- [ ] Check status shows engagement data
- [ ] Generate nudge creates appropriate message
- [ ] Dashboard shows multiple reviews
- [ ] Export widget shows approved content
- [ ] All widgets render quickly (no long loading)
- [ ] No errors or console warnings visible

---

## Common Mistakes to Avoid

**Don't**:
- Show pricing or subscription prompts
- Mention competitors by name
- Use technical jargon (MCP, OAuth, etc.)
- Rush through the widgets (let them breathe)
- Skip showing engagement data (key differentiator)

**Do**:
- Focus on the pain point (email chaos)
- Show real workflows (send, check, nudge, export)
- Emphasize engagement tracking
- Pause on key moments (widget appearing, engagement data)
- Use natural language prompts

---

## Post-Production Checklist

- [ ] Audio is clear and balanced
- [ ] Screen recordings are high resolution (1080p minimum)
- [ ] Cursor movements are smooth
- [ ] No distracting background noise
- [ ] Widgets are clearly visible
- [ ] Brand logo appears at end
- [ ] Total length: 2:00 - 3:30 minutes
- [ ] Export in MP4 format
- [ ] File size under 50MB

---

## Upload & Submission Notes

**Where to Host**:
1. **Option 1**: Upload to thumbway.com/chatgpt/demo.mp4 (recommended)
2. **Option 2**: YouTube (unlisted)
3. **Option 3**: Vimeo (private/unlisted)

**Submission Form Field**:
```
Demo Recording URL: https://thumbway.com/chatgpt/demo
```

---

## Success Criteria

This demo video succeeds if reviewers can clearly understand:

1. **What problem it solves**: Approval chaos, email chains
2. **What it does**: Send for review, track engagement, nudge, export
3. **How it works**: Natural language → approval workflow
4. **Who it's for**: Freelancers, small teams, anyone needing approvals
5. **Key differentiator**: Engagement tracking (who viewed, when, how long)
6. **What makes it unique**: Only approval app in ChatGPT

---

**Version**: 1.0
**Created**: 2025-12-23
**For**: OpenAI ChatGPT Apps Directory Submission
**Status**: Ready for Production
