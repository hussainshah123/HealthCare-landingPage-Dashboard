import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { Reveal } from "./reveal";
import styles from "./styles";

function TileHead({
  icon,
  title,
  text,
  dark = false,
}: {
  icon: IconName;
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div>
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl ${
          dark ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-700/25"
        }`}
      >
        <Icon name={icon} size={20} />
      </span>
      <h3 className={`mt-4 text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-[#0b2135]"}`}>{title}</h3>
      <p className={`mt-1.5 text-[15px] leading-relaxed ${dark ? "text-sky-100" : "text-[#4a6275]"}`}>{text}</p>
    </div>
  );
}

function Tile({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal as="li" delay={delay} className={className}>
      <article className={`${styles.tile} flex h-full flex-col justify-between gap-6 rounded-[28px] p-7`}>
        {children}
      </article>
    </Reveal>
  );
}

/** Animated preview: the same medicine at three pharmacies, best price highlighted. */
function PricePreview() {
  const rows = [
    { name: "Green Cross", km: "1.2 km", price: "PKR 95", best: true },
    { name: "City Care", km: "2.0 km", price: "PKR 110", best: false },
    { name: "Health Plus", km: "3.4 km", price: "PKR 118", best: false },
  ];
  return (
    <div className="rounded-2xl bg-white/90 p-3 shadow-[0_20px_40px_-24px_rgba(2,72,115,0.6)] ring-1 ring-sky-100" aria-hidden="true">
      <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs text-[#4a6275]">
        <Icon name="search" size={13} /> Panadol 500mg
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.name}
            className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] ${
              r.best ? `${styles.shimmer} bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] text-white` : "text-[#0b2135]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="store" size={14} className={r.best ? "text-white" : "text-[#0369a1]"} />
              <span className="font-semibold">{r.name}</span>
              <span className={r.best ? "text-sky-100" : "text-[#4a6275]"}>· {r.km}</span>
            </span>
            <span className="flex items-center gap-2 font-bold">
              {r.best ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Best</span> : null}
              {r.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Animated preview: a prescription being scanned, then approved. */
function ScanPreview() {
  return (
    <div className="relative mx-auto h-36 w-28" aria-hidden="true">
      <div className="absolute inset-0 rotate-[-4deg] rounded-xl bg-white p-3 shadow-[0_18px_36px_-18px_rgba(2,72,115,0.6)] ring-1 ring-sky-100">
        <p className="text-[10px] font-extrabold text-[#0369a1]">Rx</p>
        {[80, 64, 72, 50, 66, 40].map((w, i) => (
          <div key={i} className="mt-1.5 h-1.5 rounded-full bg-sky-100" style={{ width: `${w}%` }} />
        ))}
        <div className={`${styles.scan} absolute inset-x-1 top-3 h-0.5 rounded-full bg-[#0ea5e9] shadow-[0_0_12px_3px_rgba(14,165,233,0.6)]`} />
      </div>
      <span
        className={`${styles.approve} absolute -bottom-2 -right-4 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg`}
      >
        <Icon name="check" size={12} strokeWidth={3} /> Approved
      </span>
    </div>
  );
}

/** Animated preview: a consultation chat with a typing indicator. */
function ChatPreview() {
  const d = (s: number) => ({ ["--d" as string]: `${s}s` }) as CSSProperties;
  return (
    <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur" aria-hidden="true">
      <div className="flex items-center gap-2.5 border-b border-white/15 pb-2.5">
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#0369a1]">
          H
          <span className="absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0369a1]" />
        </span>
        <div className="text-xs">
          <p className="font-bold text-white">Dr. Hamza Khan</p>
          <p className="text-sky-200">Video consultation · live</p>
        </div>
        <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white">
          <Icon name="video" size={15} />
        </span>
      </div>
      <div className="space-y-2 pt-3 text-[12.5px]">
        <p className={`${styles.bubbleIn} ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[#0b2135]`} style={d(0)}>
          I&apos;ve had a fever since yesterday.
        </p>
        <p className={`${styles.bubbleIn} w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-white/20 px-3 py-2 text-white`} style={d(1.2)}>
          Let&apos;s check your symptoms. I&apos;ll send a prescription after.
        </p>
        <p className={`${styles.bubbleIn} w-fit rounded-2xl rounded-bl-md bg-white/20 px-3 py-2 text-white`} style={d(2.4)}>
          <span className={styles.typing}>
            <span />
            <span />
            <span />
          </span>
        </p>
      </div>
    </div>
  );
}

/** Animated preview: the 4-digit hand-over code appearing digit by digit. */
function OtpPreview() {
  return (
    <div className="flex justify-center gap-2.5" aria-hidden="true">
      {["4", "7", "1", "9"].map((n, i) => (
        <span
          key={i}
          className="grid h-14 w-12 place-items-center rounded-2xl bg-white text-2xl font-extrabold text-[#0369a1] shadow-[0_14px_28px_-16px_rgba(2,72,115,0.7)] ring-1 ring-sky-100"
        >
          <span className={styles.otp} style={{ ["--d" as string]: `${i * 0.25}s` } as CSSProperties}>
            {n}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Animated preview: switching between cash on delivery and online payment. */
function PayPreview() {
  return (
    <div className="relative grid grid-cols-2 rounded-full bg-white/15 p-1 text-sm font-bold ring-1 ring-white/25" aria-hidden="true">
      <span className={`${styles.knob} absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white/25 shadow ring-1 ring-white/50`} />
      <span className="relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-white">
        <Icon name="wallet" size={15} /> Cash
      </span>
      <span className="relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-white">
        <Icon name="phone" size={15} /> Online
      </span>
    </div>
  );
}

/** Mini map with a rider dot following the route. */
function MiniMap() {
  const route = "M10 70 C 50 70, 50 30, 90 30 S 140 10, 170 14";
  return (
    <svg viewBox="0 0 180 84" className="h-auto w-full" aria-hidden="true">
      <rect width="180" height="84" rx="14" fill="#f0f9ff" />
      <path d={route} stroke="#bae6fd" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d={route} stroke="#0369a1" strokeWidth="2.5" fill="none" strokeDasharray="4 5" strokeLinecap="round" />
      <circle cx="10" cy="70" r="6" fill="#0369a1" />
      <circle cx="170" cy="14" r="6" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
      <g>
        <circle r="7" fill="#fff" stroke="#0369a1" strokeWidth="2.5" />
        <circle r="2.5" fill="#0369a1" />
        <animateMotion dur="5s" repeatCount="indefinite" path={route} keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />
      </g>
    </svg>
  );
}

export function FeatureBento() {
  return (
    <ul className="mt-14 grid gap-5 md:grid-cols-6">
      {/* Order medicines — wide, light */}
      <Tile className="md:col-span-4">
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-white via-[#f0f9ff] to-[#dff1fb] ring-1 ring-sky-100" />
        <div className="grid items-center gap-6 sm:grid-cols-2">
          <TileHead
            icon="pill"
            title="Order medicines"
            text="Search by name or brand, compare each pharmacy's price and check out from the one that suits you."
          />
          <PricePreview />
        </div>
      </Tile>

      {/* Prescription — narrow, light */}
      <Tile className="md:col-span-2" delay={90}>
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-white ring-1 ring-sky-100" />
        <TileHead
          icon="file"
          title="Upload a prescription"
          text="A pharmacist reviews it before prescription-only medicines are sent."
        />
        <ScanPreview />
      </Tile>

      {/* Consult — narrow, dark gradient */}
      <Tile className="md:col-span-2">
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#024873] via-[#0369a1] to-[#0ea5e9]" />
        <TileHead
          dark
          icon="video"
          title="Consult a doctor"
          text="Video, audio or chat with a verified doctor, then a digital prescription."
        />
        <ChatPreview />
      </Tile>

      {/* Tracking — narrow, light */}
      <Tile className="md:col-span-2" delay={90}>
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-white ring-1 ring-sky-100" />
        <TileHead icon="mapPin" title="Live tracking" text="Follow your rider on the map, from pickup to your door." />
        <MiniMap />
      </Tile>

      {/* OTP + payment — stacked, narrow */}
      <Reveal as="li" delay={180} className="grid gap-5 md:col-span-2">
        <article className={`${styles.tile} flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-[#e0f2fe] to-white p-7 ring-1 ring-sky-100`}>
          <TileHead icon="key" title="Safe hand-over" text="Your own 4-digit code closes every delivery." />
          <OtpPreview />
        </article>
        <article className={`${styles.tile} flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-[#0369a1] to-[#0891b2] p-7`}>
          <TileHead dark icon="wallet" title="Pay your way" text="Cash on delivery or online, with the total shown up front." />
          <PayPreview />
        </article>
      </Reveal>
    </ul>
  );
}
