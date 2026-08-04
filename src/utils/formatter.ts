/** String shaping for display. */

export function truncate(value: string, max: number, ellipsis = '…'): string {
  return value.length <= max ? value : value.slice(0, Math.max(0, max - 1)) + ellipsis;
}

export function capitalise(value: string): string {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

/**
 * Initials for an avatar placeholder.
 *
 * Takes the first and last word so "Nguyen Van A" gives "NA" rather than "NV".
 */
export function initials(name: string, max = 2): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  const picked = words.length === 1 ? [words[0]] : [words[0], words[words.length - 1]];
  return picked
    .slice(0, max)
    .map(word => word[0].toUpperCase())
    .join('');
}

/** Hides all but the last few characters — for tokens and account numbers. */
export function mask(value: string, visible = 4, char = '•'): string {
  if (value.length <= visible) {
    return value;
  }
  return char.repeat(value.length - visible) + value.slice(-visible);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(1)} ${units[unit]}`;
}
