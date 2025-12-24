"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { captureException } from "@/lib/error-tracking";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    captureException(error, {
      tags: { digest: error.digest ?? "unknown" },
    });
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("somethingWentWrong")}</AlertTitle>
          <AlertDescription>
            {error.message || t("unexpectedError")}
          </AlertDescription>
        </Alert>
        <Button onClick={reset} variant="outline">
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
