"use client";

import { useSearchParams } from "next/navigation";
import type { AccountStatus } from "@/types/api";
import { UsersView } from "@/components/admin/users-view";

const STATUSES = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];

export default function UsersPage() {
  const status = useSearchParams().get("status") ?? "";
  return (
    <UsersView
      key={status}
      title="Users"
      description="Every account on the platform. Approve, reject or suspend doctors, riders and pharmacies."
      initialStatus={STATUSES.includes(status) ? (status as AccountStatus) : ""}
    />
  );
}
