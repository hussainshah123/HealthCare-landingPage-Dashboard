"use client";

import { useState } from "react";
import type { AccountStatus, AdminUser, Role } from "@/types/api";
import { listUsers, setUserStatus, type AdminSettableStatus } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { dateOnly, humanize } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/states";

const ROLES: Role[] = ["CUSTOMER", "DOCTOR", "RIDER", "PHARMACY", "ADMIN"];
const STATUSES: AccountStatus[] = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];
const APPROVABLE: Role[] = ["DOCTOR", "RIDER", "PHARMACY"];
const LIMIT = 20;

type PendingAction = { user: AdminUser; status: AdminSettableStatus };

const ACTION_LABEL: Record<AdminSettableStatus, string> = {
  ACTIVE: "Approve",
  REJECTED: "Reject",
  SUSPENDED: "Suspend",
};

function actionsFor(user: AdminUser): AdminSettableStatus[] {
  if (user.role === "ADMIN") return [];
  const approvable = APPROVABLE.includes(user.role);
  switch (user.status) {
    case "PENDING":
      return approvable ? ["ACTIVE", "REJECTED"] : ["ACTIVE"];
    case "ACTIVE":
      return ["SUSPENDED"];
    case "SUSPENDED":
      return ["ACTIVE"];
    case "REJECTED":
      return approvable ? ["ACTIVE"] : [];
  }
}

function profileSummary(user: AdminUser): string | null {
  const p = user.profile;
  if (!p) return null;
  const pick = (k: string) => (typeof p[k] === "string" || typeof p[k] === "number" ? String(p[k]) : null);
  const spec = p.specialization;
  const specName =
    typeof spec === "string" ? spec : spec && typeof spec === "object" && "name" in spec ? String(spec.name) : null;
  const parts = [
    pick("name") !== user.name ? pick("name") : null,
    specName,
    pick("licenseNumber") && `Lic. ${pick("licenseNumber")}`,
    pick("registrationNumber") && `Reg. ${pick("registrationNumber")}`,
    pick("vehicleNumber") && `${pick("vehicleType") ?? "Vehicle"} ${pick("vehicleNumber")}`,
    pick("city"),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export function UsersView({
  title,
  description,
  fixedRole,
  initialStatus = "",
  children,
}: {
  title: string;
  description?: string;
  fixedRole?: Role;
  initialStatus?: AccountStatus | "";
  children?: React.ReactNode;
}) {
  const [role, setRole] = useState<Role | "">(fixedRole ?? "");
  const [status, setStatus] = useState<AccountStatus | "">(initialStatus);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const effectiveRole = fixedRole ?? role;
  const { data, error, loading, reload } = useQuery(
    () => listUsers({ role: effectiveRole, status, search: query, page, limit: LIMIT }),
    [effectiveRole, status, query, page],
  );

  function openAction(user: AdminUser, next: AdminSettableStatus) {
    setPending({ user, status: next });
    setNote("");
    setActionError(null);
  }

  async function confirmAction() {
    if (!pending) return;
    setSaving(true);
    setActionError(null);
    try {
      await setUserStatus(pending.user.id, pending.status, note.trim() || undefined);
      setFlash(`${pending.user.name} is now ${humanize(pending.status).toLowerCase()}.`);
      setPending(null);
      reload();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      cell: (u) => (
        <div>
          <p className="font-medium text-slate-900">{u.name}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
          {profileSummary(u) && <p className="mt-0.5 text-xs text-slate-400">{profileSummary(u)}</p>}
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (u) => u.phone || "—" },
    ...(fixedRole ? [] : [{ key: "role", header: "Role", cell: (u: AdminUser) => <StatusBadge status={u.role} /> }]),
    { key: "status", header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
    { key: "createdAt", header: "Joined", cell: (u) => dateOnly(u.createdAt) },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (u) => (
        <div className="flex justify-end gap-2">
          {actionsFor(u).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === "ACTIVE" ? "success" : s === "REJECTED" ? "danger" : "secondary"}
              onClick={() => openAction(u, s)}
            >
              {ACTION_LABEL[s]}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title={title} description={description} />
      {children}
      {flash && (
        <div className="mb-4">
          <Alert tone="success">{flash}</Alert>
        </div>
      )}
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
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email or phone" />
          </Field>
          {!fixedRole && (
            <Field label="Role">
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role | "");
                  setPage(1);
                }}
              >
                <option value="">All roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {humanize(r)}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as AccountStatus | "");
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
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
          rowKey={(u) => u.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No users match these filters"
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending ? `${ACTION_LABEL[pending.status]} ${pending.user.name}?` : ""}
        description={pending ? `${humanize(pending.user.role)} · ${pending.user.email}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              variant={pending?.status === "ACTIVE" ? "success" : "danger"}
              onClick={confirmAction}
              loading={saving}
            >
              {pending ? ACTION_LABEL[pending.status] : "Confirm"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {actionError && <Alert tone="error">{actionError}</Alert>}
          <Field label="Note (optional)" hint="Sent with the status change, e.g. the reason for a rejection.">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
