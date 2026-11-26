import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon, type IconName } from "@/components/landing/icons";
import { PageHero } from "@/components/landing/page-hero";
import { Reveal } from "@/components/landing/reveal";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import styles from "@/components/landing/styles";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact MediGo · We're here to help",
  description:
    "Questions about an order, a consultation or partnering with MediGo as a pharmacy, doctor or rider? Send us a message.",
};

const INFO: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "chat",
    title: "A real person reads it",
    text: "Every message goes straight to our team's dashboard. We reply by email, or by phone if you leave a number.",
  },
  {
    icon: "store",
    title: "Joining as a partner?",
    text: "Pharmacies, doctors and riders: tell us a little about yourself and we will guide you through verification.",
  },
  {
    icon: "package",
    title: "Help with an order",
    text: "Include your order number (you will find it in the Orders tab of the app) so we can find it quickly.",
  },
];

function FormSkeleton() {
  return (
    <div className="h-[640px] animate-pulse rounded-3xl border border-sky-100 bg-white" aria-hidden="true" />
  );
}

export default function ContactPage() {
  return (
    <div className={`${styles.page} flex-1`}>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Contact"
          title={
            <>
              We&apos;re here <span className={styles.gradientText}>to help</span>
            </>
          }
        >
          Questions about an order or a consultation, or want to partner with MediGo? Send us a message and our
          team will get back to you.
        </PageHero>

        <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Contact form">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              {INFO.map((i, n) => (
                <Reveal key={i.title} delay={n * 90}>
                  <article className={`${styles.card} flex gap-4 rounded-3xl border border-sky-100 bg-white p-6`}>
                    <span
                      className={`${styles.iconChip} grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-700/25`}
                    >
                      <Icon name={i.icon} size={20} />
                    </span>
                    <div>
                      <h2 className="font-bold">{i.title}</h2>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[#4a6275]">{i.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={300}>
                <div className="rounded-3xl bg-gradient-to-br from-[#e3f2fa] to-white p-6 ring-1 ring-sky-100">
                  <p className="font-bold">Run a pharmacy already on MediGo?</p>
                  <p className="mt-1.5 text-[15px] text-[#4a6275]">
                    Manage orders, stock and prescriptions from the partner portal.
                  </p>
                  <Link
                    href="/login"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0369a1] hover:underline"
                  >
                    Go to partner login <Icon name="arrowRight" size={15} />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm />
              </Suspense>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
