import type { Category, Medicine, MedicineInput, Paginated, Specialization } from "@/types/api";
import { request } from "./client";

// GET /categories → Category[]
export const listCategories = () => request<Category[]>("/categories");
// POST /categories (admin)
export const createCategory = (body: { name: string; imageUrl?: string }) =>
  request<Category>("/categories", { method: "POST", body });

// GET /medicines?search=&categoryId=&page=&limit=
export const listMedicines = (q: { search?: string; categoryId?: string; page?: number; limit?: number }) =>
  request<Paginated<Medicine>>("/medicines", { query: q });
// GET /medicines/:id
export const getMedicine = (id: string) => request<Medicine>(`/medicines/${encodeURIComponent(id)}`);
// POST /medicines · PATCH /medicines/:id (admin)
export const createMedicine = (body: MedicineInput) =>
  request<Medicine>("/medicines", { method: "POST", body });
export const updateMedicine = (id: string, body: Partial<MedicineInput>) =>
  request<Medicine>(`/medicines/${encodeURIComponent(id)}`, { method: "PATCH", body });

// GET /specializations · POST /specializations (admin)
export const listSpecializations = () => request<Specialization[]>("/specializations");
export const createSpecialization = (body: { name: string }) =>
  request<Specialization>("/specializations", { method: "POST", body });
