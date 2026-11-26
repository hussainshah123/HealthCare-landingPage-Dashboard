import { UsersView } from "@/components/admin/users-view";

export default function DoctorsPage() {
  return <UsersView title="Doctors" description="Doctor accounts and their approval status." fixedRole="DOCTOR" />;
}
