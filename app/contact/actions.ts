"use server";

import { headers } from "next/headers";
import { serverApiUrl } from "@/lib/config";
import { isTopic } from "./topics";

export type ContactField = "name" | "email" | "phone" | "topic" | "message";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  /** What the visitor typed, so the form keeps it after a failed submit. */
  values?: Partial<Record<ContactField, string>>;
}

// Per-visitor limit. The backend sees every request coming from this server,
// so it cannot tell visitors apart. In-memory: per server instance, which is
// enough to stop a single visitor from flooding the inbox.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    recent.set(ip, times);
    return true;
  }
  times.push(now);
  recent.set(ip, times);
  if (recent.size > 5000) recent.delete(recent.keys().next().value!);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 -]{10,18}$/;

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.phone && !PHONE_RE.test(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (!isTopic(values.topic)) errors.topic = "Please choose a topic.";
  if (values.message.length < 10) errors.message = "Please write at least 10 characters.";
  if (values.message.length > 2000) errors.message = "Please keep your message under 2000 characters.";
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "You have sent several messages in a short time. Please try again in a few minutes.",
      values,
    };
  }

  try {
    const res = await fetch(`${serverApiUrl()}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, phone: values.phone || undefined }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      return { status: "success", message: "Thanks! Your message has been sent. We will get back to you soon." };
    }
    if (res.status === 400) {
      return { status: "error", message: "Please check your details and try again.", values };
    }
    if (res.status === 429) {
      return { status: "error", message: "We are receiving a lot of messages. Please try again shortly.", values };
    }
    throw new Error(`Contact API returned ${res.status}`);
  } catch (error) {
    console.error("Contact form submission failed", error);
    return {
      status: "error",
      message: "We could not send your message right now. Please try again in a moment.",
      values,
    };
  }
}
