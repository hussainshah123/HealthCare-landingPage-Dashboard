"use client";

import Link from "next/link";
import type { OrderStatus } from "@/types/api";
import { getMyPharmacy, listPharmacyOrders } from "@/lib/api/pharmacy";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime, money } from "@/lib/format";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState, Spinner } from "@/components/ui/states";

const OPEN: OrderStatus[] = ["PENDING", "PRESCRIPTION_UNDER_REVIEW", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP"];

export default function PharmacyOverviewPage() {
  const profile = useQuery(getMyPharmacy, []);
  const orders = useQuery(() => listPharmacyOrders({}), []);
  const all = orders.data ? asList(orders.data) : undefined;
  const count = (s: OrderStatus) => all?.filter((o) => o.status === s).length ?? 0;
  const open = all?.filter((o) => OPEN.includes(o.status)) ?? [];

  return (
    <>
      <PageHeader
        title={profile.data?.name ?? "Pharmacy"}
        description={
          profile.data ? [profile.data.address, profile.data.city].filter(Boolean).join(", ") || undefined : undefined
        }
      />
      {orders.error && !all ? (
        <ErrorState error={orders.error} onRetry={orders.reload} />
      ) : !all ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="New orders" value={count("PENDING")} tone={count("PENDING") ? "amber" : "slate"} />
            <StatCard
              label="Prescriptions to review"
              value={count("PRESCRIPTION_UNDER_REVIEW")}
              tone={count("PRESCRIPTION_UNDER_REVIEW") ? "amber" : "slate"}
              hint={
                <Link href="/pharmacy/prescriptions" className="text-teal-700 hover:underline">
                  Open queue →
                </Link>
              }
            />
            <StatCard label="In preparation" value={count("CONFIRMED") + count("PREPARING")} tone="teal" />
            <StatCard label="Ready for pickup" value={count("READY_FOR_PICKUP")} tone="teal" />
          </div>
          <Card
            title="Open orders"
            actions={
              <Link href="/pharmacy/orders" className="text-sm font-medium text-teal-700 hover:underline">
                Manage orders →
              </Link>
            }
            bodyClassName="p-0"
          >
            {open.length === 0 ? (
              <EmptyState title="No open orders" description="New orders will show up here." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {open.slice(0, 8).map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">#{o.orderNumber}</p>
                      <p className="text-xs text-slate-500">
                        {dateTime(o.createdAt)} · {o.items?.length ?? 0} items · {money(o.total)}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
