"use client";

import { api } from "@/trpc/react";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
} from "@/components/ui/credenza";
import { CopyLinkSection } from "./copy-link-section";
import { EmailInviteSection } from "./email-invite-section";
import { AccessManagementSection } from "./access-management-section";
import { useTranslations } from "next-intl";

interface ShareModalProps {
  reviewId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ reviewId, open, onOpenChange }: ShareModalProps) {
  const t = useTranslations("share");
  const { data: shareDetails, refetch, isLoading } = api.review.getShareDetails.useQuery(
    { reviewId },
    { enabled: open }
  );

  if (!open) return null;

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="sm:max-w-lg">
        <CredenzaHeader>
          <CredenzaTitle>
            {isLoading ? t("loading") : t("title", { title: shareDetails?.title ?? "" })}
          </CredenzaTitle>
          <CredenzaDescription>
            {t("description")}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-6">
          {shareDetails && (
            <>
              <CopyLinkSection
                reviewId={reviewId}
                slug={shareDetails.slug}
                publicAccessLevel={shareDetails.publicAccessLevel}
                onAccessLevelChange={refetch}
              />
              <div className="border-t border-gray-200" />
              <EmailInviteSection
                reviewId={reviewId}
                onInviteSent={refetch}
              />
              <div className="border-t border-gray-200" />
              <AccessManagementSection
                reviewId={reviewId}
                reviewers={shareDetails.reviewers}
                creatorEmail={shareDetails.creator.email}
                onChanged={refetch}
              />
            </>
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
