"use client";

import { useState } from "react";
import type { Category, Medicine, MedicineInput } from "@/types/api";
import { createMedicine, listCategories, listMedicines, updateMedicine } from "@/lib/api/catalog";
import { useQuery } from "@/lib/hooks/use-query";
import { money } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/states";

const LIMIT = 20;

type Editing = { mode: "create" } | { mode: "edit"; medicine: Medicine };

export default function AdminMedicinesPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const categories = useQuery(listCategories, []);
  const { data, error, loading, reload } = useQuery(
    () => listMedicines({ search: query, categoryId, page, limit: LIMIT }),
    [query, categoryId, page],
  );
  const categoryName = (id: string | null) => categories.data?.find((c) => c.id === id)?.name ?? "—";

  const columns: Column<Medicine>[] = [
    {
      key: "name",
      header: "Medicine",
      cell: (m) => (
        <div>
          <p className="font-medium text-slate-900">{m.name}</p>
          <p className="text-xs text-slate-500">{[m.brand, m.manufacturer, m.dosage].filter(Boolean).join(" · ")}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", cell: (m) => categoryName(m.categoryId) },
    {
      key: "rx",
      header: "Prescription",
      cell: (m) => (m.requiresPrescription ? <Badge tone="purple">Rx required</Badge> : <Badge>OTC</Badge>),
    },
    { key: "price", header: "From", cell: (m) => money(m.minPrice), className: "tabular-nums" },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (m) => (
        <Button size="sm" variant="secondary" onClick={() => setEditing({ mode: "edit", medicine: m })}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Medicines"
        description="The master medicine catalogue pharmacies stock from."
        actions={<Button onClick={() => setEditing({ mode: "create" })}>Add medicine</Button>}
      />
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
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or brand" />
          </Field>
          <Field label="Category">
            <Select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
          rowKey={(m) => m.id}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="No medicines found"
        />
        {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
      </Card>

      {editing && (
        <MedicineModal
          key={editing.mode === "edit" ? editing.medicine.id : "new"}
          editing={editing}
          categories={categories.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={(name) => {
            setFlash(`${name} saved.`);
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function MedicineModal({
  editing,
  categories,
  onClose,
  onSaved,
}: {
  editing: Editing;
  categories: Category[];
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const initial = editing.mode === "edit" ? editing.medicine : null;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    manufacturer: initial?.manufacturer ?? "",
    dosage: initial?.dosage ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    categoryId: initial?.categoryId ?? "",
    requiresPrescription: initial?.requiresPrescription ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const opt = (v: string) => (v.trim() ? v.trim() : undefined);
    const body: MedicineInput = {
      name: form.name.trim(),
      brand: opt(form.brand),
      manufacturer: opt(form.manufacturer),
      dosage: opt(form.dosage),
      description: opt(form.description),
      imageUrl: opt(form.imageUrl),
      categoryId: opt(form.categoryId),
      requiresPrescription: form.requiresPrescription,
    };
    try {
      if (editing.mode === "edit") await updateMedicine(editing.medicine.id, body);
      else await createMedicine(body);
      onSaved(body.name);
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
      title={editing.mode === "edit" ? `Edit ${editing.medicine.name}` : "Add medicine"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="medicine-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="medicine-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {error && (
          <div className="sm:col-span-2">
            <Alert tone="error">{error}</Alert>
          </div>
        )}
        <Field label="Name" className="sm:col-span-2">
          <Input value={form.name} onChange={set("name")} required />
        </Field>
        <Field label="Brand">
          <Input value={form.brand} onChange={set("brand")} />
        </Field>
        <Field label="Manufacturer">
          <Input value={form.manufacturer} onChange={set("manufacturer")} />
        </Field>
        <Field label="Dosage">
          <Input value={form.dosage} onChange={set("dosage")} placeholder="e.g. 500 mg tablet" />
        </Field>
        <Field label="Category">
          <Select value={form.categoryId} onChange={set("categoryId")}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Image URL" className="sm:col-span-2">
          <Input type="url" value={form.imageUrl} onChange={set("imageUrl")} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea value={form.description} onChange={set("description")} />
        </Field>
        <div className="sm:col-span-2">
          <Checkbox
            label="Requires a prescription"
            checked={form.requiresPrescription}
            onChange={(e) => setForm((f) => ({ ...f, requiresPrescription: e.target.checked }))}
          />
        </div>
      </form>
    </Modal>
  );
}
