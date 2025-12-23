"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {error.message || "An error occurred during authentication. Please try again."}
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="flex-1">
              Try again
            </Button>
            <Button onClick={() => window.location.href = "/signin"} className="flex-1">
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
