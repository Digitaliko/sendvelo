"use client";

import { useState } from "react";
import { Copy, Check, Link, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/toast";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { env } from "@/env";
import { useTranslations } from "next-intl";
import type { PublicAccessLevel } from "@/lib/schemas";

const ACCESS_LEVEL_KEYS: PublicAccessLevel[] = ["NONE", "VIEW_ONLY", "VIEW_COMMENT", "FULL_ACCESS"];

interface CopyLinkSectionProps {
  reviewId: string;
  slug: string;
  publicAccessLevel: PublicAccessLevel;
  onAccessLevelChange: () => void;
}

export function CopyLinkSection({
  reviewId,
  slug,
  publicAccessLevel,
  onAccessLevelChange,
}: CopyLinkSectionProps) {
  const t = useTranslations("share.copyLink");
  const { addToast } = useToast();
  const { copied, copy } = useCopyToClipboard();
  const [accessLevel, setAccessLevel] = useState<PublicAccessLevel>(publicAccessLevel);

  const reviewUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${slug}`;

  const updateAccessMutation = api.review.updatePublicAccess.useMutation({
    onSuccess: () => {
      onAccessLevelChange();
      addToast("success", t("accessUpdated"));
    },
    onError: (error) => {
      setAccessLevel(publicAccessLevel);
      addToast("error", t("updateFailed"), error.message);
    },
  });

  const handleAccessLevelChange = (value: PublicAccessLevel) => {
    setAccessLevel(value);
    updateAccessMutation.mutate({ reviewId, accessLevel: value });
  };

  const handleCopy = async () => {
    const success = await copy(reviewUrl);
    if (success) {
      addToast("success", t("copied"));
    } else {
      addToast("error", t("copyFailed"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Link className="w-4 h-4" />
        {t("title")}
      </div>

      <div className="flex gap-2">
        <Input
          value={reviewUrl}
          readOnly
          className="flex-1 bg-gray-50 text-sm"
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="w-4 h-4" />
          {t("anyoneWithLink")}
        </Label>
        <Select value={accessLevel} onValueChange={handleAccessLevelChange}>
          <SelectTrigger className="w-full" disabled={updateAccessMutation.isPending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCESS_LEVEL_KEYS.map((level) => (
              <SelectItem key={level} value={level}>
                <div className="flex flex-col">
                  <span>{t(`accessLevels.${level}`)}</span>
                  <span className="text-xs text-gray-500">{t(`accessLevels.${level}_desc`)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
