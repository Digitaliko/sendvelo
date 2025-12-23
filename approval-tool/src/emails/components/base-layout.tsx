import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  headerBgColor?: string;
}

export function BaseLayout({
  children,
  headerTitle,
  headerBgColor = "#4F46E5",
}: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...header, backgroundColor: headerBgColor }}>
            <Text style={headerText}>{headerTitle}</Text>
          </Section>
          <Section style={content}>{children}</Section>
          <Section style={footer}>
            <Text style={footerText}>Powered by Thumbway</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function PrimaryButton({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Link href={href} style={{ ...button, ...style }}>
      {children}
    </Link>
  );
}

export function StatusBadge({
  status,
}: {
  status: "approved" | "rejected" | "changes_requested";
}) {
  const statusConfig = {
    approved: { bg: "#10b981", text: "Approved" },
    rejected: { bg: "#ef4444", text: "Rejected" },
    changes_requested: { bg: "#f59e0b", text: "Changes Requested" },
  };

  const config = statusConfig[status];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "4px",
        fontWeight: 600,
        fontSize: "14px",
        backgroundColor: config.bg,
        color: "white",
      }}
    >
      {config.text}
    </span>
  );
}

const main: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  lineHeight: "1.6",
  color: "#333",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const header: React.CSSProperties = {
  padding: "24px",
  borderRadius: "8px 8px 0 0",
};

const headerText: React.CSSProperties = {
  margin: 0,
  fontSize: "20px",
  fontWeight: 600,
  color: "white",
};

const content: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "32px",
  borderRadius: "0 0 8px 8px",
};

const footer: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
  margin: 0,
};

const button: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#4F46E5",
  color: "white",
  padding: "14px 28px",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: 500,
  margin: "24px 0",
};
