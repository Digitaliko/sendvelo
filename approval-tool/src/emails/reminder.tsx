import { Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, PrimaryButton } from "./components/base-layout";

interface ReminderEmailProps {
  reviewerName?: string;
  creatorName: string;
  title: string;
  reviewUrl: string;
  customMessage?: string;
}

export function ReminderEmail({
  reviewerName,
  creatorName,
  title,
  reviewUrl,
  customMessage,
}: ReminderEmailProps) {
  return (
    <BaseLayout headerTitle="Reminder: Review Pending" headerBgColor="#f59e0b">
      <Text style={paragraph}>
        Hello{reviewerName ? ` ${reviewerName}` : ""},
      </Text>
      {customMessage ? (
        <Text style={customMessageStyle}>{customMessage}</Text>
      ) : (
        <Text style={paragraph}>
          This is a friendly reminder that <strong>{creatorName}</strong> is
          waiting for your review on:
        </Text>
      )}
      <Text style={titleStyle}>{title}</Text>
      <Text style={paragraph}>
        Please take a moment to review and provide your feedback:
      </Text>
      <PrimaryButton href={reviewUrl}>Review Now</PrimaryButton>
      <Text style={urlText}>
        Or copy and paste this URL into your browser:
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

const urlText: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "13px",
  color: "#6b7280",
  wordBreak: "break-all" as const,
};

const customMessageStyle: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
  fontStyle: "italic",
  color: "#374151",
  padding: "12px 16px",
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  borderLeft: "4px solid #4F46E5",
};

export default ReminderEmail;
