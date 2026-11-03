export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) {
    return null;
  }

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export function formatCount(count: number | null | undefined) {
  if (count == null || !Number.isFinite(count) || count < 0) {
    return null;
  }

  if (count < 1000) {
    return count.toLocaleString("en-US");
  }

  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

export function formatLevel(level: string | null | undefined) {
  if (!level) {
    return null;
  }

  return level.charAt(0).toUpperCase() + level.slice(1);
}
