import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/landing/styles";
import { Bubbles, Capsule, Tablet, Waves } from "@/components/landing/decor";
import { Icon, type IconName } from "@/components/landing/icons";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import { Reveal } from "@/components/landing/reveal";
import { SiteNav } from "@/components/landing/site-nav";
import { TrackingMap } from "@/components/landing/tracking-map";

export const metadata: Metadata = {
  title: "MediGo · Medicines, doctors and delivery in one app",
  description:
    "Order medicines from nearby pharmacies, upload prescriptions, consult doctors by video, audio or chat, and track your rider live to your door.",
};

// Marketing page: no request-time data, keep the whole route static.
export const ensureStatic = "navigation";

const FEATURES: { icon: IconName; title: string; text: string; tint: string }[] = [
  {
    icon: "pill",
    title: "Order medicines",
    text: "Search by name or brand, compare prices across pharmacies and check out from the one that suits you.",
    tint: "from-sky-500 to-sky-700",
  },
  {
    icon: "file",
    title: "Upload a prescription",
    text: "Snap your prescription and a pharmacist reviews it before prescription-only medicines are sent.",
    tint: "from-cyan-500 to-sky-600",
  },
  {
    icon: "video",
    title: "Consult a doctor",
    text: "Book an open slot with a verified doctor and talk by video, audio or chat, then get a digital prescription.",
    tint: "from-blue-500 to-indigo-600",
  },
  {
    icon: "mapPin",
    title: "Live rider tracking",
    text: "Watch your rider on the map from pickup to your door, and call them right from the tracking screen.",
    tint: "from-teal-500 to-cyan-600",
  },
  {
    icon: "key",
    title: "Safe hand-over",
    text: "Every order is closed with your own 4-digit code, so your medicines only reach you.",
    tint: "from-sky-600 to-blue-800",
  },
  {
    icon: "wallet",
    title: "Pay your way",
    text: "Cash on delivery or pay online. Prices, delivery fee and any discount are shown before you order.",
    tint: "from-cyan-600 to-teal-700",
  },
];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "search", title: "Find", text: "Search medicines or pick a category, and see each pharmacy's price." },
  { icon: "file", title: "Verify", text: "Add a prescription if a medicine needs one. A pharmacist checks it." },
  { icon: "package", title: "Prepare", text: "The pharmacy confirms and packs your order, then a nearby rider accepts it." },
  { icon: "bike", title: "Deliver", text: "Track the rider live and share your 4-digit code at the door." },
];

const AUDIENCES: { icon: IconName; who: string; lead: string; points: string[] }[] = [
  {
    icon: "user",
    who: "Customers",
    lead: "Everything for your health in one app.",
    points: [
      "Medicines from nearby pharmacies",
      "Doctor consultations by video, audio or chat",
      "Saved addresses with your exact map pin",
      "Order history, re-order and cancel before pickup",
    ],
  },
  {
    icon: "store",
    who: "Pharmacies",
    lead: "A web dashboard to run online orders.",
    points: [
      "Manage stock and prices for every medicine",
      "Review prescriptions before you confirm",
      "Move orders from confirmed to ready for pickup",
      "Nearby riders pick up orders when they are ready",
    ],
  },
  {
    icon: "stethoscope",
    who: "Doctors",
    lead: "See patients online on your schedule.",
    points: [
      "Set your weekly availability and slot length",
      "Consult by video, audio or chat",
      "Write digital prescriptions in the app",
      "Track your earnings and payouts",
    ],
  },
  {
    icon: "bike",
    who: "Riders",
    lead: "Deliver when you want, earn per drop.",
    points: [
      "Go online and see orders waiting for pickup",
      "One tap opens directions in your maps app",
      "Earnings and delivery history in one place",
      "Every partner is verified by our team",
    ],
  },
];

