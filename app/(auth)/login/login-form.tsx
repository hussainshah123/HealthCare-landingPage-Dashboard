"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/states";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; redirectTo?: string };
      if (!res.ok || !data.redirectTo) {
        setError(data.message ?? "Sign-in failed.");
        setPending(false);
        return;
      }
      const next = searchParams.get("next");
      const target =
        next && next.startsWith(data.redirectTo) && !next.startsWith("//") ? next : data.redirectTo;
      router.replace(target);
      router.refresh();
    } catch {
      setError("Network error – please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && <Alert tone="error">{error}</Alert>}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" loading={pending} className="mt-2 w-full">
        Sign in
      </Button>
    </form>
  );
}
