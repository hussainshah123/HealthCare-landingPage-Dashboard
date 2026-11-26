import type { CSSProperties } from "react";
import styles from "./styles";

const BUBBLES = [
  { left: "6%", size: 18, duration: 14, delay: 0 },
  { left: "14%", size: 42, duration: 19, delay: 3 },
  { left: "27%", size: 12, duration: 12, delay: 6 },
  { left: "38%", size: 28, duration: 17, delay: 1 },
  { left: "52%", size: 16, duration: 13, delay: 8 },
  { left: "63%", size: 54, duration: 22, delay: 4 },
  { left: "74%", size: 14, duration: 15, delay: 10 },
  { left: "83%", size: 32, duration: 18, delay: 2 },
  { left: "92%", size: 20, duration: 16, delay: 7 },
];

/** Water bubbles rising through the section behind the content. */
export function Bubbles() {
  return (
    <div aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className={styles.bubble}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Two-tone capsule drawn in SVG. */
export function Capsule({
  color = "#38bdf8",
  size = 64,
  rotate = 0,
  slow = false,
  className = "",
  style,
}: {
  color?: string;
  size?: number;
  rotate?: number;
  slow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const w = size * 0.4;
  const r = w / 2;
  return (
    <span
      aria-hidden="true"
      className={`${slow ? styles.floatSlow : styles.float} pointer-events-none absolute ${className}`}
      style={{ ...style, ["--r" as string]: `${rotate}deg` }}
    >
      <svg width={w} height={size} viewBox={`0 0 ${w} ${size}`}>
        <path d={`M0 ${r} A${r} ${r} 0 0 1 ${w} ${r} V${size / 2} H0 Z`} fill={color} />
        <path d={`M0 ${size / 2} H${w} V${size - r} A${r} ${r} 0 0 1 0 ${size - r} Z`} fill="#fff" />
        <rect
          x="0.75"
          y="0.75"
          width={w - 1.5}
          height={size - 1.5}
          rx={r - 0.75}
          fill="none"
          stroke="rgba(2,72,115,0.25)"
          strokeWidth="1.5"
        />
        <rect x={w * 0.2} y={size * 0.12} width={w * 0.18} height={size * 0.28} rx={w * 0.09} fill="#fff" opacity="0.6" />
      </svg>
    </span>
  );
}

/** Round tablet with a score line. */
export function Tablet({
  size = 30,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.floatSlow} pointer-events-none absolute ${className}`}
      style={style}
    >
      <svg width={size} height={size} viewBox="0 0 30 30">
        <defs>
          <linearGradient id="tabletFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#bae6fd" />
          </linearGradient>
        </defs>
        <circle cx="15" cy="15" r="14" fill="url(#tabletFill)" stroke="rgba(2,72,115,0.25)" strokeWidth="1.5" />
        <path d="M8 15h14" stroke="rgba(2,72,115,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function wavePath(amp: number, h: number) {
  // Two identical periods across 2400 units so sliding by half loops seamlessly.
  let d = `M0 ${amp}`;
  for (let i = 0; i < 4; i++) {
    const o = i * 600;
    d += ` Q${o + 150} 0 ${o + 300} ${amp} T${o + 600} ${amp}`;
  }
  return `${d} V${h} H0 Z`;
}

/**
 * Layered waves sliding along the bottom edge, filled with the next section's
 * colour. `backFill` tints the two translucent back layers (use a blue over
 * dark sections so they don't turn grey).
 */
export function Waves({ fill = "#f5fbff", backFill }: { fill?: string; backFill?: string }) {
  return (
    <div className={styles.waves} aria-hidden="true">
      <svg className={styles.wave} style={{ animationDuration: "18s" }} viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={wavePath(36, 120)} fill={backFill ?? fill} opacity="0.35" transform="translate(0 20)" />
      </svg>
      <svg
        className={styles.wave}
        style={{ animationDuration: "26s", animationDirection: "reverse" }}
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
      >
        <path d={wavePath(28, 120)} fill={backFill ?? fill} opacity="0.55" transform="translate(0 40)" />
      </svg>
      <svg className={styles.wave} style={{ animationDuration: "12s" }} viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={wavePath(20, 120)} fill={fill} transform="translate(0 62)" />
      </svg>
    </div>
  );
}
