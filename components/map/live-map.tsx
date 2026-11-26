"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/states";

/** Leaflet touches `window`, so the map is only rendered in the browser. */
export const LiveMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
      <Spinner label="Loading map…" />
    </div>
  ),
});

export function MapLegend() {
  const items = [
    { color: "bg-teal-600", label: "Rider" },
    { color: "bg-orange-600", label: "Pharmacy" },
    { color: "bg-indigo-600", label: "Drop-off" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${i.color}`} aria-hidden />
          {i.label}
        </span>
      ))}
    </div>
  );
}
