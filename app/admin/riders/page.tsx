import { UsersView } from "@/components/admin/users-view";
import { OnlineRidersCard } from "@/components/admin/online-riders-card";

export default function RidersPage() {
  return (
    <UsersView title="Riders" description="Delivery riders and their approval status." fixedRole="RIDER">
      <div className="mb-6">
        <OnlineRidersCard />
      </div>
    </UsersView>
  );
}
