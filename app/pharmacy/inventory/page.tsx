"use client";

import { useState } from "react";
import type { InventoryItem, Medicine } from "@/types/api";
import { createInventory, listInventory, updateInventory } from "@/lib/api/pharmacy";
import { listMedicines } from "@/lib/api/catalog";
import { useQuery } from "@/lib/hooks/use-query";
import { dateOnly, money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/states";
import { cx } from "@/components/ui/cx";

const LIMIT = 20;
const LOW_STOCK = 10;

type Editing = { mode: "create" } | { mode: "edit"; item: InventoryItem };

function medicineLabel(item: InventoryItem) {
  return item.medicine?.name ?? item.medicineName ?? item.medicineId;
}

function expiryBadge(expiry: string | null) {
  if (!expiry) return <span className="text-slate-400">—</span>;
  const days = (new Date(expiry).getTime() - Date.now()) / 86_400_000;
  if (Number.isNaN(days)) return expiry;
  if (days < 0) return <Badge tone="red">Expired {dateOnly(expiry)}</Badge>;
  if (days < 60) return <Badge tone="yellow">{dateOnly(expiry)}</Badge>;
  return dateOnly(expiry);
}

export default function PharmacyInventoryPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const { data, error, loading, reload } = useQuery(() => listInventory({ page, limit: LIMIT }), [page]);

  const columns: Column<InventoryItem>[] = [
    {
      key: "medicine",
      header: "Medicine",
      cell: (i) => (
        <div>
          <p className="font-medium text-slate-900">{medicineLabel(i)}</p>
          {i.medicine?.brand && <p className="text-xs text-slate-500">{i.medicine.brand}</p>}
        </div>
      ),
    },
    { key: "price", header: "Price", cell: (i) => money(i.price), className: "tabular-nums" },
    {
      key: "stock",
      header: "Stock",
      cell: (i) =>
        i.stock <= 0 ? (
          <Badge tone="red">Out of stock</Badge>
        ) : i.stock <= LOW_STOCK ? (
          <Badge tone="yellow">{i.stock} left</Badge>
        ) : (
          <span className="tabular-nums">{i.stock}</span>
        ),
    },
    { key: "batch", header: "Batch", cell: (i) => i.batchNumber || "—" },
    { key: "expiry", header: "Expiry", cell: (i) => expiryBadge(i.expiryDate) },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (i) => (
        <Button size="sm" variant="secondary" onClick={() => setEditing({ mode: "edit", item: i })}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock levels, prices, batches and expiry dates."
        actions={<Button onClick={() => setEditing({ mode: "create" })}>Add stock item</Button>}
      />
      {flash && (
        <div className="mb-4">
          <Alert tone="success">{flash}</Alert>
        </div>
      )}
      <Card bodyClassName="p-0">
        <Table
          columns={columns}
          rows={data?.items}
          rowKey={(i) => i.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No stock yet"
          emptyDescription="Add medicines from the catalogue to start receiving orders."
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>
      {editing && (
        <InventoryModal
          key={editing.mode === "edit" ? editing.item.id : "new"}
          editing={editing}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setFlash(msg);
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function InventoryModal({
  editing,
  onClose,
  onSaved,
}: {
  editing: Editing;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const item = editing.mode === "edit" ? editing.item : null;
  const [medicine, setMedicine] = useState<Pick<Medicine, "id" | "name"> | null>(
    item ? { id: item.medicineId, name: medicineLabel(item) } : null,
  );
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    price: item ? String(item.price) : "",
    stock: item ? String(item.stock) : "",
    batchNumber: item?.batchNumber ?? "",
    expiryDate: item?.expiryDate ? item.expiryDate.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const results = useQuery(
    () => (editing.mode === "create" && query ? listMedicines({ search: query, limit: 8 }) : Promise.resolve(null)),
    [query, editing.mode],
  );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!medicine) {
      setError("Choose a medicine from the catalogue.");
      return;
    }
    setSaving(true);
    setError(null);
    const common = {
      price: Number(form.price),
      stock: Number(form.stock),
      batchNumber: form.batchNumber.trim() || undefined,
      expiryDate: form.expiryDate || undefined,
    };
    try {
      if (editing.mode === "edit") {
        await updateInventory(editing.item.id, common);
        onSaved(`${medicine.name} updated.`);
      } else {
        await createInventory({ medicineId: medicine.id, ...common });
        onSaved(`${medicine.name} added to inventory.`);
      }
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={editing.mode === "edit" ? `Edit ${medicine?.name}` : "Add stock item"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="inventory-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <Alert tone="error">{error}</Alert>}
        {editing.mode === "create" && (
          <div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setQuery(search.trim());
              }}
            >
              <Field label="Find medicine" className="flex-1">
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the catalogue" />
              </Field>
              <Button type="submit" variant="secondary" loading={results.loading && !!query}>
                Search
              </Button>
            </form>
            {results.error && <p className="mt-2 text-xs text-rose-600">{results.error.message}</p>}
            {results.data && (
              <ul className="mt-2 max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
                {results.data.items.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No matches.</li>}
                {results.data.items.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setMedicine({ id: m.id, name: m.name })}
                      className={cx(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50",
                        medicine?.id === m.id && "bg-sky-50",
                      )}
                    >
                      <span>
                        <span className="font-medium text-slate-900">{m.name}</span>
                        <span className="ml-2 text-xs text-slate-500">
                          {[m.brand, m.dosage].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      {m.requiresPrescription && <Badge tone="purple">Rx</Badge>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {medicine && (
              <p className="mt-2 text-sm text-slate-600">
                Selected: <span className="font-medium text-slate-900">{medicine.name}</span>
              </p>
            )}
          </div>
        )}
        <form id="inventory-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (PKR)">
            <Input type="number" min={0} step="0.01" required value={form.price} onChange={set("price")} />
          </Field>
          <Field label="Stock">
            <Input type="number" min={0} step="1" required value={form.stock} onChange={set("stock")} />
          </Field>
          <Field label="Batch number">
            <Input value={form.batchNumber} onChange={set("batchNumber")} />
          </Field>
          <Field label="Expiry date">
            <Input type="date" value={form.expiryDate} onChange={set("expiryDate")} />
          </Field>
        </form>
      </div>
    </Modal>
  );
}
