import Link from "next/link";
import { Icon } from "./icons";
import { Reveal } from "./reveal";
import styles from "./styles";

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
    a: "Doctors and riders sign up in the app; pharmacies contact us. Every partner is reviewed and approved by our team before they can take orders or patients.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 sm:py-32" aria-labelledby="faq-title">
      <span className={`${styles.blob} -right-32 top-20 h-80 w-80 bg-sky-100`} aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0ea5e9]">FAQ</p>
          <h2 id="faq-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-4 text-[#4a6275]">Everything you need to know before your first order.</p>

          <div className={`${styles.hero} mt-8 overflow-hidden rounded-3xl p-7`}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Icon name="chat" size={22} />
            </span>
            <p className="mt-4 text-lg font-bold">Still have a question?</p>
            <p className="mt-1 text-sm text-sky-100">Our team reads every message and gets back to you.</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0369a1] transition-transform hover:-translate-y-0.5"
            >
              Contact us <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details
                className={`${styles.faq} group rounded-2xl border border-sky-100 bg-white/90 px-6 backdrop-blur transition-shadow open:border-sky-200 open:shadow-[0_20px_44px_-26px_rgba(3,105,161,0.55)]`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-bold">
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-50 text-xs font-extrabold text-[#0369a1] ring-1 ring-sky-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </span>
                  <span className={`${styles.chevron} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-50 text-[#0369a1] group-open:bg-[#0369a1] group-open:text-white`}>
                    <Icon name="chevronDown" size={18} />
                  </span>
                </summary>
                <p className="pb-5 pl-11 leading-relaxed text-[#4a6275]">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
