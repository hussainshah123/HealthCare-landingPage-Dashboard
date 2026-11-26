"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark, Icon } from "./icons";

// Absolute ("/#…") so the section links also work from /about and /contact.
const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#tracking", label: "Live tracking" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Transparent over the hero, frosted glass once the page scrolls; collapsible on phones. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/85 shadow-[0_8px_30px_-12px_rgba(3,105,161,0.25)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5" aria-label="MediGo home">
          <BrandMark size={34} />
          <span className={`text-lg font-extrabold tracking-tight ${solid ? "text-[#0b2135]" : "text-white"}`}>
            MediGo
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  solid ? "text-[#4a6275] hover:bg-sky-50 hover:text-[#0369a1]" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              solid ? "text-[#0369a1] hover:bg-sky-50" : "text-white hover:bg-white/10"
            }`}
          >
            Partner login
          </Link>
          <Link
            href="/#get-app"
            className="rounded-full bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition-transform hover:-translate-y-0.5"
          >
            Get the app
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`grid h-11 w-11 place-items-center rounded-full md:hidden ${solid ? "text-[#0b2135]" : "text-white"}`}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-sky-100 bg-white px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-[#0b2135] hover:bg-sky-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="rounded-full border border-sky-200 py-3 text-center text-sm font-semibold text-[#0369a1]"
            >
              Partner login
            </Link>
            <Link
              href="/#get-app"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] py-3 text-center text-sm font-semibold text-white"
            >
              Get the app
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
