"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/types/api";
import { listPharmacyOrders } from "@/lib/api/pharmacy";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime, humanize, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/states";
import { cx } from "@/components/ui/cx";
import { OrderHistory, OrderItemsTable, OrderMeta } from "@/components/orders/order-details";
import { OrderStatusActions } from "@/components/pharmacy/order-status-actions";
import { PrescriptionReviewModal } from "@/components/pharmacy/prescription-review-modal";

const TABS: Array<{ value: OrderStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "PENDING", label: "New" },
  { value: "PRESCRIPTION_UNDER_REVIEW", label: "Rx review" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY_FOR_PICKUP", label: "Ready" },
  { value: "RIDER_ASSIGNED", label: "Rider assigned" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function PharmacyOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<Order | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const { data, error, loading, reload } = useQuery(() => listPharmacyOrders({ status }), [status]);
  const orders = data ? asList(data) : undefined;
  const selected = orders?.find((o) => o.id === selectedId) ?? null;

  const onChanged = (order: Order) => (_: Order | null, next: OrderStatus) => {
    setFlash(`Order #${order.orderNumber} is now ${humanize(next).toLowerCase()}.`);
    reload();
  };

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Order",
      cell: (o) => (
        <div>
          <p className="font-medium text-slate-900">#{o.orderNumber}</p>
          <p className="text-xs text-slate-500">{dateTime(o.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (o) => (
        <span className="line-clamp-2 max-w-xs text-xs">
          {(o.items ?? []).map((i) => `${i.quantity}× ${i.name}`).join(", ")}
        </span>
      ),
    },
    { key: "total", header: "Total", cell: (o) => money(o.total), className: "tabular-nums" },
    {
      key: "rx",
      header: "Rx",
      cell: (o) =>
        o.prescriptionId ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setReviewing(o);
            }}
          >
            View
          </Button>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    { key: "payment", header: "Payment", cell: (o) => <Badge>{o.paymentMethod}</Badge> },
    { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (o) => <OrderStatusActions order={o} onChanged={onChanged(o)} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Confirm, prepare and hand over orders to riders."
        actions={
          <Button variant="secondary" size="sm" onClick={reload} loading={loading && !!data}>
            Refresh
          </Button>
        }
      />
      {flash && (
        <div className="mb-4">
          <Alert tone="success">{flash}</Alert>
        </div>
      )}
      <Card bodyClassName="p-0">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-3" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={status === t.value}
              onClick={() => setStatus(t.value)}
              className={cx(
                "-mb-px border-b-2 px-3 pb-2.5 text-sm font-medium whitespace-nowrap",
                status === t.value
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Table
          columns={columns}
          rows={orders}
          rowKey={(o) => o.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No orders in this queue"
          onRowClick={(o) => setSelectedId(o.id)}
        />
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelectedId(null)}
        size="xl"
        title={selected ? `Order #${selected.orderNumber}` : ""}
        footer={
          selected && (
            <>
              {selected.prescriptionId && (
                <Button variant="secondary" onClick={() => setReviewing(selected)}>
                  Review prescription
                </Button>
              )}
              <OrderStatusActions order={selected} onChanged={onChanged(selected)} size="md" />
            </>
          )
        }
      >
        {selected && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <OrderItemsTable order={selected} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <OrderMeta order={selected} />
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">History</h3>
                <OrderHistory order={selected} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {reviewing?.prescriptionId && (
        <PrescriptionReviewModal
          key={reviewing.prescriptionId}
          open
          prescriptionId={reviewing.prescriptionId}
          orderNumber={reviewing.orderNumber}
          onClose={() => setReviewing(null)}
          onReviewed={(approved) => {
            setFlash(`Prescription for #${reviewing.orderNumber} ${approved ? "approved" : "rejected"}.`);
            reload();
          }}
        />
      )}
    </>
  );
}
