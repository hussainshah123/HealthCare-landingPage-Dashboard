import { redirect } from "next/navigation";
import type { Role } from "@/types/api";
import { getSession } from "@/lib/auth/session";
import { homeForRole } from "@/lib/auth/tokens";
import { Alert } from "@/components/ui/states";
import { UserMenu } from "./user-menu";

/**
 * Server-side authorization for a portal. Reads the session cookie and verifies it with
 * GET /auth/me, so it must be rendered inside <Suspense>. Children render only for `role`.
 */
export async function SessionGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const session = await getSession();

  if (session.kind === "unauthenticated") redirect("/login");
  if (session.kind === "unavailable") {
    return (
      <div className="p-6 lg:p-8">
        <Alert tone="error" title="Cannot verify your session">
          {session.message} Make sure the backend is running and reload the page.
        </Alert>
      </div>
    );
  }

  const user = session.user;
  if (user.role !== role) redirect(homeForRole(user.role) ?? "/mobile-app");

  return (
    <>
      <header className="flex items-center justify-end border-b border-slate-200 bg-white px-6 py-3 lg:px-8">
        <UserMenu name={user.name} email={user.email} role={user.role} status={user.status} />
      </header>
      {role === "PHARMACY" && user.status !== "ACTIVE" && (
        <div className="px-6 pt-6 lg:px-8">
          {user.status === "PENDING" ? (
            <Alert tone="warning" title="Your pharmacy is pending approval">
              An administrator must approve your account before you receive orders. Complete your profile and
              inventory in the meantime.
            </Alert>
          ) : (
            <Alert tone="error" title={`Your pharmacy account is ${user.status.toLowerCase()}`}>
              Contact platform support for details.
            </Alert>
          )}
        </div>
      )}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </>
  );
}
