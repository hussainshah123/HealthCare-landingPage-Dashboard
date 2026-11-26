"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/landing/icons";
import { sendContactMessage, type ContactField, type ContactState } from "./actions";
import { TOPIC_OPTIONS, isTopic, type Topic } from "./topics";

const INITIAL: ContactState = { status: "idle" };
const EMPTY = { name: "", email: "", phone: "", message: "" };

const inputCls =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-[#0b2135] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0ea5e9] focus:ring-4 focus:ring-sky-100";

export function ContactForm() {
  const params = useSearchParams();
  const fromLink = params.get("topic");
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL);
  const [fields, setFields] = useState(EMPTY);
  const [topic, setTopic] = useState<Topic>(isTopic(fromLink) ? fromLink : "CUSTOMER");
  const statusRef = useRef<HTMLDivElement>(null);

  // Move focus to the result so screen-reader and keyboard users hear it.
  // (Fields are controlled, so they keep what was typed after a failed submit.)
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const err = (f: ContactField) => state.errors?.[f];
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((v) => ({ ...v, [k]: e.target.value }));

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center rounded-3xl border border-sky-100 bg-white px-6 py-14 text-center outline-none"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] text-white shadow-lg shadow-sky-600/30 motion-safe:animate-[bounce_1s_ease-in-out_2]">
          <Icon name="check" size={30} strokeWidth={3} />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold">Message sent</h2>
        <p className="mt-2 max-w-sm text-[#4a6275]">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full px-5 py-2.5 text-sm font-bold text-[#0369a1] ring-1 ring-sky-200 hover:bg-sky-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8" aria-describedby="form-status">
      <fieldset>
        <legend className="text-sm font-bold text-[#0b2135]">What is this about?</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {TOPIC_OPTIONS.map((t) => {
            const on = topic === t.value;
            return (
              <label
                key={t.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                  on ? "border-[#0ea5e9] bg-sky-50 ring-4 ring-sky-100" : "border-sky-100 hover:border-sky-200"
                } ${t.value === "OTHER" ? "sm:col-span-2" : ""}`}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t.value}
                  checked={on}
                  onChange={() => setTopic(t.value)}
                  className="mt-1 h-4 w-4 accent-[#0369a1]"
                />
                <span>
                  <span className="block text-[15px] font-semibold text-[#0b2135]">{t.label}</span>
                  <span className="block text-sm text-[#4a6275]">{t.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {err("topic") ? <p className="mt-2 text-sm text-rose-600">{err("topic")}</p> : null}
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-[#0b2135]">
            Full name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={fields.name}
            onChange={set("name")}
            aria-invalid={!!err("name")}
            aria-describedby={err("name") ? "name-error" : undefined}
            className={`${inputCls} ${err("name") ? "border-rose-400" : "border-sky-100"}`}
          />
          {err("name") ? (
            <p id="name-error" className="mt-1.5 text-sm text-rose-600">
              {err("name")}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-[#0b2135]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={set("email")}
            aria-invalid={!!err("email")}
            aria-describedby={err("email") ? "email-error" : undefined}
            className={`${inputCls} ${err("email") ? "border-rose-400" : "border-sky-100"}`}
          />
          {err("email") ? (
            <p id="email-error" className="mt-1.5 text-sm text-rose-600">
              {err("email")}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="text-sm font-semibold text-[#0b2135]">
            Phone <span className="font-normal text-[#4a6275]">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="03XX XXXXXXX"
            value={fields.phone}
            onChange={set("phone")}
            aria-invalid={!!err("phone")}
            aria-describedby={err("phone") ? "phone-error" : undefined}
            className={`${inputCls} ${err("phone") ? "border-rose-400" : "border-sky-100"}`}
          />
          {err("phone") ? (
            <p id="phone-error" className="mt-1.5 text-sm text-rose-600">
              {err("phone")}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="message" className="text-sm font-semibold text-[#0b2135]">
              Message
            </label>
            <span className={`text-xs ${fields.message.length > 2000 ? "text-rose-600" : "text-[#4a6275]"}`}>
              {fields.message.length}/2000
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={fields.message}
            onChange={set("message")}
            aria-invalid={!!err("message")}
            aria-describedby={err("message") ? "message-error" : undefined}
            placeholder="How can we help?"
            className={`${inputCls} resize-y ${err("message") ? "border-rose-400" : "border-sky-100"}`}
          />
          {err("message") ? (
            <p id="message-error" className="mt-1.5 text-sm text-rose-600">
              {err("message")}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div
        id="form-status"
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="outline-none"
      >
        {state.status === "error" && state.message ? (
          <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{state.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
        {!pending ? <Icon name="arrowRight" size={16} /> : null}
      </button>
    </form>
  );
}
