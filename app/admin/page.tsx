"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminAnalytics, AnalyticsTotals } from "@/types/api";
import { getAnalytics } from "@/lib/api/admin";
import { useQuery } from "@/lib/hooks/use-query";
import { humanize, money, num } from "@/lib/format";
import { Icon, type IconName } from "@/components/landing/icons";
import { BarList, CountUp, Sparkline, TrendChart } from "@/components/admin/charts";
import { ErrorState } from "@/components/ui/states";

type Days = 7 | 30 | 90;
type Metric = keyof AnalyticsTotals;

const RANGES: { days: Days; label: string }[] = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

const METRICS: { key: Metric; label: string; icon: IconName; format: (n: number) => string }[] = [
  { key: "orders", label: "Orders", icon: "package", format: (n) => num(Math.round(n)) },
  { key: "orderValue", label: "Order value", icon: "wallet", format: (n) => money(Math.round(n)) },
  { key: "newUsers", label: "New sign-ups", icon: "users", format: (n) => num(Math.round(n)) },
  { key: "deliveries", label: "Deliveries", icon: "truck", format: (n) => num(Math.round(n)) },
  { key: "appointments", label: "Appointments", icon: "calendar", format: (n) => num(Math.round(n)) },
];

const REFRESH_MS = 30_000;

function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) return <span className="text-xs text-slate-400">No change</span>;
  if (before === 0) return <span className="text-xs font-semibold text-sky-700">New this period</span>;
  const pct = ((now - before) / before) * 100;
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
    >
      <Icon name={up ? "arrowUp" : "arrowDown"} size={12} strokeWidth={2.6} />
      {Math.abs(pct).toFixed(pct > -10 && pct < 10 ? 1 : 0)}%
      <span className="sr-only">{up ? "increase" : "decrease"} vs previous period</span>
    </span>
  );
}

