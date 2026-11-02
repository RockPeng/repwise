import type { MouseEventHandler, ReactNode } from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "lg" | "md" | "xl";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
  title?: string;
  children: ReactNode;
};

type ButtonProps =
  | (ButtonBaseProps & {
      href: string;
      disabled?: boolean;
      target?: string;
      rel?: string;
      onClick?: MouseEventHandler<HTMLAnchorElement>;
    })
  | (ButtonBaseProps & {
      href?: undefined;
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
      name?: string;
      value?: string | number | readonly string[];
      form?: string;
      onClick?: MouseEventHandler<HTMLButtonElement>;
    });

export const buttonClasses: Record<ButtonVariant, string> = {
  primary: "vertex-button--primary",
  secondary: "vertex-button--secondary",
  tertiary: "vertex-button--tertiary",
  text: "vertex-button--text",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "lg",
    href,
    disabled = false,
    className,
    children,
  } = props;
  const classes = cn(
    "vertex-button",
    buttonClasses[variant],
    `vertex-button--${size}`,
    disabled && "is-disabled",
    className,
  );
  const content = (
    <>
      {variant === "text" && <PlayCircle size={16} aria-hidden="true" />}
      {children}
      {variant === "tertiary" && (
        <ExternalLink size={14} aria-hidden="true" />
      )}
    </>
  );

  if (typeof href === "string") {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-disabled={disabled || undefined}
        aria-label={props["aria-label"]}
        title={props.title}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={props.type ?? "button"}
      disabled={disabled}
      name={props.name}
      value={props.value}
      form={props.form}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
      title={props.title}
    >
      {content}
    </button>
  );
}
