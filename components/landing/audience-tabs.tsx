"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icons";
import styles from "./styles";

const AUDIENCES: {
  id: string;
  icon: IconName;
  who: string;
  lead: string;
  points: string[];
  cta: { href: string; label: string };
  visual: { icon: IconName; label: string; value: string }[];
}[] = [
  {
    id: "customers",
    icon: "user",
    who: "Customers",
    lead: "Everything for your health in one app.",
    points: [
      "Medicines from nearby pharmacies, with prices side by side",
      "Doctor consultations by video, audio or chat",
      "Saved addresses with your exact map pin",
      "Order history, re-order, and cancel before pickup",
    ],
    cta: { href: "/#get-app", label: "Get the app" },
    visual: [
      { icon: "pill", label: "Order", value: "Medicines" },
      { icon: "video", label: "Consult", value: "Doctors" },
      { icon: "mapPin", label: "Track", value: "Live map" },
    ],
  },
  {
    id: "pharmacies",
    icon: "store",
    who: "Pharmacies",
    lead: "A web dashboard to run your online orders.",
    points: [
      "Manage stock and prices for every medicine",
      "Review prescriptions before you confirm an order",
      "Move orders from confirmed to ready for pickup",
      "Nearby riders collect ready orders for you",
    ],
    cta: { href: "/contact?topic=PHARMACY", label: "Partner with us" },
    visual: [
      { icon: "package", label: "Orders", value: "In one list" },
      { icon: "file", label: "Prescriptions", value: "Review" },
      { icon: "pill", label: "Inventory", value: "Stock & price" },
    ],
  },
  {
    id: "doctors",
    icon: "stethoscope",
    who: "Doctors",
    lead: "See patients online, on your schedule.",
    points: [
      "Set your weekly availability and slot length",
      "Consult by video, audio or chat",
      "Write digital prescriptions in the app",
      "Track your earnings and payouts",
    ],
    cta: { href: "/contact?topic=DOCTOR", label: "Join as a doctor" },
    visual: [
      { icon: "calendar", label: "Slots", value: "Your hours" },
      { icon: "video", label: "Consult", value: "Video · chat" },
      { icon: "wallet", label: "Earnings", value: "Payouts" },
    ],
  },
  {
    id: "riders",
    icon: "bike",
    who: "Riders",
    lead: "Deliver when you want and earn per drop.",
    points: [
      "Go online and see orders waiting for pickup",
      "One tap opens directions in your maps app",
      "Earnings and delivery history in one place",
      "Every partner is verified by our team",
    ],
    cta: { href: "/contact?topic=RIDER", label: "Ride with us" },
    visual: [
      { icon: "bell", label: "Orders", value: "Near you" },
      { icon: "mapPin", label: "Route", value: "Directions" },
      { icon: "wallet", label: "Earn", value: "Per delivery" },
    ],
  },
];

export function AudienceTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });

  // Slide the highlight under the active tab.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    const n = AUDIENCES.length;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const a = AUDIENCES[active];

  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Who MediGo is for"
          onKeyDown={onKey}
          className="relative flex max-w-full overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_14px_34px_-18px_rgba(3,105,161,0.5)] ring-1 ring-sky-100"
        >
          <span
            className={`${styles.tabIndicator} absolute inset-y-1.5 left-0 rounded-full bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] shadow-lg shadow-sky-600/30`}
            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
            aria-hidden="true"
          />
          {AUDIENCES.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative z-10 flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-5 ${
                active === i ? "text-white" : "text-[#4a6275] hover:text-[#0369a1]"
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.who}
            </button>
          ))}
        </div>
      </div>

      <div
        key={a.id}
        role="tabpanel"
        id={`panel-${a.id}`}
        aria-labelledby={`tab-${a.id}`}
        className={`${styles.fadeUp} mt-10 grid items-center gap-8 rounded-[32px] border border-sky-100 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(3,105,161,0.6)] sm:p-10 lg:grid-cols-2`}
      >
        <div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-700/30">
            <Icon name={a.icon} size={26} />
          </span>
          <h3 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{a.who}</h3>
          <p className="mt-1 text-[#4a6275]">{a.lead}</p>
          <ul className="mt-6 space-y-3">
            {a.points.map((p) => (
              <li key={p} className="flex gap-3 text-[15px]">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-[#0369a1]">
                  <Icon name="check" size={13} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link
            href={a.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b2135] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            {a.cta.label} <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className={`${styles.hero} relative overflow-hidden rounded-3xl p-6 sm:p-8`} aria-hidden="true">
          <div className="grid gap-3">
            {a.visual.map((v, i) => (
              <div
                key={v.label}
                className={`${styles.fadeUp} flex items-center gap-4 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur`}
                style={{ animationDelay: `${120 + i * 110}ms` }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#0369a1]">
                  <Icon name={v.icon} size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">{v.label}</p>
                  <p className="text-lg font-bold text-white">{v.value}</p>
                </div>
                <Icon name="arrowRight" size={18} className="ml-auto text-sky-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
