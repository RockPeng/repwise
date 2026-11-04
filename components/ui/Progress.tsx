import { Icon } from "./Icon";

/**
 * A progress bar.
 *
 * Square ends, hairline weight, one accent fill. A rounded capsule would be
 * softer than the rest of the page; this is meant to read like a gauge.
 */
export function Progress({
  value,
  label,
  className = "",
}: {
  /** 0–100. */
  value: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`h-[3px] w-full overflow-hidden bg-surface-2 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="h-full bg-accent"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/**
 * A star rating. Filled stars are drawn with a clip so a half star reads
 * correctly at 4.9.
 */
export function Stars({
  value,
  size = 14,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      className={`inline-flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      {stars.map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span
            key={index}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Icon
              name="star"
              size={size}
              className="absolute inset-0 text-line-2"
              strokeWidth={1.4}
            />
            {fill > 0 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Icon
                  name="star"
                  size={size}
                  className="text-accent"
                  strokeWidth={1.4}
                />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
