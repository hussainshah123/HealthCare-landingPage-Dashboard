import type { LatLngTuple } from "leaflet";
import type { Delivery } from "@/types/api";
import type { LiveLocation } from "@/lib/hooks/use-tracking";
import type { MapMarker } from "./types";

export function deliveryMarkers(deliveries: Delivery[], locations: Record<string, LiveLocation>) {
  const markers: MapMarker[] = [];
  const routes: LatLngTuple[][] = [];
  for (const d of deliveries) {
    if (d.pharmacy && Number.isFinite(d.pharmacy.lat)) {
      markers.push({
        id: `p-${d.id}`,
        kind: "pharmacy",
        lat: d.pharmacy.lat,
        lng: d.pharmacy.lng,
        label: d.pharmacy.name,
        detail: `Pickup for #${d.orderNumber}`,
      });
    }
    if (d.dropoff && Number.isFinite(d.dropoff.lat)) {
      markers.push({
        id: `d-${d.id}`,
        kind: "dropoff",
        lat: d.dropoff.lat,
        lng: d.dropoff.lng,
        label: d.customerName,
        detail: `${d.dropoff.line1}, ${d.dropoff.city}`,
      });
    }
    const loc = locations[d.orderId];
    if (loc) {
      markers.push({
        id: `r-${d.id}`,
        kind: "rider",
        lat: loc.lat,
        lng: loc.lng,
        label: `Rider · #${d.orderNumber}`,
        detail: loc.recordedAt ? `Updated ${new Date(loc.recordedAt).toLocaleTimeString()}` : undefined,
      });
      if (d.dropoff && Number.isFinite(d.dropoff.lat)) {
        routes.push([
          [loc.lat, loc.lng],
          [d.dropoff.lat, d.dropoff.lng],
        ]);
      }
    }
  }
  return { markers, routes };
}