function KpiCard({
  metric,
  data,
  active,
  onSelect,
}: {
  metric: (typeof METRICS)[number];
  data: AdminAnalytics;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-[0_12px_32px_-20px_rgba(3,105,161,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(3,105,161,0.5)] ${
        active ? "border-sky-300 ring-4 ring-sky-100" : "border-sky-100/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
            active ? "bg-gradient-to-br from-sky-400 to-sky-700 text-white shadow-lg shadow-sky-700/30" : "bg-sky-50 text-sky-700"
          }`}
        >
          <Icon name={metric.icon} size={18} />
        </span>
        <Delta now={data.totals[metric.key]} before={data.previous[metric.key]} />
      </div>
      <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">{metric.label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b2135] tabular-nums">
        <CountUp value={data.totals[metric.key]} format={metric.format} />
      </p>
      <div className="mt-3">
        <Sparkline values={data.series.map((p) => p[metric.key])} />
      </div>
    </button>
  );
}

function LiveTile({
  icon,
  label,
  value,
  href,
  attention = false,
}: {
  icon: IconName;
  label: string;
  value: number;
  href: string;
  attention?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15"
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-sky-700">
        <Icon name={icon} size={20} />
        {attention && value > 0 ? (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-[#0369a1]" aria-hidden />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-2xl font-extrabold tabular-nums text-white">
          <CountUp value={value} format={(n) => num(Math.round(n))} />
        </span>
        <span className="block truncate text-xs font-medium text-sky-100">{label}</span>
      </span>
      <Icon name="arrowRight" size={16} className="ml-auto text-sky-200 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-sky-100/80 bg-white p-5 shadow-[0_12px_32px_-20px_rgba(3,105,161,0.35)] sm:p-6 ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0b2135]">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function AdminOverviewPage() {
  const [days, setDays] = useState<Days>(30);
  const [metric, setMetric] = useState<Metric>("orders");
  const { data, error, loading, reload } = useQuery(() => getAnalytics(days), [days]);

  // Live dashboard: refresh in the background while the tab is visible.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") reload();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [reload]);

  const updatedAt = data ? new Date(data.to) : null;
  const m = METRICS.find((x) => x.key === metric)!;
  const rangeLabel = RANGES.find((r) => r.days === days)!.label.toLowerCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner with live counters */}
      <section className="relative overflow-hidden rounded-3xl bg-[radial-gradient(700px_300px_at_100%_0%,rgba(125,211,252,0.35),transparent_60%),linear-gradient(135deg,#024873_0%,#0369a1_55%,#0ea5e9_100%)] p-6 text-white shadow-[0_24px_60px_-30px_rgba(3,105,161,0.8)] sm:p-8">
        <span className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-56 rounded-full border border-white/15" aria-hidden />
        <span className="pointer-events-none absolute right-24 -top-20 h-48 w-48 rounded-full border border-white/10" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              Live
              {updatedAt ? (
                <span className="font-normal text-sky-100">
                  · updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              ) : null}
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Platform overview</h1>
            <p className="mt-1 text-sm text-sky-100">Orders, people and deliveries across MediGo, right now.</p>
          </div>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <LiveTile icon="truck" label="Active deliveries" value={data?.live.activeDeliveries ?? 0} href="/admin/deliveries" />
          <LiveTile icon="bike" label="Riders online" value={data?.live.ridersOnline ?? 0} href="/admin/riders" />
          <LiveTile
            icon="shield"
            label="Pending approvals"
            value={data?.live.pendingApprovals ?? 0}
            href="/admin/users?status=PENDING"
            attention
          />
          <LiveTile icon="inbox" label="New messages" value={data?.live.newMessages ?? 0} href="/admin/messages" attention />
        </div>
      </section>

      {/* Filters: one row, scoping everything below */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-sky-100" role="radiogroup" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              role="radio"
              aria-checked={days === r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                days === r.days ? "bg-gradient-to-r from-sky-700 to-sky-500 text-white shadow" : "text-slate-600 hover:text-sky-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-sky-100 hover:text-sky-700"
        >
          <Icon name="refresh" size={15} className={loading ? "animate-spin motion-reduce:animate-none" : ""} />
          Refresh
        </button>
        <span className="text-xs text-slate-500">Changes are compared with the {days} days before.</span>
      </div>

      {error && !data ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true">
          {METRICS.map((x) => (
            <div key={x.key} className="h-[184px] animate-pulse rounded-2xl bg-white ring-1 ring-sky-100" />
          ))}
        </div>
      ) : (
        <>
          <div className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-5 ${loading ? "opacity-70" : ""}`}>
            {METRICS.map((x) => (
              <KpiCard key={x.key} metric={x} data={data} active={metric === x.key} onSelect={() => setMetric(x.key)} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel
              className="xl:col-span-2"
              title={`${m.label} per day`}
              description={`${m.format(data.totals[metric])} in the ${rangeLabel}. Pick a card above to change the chart.`}
            >
              <TrendChart
                points={data.series.map((p) => ({ date: p.date, value: p[metric] }))}
                label={m.label}
                format={m.format}
                integer={metric !== "orderValue"}
                busy={loading}
              />
            </Panel>

            <Panel title="Order pipeline" description={`Orders placed in the ${rangeLabel}, by current status.`}>
              <BarList
                items={data.ordersByStatus.map((s) => ({ label: humanize(s.status), value: s.count }))}
                empty="No orders in this period."
              />
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel
              title="Top pharmacies"
              description={`By orders, ${rangeLabel}.`}
              action={
                <Link href="/admin/pharmacies" className="text-sm font-semibold text-sky-700 hover:underline">
                  View all
                </Link>
              }
            >
              <BarList
                items={data.topPharmacies.map((p) => ({ id: p.id, label: p.name, value: p.orders, hint: money(p.orderValue) }))}
                empty="No pharmacy orders yet."
              />
            </Panel>
            <Panel title="Best-selling medicines" description={`Units sold, ${rangeLabel}.`}>
              <BarList items={data.topMedicines.map((t) => ({ label: t.name, value: t.quantity }))} empty="No sales yet." />
            </Panel>
            <Panel
              title="People on the platform"
              description="All accounts, by role."
              action={
                <Link href="/admin/users" className="text-sm font-semibold text-sky-700 hover:underline">
                  Manage
                </Link>
              }
            >
              <BarList items={data.usersByRole.map((r) => ({ label: humanize(r.role), value: r.count }))} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
