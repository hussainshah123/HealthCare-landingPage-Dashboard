"use client";

import { useState } from "react";
import type { PlatformSettings } from "@/types/api";
import { getSettings, updateSettings } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert, ErrorState, Spinner } from "@/components/ui/states";

export default function AdminSettingsPage() {
  const { data, error, reload } = useQuery(getSettings, []);
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Spinner />;
  return <SettingsForm key={JSON.stringify(data)} initial={data} onSaved={reload} />;
}

function SettingsForm({ initial, onSaved }: { initial: PlatformSettings; onSaved: () => void }) {
  const [form, setForm] = useState({
    deliveryFee: String(initial.deliveryFee ?? 0),
    platformCommissionPercent: String(initial.platformCommissionPercent ?? 0),
    doctorCommissionPercent: String(initial.doctorCommissionPercent ?? 0),
    riderFeePercent: String(initial.riderFeePercent ?? 0),
    serviceCities: (initial.serviceCities ?? []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSettings({
        deliveryFee: Number(form.deliveryFee),
        platformCommissionPercent: Number(form.platformCommissionPercent),
        doctorCommissionPercent: Number(form.doctorCommissionPercent),
        riderFeePercent: Number(form.riderFeePercent),
        serviceCities: form.serviceCities
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const pct = { type: "number", min: 0, max: 100, step: "0.01", required: true } as const;

  return (
    <>
      <PageHeader title="Settings" description="Platform fees, commissions and service area." />
      <form onSubmit={submit} className="max-w-3xl">
        <Card
          title="Platform settings"
          actions={
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {error && (
              <div className="sm:col-span-2">
                <Alert tone="error">{error}</Alert>
              </div>
            )}
            {saved && (
              <div className="sm:col-span-2">
                <Alert tone="success">Settings saved.</Alert>
              </div>
            )}
            <Field label="Delivery fee" hint="Charged to customers per order (PKR).">
              <Input type="number" min={0} step="0.01" required value={form.deliveryFee} onChange={set("deliveryFee")} />
            </Field>
            <Field label="Platform commission (%)" hint="Taken from pharmacy order value.">
              <Input {...pct} value={form.platformCommissionPercent} onChange={set("platformCommissionPercent")} />
            </Field>
            <Field label="Doctor commission (%)" hint="Taken from consultation fees.">
              <Input {...pct} value={form.doctorCommissionPercent} onChange={set("doctorCommissionPercent")} />
            </Field>
            <Field label="Rider fee (%)" hint="Share of the delivery fee paid to riders.">
              <Input {...pct} value={form.riderFeePercent} onChange={set("riderFeePercent")} />
            </Field>
            <Field label="Service cities" hint="Comma-separated, e.g. Lahore, Karachi, Islamabad." className="sm:col-span-2">
              <Input value={form.serviceCities} onChange={set("serviceCities")} />
            </Field>
          </div>
        </Card>
      </form>
    </>
  );
}
