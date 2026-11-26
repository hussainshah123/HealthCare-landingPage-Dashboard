"use client";

import { useState } from "react";
import type { Order, OrderStatus, PharmacySettableStatus } from "@/types/api";
import { setOrderStatus } from "@/lib/api/pharmacy";
import { humanize } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/states";

/** Next statuses a pharmacy may set (API.md: CONFIRMED, PREPARING, READY_FOR_PICKUP, CANCELLED). */
export function nextPharmacyStatuses(status: OrderStatus): PharmacySettableStatus[] {
  switch (status) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];
    case "PRESCRIPTION_UNDER_REVIEW":
      return ["CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["PREPARING", "CANCELLED"];
    case "PREPARING":
      return ["READY_FOR_PICKUP", "CANCELLED"];
    case "READY_FOR_PICKUP":
      return ["CANCELLED"];
    default:
      return [];
  }
}

const LABEL: Record<PharmacySettableStatus, string> = {
  CONFIRMED: "Confirm",
  PREPARING: "Start preparing",
  READY_FOR_PICKUP: "Ready for pickup",
  CANCELLED: "Cancel",
};

export function OrderStatusActions({
  order,
  onChanged,
  size = "sm",
}: {
  order: Order;
  onChanged: (order: Order | null, status: PharmacySettableStatus) => void;
  size?: "sm" | "md";
}) {
  const [target, setTarget] = useState<PharmacySettableStatus | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = nextPharmacyStatuses(order.status);
  if (!options.length) return null;

  async function submit() {
    if (!target) return;
    if (target === "CANCELLED" && !note.trim()) {
      setError("Please give a reason for cancelling.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await setOrderStatus(order.id, target, note.trim() || undefined);
      onChanged(updated ?? null, target);
      setTarget(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        {options.map((s) => (
          <Button
            key={s}
            size={size}
            variant={s === "CANCELLED" ? "secondary" : "primary"}
            onClick={(e) => {
              e.stopPropagation();
              setTarget(s);
              setNote("");
              setError(null);
            }}
          >
            {LABEL[s]}
          </Button>
        ))}
      </div>
      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title={target ? `${LABEL[target]} – order #${order.orderNumber}` : ""}
        description={target ? `Status will change from ${humanize(order.status)} to ${humanize(target)}.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              Back
            </Button>
            <Button variant={target === "CANCELLED" ? "danger" : "primary"} onClick={submit} loading={saving}>
              {target ? LABEL[target] : "Confirm"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {error && <Alert tone="error">{error}</Alert>}
          <Field label={target === "CANCELLED" ? "Reason" : "Note (optional)"}>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
