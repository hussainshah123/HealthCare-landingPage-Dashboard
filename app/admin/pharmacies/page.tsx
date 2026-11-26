import { UsersView } from "@/components/admin/users-view";

export default function PharmaciesPage() {
  return (
    <UsersView title="Pharmacies" description="Partner pharmacies and their approval status." fixedRole="PHARMACY" />
  );
}
