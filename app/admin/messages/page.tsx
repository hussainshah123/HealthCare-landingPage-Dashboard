"use client";

import { useState } from "react";
import type { ContactMessage } from "@/types/api";
import { listContactMessages, setContactMessageHandled } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { dateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

const TOPIC: Record<ContactMessage["topic"], { label: string; tone: "blue" | "teal" | "purple" | "orange" | "gray" }> = {
  CUSTOMER: { label: "Customer", tone: "blue" },
  PHARMACY: { label: "Pharmacy", tone: "teal" },
  DOCTOR: { label: "Doctor", tone: "purple" },
  RIDER: { label: "Rider", tone: "orange" },
  OTHER: { label: "General", tone: "gray" },
};

const FILTERS = [
  { key: "new", label: "New", handled: false },
  { key: "handled", label: "Handled", handled: true },
  { key: "all", label: "All", handled: undefined },
] as const;

export default function AdminMessagesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("new");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const handled = FILTERS.find((f) => f.key === filter)?.handled;
  const { data, error, loading, reload } = useQuery(
    () => listContactMessages({ handled, page }),
    [handled, page],
  );

  const toggle = async (m: ContactMessage) => {
    setBusy(m.id);
    setActionError(null);
    try {
      await setContactMessageHandled(m.id, !m.handled);
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update the message.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Enquiries sent from the website's contact form."
        actions={
          <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Filter messages">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  filter === f.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {actionError && <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>}

      {loading && !data ? (
        <Card>
          <p className="text-sm text-slate-500">Loading messages…</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-rose-700">{String(error)}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={reload}>
            Try again
          </Button>
        </Card>
      ) : !data?.items.length ? (
        <Card>
          <p className="py-6 text-center text-sm text-slate-500">
            {filter === "new" ? "No new messages. You're all caught up." : "No messages here yet."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {data.items.map((m) => (
            <li key={m.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{m.name}</p>
                      <Badge tone={TOPIC[m.topic]?.tone ?? "gray"}>{TOPIC[m.topic]?.label ?? m.topic}</Badge>
                      {m.handled ? <Badge tone="green">Handled</Badge> : <Badge tone="yellow">New</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      <a href={`mailto:${m.email}`} className="text-sky-700 hover:underline">
                        {m.email}
                      </a>
                      {m.phone ? (
                        <>
                          {" · "}
                          <a href={`tel:${m.phone.replace(/\s+/g, "")}`} className="text-sky-700 hover:underline">
                            {m.phone}
                          </a>
                        </>
                      ) : null}
                      {" · "}
                      {dateTime(m.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to MediGo")}`}
                      className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
                    >
                      Reply by email
                    </a>
                    <Button
                      size="sm"
                      variant={m.handled ? "secondary" : "success"}
                      loading={busy === m.id}
                      onClick={() => toggle(m)}
                    >
                      {m.handled ? "Mark as new" : "Mark handled"}
                    </Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{m.message}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {data && data.total > data.limit && (
        <div className="mt-4">
          <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
