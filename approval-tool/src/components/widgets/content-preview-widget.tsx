"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Send, Edit3, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWidgetProps, useOpenAiActions } from "./hooks";
import { cn } from "@/lib/utils";

interface ContentPreviewData {
  title: string;
  content: string;
  contentPreview: string;
  wordCount: number;
  characterCount: number;
  format: "plain_text" | "markdown" | "html";
  reviewers: string[];
  workflowType: "parallel" | "sequential" | "any_one";
  remindAfter: string;
}

function WorkflowInfo({ type }: { type: string }) {
  const labels: Record<string, string> = {
    parallel: "All reviewers must approve",
    sequential: "Reviewers approve in order",
    any_one: "First approval completes review",
  };
  return <span className="text-xs text-muted-foreground">{labels[type] ?? type}</span>;
}

export function ContentPreviewWidget() {
  const data = useWidgetProps<ContentPreviewData>();
  const { sendFollowUpMessage } = useOpenAiActions();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="h-4 w-32 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-48 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    setIsSending(true);
    try {
      await sendFollowUpMessage("Yes, send it for review now.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEdit = async () => {
    await sendFollowUpMessage("Wait, I want to edit the content first.");
  };

  const displayContent = isExpanded ? data.content : data.contentPreview;
  const canExpand = data.content.length > data.contentPreview.length;

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Ready to Send?</CardTitle>
              <p className="text-xs text-muted-foreground">Preview what reviewers will see</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-1">{data.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{data.wordCount} words</span>
              <span>•</span>
              <span>{data.format.replace("_", " ")}</span>
            </div>
          </div>

          <div className="relative">
            <div className={cn(
              "bg-muted/30 rounded-lg p-3 text-sm",
              !isExpanded && "max-h-[120px] overflow-hidden"
            )}>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {data.format === "markdown" ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm">{displayContent}</pre>
                ) : (
                  <p className="whitespace-pre-wrap">{displayContent}</p>
                )}
              </div>
            </div>
            {canExpand && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted/50 to-transparent rounded-b-lg" />
            )}
          </div>

          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show more
                </>
              )}
            </Button>
          )}

          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {data.reviewers.length} reviewer{data.reviewers.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.reviewers.map((email, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-background px-2 py-0.5 rounded-full"
                >
                  {email}
                </span>
              ))}
            </div>
            <WorkflowInfo type={data.workflowType} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSend}
              disabled={isSending}
            >
              <Send className="w-4 h-4 mr-1" />
              {isSending ? "Sending..." : "Looks Good - Send"}
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit First
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
