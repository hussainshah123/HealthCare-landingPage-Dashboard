import type { Metadata } from "next";
import { PortalFrame } from "@/components/portal/portal-frame";
import type { NavGroup } from "@/components/ui/sidebar";

export const metadata: Metadata = { title: "Pharmacy · MediGo" };

const NAV: NavGroup[] = [
  { items: [{ href: "/pharmacy", icon: "grid", label: "Overview", exact: true }] },
  {
    label: "Store",
    items: [
      { href: "/pharmacy/orders", icon: "package", label: "Orders" },
      { href: "/pharmacy/prescriptions", icon: "file", label: "Prescriptions" },
      { href: "/pharmacy/inventory", icon: "pill", label: "Inventory" },
    ],
  },
  { label: "Account", items: [{ href: "/pharmacy/profile", icon: "store", label: "Profile" }] },
];

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalFrame title="Pharmacy portal" nav={NAV} role="PHARMACY">
      {children}
    </PortalFrame>
  );
}
