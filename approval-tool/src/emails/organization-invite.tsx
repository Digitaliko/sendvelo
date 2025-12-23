import { Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, PrimaryButton } from "./components/base-layout";

interface OrganizationInviteEmailProps {
  inviterName: string;
  organizationName: string;
  inviteLink: string;
  role: string;
}

export function OrganizationInviteEmail({
  inviterName,
  organizationName,
  inviteLink,
  role,
}: OrganizationInviteEmailProps) {
  return (
    <BaseLayout headerTitle="Organization Invitation">
      <Text style={paragraph}>Hello,</Text>
      <Text style={paragraph}>
        <strong>{inviterName}</strong> has invited you to join{" "}
        <strong>{organizationName}</strong> as a{" "}
        <strong>{role.toLowerCase()}</strong>.
      </Text>
      <Text style={paragraph}>
        Click the button below to accept the invitation:
      </Text>
      <PrimaryButton href={inviteLink}>Accept Invitation</PrimaryButton>
      <Text style={urlText}>
        Or copy and paste this URL into your browser:
        <br />
        {inviteLink}
      </Text>
      <Text style={expiryText}>This invitation will expire in 7 days.</Text>
    </BaseLayout>
  );
}

const paragraph: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "16px",
};

const urlText: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "13px",
  color: "#6b7280",
  wordBreak: "break-all" as const,
};

const expiryText: React.CSSProperties = {
  marginTop: "24px",
  color: "#6b7280",
  fontSize: "14px",
};

export default OrganizationInviteEmail;
