import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal/portal-frame";
import type { NavGroup } from "@/components/ui/sidebar";

export const metadata: Metadata = { title: "Admin · HealthHub" };

const NAV: NavGroup[] = [
  { items: [{ href: "/admin", label: "Overview", exact: true }] },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "All users" },
      { href: "/admin/doctors", label: "Doctors" },
      { href: "/admin/riders", label: "Riders" },
      { href: "/admin/pharmacies", label: "Pharmacies" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/deliveries", label: "Active deliveries" },
      { href: "/admin/appointments", label: "Appointments" },
      { href: "/admin/payments", label: "Payments" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/medicines", label: "Medicines" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/specializations", label: "Specializations" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/settings", label: "Settings" },
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
