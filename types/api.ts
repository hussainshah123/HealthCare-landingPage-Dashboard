// Types mirror appoitment-backend/API.md (Healthcare Platform – API Contract v1).

export type Role = "CUSTOMER" | "DOCTOR" | "RIDER" | "PHARMACY" | "ADMIN";
export type AccountStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: AccountStatus;
  avatarUrl: string | null;
  createdAt: string;
}

/** `GET /admin/users` returns `User & { profile }`; the profile shape depends on the role. */
export type AdminUser = User & { profile: Record<string, unknown> | null };

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | string;
  user: User;
}

// Catalogue
export interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface Medicine {
  id: string;
  name: string;
  brand: string | null;
  manufacturer: string | null;
  description: string | null;
  dosage: string | null;
  imageUrl: string | null;
  requiresPrescription: boolean;
  categoryId: string | null;
  minPrice: number | null;
}

export interface MedicineInput {
  name: string;
  brand?: string;
  manufacturer?: string;
  description?: string;
  dosage?: string;
  imageUrl?: string;
  requiresPrescription: boolean;
  categoryId?: string;
}

export interface Specialization {
  id: string;
  name: string;
}

// Pharmacies & inventory
export interface PharmacyProfile {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  licenseNumber: string | null;
  lat: number | null;
  lng: number | null;
  status?: AccountStatus;
}

export interface PharmacyProfileInput {
  name?: string;
  address?: string;
  city?: string;
  licenseNumber?: string;
  lat?: number;
  lng?: number;
}

/**
 * Inventory rows are not fully specified in API.md; the request bodies are
 * `{ medicineId, price, stock, batchNumber?, expiryDate? }`. Fields beyond those are optional.
 */
export interface InventoryItem {
  id: string;
  medicineId: string;
  price: number;
  stock: number;
  batchNumber: string | null;
  expiryDate: string | null;
  medicine?: Pick<Medicine, "id" | "name"> & Partial<Medicine>;
  medicineName?: string;
}

export interface InventoryCreateInput {
  medicineId: string;
  price: number;
  stock: number;
  batchNumber?: string;
  expiryDate?: string;
}

export type InventoryUpdateInput = Partial<Omit<InventoryCreateInput, "medicineId">>;

// Prescriptions
export type PrescriptionStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface Prescription {
  id: string;
  fileUrl: string;
  notes: string | null;
  status: PrescriptionStatus;
  reviewNote: string | null;
  createdAt: string;
}

// Orders
export const ORDER_STATUSES = [
  "PENDING",
  "PRESCRIPTION_UNDER_REVIEW",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "RIDER_ASSIGNED",
  "PICKED_UP",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PHARMACY_SETTABLE_STATUSES = [
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "CANCELLED",
] as const;
export type PharmacySettableStatus = (typeof PHARMACY_SETTABLE_STATUSES)[number];

export type PaymentMethod = "COD" | "ONLINE";

export interface OrderItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

/** Address shape is not specified for orders; it mirrors the customer address body. */
export interface OrderAddress {
  label?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  lat?: number | null;
  lng?: number | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  address: OrderAddress | null;
  pharmacy: { id: string; name: string };
  prescriptionId: string | null;
  history: OrderHistoryEntry[];
  delivery: Delivery | null;
  createdAt: string;
}

// Deliveries
export type DeliveryStatus = "ASSIGNED" | "PICKED_UP" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  status: DeliveryStatus;
  fee: number;
  pharmacy: { name: string; address: string; lat: number; lng: number };
  dropoff: { line1: string; city: string; lat: number; lng: number };
  customerName: string;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
}

/** `GET /admin/riders/online` – shape not specified beyond being riders; treat as User-like. */
export interface OnlineRider {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  vehicleType?: string | null;
  vehicleNumber?: string | null;
  lastLocation?: { lat: number; lng: number; recordedAt?: string } | null;
}

// Appointments
export type AppointmentStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";
export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "REQUESTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  type: "AUDIO" | "VIDEO" | "CHAT";
  startsAt: string;
  endsAt: string;
  fee: number;
  reason: string | null;
  doctor: { id: string; name: string; specialization: string; avatarUrl: string | null };
  customer: { id: string; name: string };
  consultationId: string | null;
}

/** API.md does not define the Payment shape; every field except id is optional. */
export interface Payment {
  id: string;
  amount?: number;
  status?: string;
  method?: string;
  provider?: string;
  reference?: string;
  orderId?: string | null;
  appointmentId?: string | null;
  user?: { id?: string; name?: string } | null;
  createdAt?: string;
}

// Admin
export interface AdminStats {
  customers: number;
  doctors: number;
  riders: number;
  pharmacies: number;
  orders: number;
  activeDeliveries: number;
  consultations: number;
  revenue: number;
  pendingApprovals: number;
}

export interface PlatformSettings {
  deliveryFee: number;
  platformCommissionPercent: number;
  doctorCommissionPercent: number;
  riderFeePercent: number;
  serviceCities: string[];
}

// Socket.IO /tracking
export interface RiderLocationEvent {
  orderId: string;
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  recordedAt: string;
}

export interface DeliveryStatusEvent {
  orderId: string;
  status: DeliveryStatus | OrderStatus;
}

export interface DeliveryJoinAck {
  ok: boolean;
  lastLocation?: { lat: number; lng: number; heading?: number | null; recordedAt?: string } | null;
}

/** A message sent from the website's contact form. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: "CUSTOMER" | "PHARMACY" | "DOCTOR" | "RIDER" | "OTHER";
  message: string;
  handled: boolean;
  createdAt: string;
}
