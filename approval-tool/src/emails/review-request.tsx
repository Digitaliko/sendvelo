import { Text, Link, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout, PrimaryButton } from "./components/base-layout";

interface ReviewRequestEmailProps {
  reviewerName?: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
  approveUrl?: string;
  rejectUrl?: string;
}

export function ReviewRequestEmail({
  reviewerName,
  creatorName,
  title,
  reviewUrl,
  approveUrl,
  rejectUrl,
}: ReviewRequestEmailProps) {
  const hasOneClickLinks = approveUrl && rejectUrl;

  return (
    <BaseLayout headerTitle="Review Request">
      <Text style={paragraph}>
        Hello{reviewerName ? ` ${reviewerName}` : ""},
      </Text>
      <Text style={paragraph}>
        <strong>{creatorName}</strong> has requested your review for:
      </Text>
      <Text style={titleStyle}>{title}</Text>

      {hasOneClickLinks ? (
        <>
          <Section style={buttonContainer}>
            <Link href={approveUrl} style={approveButton}>
              Approve
            </Link>
            <Link href={rejectUrl} style={rejectButton}>
              Reject
            </Link>
          </Section>
          <Text style={helperText}>
            Or{" "}
            <Link href={reviewUrl} style={linkStyle}>
              view the full review
            </Link>{" "}
            to add comments or request changes
          </Text>
        </>
      ) : (
        <>
          <Text style={paragraph}>
            Click the button below to review and provide your feedback:
          </Text>
          <PrimaryButton href={reviewUrl}>Review Now</PrimaryButton>
        </>
      )}

      <Text style={urlText}>
        Copy and paste this URL into your browser:
        <br />
        {reviewUrl}
      </Text>
    </BaseLayout>
  );
}

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
};

const titleStyle: React.CSSProperties = {
  color: "#4F46E5",
  margin: "20px 0",
  fontSize: "24px",
  fontWeight: 600,
};

const buttonContainer: React.CSSProperties = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const approveButton: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 32px",
  backgroundColor: "#22c55e",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "16px",
  marginRight: "12px",
};

const rejectButton: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 32px",
  backgroundColor: "#ef4444",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "16px",
};

const helperText: React.CSSProperties = {
  color: "#6a6a6a",
  fontSize: "14px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const linkStyle: React.CSSProperties = {
  color: "#3b82f6",
};

const urlText: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "13px",
  color: "#6b7280",
  wordBreak: "break-all" as const,
};

export default ReviewRequestEmail;
