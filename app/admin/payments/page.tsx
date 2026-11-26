"use client";

import Link from "next/link";
import { useState } from "react";
import type { Payment } from "@/types/api";
import { listPayments } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime, humanize, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/badge";

// API.md does not define the Payment shape, so every column tolerates missing fields.
const columns: Column<Payment>[] = [
  { key: "created", header: "Date", cell: (p) => dateTime(p.createdAt) },
  { key: "ref", header: "Reference", cell: (p) => <span className="font-mono text-xs">{p.reference ?? p.id}</span> },
  { key: "user", header: "Payer", cell: (p) => p.user?.name ?? "—" },
  {
    key: "for",
    header: "For",
    cell: (p) =>
      p.orderId ? (
        <Link href={`/admin/orders/${p.orderId}`} className="text-teal-700 hover:underline">
          Order
        </Link>
      ) : p.appointmentId ? (
        "Appointment"
      ) : (
        "—"
      ),
  },
  { key: "method", header: "Method", cell: (p) => humanize(p.method ?? p.provider) },
  { key: "amount", header: "Amount", cell: (p) => money(p.amount), className: "tabular-nums" },
  { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
];

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useQuery(() => listPayments({ page }), [page]);
  return (
    <>
      <PageHeader title="Payments" description="Payments for orders and consultations." />
      <Card bodyClassName="p-0">
        <Table
          columns={columns}
          rows={data?.items}
          rowKey={(p) => p.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No payments yet"
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>
    </>
  );
}
