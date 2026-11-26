"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/api";
import { listOrders } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime, humanize, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";

const columns: Column<Order>[] = [
  {
    key: "number",
    header: "Order",
    cell: (o) => (
      <Link href={`/admin/orders/${o.id}`} className="font-medium text-teal-700 hover:underline">
        #{o.orderNumber}
      </Link>
    ),
  },
  { key: "pharmacy", header: "Pharmacy", cell: (o) => o.pharmacy?.name ?? "—" },
  { key: "items", header: "Items", cell: (o) => o.items?.length ?? 0 },
  { key: "total", header: "Total", cell: (o) => money(o.total), className: "tabular-nums" },
  {
    key: "payment",
    header: "Payment",
    cell: (o) => (
      <span className="text-xs">
        {o.paymentMethod} · {humanize(o.paymentStatus)}
      </span>
    ),
  },
  { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
  { key: "created", header: "Placed", cell: (o) => dateTime(o.createdAt) },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useQuery(
    () => listOrders({ status, search: query, page }),
    [status, query, page],
  );

  return (
    <>
      <PageHeader title="Orders" description="All medicine orders across pharmacies." />
      <Card bodyClassName="p-0">
        <form
          className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(search.trim());
          }}
        >
          <Field label="Search" className="min-w-56 flex-1">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number or customer" />
          </Field>
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as OrderStatus | "");
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Table
          columns={columns}
          rows={data?.items}
          rowKey={(o) => o.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No orders found"
          onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>
    </>
  );
}
