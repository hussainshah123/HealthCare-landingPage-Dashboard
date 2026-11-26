import type { Order } from "@/types/api";
import { dateTime, humanize, money } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";

export function OrderItemsTable({ order }: { order: Order }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-500 uppercase">
            <th className="py-2 pr-4 font-semibold">Medicine</th>
            <th className="py-2 pr-4 text-right font-semibold">Price</th>
            <th className="py-2 pr-4 text-right font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Line total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(order.items ?? []).map((i) => (
            <tr key={i.medicineId}>
              <td className="py-2 pr-4 text-slate-900">{i.name}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{money(i.price)}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{i.quantity}</td>
              <td className="py-2 text-right tabular-nums">{money(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-sm">
          <TotalRow label="Subtotal" value={money(order.subtotal)} />
          <TotalRow label="Delivery fee" value={money(order.deliveryFee)} />
          {order.discount > 0 && <TotalRow label="Discount" value={`− ${money(order.discount)}`} />}
          <TotalRow label="Total" value={money(order.total)} strong />
        </tfoot>
      </table>
    </div>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr>
      <td colSpan={3} className={`pt-2 pr-4 text-right ${strong ? "font-semibold text-slate-900" : "text-slate-500"}`}>
        {label}
      </td>
      <td className={`pt-2 text-right tabular-nums ${strong ? "font-semibold text-slate-900" : ""}`}>{value}</td>
    </tr>
  );
}

export function OrderHistory({ order }: { order: Order }) {
  const history = [...(order.history ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  if (!history.length) return <p className="text-sm text-slate-500">No status changes recorded yet.</p>;
  return (
    <ol className="relative ml-2 border-l border-slate-200">
      {history.map((h, idx) => (
        <li key={`${h.status}-${h.createdAt}-${idx}`} className="mb-4 ml-5 last:mb-0">
          <span
            className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ${
              idx === history.length - 1 ? "bg-sky-700" : "bg-slate-300"
            }`}
            aria-hidden
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={h.status} />
            <span className="text-xs text-slate-500">{dateTime(h.createdAt)}</span>
          </div>
          {h.note && <p className="mt-1 text-sm text-slate-600">{h.note}</p>}
        </li>
      ))}
    </ol>
  );
}

export function OrderMeta({ order }: { order: Order }) {
  const a = order.address;
  const rows: Array<[string, React.ReactNode]> = [
    ["Status", <StatusBadge key="s" status={order.status} />],
    ["Placed", dateTime(order.createdAt)],
    ["Pharmacy", order.pharmacy?.name ?? "—"],
    ["Payment", `${order.paymentMethod} · ${humanize(order.paymentStatus)}`],
    [
      "Delivery address",
      a ? [a.label, a.line1, a.line2, a.city].filter(Boolean).join(", ") || "—" : "—",
    ],
    ["Prescription", order.prescriptionId ? "Attached" : "Not required"],
  ];
  return (
    <dl className="grid gap-3 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-2">
          <dt className="text-slate-500">{k}</dt>
          <dd className="col-span-2 text-slate-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
