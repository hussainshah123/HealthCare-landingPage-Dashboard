"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import type { MapMarker } from "./types";

const COLORS: Record<MapMarker["kind"], string> = {
  rider: "#0d9488",
  pharmacy: "#ea580c",
  dropoff: "#4f46e5",
};

function FitBounds({ points, fitKey }: { points: LatLngTuple[]; fitKey: string }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) map.setView(points[0], 14);
    else map.fitBounds(points as LatLngBoundsExpression, { padding: [40, 40], maxZoom: 15 });
    // Refit only when the set of markers changes, not on every rider movement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, map]);
  return null;
}

export default function LeafletMap({
  markers,
  routes = [],
  className = "h-[480px]",
}: {
  markers: MapMarker[];
  routes?: LatLngTuple[][];
  className?: string;
}) {
  const valid = useMemo(
    () => markers.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng)),
    [markers],
  );
  const points = valid.map((m) => [m.lat, m.lng] as LatLngTuple);
  const fitKey = valid.map((m) => m.id).sort().join("|");
  const center: LatLngTuple = points[0] ?? [30.3753, 69.3451]; // Pakistan

  return (
    <div className={`${className} w-full overflow-hidden rounded-lg border border-slate-200`}>
      <MapContainer center={center} zoom={points.length ? 12 : 5} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} fitKey={fitKey} />
        {routes.map((r, i) => (
          <Polyline key={i} positions={r} pathOptions={{ color: "#94a3b8", weight: 2, dashArray: "6 6" }} />
        ))}
        {valid.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={m.kind === "rider" ? 9 : 7}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: COLORS[m.kind],
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <span className="text-xs">
                <strong>{m.label}</strong>
                {m.detail && (
                  <>
                    <br />
                    {m.detail}
                  </>
                )}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
