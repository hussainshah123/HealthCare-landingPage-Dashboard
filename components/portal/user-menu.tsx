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
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-sky-700 text-sm font-bold text-white shadow-md shadow-sky-700/30"
        aria-hidden
      >
        {name.trim().charAt(0).toUpperCase() || "?"}
      </span>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{email}</p>
      </div>
      <Badge tone="blue">{role}</Badge>
      {status !== "ACTIVE" && <StatusBadge status={status} />}
      <Button variant="secondary" size="sm" onClick={signOut} loading={busy}>
        Sign out
      </Button>
    </div>
  );
}
