"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

interface EmailInviteSectionProps {
  reviewId: string;
  onInviteSent: () => void;
}

export function EmailInviteSection({
  reviewId,
  onInviteSent,
}: EmailInviteSectionProps) {
  const t = useTranslations("share.emailInvite");
  const { addToast } = useToast();
  const [emailInput, setEmailInput] = useState("");

  const addReviewersMutation = api.review.addReviewers.useMutation({
    onSuccess: (data) => {
      setEmailInput("");
      onInviteSent();
      if (data.added > 0) {
        addToast(
          "success",
          t("success"),
          t("successCount", { count: data.added })
        );
      } else {
        addToast("info", t("noNew"), data.message ?? t("allInvited"));
      }
    },
    onError: (error) => {
      addToast("error", t("failed"), error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emails = emailInput
      .split(/[,;\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));

    if (emails.length === 0) {
      addToast("error", t("invalidEmail"), t("invalidEmailDesc"));
      return;
    }

    addReviewersMutation.mutate({ reviewId, emails });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Mail className="w-4 h-4" />
        {t("title")}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder={t("placeholder")}
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="flex-1"
          disabled={addReviewersMutation.isPending}
        />
        <Button
          type="submit"
          disabled={!emailInput.trim() || addReviewersMutation.isPending}
          className="shrink-0"
        >
          <Send className="w-4 h-4 mr-2" />
          {addReviewersMutation.isPending ? t("sending") : t("invite")}
        </Button>
      </form>

      <p className="text-xs text-gray-500">
        {t("description")}
      </p>
    </div>
  );
}
