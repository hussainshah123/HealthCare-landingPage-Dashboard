"use client";

import { useState } from "react";
import { prescriptionFileUrl, reviewPrescription } from "@/lib/api/pharmacy";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/states";

/** Shows GET /prescriptions/:id/file and submits PATCH /prescriptions/:id/review. */
export function PrescriptionReviewModal({
  prescriptionId,
  orderNumber,
  open,
  onClose,
  onReviewed,
}: {
  prescriptionId: string;
  orderNumber: string;
  open: boolean;
  onClose: () => void;
  onReviewed: (approved: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileUrl = prescriptionFileUrl(prescriptionId);

  async function review(approved: boolean) {
    if (!approved && !note.trim()) {
      setError("Add a note explaining why the prescription is rejected.");
      return;
    }
    setSaving(approved ? "approve" : "reject");
    setError(null);
    try {
      await reviewPrescription(prescriptionId, approved, note.trim() || undefined);
      onReviewed(approved);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={`Prescription for order #${orderNumber}`}
      description="Check the prescription matches the ordered medicines before approving."
      footer={
        <>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mr-auto inline-flex h-10 items-center text-sm font-medium text-sky-700 hover:underline"
          >
            Open in new tab
          </a>
          <Button variant="danger" onClick={() => review(false)} loading={saving === "reject"} disabled={!!saving}>
            Reject
          </Button>
          <Button variant="success" onClick={() => review(true)} loading={saving === "approve"} disabled={!!saving}>
            Approve
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <Alert tone="error">{error}</Alert>}
        <iframe
          src={fileUrl}
          title="Prescription file"
          className="h-[55vh] w-full rounded-lg border border-slate-200 bg-slate-50"
        />
        <Field label="Review note" hint="Required when rejecting; shown to the customer.">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
