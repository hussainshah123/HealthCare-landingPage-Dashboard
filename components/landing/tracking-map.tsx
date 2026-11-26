import styles from "./styles";

const ROUTE = "M40 250 C 120 250, 120 150, 200 150 S 300 60, 380 70";

function RiderIcon() {
  return (
    <>
      <circle r="15" fill="#fff" stroke="#0369a1" strokeWidth="3" />
      <g
        transform="translate(-9 -9) scale(0.75)"
        fill="none"
        stroke="#0369a1"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18.5" cy="17.5" r="3.5" />
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="15" cy="5" r="1" />
        <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
      </g>
    </>
  );
}

/** Stylised city map with a rider travelling from the pharmacy to the customer. */
export function TrackingMap() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_30px_60px_-30px_rgba(3,105,161,0.45)]"
      role="img"
      aria-label="Live tracking map: a rider moves along the route from the pharmacy to the customer's door"
    >
      <svg viewBox="0 0 420 300" className="block h-auto w-full">
        <defs>
          <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="#e0f2fe" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="420" height="300" fill="#f0f9ff" />
        <rect width="420" height="300" fill="url(#mapGrid)" />
        {/* blocks and a park */}
        <rect x="70" y="30" width="90" height="70" rx="10" fill="#e0f2fe" />
        <rect x="250" y="160" width="120" height="90" rx="10" fill="#e0f2fe" />
        <rect x="20" y="120" width="70" height="60" rx="10" fill="#dcfce7" />
        <path d="M0 200 C 140 190, 220 230, 420 200" stroke="#fff" strokeWidth="18" fill="none" />
        <path d="M230 0 C 220 120, 260 200, 240 300" stroke="#fff" strokeWidth="16" fill="none" />

        {/* route */}
        <path d={ROUTE} stroke="#bae6fd" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path
          className={styles.route}
          d={ROUTE}
          stroke="#0369a1"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* pharmacy */}
        <g transform="translate(40 250)">
          <circle r="16" fill="#0369a1" />
          <path d="M-2-8h4v6h6v4h-6v6h-4v-6h-6v-4h6z" fill="#fff" />
        </g>
        {/* customer home with ping */}
        <g transform="translate(380 70)">
          <circle className={styles.ping} r="10" fill="#0ea5e9" />
          <circle r="14" fill="#0ea5e9" stroke="#fff" strokeWidth="3" />
          <path d="M-6 1l6-6 6 6v6h-12z" fill="#fff" />
        </g>
        {/* rider: moves along the route with SVG animateMotion (static for reduced motion) */}
        <g className={styles.riderMoving}>
          <RiderIcon />
          <animateMotion dur="7s" repeatCount="indefinite" path={ROUTE} keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />
        </g>
        <g className={styles.riderStatic} transform="translate(200 150)">
          <RiderIcon />
        </g>
      </svg>

      {/* floating status card */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-sky-100 backdrop-blur sm:left-auto sm:w-64">
        <span className={`${styles.pulseDot} grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-500 text-white`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0b2135]">Your rider is on the way</p>
          <p className="text-xs text-[#4a6275]">Share your 4-digit code at the door</p>
        </div>
      </div>
    </div>
  );
}
