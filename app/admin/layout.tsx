import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal/portal-frame";
import type { NavGroup } from "@/components/ui/sidebar";

export const metadata: Metadata = { title: "Admin · MediGo" };

const NAV: NavGroup[] = [
  { items: [{ href: "/admin", icon: "grid", label: "Overview", exact: true }] },
  {
    label: "People",
    items: [
      { href: "/admin/users", icon: "users", label: "All users" },
      { href: "/admin/doctors", icon: "stethoscope", label: "Doctors" },
      { href: "/admin/riders", icon: "bike", label: "Riders" },
      { href: "/admin/pharmacies", icon: "store", label: "Pharmacies" },
      { href: "/admin/customers", icon: "user", label: "Customers" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/orders", icon: "package", label: "Orders" },
      { href: "/admin/deliveries", icon: "truck", label: "Active deliveries" },
      { href: "/admin/appointments", icon: "calendar", label: "Appointments" },
      { href: "/admin/payments", icon: "wallet", label: "Payments" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/medicines", icon: "pill", label: "Medicines" },
      { href: "/admin/categories", icon: "tag", label: "Categories" },
      { href: "/admin/specializations", icon: "layers", label: "Specializations" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/messages", icon: "inbox", label: "Messages" },
      { href: "/admin/settings", icon: "settings", label: "Settings" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalFrame title="Admin dashboard" nav={NAV} role="ADMIN">
      {children}
    </PortalFrame>
  );
}
