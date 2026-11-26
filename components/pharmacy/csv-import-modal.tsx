"use client";

import { useRef, useState, type DragEvent } from "react";
import type { BulkInventoryResult, BulkInventoryRow } from "@/types/api";
import { bulkImportInventory, INVENTORY_TEMPLATE_URL } from "@/lib/api/pharmacy";
import { parseCsv } from "@/lib/csv";
import { Icon } from "@/components/landing/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/states";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 2000;

/** Header names we accept for each field (lower-case, spaces/underscores ignored). */
const HEADERS: Record<keyof Omit<BulkInventoryRow, "row">, string[]> = {
  medicine: ["medicine", "medicinename", "name", "product", "item"],
  price: ["price", "saleprice", "rate", "mrp"],
  stock: ["stock", "quantity", "qty", "units"],
  batchNumber: ["batchnumber", "batch", "batchno", "lot"],
  expiryDate: ["expirydate", "expiry", "exp", "expires"],
};

function toRows(text: string): { rows: BulkInventoryRow[]; error?: string } {
  const table = parseCsv(text);
  if (table.length < 2) return { rows: [], error: "The file has no data rows under the header." };
  const header = table[0].map((h) => h.toLowerCase().replace(/[\s_-]+/g, ""));
  const col = Object.fromEntries(
    Object.entries(HEADERS).map(([field, names]) => [field, header.findIndex((h) => names.includes(h))]),
  ) as Record<keyof typeof HEADERS, number>;
  const missing = (["medicine", "price", "stock"] as const).filter((f) => col[f] < 0);
  if (missing.length) {
    return { rows: [], error: `Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Use the template.` };
  }
  if (table.length - 1 > MAX_ROWS) return { rows: [], error: `Please upload at most ${MAX_ROWS} rows at a time.` };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : undefined);
  const rows = table.slice(1).map((r, i) => ({
    row: i + 2, // spreadsheet row number (header is row 1)
    medicine: get(r, col.medicine),
    price: get(r, col.price),
    stock: get(r, col.stock),
    batchNumber: get(r, col.batchNumber),
    expiryDate: get(r, col.expiryDate),
  }));
  // Template rows left without price and stock are "not stocked": skip them quietly.
  return { rows: rows.filter((r) => r.price || r.stock || r.batchNumber || r.expiryDate) };
}

type Step =
  | { kind: "pick" }
  | { kind: "checking"; fileName: string }
  | { kind: "preview"; fileName: string; rows: BulkInventoryRow[]; result: BulkInventoryResult }
  | { kind: "importing"; fileName: string }
  | { kind: "done"; result: BulkInventoryResult };

