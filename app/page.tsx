import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/landing/styles";
import { Bubbles, Capsule, Tablet, Waves } from "@/components/landing/decor";
import { AudienceTabs } from "@/components/landing/audience-tabs";
import { FaqSection } from "@/components/landing/faq-section";
import { FeatureBento } from "@/components/landing/feature-bento";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Icon } from "@/components/landing/icons";
import { SpotlightGroup, Tilt } from "@/components/landing/interactive";
import { Marquee } from "@/components/landing/marquee";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import { Reveal } from "@/components/landing/reveal";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { TrackingSection } from "@/components/landing/tracking-section";

export const metadata: Metadata = {
  title: "MediGo · Medicines, doctors and delivery in one app",
  description:
    "Order medicines from nearby pharmacies, upload prescriptions, consult doctors by video, audio or chat, and track your rider live to your door.",
};

// Marketing page: no request-time data, keep the whole route static.
export const ensureStatic = "navigation";

export default function Home() {
  return (
    <div className={`${styles.page} flex-1`}>
      <SiteNav />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className={`${styles.hero} pb-40 pt-28 sm:pt-32`} aria-labelledby="hero-title">
          <Bubbles />
          <Capsule color="#7dd3fc" size={70} rotate={30} className="left-[4%] top-28 hidden opacity-70 lg:block" />
          <Capsule color="#fda4af" size={52} rotate={-35} slow className="right-[46%] top-24 hidden opacity-60 lg:block" />
          <Tablet size={34} className="bottom-44 left-[38%] hidden opacity-70 md:block" />
          <Capsule color="#a5f3fc" size={46} rotate={60} slow className="bottom-40 right-[6%] opacity-60" />

          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.25)]" />
                  Pharmacy · Doctors · Delivery
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 id="hero-title" className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  Your health,{" "}
                  <span className={styles.gradientText}>delivered</span>
                  <br className="hidden sm:block" /> in one tap.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-100 sm:text-lg">
                  Order medicines from pharmacies near you, consult verified doctors by video, audio or chat,
                  and watch your rider bring it all to your door.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#get-app"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0369a1] shadow-xl shadow-sky-950/30 transition-transform hover:-translate-y-0.5"
                  >
                    <Icon name="download" size={18} />
                    Get the app
                    <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                  >
                    See how it works
                  </a>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <ul className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm">
                  {[
                    { icon: "shield" as const, t: "Verified partners" },
                    { icon: "mapPin" as const, t: "Live GPS tracking" },
                    { icon: "key" as const, t: "OTP hand-over" },
                  ].map((b) => (
                    <li key={b.t} className="flex flex-col gap-2 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur">
                      <Icon name={b.icon} size={20} className="text-sky-200" />
                      <span className="font-semibold leading-tight">{b.t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 m-auto h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
              <Tilt>
                <PhoneMockup />
              </Tilt>
            </div>
          </div>

          <Waves />
        </section>

        <Marquee />

        {/* ---------------- Features ---------------- */}
        <section id="features" className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 sm:py-32" aria-labelledby="features-title">
          <span className={`${styles.blob} -left-40 top-24 h-96 w-96 bg-sky-100`} aria-hidden="true" />
          <span className={`${styles.blob} -right-32 bottom-10 h-80 w-80 bg-cyan-100`} aria-hidden="true" style={{ animationDelay: "-8s" }} />
          <div className="relative mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">What you can do</p>
              <h2 id="features-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Your pharmacy, your doctor and your delivery. <span className="text-[#0369a1]">One app.</span>
              </h2>
              <p className="mt-4 text-[#4a6275]">
                No more calling around for stock or waiting in clinic queues. MediGo brings pharmacies, doctors and
                riders together so you can get care from home.
              </p>
            </Reveal>
            <SpotlightGroup>
              <FeatureBento />
            </SpotlightGroup>
          </div>
        </section>

        <HowItWorks />

        <TrackingSection />

        {/* ---------------- Partners ---------------- */}
        <section
          id="partners"
          className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-[#f5fbff] via-[#e8f5fc] to-[#f5fbff] px-4 py-24 sm:px-6 sm:py-32"
          aria-labelledby="partners-title"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Built for everyone</p>
              <h2 id="partners-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                One platform, four sides of care
              </h2>
              <p className="mt-4 text-[#4a6275]">Pick who you are to see what MediGo does for you.</p>
            </Reveal>
            <Reveal>
              <AudienceTabs />
            </Reveal>
          </div>
        </section>

        <FaqSection />

        {/* ---------------- Get the app ---------------- */}
        <section id="get-app" className="scroll-mt-20 px-4 pb-24 sm:px-6" aria-labelledby="app-title">
          <Reveal className="mx-auto max-w-6xl">
            <div className={`${styles.hero} rounded-[2rem] px-6 py-16 text-center sm:px-12`}>
              <Bubbles />
              <Capsule color="#7dd3fc" size={56} rotate={-25} className="left-[8%] top-10 hidden opacity-70 sm:block" />
              <Capsule color="#fda4af" size={44} rotate={40} slow className="bottom-10 right-[10%] hidden opacity-60 sm:block" />
              <h2 id="app-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Care that comes to you
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sky-100">
                MediGo is built for Android and iOS. Want early access for yourself, your pharmacy or your clinic?
                Get in touch and we&apos;ll set you up.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0369a1] shadow-xl shadow-sky-950/30 transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="phone" size={18} />
                  Contact us
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
                >
                  About MediGo
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
