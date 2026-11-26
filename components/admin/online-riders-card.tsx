"use client";

import type { OnlineRider } from "@/types/api";
import { listOnlineRiders } from "@/lib/api/admin";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columns: Column<OnlineRider>[] = [
  {
    key: "name",
    header: "Rider",
    cell: (r) => (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        <span className="font-medium text-slate-900">{r.name}</span>
      </div>
    ),
  },
  { key: "phone", header: "Phone", cell: (r) => r.phone ?? "—" },
  {
    key: "vehicle",
    header: "Vehicle",
    cell: (r) => [r.vehicleType, r.vehicleNumber].filter(Boolean).join(" · ") || "—",
  },
  {
    key: "location",
    header: "Last location",
    cell: (r) =>
      r.lastLocation ? (
        <span className="text-xs">
          {r.lastLocation.lat.toFixed(4)}, {r.lastLocation.lng.toFixed(4)}
          {r.lastLocation.recordedAt && <span className="text-slate-400"> · {dateTime(r.lastLocation.recordedAt)}</span>}
        </span>
      ) : (
        "—"
      ),
  },
];

export function OnlineRidersCard() {
  const { data, error, loading, reload } = useQuery(listOnlineRiders, []);
  const riders = data ? asList(data) : undefined;
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          Online riders {riders && <Badge tone="green">{riders.length}</Badge>}
        </span>
      }
      description="Riders currently available for delivery assignment."
      actions={
        <Button variant="secondary" size="sm" onClick={reload} loading={loading && !!data}>
          Refresh
        </Button>
      }
      bodyClassName="p-0"
    >
      <Table
        columns={columns}
        rows={riders}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        emptyTitle="No riders online right now"
      />
    </Card>
  );
}
