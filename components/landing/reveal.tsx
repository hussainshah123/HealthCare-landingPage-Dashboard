"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./styles";

/**
 * Fades and slides its children in the first time they scroll into view.
 * Content is fully visible without JavaScript (the hidden state is only
 * applied after hydration), so nothing is lost for crawlers or no-JS visitors.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Already on screen at load: show without animating.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setState("shown");
      return;
    }
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls =
    state === "static" ? "" : `${styles.reveal} ${state === "shown" ? styles.revealed : ""}`;

  return (
    <Tag
      ref={ref as never}
      className={`${cls} ${className}`}
      style={{ ["--delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
