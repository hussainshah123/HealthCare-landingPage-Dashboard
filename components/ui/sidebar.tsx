"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark, Icon, type IconName } from "@/components/landing/icons";
import { cx } from "./cx";

export interface NavItem {
  href: string;
  label: string;
  /** Match only the exact path (used for portal home links). */
  exact?: boolean;
  /** Line icon shown before the label. */
  icon?: IconName;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SidebarNav({ groups, pathname }: { groups: NavGroup[]; pathname: string | null }) {
  return (
    <nav className="flex flex-col gap-6 px-3 py-5" aria-label="Portal">
      {groups.map((g, i) => (
        <div key={g.label ?? i}>
          {g.label && (
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-sky-300/60 uppercase">{g.label}</p>
          )}
          <ul className="flex flex-col gap-1">
            {g.items.map((item) => {
              const active = pathname ? isActive(pathname, item) : false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-white/15 to-white/[0.04] text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.18)]"
                        : "text-sky-100/70 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-2 -left-3 w-1 rounded-r-full bg-sky-300 shadow-[0_0_12px_2px_rgba(125,211,252,0.7)]"
                        aria-hidden
                      />
                    )}
                    <span
                      className={cx(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors",
                        active
                          ? "bg-gradient-to-br from-sky-400 to-sky-700 text-white shadow-lg shadow-sky-900/40"
                          : "bg-white/[0.06] text-sky-200/80 group-hover:text-white",
                      )}
                      aria-hidden
                    >
                      {item.icon ? <Icon name={item.icon} size={16} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

const PANEL =
  "bg-[radial-gradient(420px_260px_at_0%_0%,rgba(14,165,233,0.28),transparent_60%),linear-gradient(180deg,#03253f_0%,#021a2c_100%)]";

/** Sidebar that highlights the active route. Must be rendered inside <Suspense> (reads the pathname). */
export function Sidebar({ groups, title }: { groups: NavGroup[]; title: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cx("flex items-center justify-between px-4 py-3 lg:hidden", PANEL)}>
        <Brand title={title} />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-xl text-sky-100 hover:bg-white/10"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </div>
      {open && (
        <div className={cx("lg:hidden", PANEL)} onClick={() => setOpen(false)}>
          <SidebarNav groups={groups} pathname={pathname} />
        </div>
      )}
      <aside className={cx("hidden w-72 shrink-0 lg:block", PANEL)}>
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          <div className="px-6 pt-6 pb-2">
            <Brand title={title} />
          </div>
          <SidebarNav groups={groups} pathname={pathname} />
          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              <p className="flex items-center gap-2 text-xs font-semibold text-sky-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Systems live
              </p>
              <p className="mt-1 text-xs text-sky-200/60">Data refreshes automatically.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarFallback({ groups, title }: { groups: NavGroup[]; title: string }) {
  return (
    <aside className={cx("hidden w-72 shrink-0 lg:block", PANEL)}>
      <div className="px-6 pt-6 pb-2">
        <Brand title={title} />
      </div>
      <SidebarNav groups={groups} pathname={null} />
    </aside>
  );
}

function Brand({ title }: { title: string }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <BrandMark size={38} />
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-white">MediGo</span>
        <span className="block text-xs text-sky-200/70">{title}</span>
      </span>
    </Link>
  );
}
