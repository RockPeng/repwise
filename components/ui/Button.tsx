import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * The button.
 *
 * Four weights of action, one shape. The primary is a solid pill in the
 * accent — the only filled green in the product — and everything else is a
 * line or a label. There is no shadow anywhere: a border and a fill are
 * enough on a dark ground, and shadows are what make a set of cards read as
 * a template.
 *
 * It renders as a link when given an `href` and as a button otherwise, so a
 * call to action is never a `<div>` with a click handler.
 */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-solid text-accent-ink hover:brightness-[1.08] active:brightness-95",
  secondary:
    "border border-line-2 text-ink hover:border-ink-3 hover:bg-surface-2",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
  danger:
    "border border-danger/45 text-danger hover:bg-danger-soft hover:border-danger",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3.5 text-[13px]",
  md: "h-10 gap-2 px-5 text-sm",
  lg: "h-12 gap-2.5 px-6 text-[15px]",
};

const base =
  "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-[-0.005em] transition-[background-color,border-color,color,filter] duration-150 disabled:pointer-events-none disabled:opacity-45";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Places the icon after the label instead of before it. */
  iconAfter?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconAfter = false,
  className = "",
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "children">) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <button
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && !iconAfter ? <Icon name={icon} size={iconSize} /> : null}
      {children}
      {icon && iconAfter ? <Icon name={icon} size={iconSize} /> : null}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  iconAfter = false,
  className = "",
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "children">) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <Link
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && !iconAfter ? <Icon name={icon} size={iconSize} /> : null}
      {children}
      {icon && iconAfter ? <Icon name={icon} size={iconSize} /> : null}
    </Link>
  );
}
