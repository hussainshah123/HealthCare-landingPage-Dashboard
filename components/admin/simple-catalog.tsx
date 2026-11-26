"use client";

import { useState } from "react";
import { useQuery } from "@/lib/hooks/use-query";
import { Card, PageHeader } from "@/components/ui/card";
import { Table, type Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/states";

/** List + create screen for flat catalogue entities (categories, specializations). */
export function SimpleCatalog<T extends { id: string; name: string }>({
  title,
  description,
  noun,
  list,
  create,
  withImageUrl,
  extraColumns = [],
}: {
  title: string;
  description: string;
  noun: string;
  list: () => Promise<T[]>;
  create: (body: { name: string; imageUrl?: string }) => Promise<unknown>;
  withImageUrl?: boolean;
  extraColumns?: Column<T>[];
}) {
  const { data, error, loading, reload } = useQuery(list, []);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      await create(withImageUrl && imageUrl.trim() ? { name: name.trim(), imageUrl: imageUrl.trim() } : { name: name.trim() });
      setFlash(`${noun} “${name.trim()}” created.`);
      setName("");
      setImageUrl("");
      reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const columns: Column<T>[] = [
    { key: "name", header: "Name", cell: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    ...extraColumns,
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
  ];

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title={`All ${title.toLowerCase()}`} bodyClassName="p-0" className="xl:col-span-2">
          <Table
            columns={columns}
            rows={data}
            rowKey={(r) => r.id}
            loading={loading}
            error={error}
            onRetry={reload}
            emptyTitle={`No ${title.toLowerCase()} yet`}
          />
        </Card>
        <Card title={`Add ${noun.toLowerCase()}`}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {formError && <Alert tone="error">{formError}</Alert>}
            {flash && <Alert tone="success">{flash}</Alert>}
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            {withImageUrl && (
              <Field label="Image URL (optional)">
                <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </Field>
            )}
            <Button type="submit" loading={saving}>
              Create {noun.toLowerCase()}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
