const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "PKR";

export function money(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: CURRENCY, maximumFractionDigits: 2 }).format(
      value,
    );
  } catch {
    return `${CURRENCY} ${value.toFixed(2)}`;
  }
}

export function num(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function dateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function dateOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { dateStyle: "medium" });
}

/** "READY_FOR_PICKUP" → "Ready for pickup" */
export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
