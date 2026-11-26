import { Suspense } from "react";
import type { Role } from "@/types/api";
import { Sidebar, SidebarFallback, type NavGroup } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/states";
import { SessionGate } from "./session-gate";

/** Static dashboard chrome (prerendered) with the session-dependent content streamed in. */
export function PortalFrame({
  title,
  nav,
  role,
  children,
}: {
  title: string;
  nav: NavGroup[];
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f3f9fd] bg-[radial-gradient(900px_420px_at_100%_-10%,rgba(14,165,233,0.10),transparent_60%)] text-slate-900 lg:flex-row">
      <Suspense fallback={<SidebarFallback groups={nav} title={title} />}>
        <Sidebar groups={nav} title={title} />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<Spinner label="Checking your session…" />}>
          <SessionGate role={role}>{children}</SessionGate>
        </Suspense>
      </div>
    </div>
  );
}
