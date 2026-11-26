"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/types/api";
import { getOrder } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { useTracking } from "@/lib/hooks/use-tracking";
import { dateTime, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Alert, ErrorState, Spinner } from "@/components/ui/states";
import { OrderHistory, OrderItemsTable, OrderMeta } from "@/components/orders/order-details";
import { AssignRiderModal } from "@/components/admin/assign-rider-modal";
import { LiveMap, MapLegend } from "@/components/map/live-map";
import { deliveryMarkers } from "@/components/map/markers";

const TRACKABLE: OrderStatus[] = ["RIDER_ASSIGNED", "PICKED_UP", "ON_THE_WAY"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, error, loading, reload } = useQuery(() => getOrder(id), [id]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const trackable = !!order?.delivery && TRACKABLE.includes(order.status);
  const tracking = useTracking(trackable && order ? [order.id] : []);

  if (error && !order) return <ErrorState error={error} onRetry={reload} />;
  if (!order) return <Spinner />;

  const canAssign = order.status === "READY_FOR_PICKUP" && !order.delivery;
  const liveStatus = tracking.statuses[order.id];
  const { markers, routes } = order.delivery ? deliveryMarkers([order.delivery], tracking.locations) : { markers: [], routes: [] };

  return (
    <>
      <div className="mb-2">
        <Link href="/admin/orders" className="text-sm text-slate-500 hover:text-slate-700">
          ← All orders
        </Link>
      </div>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Order #{order.orderNumber} <StatusBadge status={order.status} />
          </span>
        }
        description={`Placed ${dateTime(order.createdAt)} · ${money(order.total)}`}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={reload} loading={loading}>
              Refresh
            </Button>
            {canAssign && <Button onClick={() => setAssignOpen(true)}>Assign rider</Button>}
          </>
        }
      />
      {flash && (
        <div className="mb-4">
          <Alert tone="success">{flash}</Alert>
        </div>
      )}
      {liveStatus && liveStatus !== order.status && (
        <div className="mb-4">
          <Alert tone="info" title="Live update">
            Delivery status changed to <StatusBadge status={liveStatus} />.{" "}
            <button className="font-medium underline" onClick={reload}>
              Reload order
            </button>
          </Alert>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card title="Items">
            <OrderItemsTable order={order} />
          </Card>
          {order.delivery && (
            <Card
              title="Delivery"
              description={
                trackable
                  ? tracking.connected
                    ? "Live tracking connected"
                    : tracking.error
                      ? `Live tracking unavailable: ${tracking.error}`
                      : "Connecting to live tracking…"
                  : undefined
              }
              actions={<StatusBadge status={order.delivery.status} />}
            >
              <dl className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Pickup</dt>
                  <dd>
                    {order.delivery.pharmacy.name}, {order.delivery.pharmacy.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Drop-off</dt>
                  <dd>
                    {order.delivery.customerName} – {order.delivery.dropoff.line1}, {order.delivery.dropoff.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Rider fee</dt>
                  <dd>{money(order.delivery.fee)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Assigned / picked up / delivered</dt>
                  <dd className="text-xs">
                    {dateTime(order.delivery.assignedAt)} · {dateTime(order.delivery.pickedUpAt)} ·{" "}
                    {dateTime(order.delivery.deliveredAt)}
                  </dd>
                </div>
              </dl>
              {trackable && (
                <div className="flex flex-col gap-2">
                  <LiveMap markers={markers} routes={routes} className="h-[360px]" />
                  <MapLegend />
                </div>
              )}
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Details">
            <OrderMeta order={order} />
          </Card>
          <Card title="Status history">
            <OrderHistory order={order} />
          </Card>
        </div>
      </div>

      <AssignRiderModal
        order={order}
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssigned={() => {
          setFlash("Rider assigned.");
          reload();
        }}
      />
    </>
  );
}
