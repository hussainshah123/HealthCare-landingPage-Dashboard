import { humanize } from "@/lib/format";
import { cx } from "./cx";

type Tone = "gray" | "green" | "yellow" | "red" | "blue" | "purple" | "teal" | "orange";

const tones: Record<Tone, string> = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
  teal: "bg-sky-50 text-sky-700 ring-sky-200",
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function Badge({ tone = "gray", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONES: Record<string, Tone> = {
  // account
  ACTIVE: "green",
  PENDING: "yellow",
  REJECTED: "red",
  SUSPENDED: "orange",
  // orders
  PRESCRIPTION_UNDER_REVIEW: "purple",
  CONFIRMED: "blue",
  PREPARING: "blue",
  READY_FOR_PICKUP: "teal",
  RIDER_ASSIGNED: "teal",
  PICKED_UP: "teal",
  ON_THE_WAY: "teal",
  DELIVERED: "green",
  CANCELLED: "red",
  RETURNED: "orange",
  // deliveries
  ASSIGNED: "blue",
  // appointments
  REQUESTED: "yellow",
  IN_PROGRESS: "teal",
  COMPLETED: "green",
  // prescriptions / payments
  APPROVED: "green",
  PAID: "green",
  SUCCEEDED: "green",
  FAILED: "red",
  REFUNDED: "orange",
  UNPAID: "yellow",
  // roles
  ADMIN: "purple",
  DOCTOR: "blue",
  RIDER: "teal",
  PHARMACY: "orange",
  CUSTOMER: "gray",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <Badge>—</Badge>;
  return <Badge tone={STATUS_TONES[status] ?? "gray"}>{humanize(status)}</Badge>;
}
