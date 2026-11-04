/**
 * A switch.
 *
 * A real checkbox with a styled track, so it works without JavaScript and
 * announces itself as a checkbox rather than as a mystery toggle.
 */
export function Toggle({
  checked,
  label,
  showLabel = false,
  onChange,
}: {
  checked: boolean;
  /** The accessible name. */
  label: string;
  /** Whether the name is also shown next to the switch. */
  showLabel?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2.5">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={onChange ? checked : undefined}
        defaultChecked={onChange ? undefined : checked}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
        aria-label={label}
      />
      <span
        aria-hidden="true"
        className="relative block h-[18px] w-8 shrink-0 rounded-full bg-surface-2 transition-colors peer-checked:bg-accent peer-checked:[&>span]:translate-x-[14px] peer-checked:[&>span]:bg-accent-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        <span className="absolute top-[2px] left-[2px] block size-[14px] rounded-full bg-ink-3 transition-transform" />
      </span>
      {showLabel ? (
        <span className="text-[13px] text-ink-2">{label}</span>
      ) : null}
    </label>
  );
}
