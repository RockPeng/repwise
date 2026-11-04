import type { ReactNode } from "react";

/**
 * The icon set.
 *
 * One component, one file, no dependency: every glyph is drawn on a 24×24
 * grid with a 1.6 stroke so they sit at the same weight as Inter at 15–18px.
 * Icons are decorative by default — the surrounding label carries the
 * meaning — so they are always `aria-hidden`.
 */

const glyphs = {
  "arrow-right": (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  "arrow-up": (
    <>
      <path d="M12 20V5" />
      <path d="m6 11 6-6 6 6" />
    </>
  ),
  "arrow-down": (
    <>
      <path d="M12 4v15" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  check: <path d="m20 6-11 11-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  play: <path d="M7 4.8v14.4L19.5 12z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.4" />
      <path d="M3 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5a3.4 3.4 0 0 1 0 6.6" />
      <path d="M18 13.6a6.5 6.5 0 0 1 3 5.4" />
    </>
  ),
  message: (
    <>
      <path d="M20.5 14.5a3 3 0 0 1-3 3H8l-4.5 3.5V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z" />
      <path d="M8.5 8.5h7M8.5 12h4.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12.5" height="12" rx="2" />
      <path d="m15.5 11 5.5-3v8l-5.5-3z" />
    </>
  ),
  phone: (
    <path d="M5 3.5h3.5l2 5-2.4 1.6a12.5 12.5 0 0 0 5.8 5.8l1.6-2.4 5 2V19a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z" />
  ),
  mic: (
    <>
      <rect x="9.5" y="3" width="5" height="11" rx="2.5" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  "mic-off": (
    <>
      <path d="M9 9v2.5a3 3 0 0 0 4.6 2.5" />
      <path d="M15 11V5.5a2.5 2.5 0 0 0-4.7-1.2" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 10.3 5.3M18.5 11.5v.5M12 18v3" />
      <path d="m3 3 18 18" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5.5-2 7-2 7h16s-2-1.5-2-7" />
      <path d="M13.7 19.5a2 2 0 0 1-3.4 0" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.4-7.5-9.5A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.3c0 5.1-7.5 9.5-7.5 9.5z" />
  ),
  activity: <path d="M3 12h3.5l2.5-6.5 4 13 2.5-6.5H21" />,
  trending: (
    <>
      <path d="m3 16.5 5.5-5.5 4 3L21 5.5" />
      <path d="M15 5.5h6v6" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M7 20.5V11M12 20.5V5.5M17 20.5v-7" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.5 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2z" />
      <path d="M16 12.5h3.5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M18 7h2M4 17h3M12 17h8" />
      <circle cx="15.5" cy="7" r="2.2" />
      <circle cx="9.5" cy="17" r="2.2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  flame: (
    <path d="M12 21.5c4 0 7.2-2.8 7.2-6.7 0-4.6-4.6-6.2-5.6-11.3-2 2.4-4 4-4 7.6 0 1.6-1 2.1-1.6 1.3-.5-.7-.5-2.2-.5-2.2-1 1.6-1.7 3-1.7 5.6 0 3.9 3.2 5.7 6.2 5.7z" />
  ),
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 10v3.5l2.5 1.5M9.5 2.5h5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="m8.5 13.2-1.3 8L12 18l4.8 3.2-1.3-8" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
      <circle cx="12" cy="10.3" r="2.4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20.5 4v5h-5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 19.5h14" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6.5h16M7 12h10M10 17.5h4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4.5L20 8.5 15.5 4 4 15.5z" />
      <path d="m14 5.5 4.5 4.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </>
  ),
  "external-link": (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10.5 13.5" />
      <path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5" />
    </>
  ),
  "log-out": (
    <>
      <path d="M9.5 21H5a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 5 3h4.5" />
      <path d="m16 16.5 4.5-4.5L16 7.5" />
      <path d="M20.5 12H9.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </>
  ),
  send: (
    <>
      <path d="m21 3-7.5 18-3.5-7-7-3.5z" />
      <path d="M21 3 10 14" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.7L12 12.4 3.5 7.7z" />
      <path d="m3.5 12.4 8.5 4.7 8.5-4.7" />
      <path d="m3.5 16.9 8.5 4.7 8.5-4.7" />
    </>
  ),
  notebook: (
    <>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v18H7.5A2.5 2.5 0 0 1 5 18.5z" />
      <path d="M9 3v18" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 8.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2V10a2 2 0 0 0 0 4v1.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V14a2 2 0 0 0 0-4z" />
      <path d="M13 6.5v11" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 14H11l-1 7.5L19 10h-6.5z" />,
  sparkle: (
    <>
      <path d="M11 3.5 12.7 8l4.5 1.7-4.5 1.7L11 16l-1.7-4.6L4.8 9.7 9.3 8z" />
      <path d="m18 15 .9 2.3 2.3.9-2.3.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" />
    </>
  ),
  star: (
    <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
  ),
  shield: (
    <>
      <path d="M12 3.2 19 6v5.6c0 4.2-2.9 7.8-7 9.2-4.1-1.4-7-5-7-9.2V6z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  "square-check": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.8-2-3-4.5-3s-4.5 1.2-4.5 3 2 2.6 4.5 3 4.5 1.4 4.5 3.3-2 3.2-4.5 3.2-4.5-1.2-4.5-3" />
    </>
  ),
  percent: (
    <>
      <path d="M6 18 18 6" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </>
  ),
  "more-horizontal": (
    <>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.4 5.4 3.4 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.4-5.4-3.4-8.5S9.8 5.9 12 3.5z" />
    </>
  ),
  bookmark: <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof glyphs;

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  );
}
