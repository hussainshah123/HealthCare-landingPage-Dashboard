import type {
  BulkInventoryResult,
  BulkInventoryRow,
  InventoryCreateInput,
  InventoryItem,
  InventoryUpdateInput,
  Order,
  OrderStatus,
  Paginated,
  PharmacyProfile,
  PharmacyProfileInput,
  PharmacySettableStatus,
  Prescription,
} from "@/types/api";
import { backendUrl, request } from "./client";

// GET /pharmacies/me · PATCH /pharmacies/me
export const getMyPharmacy = () => request<PharmacyProfile>("/pharmacies/me");
export const updateMyPharmacy = (body: PharmacyProfileInput) =>
  request<PharmacyProfile>("/pharmacies/me", { method: "PATCH", body });

// GET /inventory (paginated) · POST /inventory · PATCH /inventory/:id
export const listInventory = (q: { page?: number; limit?: number }) =>
  request<Paginated<InventoryItem>>("/inventory", { query: q });
export const createInventory = (body: InventoryCreateInput) =>
  request<InventoryItem>("/inventory", { method: "POST", body });
export const updateInventory = (id: string, body: InventoryUpdateInput) =>
  request<InventoryItem>(`/inventory/${encodeURIComponent(id)}`, { method: "PATCH", body });

// GET /orders/pharmacy?status= · PATCH /orders/:id/status { status, note? }
export const listPharmacyOrders = (q: { status?: OrderStatus | ""; page?: number; limit?: number }) =>
  request<Order[] | Paginated<Order>>("/orders/pharmacy", { query: q });
export const setOrderStatus = (id: string, status: PharmacySettableStatus, note?: string) =>
  request<Order>(`/orders/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: note ? { status, note } : { status },
  });

// GET /prescriptions/:id/file (streamed through the BFF) · PATCH /prescriptions/:id/review
export const prescriptionFileUrl = (id: string) => backendUrl(`/prescriptions/${encodeURIComponent(id)}/file`);
export const reviewPrescription = (id: string, approved: boolean, note?: string) =>
  request<Prescription>(`/prescriptions/${encodeURIComponent(id)}/review`, {
    method: "PATCH",
    body: note ? { approved, note } : { approved },
  });

// POST /inventory/bulk { rows, dryRun } — CSV import (dryRun previews without saving)
export const bulkImportInventory = (rows: BulkInventoryRow[], dryRun: boolean) =>
  request<BulkInventoryResult>("/inventory/bulk", { method: "POST", body: { rows, dryRun } });

/** GET /inventory/template.csv through the authenticated proxy. */
export const INVENTORY_TEMPLATE_URL = "/api/backend/inventory/template.csv";
