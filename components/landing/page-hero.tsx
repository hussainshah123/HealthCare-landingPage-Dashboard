import type { ReactNode } from "react";
import { Bubbles, Capsule, Tablet, Waves } from "./decor";
import { Reveal } from "./reveal";
import styles from "./styles";

/** Shorter version of the landing hero for inner pages (About, Contact). */
export function PageHero({
  eyebrow,
  title,
  children,
  id = "page-title",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section className={`${styles.hero} pb-36 pt-32 sm:pt-36`} aria-labelledby={id}>
      <Bubbles />
      <Capsule color="#7dd3fc" size={62} rotate={30} className="left-[6%] top-32 hidden opacity-70 md:block" />
      <Capsule color="#fda4af" size={46} rotate={-35} slow className="right-[8%] top-28 opacity-60" />
      <Tablet size={30} className="bottom-36 right-[22%] hidden opacity-70 md:block" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.25)]" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 id={id} className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {children ? (
          <Reveal delay={160}>
            <div className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-sky-100 sm:text-lg">{children}</div>
          </Reveal>
        ) : null}
      </div>
      <Waves />
    </section>
  );
}
