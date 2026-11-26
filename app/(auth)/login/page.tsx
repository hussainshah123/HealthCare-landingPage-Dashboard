import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../auth-card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · HealthHub Portal" };

export default function LoginPage() {
  return (
    <AuthCard title="Sign in to the portal" subtitle="For platform administrators and partner pharmacies.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
