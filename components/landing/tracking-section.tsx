import { Icon, type IconName } from "./icons";
import { Reveal } from "./reveal";
import styles from "./styles";
import { TrackingMap } from "./tracking-map";

const TIMELINE: { icon: IconName; title: string; note: string }[] = [
  { icon: "check", title: "Order confirmed", note: "The pharmacy accepted your order" },
  { icon: "package", title: "Ready for pickup", note: "Packed and waiting for a rider" },
  { icon: "bike", title: "On the way", note: "Your rider is heading to you" },
  { icon: "key", title: "Delivered", note: "Closed with your 4-digit code" },
];

// One class per dot: each turns on as the rail fill reaches it.
const DOT_CLASS = [styles.tlDot0, styles.tlDot1, styles.tlDot2, styles.tlDot3];

/** Map with floating status chips, next to an order timeline that fills step by step. */
export function TrackingSection() {
  return (
    <section id="tracking" className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 sm:py-32" aria-labelledby="tracking-title">
      <span className={`${styles.blob} -left-24 top-10 h-72 w-72 bg-sky-200`} aria-hidden="true" />
      <span className={`${styles.blob} -right-24 bottom-0 h-80 w-80 bg-cyan-100`} aria-hidden="true" style={{ animationDelay: "-6s" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="relative">
          <TrackingMap />
          {/* floating chips */}
          <div
            className={`${styles.float} absolute -left-3 top-6 hidden items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-sm font-bold text-[#0b2135] shadow-[0_18px_40px_-18px_rgba(2,72,115,0.6)] ring-1 ring-sky-100 sm:flex`}
            aria-hidden="true"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
              <Icon name="check" size={14} strokeWidth={3} />
            </span>
            Picked up
          </div>
          <div
            className={`${styles.floatSlow} absolute -right-3 top-1/3 hidden items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-sm font-bold text-[#0b2135] shadow-[0_18px_40px_-18px_rgba(2,72,115,0.6)] ring-1 ring-sky-100 sm:flex`}
            aria-hidden="true"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-white">
              <Icon name="phone" size={13} />
            </span>
            Call rider
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Live tracking</p>
          <h2 id="tracking-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Know exactly where your medicines are
          </h2>
          <p className="mt-4 text-[#4a6275]">
            You get a notification at every step, and once a rider accepts your order you can watch them on the map.
            Their location is shared only during your delivery, and only with you.
          </p>

          <ol className="relative mt-8 space-y-5 pl-1">
            {/* rail + animated fill */}
            <span className="absolute bottom-5 left-[19px] top-5 w-0.5 rounded-full bg-sky-100" aria-hidden="true">
              <span className={`${styles.tlFill} absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[#0369a1] to-[#0ea5e9]`} />
            </span>
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative flex items-center gap-4">
                <span
                  className={`${DOT_CLASS[i]} relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-sky-200 bg-white text-sky-200`}
                >
                  <Icon name={t.icon} size={16} strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block font-bold text-[#0b2135]">{t.title}</span>
                  <span className="block text-sm text-[#4a6275]">{t.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
