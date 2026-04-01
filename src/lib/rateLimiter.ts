const RATE_LIMIT_KEY = '8bit-kitchen-rate-limit';
const COOLDOWN_MS = 60_000;

export function canMakeRequest(): boolean {
  const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastRequest) return true;
  return Date.now() - parseInt(lastRequest) > COOLDOWN_MS;
}

export function recordRequest(): void {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

export function getCooldownRemaining(): number {
  const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
  if (!lastRequest) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - parseInt(lastRequest)));
}
