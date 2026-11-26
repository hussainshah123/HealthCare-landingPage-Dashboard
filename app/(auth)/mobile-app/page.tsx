import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../auth-card";

export const metadata: Metadata = { title: "Use the mobile app · HealthHub" };

export default function MobileAppPage() {
  return (
    <AuthCard title="Please use the mobile app">
      <p className="mt-2 text-sm text-slate-600">
        The web portal is available to platform administrators and pharmacies only. Customers, doctors and riders can
        sign in with the HealthHub mobile app for Android and iOS.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
      >
        Back to sign in
      </Link>
    </AuthCard>
  );
}
