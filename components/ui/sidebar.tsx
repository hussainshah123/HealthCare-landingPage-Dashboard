"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "./cx";

export interface NavItem {
  href: string;
  label: string;
  /** Match only the exact path (used for portal home links). */
  exact?: boolean;
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
    <nav className="flex flex-col gap-5 px-3 py-4">
      {groups.map((g, i) => (
        <div key={g.label ?? i}>
          {g.label && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{g.label}</p>
          )}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const active = pathname ? isActive(pathname, item) : false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <span
                      className={cx("mr-3 h-1.5 w-1.5 rounded-full", active ? "bg-teal-600" : "bg-slate-300")}
                      aria-hidden
                    />
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

/** Sidebar that highlights the active route. Must be rendered inside <Suspense> (reads the pathname). */
export function Sidebar({ groups, title }: { groups: NavGroup[]; title: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Brand title={title} />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-b border-slate-200 bg-white lg:hidden" onClick={() => setOpen(false)}>
          <SidebarNav groups={groups} pathname={pathname} />
        </div>
      )}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          <div className="border-b border-slate-100 px-6 py-5">
            <Brand title={title} />
          </div>
          <SidebarNav groups={groups} pathname={pathname} />
        </div>
      </aside>
    </>
  );
}

export function SidebarFallback({ groups, title }: { groups: NavGroup[]; title: string }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-100 px-6 py-5">
        <Brand title={title} />
      </div>
      <SidebarNav groups={groups} pathname={null} />
    </aside>
  );
}

function Brand({ title }: { title: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-slate-900">HealthHub</span>
        <span className="block text-xs text-slate-500">{title}</span>
      </span>
    </Link>
  );
}
