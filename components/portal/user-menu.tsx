"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UserMenu({ name, email, role, status }: { name: string; email: string; role: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{email}</p>
      </div>
      <Badge tone="purple">{role}</Badge>
      {status !== "ACTIVE" && <StatusBadge status={status} />}
      <Button variant="secondary" size="sm" onClick={signOut} loading={busy}>
        Sign out
      </Button>
    </div>
  );
}