const FAQ = [
  {
    q: "Do I need a prescription to order?",
    a: "Only for prescription-only medicines. Upload a photo or PDF of your prescription at checkout and a pharmacist reviews it before your order is confirmed. Everything else can be ordered straight away.",
  },
  {
    q: "How do I know my medicines reach me safely?",
    a: "You can follow your rider live on the map, and the delivery is only completed when you give the rider your own 4-digit code.",
  },
  {
    q: "How does a doctor consultation work?",
    a: "Pick a doctor, choose an open time slot and the type of consultation: video, audio or chat. At the time of your appointment you join from the app, and the doctor can send you a digital prescription.",
  },
  {
    q: "How can I pay?",
    a: "You can pay cash on delivery or choose to pay online. The total, including the delivery fee and any coupon discount, is shown before you place the order.",
  },
  {
    q: "Can I cancel an order?",
    a: "Yes, any time before the rider picks it up. Held stock goes straight back to the pharmacy.",
  },
  {
    q: "How do pharmacies, doctors and riders join?",
    a: "Sign up in the app (doctors and riders) or contact us (pharmacies). Every partner is reviewed and approved by our team before they can take orders or patients.",
  },
];

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
              <PhoneMockup />
            </div>
          </div>

          <Waves />
        </section>

        {/* ---------------- Features ---------------- */}
        <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28" aria-labelledby="features-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">What you can do</p>
              <h2 id="features-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                One app for your pharmacy, your doctor and your delivery
              </h2>
              <p className="mt-4 text-[#4a6275]">
                No more calling around for stock or waiting in clinic queues. MediGo brings pharmacies, doctors and
                riders together so you can get care from home.
              </p>
            </Reveal>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal as="li" key={f.title} delay={(i % 3) * 90}>
                  <article className={`${styles.card} h-full rounded-3xl border border-sky-100 bg-white p-7`}>
                    <span
                      className={`${styles.iconChip} grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tint} text-white shadow-lg shadow-sky-700/25`}
                    >
                      <Icon name={f.icon} size={22} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#4a6275]">{f.text}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section
          id="how-it-works"
          className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-[#e3f2fa] to-[#f5fbff] px-4 py-20 sm:px-6 sm:py-28"
          aria-labelledby="how-title"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">How it works</p>
              <h2 id="how-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                From search to your door in four steps
              </h2>
            </Reveal>

            <Reveal className="relative mt-16">
              <div
                className={`${styles.connector} absolute left-[12.5%] right-[12.5%] top-8 hidden h-1 rounded-full bg-gradient-to-r from-[#0369a1] via-[#0ea5e9] to-[#67e8f9] lg:block`}
                aria-hidden="true"
              />
              <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="text-center">
                    <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-[#0369a1] shadow-[0_12px_30px_-10px_rgba(3,105,161,0.5)] ring-4 ring-[#e3f2fa]">
                      <Icon name={s.icon} size={26} />
                      <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-[16rem] text-[15px] leading-relaxed text-[#4a6275]">{s.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Live tracking ---------------- */}
        <section id="tracking" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28" aria-labelledby="tracking-title">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <TrackingMap />
            </Reveal>
            <Reveal delay={120}>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Live tracking</p>
              <h2 id="tracking-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Know exactly where your medicines are
              </h2>
              <p className="mt-4 text-[#4a6275]">
                As soon as a rider accepts your order, you see them move on the map in real time, from the pharmacy
                counter to your doorstep.
              </p>
              <ul className="mt-7 space-y-4">
                {[
                  { t: "Status at every step", d: "Confirmed, preparing, picked up, on the way: you get a notification each time." },
                  { t: "Rider details up front", d: "Name, vehicle number and a one-tap call button." },
                  { t: "Your location stays private", d: "Live location is shared only during an active delivery, and only with you." },
                ].map((x) => (
                  <li key={x.t} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-[#0369a1]">
                      <Icon name="check" size={14} strokeWidth={3} />
                    </span>
                    <span>
                      <span className="font-bold">{x.t}.</span>{" "}
                      <span className="text-[#4a6275]">{x.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Partners ---------------- */}
        <section
          id="partners"
          className="scroll-mt-20 bg-gradient-to-b from-[#f5fbff] to-[#e3f2fa] px-4 py-20 sm:px-6 sm:py-28"
          aria-labelledby="partners-title"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">Built for everyone</p>
              <h2 id="partners-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                One platform, four sides of care
              </h2>
            </Reveal>

            <ul className="mt-14 grid gap-5 md:grid-cols-2">
              {AUDIENCES.map((a, i) => (
                <Reveal as="li" key={a.who} delay={(i % 2) * 100}>
                  <article className={`${styles.card} h-full rounded-3xl border border-sky-100 bg-white p-7`}>
                    <div className="flex items-center gap-4">
                      <span className={`${styles.iconChip} grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-[#0369a1] ring-1 ring-sky-100`}>
                        <Icon name={a.icon} size={22} />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold">{a.who}</h3>
                        <p className="text-sm text-[#4a6275]">{a.lead}</p>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {a.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[15px]">
                          <Icon name="check" size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-[#0ea5e9]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-10 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b2135] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Pharmacy or admin? Sign in to the portal
                <Icon name="arrowRight" size={16} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28" aria-labelledby="faq-title">
          <div className="mx-auto max-w-3xl">
            <Reveal className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">FAQ</p>
              <h2 id="faq-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Questions, answered
              </h2>
            </Reveal>
            <div className="mt-12 space-y-3">
              {FAQ.map((f, i) => (
                <Reveal key={f.q} delay={i * 50}>
                  <details className={`${styles.faq} group rounded-2xl border border-sky-100 bg-white px-6 open:shadow-[0_16px_40px_-24px_rgba(3,105,161,0.5)]`}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold">
                      {f.q}
                      <Icon name="chevronDown" size={20} className={`${styles.chevron} shrink-0 text-[#0369a1]`} />
                    </summary>
                    <p className="pb-5 leading-relaxed text-[#4a6275]">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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

      <footer className="border-t border-sky-100 bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#4a6275] sm:flex-row">
          <p className="font-semibold text-[#0b2135]">MediGo</p>
          <nav aria-label="Footer" className="flex gap-6">
            <Link href="/about" className="hover:text-[#0369a1]">About</Link>
            <Link href="/contact" className="hover:text-[#0369a1]">Contact</Link>
            <Link href="/login" className="hover:text-[#0369a1]">Partner login</Link>
          </nav>
          <p>© MediGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
