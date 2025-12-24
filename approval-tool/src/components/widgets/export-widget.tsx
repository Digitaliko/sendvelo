"use client";

import { useState } from "react";
import { Copy, Check, FileText, Download, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWidgetProps, useOpenAiActions } from "./hooks";
import { cn } from "@/lib/utils";

interface ApproverInfo {
  name: string;
  email: string;
  approvedAt: string;
}

interface ExportData {
  reviewId: string;
  title: string;
  content: string;
  format: "plain_text" | "markdown" | "html";
  status: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  approvedAt: string | null;
  approvers: ApproverInfo[];
  shareLink: string;
  version: number;
}

type ExportFormat = "clipboard" | "markdown" | "email";

function ApprovalBadge({ status, approvers, approvedAt }: {
  status: string;
  approvers: ApproverInfo[];
  approvedAt: string | null;
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (status !== "APPROVED") {
    return (
      <div className="text-sm text-muted-foreground">
        Status: {status.toLowerCase().replace("_", " ")}
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium text-green-600">Approved</span>
      </div>
      {approvers.length > 0 && (
        <div className="text-xs text-muted-foreground">
          By: {approvers.map(a => a.name || a.email.split("@")[0]).join(", ")}
        </div>
      )}
      {approvedAt && (
        <div className="text-xs text-muted-foreground">
          {formatDate(approvedAt)}
        </div>
      )}
    </div>
  );
}

export function ExportWidget() {
  const data = useWidgetProps<ExportData>();
  const { openExternal } = useOpenAiActions();
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Download className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="h-4 w-32 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-48 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const generateExportContent = (format: ExportFormat): string => {
    const approvalInfo = data.status === "APPROVED" && data.approvers.length > 0
      ? `\n\n---\nApproved by: ${data.approvers.map(a => a.name || a.email).join(", ")}\nDate: ${data.approvedAt ? new Date(data.approvedAt).toLocaleDateString() : "N/A"}\nVersion: ${data.version}`
      : "";

    switch (format) {
      case "markdown":
        return `# ${data.title}\n\n${data.content}${approvalInfo}`;
      case "email":
        return `Subject: ${data.title}\n\n${data.content}${approvalInfo}\n\nView original: ${data.shareLink}`;
      case "clipboard":
      default:
        return `${data.title}\n\n${data.content}${approvalInfo}`;
    }
  };

  const handleExport = async (format: ExportFormat) => {
    const content = generateExportContent(format);
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  };

  const handleOpenInBrowser = () => {
    openExternal(data.shareLink);
  };

  const exportOptions = [
    {
      id: "clipboard" as ExportFormat,
      label: "Copy to Clipboard",
      description: "Plain text, ready to paste",
      icon: Copy
    },
    {
      id: "markdown" as ExportFormat,
      label: "Copy as Markdown",
      description: "For Notion, GitHub, etc.",
      icon: FileText
    },
    {
      id: "email" as ExportFormat,
      label: "Copy for Email",
      description: "With subject line & link",
      icon: Mail
    },
  ];

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Export Content</CardTitle>
              <p className="text-xs text-muted-foreground">Get your approved content out</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">{data.title}</h3>
            <p className="text-xs text-muted-foreground">
              Version {data.version} • {data.content.split(/\s+/).length} words
            </p>
          </div>

          <ApprovalBadge
            status={data.status}
            approvers={data.approvers}
            approvedAt={data.approvedAt}
          />

          <div className="space-y-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isCopied = copiedFormat === option.id;

              return (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleExport(option.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isCopied ? "bg-green-500/10" : "bg-muted"
                    )}>
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {isCopied ? "Copied!" : option.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleOpenInBrowser}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Browser
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
