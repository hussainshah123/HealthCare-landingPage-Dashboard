"use client";

import { useState } from "react";
import type { PharmacyProfile, PharmacyProfileInput } from "@/types/api";
import { getMyPharmacy, updateMyPharmacy } from "@/lib/api/pharmacy";
import { useQuery } from "@/lib/hooks/use-query";
import { Card, PageHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert, ErrorState, Spinner } from "@/components/ui/states";

export default function PharmacyProfilePage() {
  const { data, error, reload } = useQuery(getMyPharmacy, []);
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Spinner />;
  return <ProfileForm key={JSON.stringify(data)} profile={data} onSaved={reload} />;
}

function ProfileForm({ profile, onSaved }: { profile: PharmacyProfile; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: profile.name ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    licenseNumber: profile.licenseNumber ?? "",
    lat: profile.lat != null ? String(profile.lat) : "",
    lng: profile.lng != null ? String(profile.lng) : "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
        setLocating(false);
      },
      (err) => {
        setError(err.message);
        setLocating(false);
      },
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body: PharmacyProfileInput = {
      name: form.name.trim() || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      licenseNumber: form.licenseNumber.trim() || undefined,
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
    };
    try {
      await updateMyPharmacy(body);
      setSaved(true);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Pharmacy profile"
        description="Customers see your name and address; riders use your location for pickups."
        actions={profile.status ? <StatusBadge status={profile.status} /> : undefined}
      />
      {profile.status === "PENDING" && (
        <div className="mb-4 max-w-3xl">
          <Alert tone="warning" title="Pending approval">
            Keep your licence number and address up to date – an administrator reviews them before approving your
            pharmacy.
          </Alert>
        </div>
      )}
      <form onSubmit={submit} className="max-w-3xl">
        <Card
          title="Business details"
          actions={
            <Button type="submit" loading={saving}>
              Save profile
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
                <Alert tone="success">Profile saved.</Alert>
              </div>
            )}
            <Field label="Pharmacy name" className="sm:col-span-2">
              <Input value={form.name} onChange={set("name")} required />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input value={form.address} onChange={set("address")} />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={set("city")} />
            </Field>
            <Field label="Licence number">
              <Input value={form.licenseNumber} onChange={set("licenseNumber")} />
            </Field>
            <Field label="Latitude">
              <Input type="number" step="any" min={-90} max={90} value={form.lat} onChange={set("lat")} />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" min={-180} max={180} value={form.lng} onChange={set("lng")} />
            </Field>
            <div className="sm:col-span-2">
              <Button variant="secondary" size="sm" onClick={useMyLocation} loading={locating}>
                Use my current location
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </>
  );
}
