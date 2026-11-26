export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  kind: "rider" | "pharmacy" | "dropoff";
  label: string;
  detail?: string;
}
