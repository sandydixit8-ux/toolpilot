const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, val] of loginAttempts) {
    if (val.lockedUntil < now) loginAttempts.delete(key);
  }
}

export function isLocked(email: string): { locked: boolean; retryAfterMs?: number } {
  cleanup();
  const entry = loginAttempts.get(email);
  if (!entry) return { locked: false };
  if (entry.lockedUntil > Date.now()) {
    return { locked: true, retryAfterMs: entry.lockedUntil - Date.now() };
  }
  loginAttempts.delete(email);
  return { locked: false };
}

export function recordFailedAttempt(email: string): { locked: boolean; remainingAttempts: number } {
  const entry = loginAttempts.get(email) || { count: 0, lockedUntil: 0 };

  if (entry.lockedUntil > Date.now()) {
    return { locked: true, remainingAttempts: 0 };
  }

  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    loginAttempts.set(email, entry);
    return { locked: true, remainingAttempts: 0 };
  }

  loginAttempts.set(email, entry);
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - entry.count };
}

export function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}

export function getAttemptCount(email: string): number {
  const entry = loginAttempts.get(email);
  if (!entry || entry.lockedUntil < Date.now()) return 0;
  return entry.count;
}
