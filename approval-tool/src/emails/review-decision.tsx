import { Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout, PrimaryButton, StatusBadge } from "./components/base-layout";

interface ReviewDecisionEmailProps {
  creatorName: string;
  title: string;
  decision: "approved" | "rejected" | "changes_requested";
  reviewerEmail?: string;
  comments?: string;
  reviewUrl: string;
}

export function ReviewDecisionEmail({
  creatorName,
  title,
  decision,
  reviewerEmail,
  comments,
  reviewUrl,
}: ReviewDecisionEmailProps) {
  const headerColors = {
    approved: "#10b981",
    rejected: "#ef4444",
    changes_requested: "#f59e0b",
  };

  return (
    <BaseLayout headerTitle="Review Decision" headerBgColor={headerColors[decision]}>
      <Text style={paragraph}>Hello {creatorName},</Text>
      <Text style={paragraph}>Your review request has been:</Text>
      <Section style={badgeContainer}>
        <StatusBadge status={decision} />
      </Section>
      <Text style={titleStyle}>{title}</Text>
      {reviewerEmail && (
        <Text style={subText}>Decision by: {reviewerEmail}</Text>
      )}
      {comments && (
        <Section style={commentBox}>
          <Text style={commentLabel}>Feedback</Text>
          <Text style={commentText}>{comments}</Text>
        </Section>
      )}
      <PrimaryButton href={reviewUrl}>View Review</PrimaryButton>
    </BaseLayout>
  );
}

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
};

const badgeContainer: React.CSSProperties = {
  margin: "16px 0",
};

const titleStyle: React.CSSProperties = {
  color: "#4F46E5",
  margin: "20px 0",
  fontSize: "24px",
  fontWeight: 600,
};

const subText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "8px 0",
};

const commentBox: React.CSSProperties = {
  backgroundColor: "white",
  padding: "16px",
  borderLeft: "4px solid #4F46E5",
  margin: "16px 0",
  borderRadius: "0 4px 4px 0",
};

const commentLabel: React.CSSProperties = {
  margin: "0 0 8px 0",
  color: "#6b7280",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  fontWeight: 600,
};

const commentText: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
};

export default ReviewDecisionEmail;
