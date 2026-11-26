"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/*
 * Small, dependency-free SVG charts for the admin dashboard.
 * Every chart here is single-series, so it uses one validated brand blue
 * (#0369a1, passes the dataviz palette checks on the white card surface),
 * 2px lines with a ~10% area wash, hairline solid gridlines, and text in ink
 * colours (never the series colour). Hover/focus tooltips enhance; the same
 * numbers stay reachable through labels or a data table.
 */

const SERIES = "#0369a1";
const GRID = "#e5eef5";
const AXIS_TEXT = "#64748b";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/**
 * Clean axis maximum and tick step (1, 2, 2.5 or 5 × 10^n). Counts get whole
 * steps only, so an axis of orders never shows "2.5".
 */
function niceScale(max: number, integer: boolean, ticks = 4) {
  if (max <= 0) return { top: ticks, step: 1 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const steps = (integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10]).map((m) => m * mag);
  let step = steps.find((s) => s >= raw) ?? 10 * mag;
  if (integer) step = Math.max(1, Math.round(step));
  return { top: step * Math.ceil(max / step), step };
}

function compact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${+(n / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-US").format(n);
}

function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

/** Animated number that counts up to `value` (snaps instantly for reduced motion). */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    if (reduce) {
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const eased = 1 - (1 - p) ** 3;
      setShown(a + (value - a) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <>{format(reduce ? value : shown)}</>;
}

/** Tiny trend line for a stat card. Decorative: the card shows the number in text. */
export function Sparkline({ values, height = 40 }: { values: number[]; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const id = useId();
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [
    values.length > 1 ? (i / (values.length - 1)) * (width - 6) + 3 : width / 2,
    height - 4 - (v / max) * (height - 10),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <div ref={ref} className="h-10 w-full" aria-hidden="true">
      {width > 0 && values.length > 0 ? (
        <svg width={width} height={height}>
          <defs>
            <linearGradient id={`sp${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={SERIES} stopOpacity="0.18" />
              <stop offset="1" stopColor={SERIES} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${last[0]} ${height} L${pts[0][0]} ${height} Z`} fill={`url(#sp${id})`} />
          <path d={line} fill="none" stroke={SERIES} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={last[0]} cy={last[1]} r="4" fill={SERIES} stroke="#fff" strokeWidth="2" />
        </svg>
      ) : null}
    </div>
  );
}

/**
 * Area chart over days with a snapping crosshair + tooltip (pointer and
 * arrow keys) and a data-table fallback. Holds its previous render, dimmed,
 * while `busy`.
 */
export function TrendChart({
  points,
  label,
  format,
  busy = false,
  integer = false,
  height = 280,
}: {
  points: { date: string; value: number }[];
  label: string;
  format: (n: number) => string;
  busy?: boolean;
  /** Whole-number data (counts): ticks stay whole numbers. */
  integer?: boolean;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const gradId = useId();
  const pad = { top: 16, right: 16, bottom: 28, left: 52 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(0, ...points.map((p) => p.value));
  const { top, step } = niceScale(max, integer);

  const xy = useMemo(
    () =>
      points.map((p, i) => ({
        x: pad.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : innerW / 2),
        y: pad.top + innerH - (p.value / top) * innerH,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points, innerW, innerH, top],
  );
  const line = xy.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = xy.length ? `${line} L${xy[xy.length - 1].x} ${pad.top + innerH} L${xy[0].x} ${pad.top + innerH} Z` : "";

  // x labels: about 6, always including the last day
  const every = Math.max(1, Math.ceil(points.length / 6));
  const ticksY = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);

  const indexAt = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left - pad.left;
    const i = Math.round((x / Math.max(innerW, 1)) * (points.length - 1));
    return Math.max(0, Math.min(points.length - 1, i));
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => setHover(indexAt(e.clientX, e.currentTarget.getBoundingClientRect()));
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!points.length) return;
    if (e.key === "ArrowRight") setHover((h) => Math.min(points.length - 1, (h ?? -1) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? points.length) - 1));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  const h = hover !== null ? xy[hover] : null;
  const tipLeft = h ? Math.min(Math.max(h.x, 70), width - 70) : 0;

  return (
    <div>
      <div ref={ref} className={`relative transition-opacity duration-300 ${busy ? "opacity-50" : ""}`}>
        {width > 0 ? (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label} per day. Use the arrow keys to read each day.`}
            tabIndex={0}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onKeyDown={onKey}
            onBlur={() => setHover(null)}
            className="block touch-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <defs>
              <linearGradient id={`g${gradId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={SERIES} stopOpacity="0.16" />
                <stop offset="1" stopColor={SERIES} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticksY.map((t) => {
              const y = pad.top + innerH - (t / top) * innerH;
              return (
                <g key={t}>
                  <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke={GRID} strokeWidth="1" />
                  <text x={pad.left - 10} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>
                    {compact(t)}
                  </text>
                </g>
              );
            })}
            {points.map((p, i) =>
              i % every === 0 || i === points.length - 1 ? (
                <text key={p.date} x={xy[i].x} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>
                  {shortDate(p.date)}
                </text>
              ) : null,
            )}
            <path d={area} fill={`url(#g${gradId})`} />
            <path
              key={`${points.length}-${top}`}
              d={line}
              fill="none"
              stroke={SERIES}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={reduce ? undefined : { strokeDasharray: 1, strokeDashoffset: 1, animation: "lp-draw 1.1s ease-out forwards" }}
            />
            {xy.length ? (
              <circle cx={xy[xy.length - 1].x} cy={xy[xy.length - 1].y} r="4" fill={SERIES} stroke="#fff" strokeWidth="2" />
            ) : null}
            {h ? (
              <g pointerEvents="none">
                <line x1={h.x} x2={h.x} y1={pad.top} y2={pad.top + innerH} stroke="#94a3b8" strokeWidth="1" />
                <circle cx={h.x} cy={h.y} r="5" fill={SERIES} stroke="#fff" strokeWidth="2" />
              </g>
            ) : null}
          </svg>
        ) : (
          <div style={{ height }} />
        )}
        {h && hover !== null ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-xl bg-[#0b2135] px-3 py-2 text-white shadow-xl"
            style={{ left: tipLeft, top: Math.max(0, h.y - 64) }}
            role="status"
          >
            <p className="text-base font-bold tabular-nums">{format(points[hover].value)}</p>
            <p className="flex items-center gap-1.5 text-xs text-sky-100">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: "#7dd3fc" }} aria-hidden />
              {label} · {shortDate(points[hover].date)}
            </p>
          </div>
        ) : null}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-sky-700">Show data table</summary>
        <div className="mt-2 max-h-56 overflow-auto rounded-lg ring-1 ring-sky-100">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-sky-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-semibold">Day</th>
                <th className="px-3 py-2 text-right font-semibold">{label}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.date} className="border-t border-sky-50">
                  <td className="px-3 py-1.5">{shortDate(p.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{format(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/**
 * Horizontal bars, one hue, value at the tip. Bars grow from the baseline on
 * mount; the whole row is the hover/focus target.
 */
export function BarList({
  items,
  format = (n) => new Intl.NumberFormat("en-US").format(n),
  empty = "No data for this period.",
}: {
  /** `id` keeps rows distinct when two labels are the same (e.g. two pharmacies with one name). */
  items: { id?: string; label: string; value: number; hint?: string }[];
  format?: (n: number) => string;
  empty?: string;
}) {
  const reduce = useReducedMotion();
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(t);
  }, []);
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="py-6 text-center text-sm text-slate-500">{empty}</p>;
  return (
    <ul className="space-y-3.5">
      {items.map((it, index) => {
        const pct = (it.value / max) * 100;
        return (
          <li key={it.id ?? `${it.label}-${index}`} className="group" tabIndex={0} aria-label={`${it.label}: ${format(it.value)}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium text-slate-700">
                {it.label}
                {it.hint ? <span className="ml-1.5 text-xs font-normal text-slate-400">{it.hint}</span> : null}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1">
                <div
                  className="h-full rounded-r-[4px] transition-[width,opacity] duration-700 ease-out group-hover:opacity-80 group-focus-visible:opacity-80"
                  style={{ width: `${reduce || grown ? Math.max(pct, 1.5) : 0}%`, background: SERIES }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900">{format(it.value)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