export function CsvImportModal({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported: () => void }) {
  const [step, setStep] = useState<Step>({ kind: "pick" });
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep({ kind: "pick" });
    setError(null);
  };
  const close = () => {
    reset();
    onClose();
  };

  const handleFile = async (file: File) => {
    setError(null);
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      setError("Please choose a .csv file. In Excel: File → Save As → CSV.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is larger than 2 MB. Split it into smaller files.");
      return;
    }
    const { rows, error: parseError } = toRows(await file.text());
    if (parseError) {
      setError(parseError);
      return;
    }
    if (!rows.length) {
      setError("No rows with a price or stock were found. Fill in price and stock for the items you sell.");
      return;
    }
    setStep({ kind: "checking", fileName: file.name });
    try {
      const result = await bulkImportInventory(rows, true);
      setStep({ kind: "preview", fileName: file.name, rows, result });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check the file.");
      setStep({ kind: "pick" });
    }
  };

  const confirm = async () => {
    if (step.kind !== "preview") return;
    const good = new Set(step.result.rows.filter((r) => r.status !== "error").map((r) => r.row));
    const rows = step.rows.filter((r) => good.has(r.row));
    setStep({ kind: "importing", fileName: step.fileName });
    try {
      const result = await bulkImportInventory(rows, false);
      setStep({ kind: "done", result });
      onImported();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed. Nothing was saved.");
      setStep({ kind: "pick" });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  const ok = step.kind === "preview" ? step.result.created + step.result.updated : 0;

  return (
    <Modal
      open={open}
      onClose={close}
      size="xl"
      title="Import inventory from CSV"
      description="Add or update many items at once. Existing items are updated, new ones are added."
      footer={
        step.kind === "preview" ? (
          <>
            <Button variant="secondary" onClick={reset}>
              Choose another file
            </Button>
            <Button onClick={confirm} disabled={ok === 0}>
              Import {ok} item{ok === 1 ? "" : "s"}
            </Button>
          </>
        ) : step.kind === "done" ? (
          <Button onClick={close}>Done</Button>
        ) : (
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        )
      }
    >
      {error && (
        <div className="mb-4">
          <Alert tone="error" title="Can't use this file">
            {error}
          </Alert>
        </div>
      )}

      {(step.kind === "pick" || step.kind === "checking") && (
        <div className="space-y-5">
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              { n: 1, t: "Download the template", d: "It lists every medicine in the catalogue with your current prices." },
              { n: 2, t: "Fill in price and stock", d: "Leave a row empty if you don't sell it. Batch and expiry are optional." },
              { n: 3, t: "Upload it here", d: "We check every row first and show you before anything is saved." },
            ].map((s) => (
              <li key={s.n} className="rounded-xl bg-sky-50/70 p-4 ring-1 ring-sky-100">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-sky-700 text-xs font-bold text-white">
                  {s.n}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-900">{s.t}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.d}</p>
              </li>
            ))}
          </ol>

          <a
            href={INVENTORY_TEMPLATE_URL}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50"
          >
            <Icon name="download" size={16} /> Download template (.csv)
          </a>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-sky-400 bg-sky-50" : "border-sky-200 bg-white"
            }`}
          >
            {step.kind === "checking" ? (
              <>
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 motion-reduce:animate-none" />
                <p className="mt-4 text-sm font-semibold text-slate-900">Checking {step.fileName}…</p>
              </>
            ) : (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-700 text-white shadow-lg shadow-sky-700/30">
                  <Icon name="file" size={22} />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-900">Drag your CSV file here</p>
                <p className="mt-1 text-xs text-slate-500">Columns: medicine, price, stock (+ optional batchNumber, expiryDate)</p>
                <Button className="mt-4" variant="secondary" onClick={() => inputRef.current?.click()}>
                  Choose file
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="sr-only"
                  aria-label="CSV file"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) void handleFile(f);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {step.kind === "preview" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Summary tone="sky" label="New items" value={step.result.created} />
            <Summary tone="emerald" label="Will be updated" value={step.result.updated} />
            <Summary tone="rose" label="Need fixing (skipped)" value={step.result.failed} />
          </div>
          {step.result.failed > 0 && (
            <Alert tone="warning" title={`${step.result.failed} row${step.result.failed === 1 ? "" : "s"} will be skipped`}>
              Fix them in your spreadsheet and upload again later, or import the good rows now.
            </Alert>
          )}
          <div className="max-h-80 overflow-auto rounded-xl ring-1 ring-sky-100">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-sky-50 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Row</th>
                  <th className="px-3 py-2 font-semibold">Medicine</th>
                  <th className="px-3 py-2 font-semibold">Price</th>
                  <th className="px-3 py-2 font-semibold">Stock</th>
                  <th className="px-3 py-2 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {step.result.rows.map((r) => {
                  const src = step.rows.find((x) => x.row === r.row);
                  return (
                    <tr key={r.row} className={`border-t border-sky-50 ${r.status === "error" ? "bg-rose-50/40" : ""}`}>
                      <td className="px-3 py-2 tabular-nums text-slate-500">{r.row}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{r.medicine || "—"}</td>
                      <td className="px-3 py-2 tabular-nums">{src?.price || "—"}</td>
                      <td className="px-3 py-2 tabular-nums">{src?.stock || "—"}</td>
                      <td className="px-3 py-2">
                        {r.status === "error" ? (
                          <span className="text-xs text-rose-700">{r.reason}</span>
                        ) : r.status === "create" ? (
                          <Badge tone="blue">New</Badge>
                        ) : (
                          <Badge tone="green">Update</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">From {step.fileName}. Nothing has been saved yet.</p>
        </div>
      )}

      {step.kind === "importing" && (
        <div className="flex flex-col items-center py-12">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 motion-reduce:animate-none" />
          <p className="mt-4 text-sm font-semibold text-slate-900">Importing…</p>
        </div>
      )}

      {step.kind === "done" && (
        <div className="flex flex-col items-center py-8 text-center" role="status">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-600/30">
            <Icon name="check" size={28} strokeWidth={3} />
          </span>
          <p className="mt-4 text-lg font-bold text-slate-900">Inventory updated</p>
          <p className="mt-1 text-sm text-slate-500">
            {step.result.created} added · {step.result.updated} updated
            {step.result.failed ? ` · ${step.result.failed} skipped` : ""}
          </p>
        </div>
      )}
    </Modal>
  );
}

function Summary({ tone, label, value }: { tone: "sky" | "emerald" | "rose"; label: string; value: number }) {
  const t = {
    sky: "bg-sky-50 text-sky-800 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    rose: "bg-rose-50 text-rose-800 ring-rose-100",
  }[tone];
  return (
    <div className={`rounded-xl p-4 ring-1 ${t}`}>
      <p className="text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}
