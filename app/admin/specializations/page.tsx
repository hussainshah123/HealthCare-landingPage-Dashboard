"use client";

import type { Specialization } from "@/types/api";
import { createSpecialization, listSpecializations } from "@/lib/api/catalog";
import { SimpleCatalog } from "@/components/admin/simple-catalog";

export default function SpecializationsPage() {
  return (
    <SimpleCatalog<Specialization>
      title="Specializations"
      description="Medical specializations doctors can choose from."
      noun="Specialization"
      list={listSpecializations}
      create={({ name }) => createSpecialization({ name })}
    />
  );
}
