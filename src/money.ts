const MONEY_PATTERN = /^(-?)(\d+)\.(\d{2})$/;

/**
 * Inserts thousands separators into the backend's money string. String-only on purpose:
 * the backend calculates in piastres, and parsing to a float here would reintroduce rounding.
 * `null` stays `null` (render "—"); an unexpected shape is returned untouched rather than guessed.
 */
export function formatMoney(value: string): string;
export function formatMoney(value: string | null | undefined): string | null;
export function formatMoney(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const match = MONEY_PATTERN.exec(value);
  if (!match) return value;
  const [, sign = '', whole = '', fraction = ''] = match;
  return `${sign}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`;
}
