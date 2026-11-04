import type { CSSProperties, ReactNode } from "react";

/**
 * The signature shape: a cut corner.
 *
 * Media frames are sharp and chamfered rather than rounded, which is what
 * keeps a page of coaches and programmes from reading as a grid of identical
 * cards. The cut size is set per frame through `--cut`, and an optional
 * accent line is drawn along the diagonal so the corner reads as deliberate
 * rather than as a crop.
 *
 * `className` lands on the outer element, so an aspect ratio or a grid
 * track can be set here and the clipped frame fills it.
 */
export function Chamfer({
  cut = 28,
  side = "bl",
  accent = false,
  className = "",
  style,
  children,
}: {
  /** The size of the cut, in pixels. */
  cut?: number;
  /** Which corner is cut away. */
  side?: "bl" | "tl";
  /** Draw the accent line along the diagonal. */
  accent?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const cutStyle = { "--cut": `${cut}px`, ...style } as CSSProperties;

  return (
    <div className={`relative ${className}`} style={cutStyle}>
      <div
        className={`${side === "bl" ? "chamfer-bl" : "chamfer-tl"} relative size-full overflow-hidden`}
      >
        {children}
      </div>
      {accent ? <Diagonal cut={cut} side={side} /> : null}
    </div>
  );
}

/**
 * The accent line along the cut.
 *
 * It is a sibling of the clipped frame rather than a child, because the
 * clip-path would cut the line in half. The geometry: for a bottom-left cut
 * of size S the diagonal runs from (0, height − S) to (S, height), so the
 * line starts at the left edge, one cut-size above the bottom, and rotates
 * 45° about that point.
 */
function Diagonal({ cut, side }: { cut: number; side: "bl" | "tl" }) {
  if (side === "tl") {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 block h-0.5 bg-accent"
        style={{
          top: cut,
          width: `${cut * 1.4143}px`,
          transform: "rotate(-45deg)",
          transformOrigin: "0 50%",
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 block h-0.5 bg-accent"
      style={{
        top: `calc(100% - ${cut}px)`,
        width: `${cut * 1.4143}px`,
        transform: "rotate(45deg)",
        transformOrigin: "0 50%",
      }}
    />
  );
}
