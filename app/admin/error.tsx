"use client";

import { SegmentError } from "@/components/portal/segment-error";

export default function PortalError({ error, retry }: { error: unknown; retry: () => void }) {
  return <SegmentError error={error} retry={retry} />;
}
