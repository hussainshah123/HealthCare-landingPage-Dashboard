import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal/portal-frame";
import type { NavGroup } from "@/components/ui/sidebar";

export const metadata: Metadata = { title: "Pharmacy · HealthHub" };

const NAV: NavGroup[] = [
  { items: [{ href: "/pharmacy", label: "Overview", exact: true }] },
  {
    label: "Store",
    items: [
      { href: "/pharmacy/orders", label: "Orders" },
      { href: "/pharmacy/prescriptions", label: "Prescriptions" },
      { href: "/pharmacy/inventory", label: "Inventory" },
    ],
  },
  { label: "Account", items: [{ href: "/pharmacy/profile", label: "Profile" }] },
];

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalFrame title="Pharmacy portal" nav={NAV} role="PHARMACY">
      {children}
    </PortalFrame>
  );
}
