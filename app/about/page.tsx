import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/landing/icons";
import { PageHero } from "@/components/landing/page-hero";
import { Reveal } from "@/components/landing/reveal";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import styles from "@/components/landing/styles";

export const metadata: Metadata = {
  title: "About MediGo · Care that comes to you",
  description:
    "MediGo connects patients with nearby pharmacies, verified doctors and delivery riders, so getting medicines and medical advice no longer means a trip across town.",
};

export const ensureStatic = "navigation";

const PROBLEMS = [
  "Calling pharmacy after pharmacy to find a medicine in stock",
  "Waiting hours in a clinic for a short consultation",
  "No idea when, or if, a delivery will arrive",
];

const PILLARS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "store",
    title: "Pharmacies near you",
    text: "Local pharmacies list their stock and prices on MediGo, so you can compare and order from the one that suits you.",
  },
  {
    icon: "stethoscope",
    title: "Doctors on your schedule",
    text: "Book an open slot and consult by video, audio or chat. Your doctor can send a digital prescription straight to the app.",
  },
  {
    icon: "bike",
    title: "Riders who bring it home",
    text: "Nearby riders pick up ready orders and you follow them live on the map until they reach your door.",
  },
];

const PROMISES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "shield",
    title: "Every partner is verified",
    text: "Doctors, riders and pharmacies start as pending and can only take work after our team reviews and approves them.",
  },
  {
    icon: "file",
    title: "Prescriptions are checked",
    text: "Prescription-only medicines are sent only after a pharmacist has reviewed your prescription.",
  },
  {
    icon: "key",
    title: "Safe hand-over",
    text: "A delivery is completed only when you share your own 4-digit code with the rider.",
  },
  {
    icon: "mapPin",
    title: "Your location stays yours",
    text: "A rider's live location is shared only during an active delivery, and only with that order's customer.",
  },
  {
    icon: "wallet",
    title: "Clear prices",
    text: "Medicine prices, the delivery fee and any discount are shown before you place an order.",
  },
  {
    icon: "package",
    title: "Fair if plans change",
    text: "Cancel any time before pickup and the held stock goes straight back to the pharmacy.",
  },
];

export default function AboutPage() {
  return (
    <div className={`${styles.page} flex-1`}>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="About MediGo"
          title={
            <>
              Healthcare that <span className={styles.gradientText}>comes to you</span>
            </>
          }
        >
          MediGo brings pharmacies, doctors and delivery riders into one app, so getting medicines and medical
          advice no longer means a trip across town.
        </PageHero>

        {/* Mission */}
        <section className="px-4 py-20 sm:px-6 sm:py-24" aria-labelledby="mission-title">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Why we built it</p>
              <h2 id="mission-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Getting care should not be the hard part
              </h2>
              <p className="mt-4 leading-relaxed text-[#4a6275]">
                When you are unwell, or caring for someone who is, the last thing you need is a long search for
                stock or a long queue at the clinic. Our mission is simple: bring the pharmacy, the doctor and the
                delivery to you, safely and with no guesswork.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-3xl border border-sky-100 bg-white p-7 shadow-[0_24px_60px_-30px_rgba(3,105,161,0.4)]">
                <p className="text-sm font-bold text-[#0b2135]">We set out to end</p>
                <ul className="mt-4 space-y-3">
                  {PROBLEMS.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] text-[#4a6275]">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-500">
                        <Icon name="close" size={14} strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="my-5 h-px bg-sky-100" />
                <p className="flex gap-3 text-[15px] font-semibold text-[#0b2135]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-[#0369a1]">
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                  One app where you search, consult, order and track.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What we do */}
        <section
          className="bg-gradient-to-b from-[#e3f2fa] to-[#f5fbff] px-4 py-20 sm:px-6 sm:py-24"
          aria-labelledby="pillars-title"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">What we do</p>
              <h2 id="pillars-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Three services, one connected platform
              </h2>
            </Reveal>
            <ul className="mt-14 grid gap-5 md:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 100}>
                  <article className={`${styles.card} h-full rounded-3xl border border-sky-100 bg-white p-7`}>
                    <span
                      className={`${styles.iconChip} grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-700/25`}
                    >
                      <Icon name={p.icon} size={22} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#4a6275]">{p.text}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Promises */}
        <section className="px-4 py-20 sm:px-6 sm:py-24" aria-labelledby="promises-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Our promises</p>
              <h2 id="promises-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Built on trust and safety
              </h2>
              <p className="mt-4 text-[#4a6275]">
                These are not just values on a page. Each one is a rule the platform enforces.
              </p>
            </Reveal>
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROMISES.map((p, i) => (
                <Reveal as="li" key={p.title} delay={(i % 3) * 90}>
                  <article className={`${styles.card} flex h-full gap-4 rounded-3xl border border-sky-100 bg-white p-6`}>
                    <span
                      className={`${styles.iconChip} grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-[#0369a1] ring-1 ring-sky-100`}
                    >
                      <Icon name={p.icon} size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[#4a6275]">{p.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 sm:px-6" aria-labelledby="about-cta">
          <Reveal className="mx-auto max-w-6xl">
            <div className={`${styles.hero} rounded-[2rem] px-6 py-14 text-center sm:px-12`}>
              <h2 id="about-cta" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Want to work with us?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sky-100">
                Whether you run a pharmacy, practise medicine or want to ride with us, we would love to hear from
                you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0369a1] shadow-xl shadow-sky-950/30 transition-transform hover:-translate-y-0.5"
                >
                  Get in touch
                  <Icon name="arrowRight" size={16} />
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                >
                  See the features
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
