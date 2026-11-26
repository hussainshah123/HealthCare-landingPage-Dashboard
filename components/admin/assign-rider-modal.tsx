"use client";

import { useState } from "react";
import type { Order } from "@/types/api";
import { assignRider, listOnlineRiders } from "@/lib/api/admin";
import { asList } from "@/lib/api/client";
import { useQuery } from "@/lib/hooks/use-query";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, ErrorState, Spinner } from "@/components/ui/states";
import { cx } from "@/components/ui/cx";

export function AssignRiderModal({
  order,
  open,
  onClose,
  onAssigned,
}: {
  order: Order;
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const { data, error, loading, reload } = useQuery(() => (open ? listOnlineRiders() : Promise.resolve(null)), [open]);
  const riders = data ? asList(data) : undefined;
  const [riderId, setRiderId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function submit() {
    if (!riderId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await assignRider(order.id, riderId);
      onAssigned();
      onClose();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign a rider to #${order.orderNumber}`}
      description="Only riders who are online and approved are listed."
      footer={
        <>
          <Button variant="ghost" onClick={reload}>
            Refresh list
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!riderId} loading={saving}>
            Assign rider
          </Button>
        </>
      }
    >
      {saveError && (
        <div className="mb-3">
          <Alert tone="error">{saveError}</Alert>
        </div>
      )}
      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading && !riders ? (
        <Spinner label="Loading online riders…" />
      ) : !riders?.length ? (
        <EmptyState title="No riders online" description="Ask riders to go online in the mobile app, then refresh." />
      ) : (
        <ul className="flex flex-col gap-2" role="radiogroup">
          {riders.map((r) => (
            <li key={r.id}>
              <label
                className={cx(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm",
                  riderId === r.id ? "border-sky-500 bg-sky-50" : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <input
                  type="radio"
                  name="rider"
                  value={r.id}
                  checked={riderId === r.id}
                  onChange={() => setRiderId(r.id)}
                  className="h-4 w-4 text-sky-700"
                />
                <span className="flex-1">
                  <span className="block font-medium text-slate-900">{r.name}</span>
                  <span className="block text-xs text-slate-500">
                    {[r.phone, r.vehicleType, r.vehicleNumber].filter(Boolean).join(" · ") || "No vehicle details"}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
