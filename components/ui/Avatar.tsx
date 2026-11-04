import Image from "next/image";
import { initials } from "@/lib/format";

/**
 * A portrait.
 *
 * The initials sit underneath the image as a fallback layer, so a broken or
 * slow image still shows a person rather than a grey box.
 */
export function Avatar({
  name,
  src,
  size = 40,
  className = "",
  ring = false,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 font-display text-[11px] font-semibold uppercase tracking-wide text-ink-3 ${
        ring ? "ring-1 ring-line-2 ring-offset-2 ring-offset-surface-0" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <span aria-hidden="true">{initials(name)}</span>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  );
}
