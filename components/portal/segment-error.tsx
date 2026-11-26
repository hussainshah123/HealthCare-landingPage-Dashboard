"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/states";

export function SegmentError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  return (
    <div className="p-6 lg:p-8">
      <ErrorState error={message} onRetry={retry} />
    </div>
  );
}
