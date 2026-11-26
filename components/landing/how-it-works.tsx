import type { CSSProperties } from "react";
import { Icon, type IconName } from "./icons";
import { Reveal } from "./reveal";
import styles from "./styles";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "search", title: "Find", text: "Search medicines or pick a category, and see each pharmacy's price." },
  { icon: "file", title: "Verify", text: "Add a prescription if a medicine needs one. A pharmacist checks it." },
  { icon: "package", title: "Prepare", text: "The pharmacy confirms and packs your order; a nearby rider accepts it." },
  { icon: "bike", title: "Deliver", text: "Track the rider live and share your 4-digit code at the door." },
];

/** Dark section: four glowing steps with a light travelling along the line between them. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className={`${styles.dark} scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32`} aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">How it works</p>
          <h2 id="how-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            From search to your door in <span className={styles.gradientText}>four steps</span>
          </h2>
          <p className="mt-4 text-sky-100/80">The whole journey happens in the app, and you can see every step.</p>
        </Reveal>

        <Reveal className="relative mt-20">
          {/* connector with a travelling light (desktop) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-gradient-to-r from-sky-400/10 via-sky-300/50 to-sky-400/10 lg:block" aria-hidden="true">
            <span className={`${styles.travel} absolute -top-[3px] h-[7px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_18px_4px_rgba(56,189,248,0.7)]`} />
          </div>
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="group text-center">
                <span
                  className={`${styles.stepGlow} relative mx-auto grid h-[72px] w-[72px] place-items-center rounded-2xl bg-gradient-to-br from-[#0b3a5c] to-[#062a45] text-sky-200`}
                  style={{ ["--d" as string]: `${i * 0.9}s` } as CSSProperties}
                >
                  <Icon name={s.icon} size={28} />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#38bdf8] to-[#0369a1] text-xs font-extrabold text-white ring-4 ring-[#021a2c]">
                    {i + 1}
                  </span>
                </span>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors group-hover:border-sky-300/40 group-hover:bg-white/[0.07]">
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-sky-100/75">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
