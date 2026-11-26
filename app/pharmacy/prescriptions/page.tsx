"use client";

import { useState } from "react";
import type { Order } from "@/types/api";
import { listPharmacyOrders } from "@/lib/api/pharmacy";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Alert } from "@/components/ui/states";
import { PrescriptionReviewModal } from "@/components/pharmacy/prescription-review-modal";

/**
 * API.md has no "list prescriptions for my pharmacy" endpoint, so the review queue is derived from
 * GET /orders/pharmacy: orders carrying a prescriptionId, by default those in PRESCRIPTION_UNDER_REVIEW.
 */
export default function PharmacyPrescriptionsPage() {
  const [showAll, setShowAll] = useState(false);
  const [reviewing, setReviewing] = useState<Order | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const { data, error, loading, reload } = useQuery(
    () => listPharmacyOrders({ status: showAll ? "" : "PRESCRIPTION_UNDER_REVIEW" }),
    [showAll],
  );
  const orders = data ? asList(data).filter((o) => !!o.prescriptionId) : undefined;

  const columns: Column<Order>[] = [
    { key: "number", header: "Order", cell: (o) => <span className="font-medium text-slate-900">#{o.orderNumber}</span> },
    { key: "placed", header: "Placed", cell: (o) => dateTime(o.createdAt) },
    {
      key: "items",
      header: "Medicines",
      cell: (o) => (
        <span className="line-clamp-2 max-w-sm text-xs">
          {(o.items ?? []).map((i) => `${i.quantity}× ${i.name}`).join(", ")}
        </span>
      ),
    },
    { key: "status", header: "Order status", cell: (o) => <StatusBadge status={o.status} /> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (o) => (
        <Button size="sm" onClick={() => setReviewing(o)}>
          {o.status === "PRESCRIPTION_UNDER_REVIEW" ? "Review" : "View"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Prescriptions"
        description="Review customer prescriptions attached to orders."
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
      <Card
        bodyClassName="p-0"
        title={showAll ? "All orders with prescriptions" : "Awaiting review"}
        actions={<Checkbox label="Show all" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />}
      >
        <Table
          columns={columns}
          rows={orders}
          rowKey={(o) => o.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle={showAll ? "No orders with prescriptions" : "No prescriptions waiting for review"}
        />
      </Card>
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
