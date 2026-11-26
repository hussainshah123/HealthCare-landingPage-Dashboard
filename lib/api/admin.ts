import type {
  AccountStatus,
  AdminStats,
  AdminUser,
  Appointment,
  AppointmentStatus,
  Delivery,
  OnlineRider,
  Order,
  OrderStatus,
  Paginated,
  Payment,
  PlatformSettings,
  Role,
} from "@/types/api";
import type { ContactMessage } from "@/types/api";
import { request } from "./client";

// GET /admin/stats
export const getStats = () => request<AdminStats>("/admin/stats");

// GET /admin/users?role=&status=&search=&page=&limit=
export const listUsers = (q: {
  role?: Role | "";
  status?: AccountStatus | "";
  search?: string;
  page?: number;
  limit?: number;
}) => request<Paginated<AdminUser>>("/admin/users", { query: q });

// PATCH /admin/users/:id/status { status: ACTIVE|REJECTED|SUSPENDED, note? }
export type AdminSettableStatus = Exclude<AccountStatus, "PENDING">;
export const setUserStatus = (id: string, status: AdminSettableStatus, note?: string) =>
  request<AdminUser>(`/admin/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: note ? { status, note } : { status },
  });

// GET /admin/orders?status=&search=&page=
export const listOrders = (q: { status?: OrderStatus | ""; search?: string; page?: number }) =>
  request<Paginated<Order>>("/admin/orders", { query: q });

// GET /admin/orders/:id
export const getOrder = (id: string) => request<Order>(`/admin/orders/${encodeURIComponent(id)}`);

// POST /admin/deliveries/assign { orderId, riderId }
export const assignRider = (orderId: string, riderId: string) =>
  request<Delivery>("/admin/deliveries/assign", { method: "POST", body: { orderId, riderId } });

// GET /admin/deliveries/active
export const listActiveDeliveries = () =>
  request<Delivery[] | Paginated<Delivery>>("/admin/deliveries/active");

// GET /admin/riders/online
export const listOnlineRiders = () => request<OnlineRider[] | Paginated<OnlineRider>>("/admin/riders/online");

// GET /admin/appointments?status=&page=
export const listAppointments = (q: { status?: AppointmentStatus | ""; page?: number }) =>
  request<Paginated<Appointment>>("/admin/appointments", { query: q });

// GET /admin/payments?page=
export const listPayments = (q: { page?: number }) =>
  request<Paginated<Payment>>("/admin/payments", { query: q });

// GET /admin/settings · PUT /admin/settings
export const getSettings = () => request<PlatformSettings>("/admin/settings");
export const updateSettings = (body: PlatformSettings) =>
  request<PlatformSettings>("/admin/settings", { method: "PUT", body });

// GET /contact?handled=&page= · PATCH /contact/:id { handled }  (website contact form messages)
export const listContactMessages = (q: { handled?: boolean; page?: number }) =>
  request<Paginated<ContactMessage>>("/contact", { query: q });
export const setContactMessageHandled = (id: string, handled: boolean) =>
  request<ContactMessage>(`/contact/${encodeURIComponent(id)}`, { method: "PATCH", body: { handled } });
