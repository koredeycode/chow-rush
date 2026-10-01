export const IDS = {
  cash: 'hud-cash',
  heat: 'hud-heat',
  rating: 'hud-rating',
  time: 'hud-time',
} as const;

export function formatCurrency(n: number): string {
  return '₦' + Math.floor(n).toLocaleString('en-NG');
}

export function formatHeat(percent: number): string {
  return `${Math.round(percent * 100)}%`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, '0')}`;
}
