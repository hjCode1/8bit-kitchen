import { useState, useEffect } from 'react';
import { canMakeRequest, getCooldownRemaining } from '../lib/rateLimiter';

export function useRateLimit() {
  const [cooldown, setCooldown] = useState(getCooldownRemaining());

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    canRequest: canMakeRequest(),
    cooldownSeconds: Math.ceil(cooldown / 1000),
    refresh: () => setCooldown(getCooldownRemaining()),
  };
}
