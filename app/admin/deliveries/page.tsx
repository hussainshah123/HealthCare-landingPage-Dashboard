"use client";

import Link from "next/link";
import type { Delivery } from "@/types/api";
import { listActiveDeliveries } from "@/lib/api/admin";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { useTracking } from "@/lib/hooks/use-tracking";
import { dateTime, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { LiveMap, MapLegend } from "@/components/map/live-map";
import { deliveryMarkers } from "@/components/map/markers";

export default function ActiveDeliveriesPage() {
  const { data, error, loading, reload } = useQuery(listActiveDeliveries, []);
  const deliveries = data ? asList(data) : undefined;
  const tracking = useTracking((deliveries ?? []).map((d) => d.orderId));
  const { markers, routes } = deliveryMarkers(deliveries ?? [], tracking.locations);

  const columns: Column<Delivery>[] = [
    {
      key: "order",
      header: "Order",
      cell: (d) => (
        <Link href={`/admin/orders/${d.orderId}`} className="font-medium text-teal-700 hover:underline">
          #{d.orderNumber}
        </Link>
      ),
    },
    { key: "pharmacy", header: "Pickup", cell: (d) => d.pharmacy?.name ?? "—" },
    {
      key: "dropoff",
      header: "Drop-off",
      cell: (d) => (
        <div>
          <p className="text-slate-900">{d.customerName}</p>
          <p className="text-xs text-slate-500">
            {d.dropoff?.line1}, {d.dropoff?.city}
          </p>
        </div>
      ),
    },
    { key: "fee", header: "Fee", cell: (d) => money(d.fee) },
    {
      key: "status",
      header: "Status",
      cell: (d) => <StatusBadge status={tracking.statuses[d.orderId] ?? d.status} />,
    },
    {
      key: "live",
      header: "Rider position",
      cell: (d) => {
        const loc = tracking.locations[d.orderId];
        return loc ? (
          <span className="text-xs">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {loc.recordedAt ? dateTime(loc.recordedAt) : "Live"}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Waiting…</span>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Active deliveries"
        description="Deliveries in progress with live rider positions."
        actions={
          <>
            <Badge tone={tracking.connected ? "green" : tracking.error ? "red" : "yellow"}>
              {tracking.connected ? "Live" : tracking.error ? "Offline" : "Connecting…"}
            </Badge>
            <Button variant="secondary" size="sm" onClick={reload} loading={loading && !!data}>
              Refresh
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-6">
        <Card
          title="Live map"
          description={tracking.error ? `Live tracking unavailable: ${tracking.error}` : undefined}
          actions={<MapLegend />}
        >
          <LiveMap markers={markers} routes={routes} />
        </Card>
        <Card title="Deliveries" bodyClassName="p-0">
          <Table
            columns={columns}
            rows={deliveries}
            rowKey={(d) => d.id}
            loading={loading}
            error={error}
            onRetry={reload}
            emptyTitle="No active deliveries"
            emptyDescription="Deliveries appear here once a rider is assigned."
          />
        </Card>
      </div>
    </>
  );
}
