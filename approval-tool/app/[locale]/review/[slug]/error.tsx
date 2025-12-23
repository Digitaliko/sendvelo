"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Home } from "lucide-react";

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Review page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Review</AlertTitle>
          <AlertDescription>
            {error.message || "Unable to load this review. It may have been deleted or you may not have access."}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={reset} variant="outline" className="flex-1">
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/"} className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
