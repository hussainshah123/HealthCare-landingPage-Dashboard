"use client";

import { useState } from "react";
import { APPOINTMENT_STATUSES, type Appointment, type AppointmentStatus } from "@/types/api";
import { listAppointments } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime, humanize, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Field, Select } from "@/components/ui/form";

const columns: Column<Appointment>[] = [
  {
    key: "when",
    header: "When",
    cell: (a) => (
      <div>
        <p className="text-slate-900">{dateTime(a.startsAt)}</p>
        {a.endsAt && <p className="text-xs text-slate-500">until {dateTime(a.endsAt)}</p>}
      </div>
    ),
  },
  {
    key: "doctor",
    header: "Doctor",
    cell: (a) => (
      <div>
        <p className="text-slate-900">{a.doctor?.name ?? "—"}</p>
        <p className="text-xs text-slate-500">{a.doctor?.specialization}</p>
      </div>
    ),
  },
  { key: "customer", header: "Patient", cell: (a) => a.customer?.name ?? "—" },
  { key: "type", header: "Type", cell: (a) => <Badge tone="blue">{humanize(a.type)}</Badge> },
  { key: "fee", header: "Fee", cell: (a) => money(a.fee), className: "tabular-nums" },
  { key: "reason", header: "Reason", cell: (a) => <span className="line-clamp-2 max-w-xs">{a.reason || "—"}</span> },
  { key: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
];

export default function AdminAppointmentsPage() {
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useQuery(() => listAppointments({ status, page }), [status, page]);

  return (
    <>
      <PageHeader title="Appointments" description="Doctor consultations booked on the platform." />
      <Card bodyClassName="p-0">
        <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4">
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as AppointmentStatus | "");
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {APPOINTMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Table
          columns={columns}
          rows={data?.items}
          rowKey={(a) => a.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No appointments found"
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>
    </>
  );
}
