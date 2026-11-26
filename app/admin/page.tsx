"use client";

import Link from "next/link";
import { getStats } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { money, num } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState, Spinner } from "@/components/ui/states";

export default function AdminOverviewPage() {
  const { data, error, loading, reload } = useQuery(getStats, []);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Platform-wide activity at a glance."
        actions={
          <Button variant="secondary" size="sm" onClick={reload} loading={loading && !!data}>
            Refresh
          </Button>
        }
      />
      {error && !data ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !data ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Revenue" value={money(data.revenue)} tone="teal" />
            <StatCard label="Orders" value={num(data.orders)} />
            <StatCard label="Active deliveries" value={num(data.activeDeliveries)} tone="teal" />
            <StatCard
              label="Pending approvals"
              value={num(data.pendingApprovals)}
              tone={data.pendingApprovals > 0 ? "amber" : "slate"}
              hint={
                data.pendingApprovals > 0 ? (
                  <Link href="/admin/users?status=PENDING" className="font-medium text-amber-700 hover:underline">
                    Review now →
                  </Link>
                ) : (
                  "All caught up"
                )
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Customers" value={num(data.customers)} />
            <StatCard label="Doctors" value={num(data.doctors)} />
            <StatCard label="Riders" value={num(data.riders)} />
            <StatCard label="Pharmacies" value={num(data.pharmacies)} />
            <StatCard label="Consultations" value={num(data.consultations)} />
          </div>
        </div>
      )}
    </>
  );
}
