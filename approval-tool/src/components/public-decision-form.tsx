"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

interface PublicDecisionFormProps {
  slug: string;
  isMobile?: boolean;
  labels: {
    approve: string;
    reject: string;
    requestChanges: string;
    commentsLabel: string;
    commentsPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    submitting: string;
  };
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function PublicDecisionForm({ slug, isMobile = false, labels }: PublicDecisionFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (turnstileRef.current && window.turnstile) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          "error-callback": () => {
            setTurnstileToken(undefined);
          },
          theme: "auto",
          size: isMobile ? "compact" : "normal",
        });
      }
    };

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      document.body.removeChild(script);
    };
  }, [isMobile]);

  const mutation = api.review.submitPublicDecision.useMutation({
    onSuccess: () => {
      addToast("success", "Decision submitted successfully");
      router.refresh();
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
    onError: (error) => {
      addToast("error", error.message || "Failed to submit decision");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  });

  const handleSubmit = (decision: "approved" | "rejected" | "changes_requested") => {
    mutation.mutate({
      slug,
      decision,
      comments: comments || undefined,
      email: email || undefined,
      name: name || undefined,
      honeypot: honeypot || undefined,
      turnstileToken,
    });
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 safe-area-inset-bottom">
        <div className="space-y-3">
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailPlaceholder}
            disabled={mutation.isPending}
          />
          {env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div ref={turnstileRef} className="flex justify-center" />
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={() => handleSubmit("rejected")}
              disabled={mutation.isPending}
              className="flex-1 py-4 rounded-xl text-lg active:scale-95 transition-transform touch-manipulation"
            >
              {mutation.isPending ? labels.submitting : labels.reject}
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => handleSubmit("approved")}
              disabled={mutation.isPending}
              className="flex-1 py-4 rounded-xl text-lg bg-green-600 hover:bg-green-700 active:scale-95 transition-transform touch-manipulation"
            >
              {mutation.isPending ? labels.submitting : labels.approve}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="public-email">{labels.emailLabel}</Label>
            <Input
              id="public-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.emailPlaceholder}
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="public-name">{labels.nameLabel}</Label>
            <Input
              id="public-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="public-comments">{labels.commentsLabel}</Label>
          <Textarea
            id="public-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            placeholder={labels.commentsPlaceholder}
            disabled={mutation.isPending}
          />
        </div>

        {env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div ref={turnstileRef} className="flex justify-center" />
        )}

        {mutation.error && (
          <Alert variant="destructive">
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => handleSubmit("approved")}
            disabled={mutation.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {mutation.isPending ? labels.submitting : labels.approve}
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("changes_requested")}
            disabled={mutation.isPending}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          >
            {mutation.isPending ? labels.submitting : labels.requestChanges}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleSubmit("rejected")}
            disabled={mutation.isPending}
            className="flex-1"
          >
            {mutation.isPending ? labels.submitting : labels.reject}
          </Button>
        </div>
      </div>
    </Card>
  );
}
