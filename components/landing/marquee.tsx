import { Icon, type IconName } from "./icons";
import styles from "./styles";

const ITEMS: { icon: IconName; label: string }[] = [
  { icon: "pill", label: "Pain Relief" },
  { icon: "video", label: "Video consultations" },
  { icon: "pill", label: "Antibiotics" },
  { icon: "file", label: "Prescription upload" },
  { icon: "pill", label: "Diabetes care" },
  { icon: "mapPin", label: "Live rider tracking" },
  { icon: "heartPulse", label: "Heart & Blood Pressure" },
  { icon: "chat", label: "Chat with a doctor" },
  { icon: "pill", label: "Vitamins & Supplements" },
  { icon: "key", label: "OTP hand-over" },
  { icon: "pill", label: "Cold & Flu" },
  { icon: "store", label: "Nearby pharmacies" },
  { icon: "pill", label: "Skin Care" },
  { icon: "pill", label: "Baby Care" },
];

/** Endless strip of categories and services; pauses on hover. */
export function Marquee() {
  const row = (hidden: boolean) =>
    ITEMS.map((it, i) => (
      <li
        key={`${hidden}-${i}`}
        aria-hidden={hidden || undefined}
        className="mx-2 flex shrink-0 items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b2135] shadow-[0_6px_18px_-12px_rgba(3,105,161,0.5)]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white">
          <Icon name={it.icon} size={14} />
        </span>
        {it.label}
      </li>
    ));
  return (
    <div className={`${styles.marquee} relative -mt-6 overflow-hidden py-4`} aria-label="Categories and services">
      {/* duplicated once so the loop is seamless; the copy is hidden from screen readers */}
      <ul className={styles.marqueeTrack}>
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
