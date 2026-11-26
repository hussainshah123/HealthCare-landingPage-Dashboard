import styles from "./styles";
import { Icon, type IconName } from "./icons";

const TABS: { icon: IconName; label: string }[] = [
  { icon: "pill", label: "Pharmacy" },
  { icon: "stethoscope", label: "Doctors" },
  { icon: "package", label: "Orders" },
  { icon: "calendar", label: "Visits" },
  { icon: "user", label: "Profile" },
];

/** A drawn (not screenshotted) preview of the customer app's home screen. */
export function PhoneMockup() {
  return (
    <div
      className={`${styles.phone} relative mx-auto w-[290px] rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-[0_40px_80px_-20px_rgba(2,40,70,0.6)]`}
      role="img"
      aria-label="MediGo app home screen: search, upload prescription, browse medicines, and doctors to consult"
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
      <div className="relative h-[590px] overflow-hidden rounded-[34px] bg-gradient-to-b from-[#e3f2fa] to-[#c9e6f5]">
        {/* header */}
        <div className="bg-gradient-to-br from-[#024873] via-[#0369a1] to-[#0ea5e9] px-4 pb-4 pt-9 text-white">
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold">Pharmacy</span>
            <div className="flex gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                <Icon name="bell" size={16} />
              </span>
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/15">
                <Icon name="cart" size={16} />
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold ring-2 ring-[#0369a1]">
                  2
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="text-base font-bold text-[#0b2135]">Hi Ayesha</p>
            <p className="text-[11px] text-[#4a6275]">What do you need today?</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#c3ddec] bg-white px-3 py-2.5 text-[11px] text-slate-400">
            <Icon name="search" size={14} /> Search medicines, brands…
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#024873] to-[#0369a1] p-3 text-white shadow-lg shadow-sky-900/20">
              <svg className="absolute right-1 top-2" width="56" height="20" viewBox="0 0 120 40" aria-hidden="true">
                <path
                  className={styles.ecg}
                  d="M0 22H34l6-8 6 16 8-26 8 32 6-14h16l4-4 4 4h28"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity="0.7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-white/20">
                <Icon name="file" size={15} />
              </span>
              <p className="text-[12px] font-bold leading-tight">Upload prescription</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#0369a1] to-[#0891b2] p-3 text-white shadow-lg shadow-sky-900/20">
              <span className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-white/20">
                <Icon name="pill" size={15} />
              </span>
              <p className="text-[12px] font-bold leading-tight">Browse medicines</p>
            </div>
          </div>

          <p className="pt-1 text-[12px] font-bold text-[#0b2135]">Consult a doctor</p>
          {[
            { n: "Dr. Hamza Khan", s: "General Physician", f: "1,500" },
            { n: "Dr. Sana Malik", s: "Dermatologist", f: "2,000" },
          ].map((d) => (
            <div key={d.n} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-[13px] font-bold text-[#0369a1]">
                {d.n.split(" ")[1][0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-bold text-[#0b2135]">{d.n}</p>
                <p className="text-[10px] text-[#4a6275]">{d.s}</p>
              </div>
              <span className="text-[10.5px] font-bold text-[#0369a1]">PKR {d.f}</span>
            </div>
          ))}
        </div>

        {/* bubble tab bar */}
        <div className="absolute inset-x-2 bottom-2">
          <div className="relative flex h-14 rounded-[22px] bg-white shadow-[0_8px_20px_-8px_rgba(2,72,115,0.35)]">
            <span
              className={`${styles.tabBubble} absolute -top-5 left-[calc(10%-22px)] grid h-11 w-11 place-items-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#0ea5e9] to-[#024873] text-white shadow-lg shadow-sky-700/40`}
              style={{ ["--step" as string]: "54px" }}
            >
              <Icon name="pill" size={18} />
            </span>
            {TABS.map((t, i) => (
              <div key={t.label} className="flex flex-1 flex-col items-center justify-end pb-2">
                <span className={i === 0 ? "opacity-0" : "text-slate-400"}>
                  <Icon name={t.icon} size={16} strokeWidth={1.8} />
                </span>
                <span className={`mt-0.5 text-[8.5px] font-semibold ${i === 0 ? "text-[#0369a1]" : "text-slate-400"}`}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
