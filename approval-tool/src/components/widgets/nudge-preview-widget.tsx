"use client";

import { useState } from "react";
import { Send, Edit3, X, Clock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWidgetProps, useOpenAiActions, useWidgetState } from "./hooks";
import { cn } from "@/lib/utils";

interface ReviewerStatus {
  email: string;
  viewedAt: string | null;
  status: string;
}

interface NudgePreviewData {
  reviewId: string;
  reviewTitle: string;
  tone: "friendly" | "professional" | "urgent";
  daysSinceCreated: number;
  recipients: string[];
  reviewerStatuses: ReviewerStatus[];
  suggestedSubject: string;
  suggestedMessage: string;
  isDraft: boolean;
}

interface WidgetState {
  [key: string]: unknown;
  isEditing: boolean;
  editedMessage: string;
}

function ToneBadge({ tone }: { tone: string }) {
  const configs: Record<string, { label: string; color: string; icon: string }> = {
    friendly: { label: "Friendly", color: "bg-blue-500/10 text-blue-600", icon: "😊" },
    professional: { label: "Professional", color: "bg-slate-500/10 text-slate-600", icon: "💼" },
    urgent: { label: "Urgent", color: "bg-red-500/10 text-red-600", icon: "⚡" },
  };
  const config = configs[tone] ?? { label: tone, color: "bg-muted", icon: "📝" };

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.color)}>
      {config.icon} {config.label}
    </span>
  );
}

function ReviewerStatusRow({ reviewer }: { reviewer: ReviewerStatus }) {
  const hasViewed = reviewer.viewedAt !== null;

  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="truncate max-w-[160px]">{reviewer.email}</span>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {hasViewed ? (
          <>
            <Eye className="w-3 h-3" />
            <span>Viewed</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3 h-3" />
            <span>Not viewed</span>
          </>
        )}
      </div>
    </div>
  );
}

export function NudgePreviewWidget() {
  const data = useWidgetProps<NudgePreviewData>();
  const { sendFollowUpMessage } = useOpenAiActions();
  const [state, setState] = useWidgetState<WidgetState>({
    isEditing: false,
    editedMessage: "",
  });
  const [isSending, setIsSending] = useState(false);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="h-4 w-40 bg-muted mx-auto mb-2 rounded" />
          <div className="h-3 w-56 bg-muted mx-auto rounded" />
        </div>
      </div>
    );
  }

  const currentMessage = state.isEditing ? state.editedMessage : data.suggestedMessage;

  const handleEdit = () => {
    setState({ isEditing: true, editedMessage: data.suggestedMessage });
  };

  const handleCancelEdit = () => {
    setState({ isEditing: false, editedMessage: "" });
  };

  const handleSendNow = async () => {
    setIsSending(true);
    try {
      const message = state.isEditing && state.editedMessage
        ? `Send this nudge for "${data.reviewTitle}" with custom message: "${state.editedMessage}"`
        : `Send the nudge now for "${data.reviewTitle}" with sendImmediately: true`;
      await sendFollowUpMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = async () => {
    await sendFollowUpMessage("Cancel the nudge, I'll follow up later.");
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">AI-Generated Nudge</CardTitle>
                <p className="text-xs text-muted-foreground">Preview before sending</p>
              </div>
            </div>
            <ToneBadge tone={data.tone} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Review</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{data.daysSinceCreated} day{data.daysSinceCreated !== 1 ? "s" : ""} waiting</span>
              </div>
            </div>
            <p className="font-medium text-sm">{data.reviewTitle}</p>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground mb-1 block">
              To ({data.recipients.length})
            </span>
            <div className="bg-muted/30 rounded-lg px-3 py-1 max-h-[80px] overflow-y-auto">
              {data.reviewerStatuses.map((reviewer, idx) => (
                <ReviewerStatusRow key={idx} reviewer={reviewer} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Message</span>
              {!state.isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleEdit}
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            {state.isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={state.editedMessage}
                  onChange={(e) => setState({ ...state, editedMessage: e.target.value })}
                  className="min-h-[100px] text-sm"
                  placeholder="Type your custom message..."
                />
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleCancelEdit}
                  >
                    Use AI suggestion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm italic">"{currentMessage}"</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSendNow}
              disabled={isSending}
            >
              <Send className="w-4 h-4 mr-1" />
              {isSending ? "Sending..." : "Send Now"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Recipients will receive an email with a direct link to respond
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
