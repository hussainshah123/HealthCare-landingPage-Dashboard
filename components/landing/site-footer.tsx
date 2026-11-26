import Link from "next/link";
import { BrandMark } from "./icons";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#tracking", label: "Live tracking" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/contact?topic=PHARMACY", label: "Partner with us" },
    ],
  },
  {
    title: "Portal",
    links: [
      { href: "/login", label: "Pharmacy login" },
      { href: "/login", label: "Admin login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-sky-100 bg-white px-4 pb-8 pt-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="MediGo home">
            <BrandMark size={34} />
            <span className="text-lg font-extrabold tracking-tight text-[#0b2135]">MediGo</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#4a6275]">
            Medicines, doctors and delivery in one app, connecting you with pharmacies, doctors and riders near
            you.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-bold text-[#0b2135]">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#4a6275] transition-colors hover:text-[#0369a1]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-sky-100 pt-6 text-sm text-[#4a6275]">
        © MediGo. All rights reserved.
      </div>
    </footer>
  );
}
