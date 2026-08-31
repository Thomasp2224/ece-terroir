// In-memory store for password reset codes with 15-minute expiration
interface ResetEntry {
  email: string;
  code: string;
  expiresAt: number; // timestamp in ms
}

const resetEntries: Map<string, ResetEntry> = new Map();

const EXPIRATION_TIME_MS = 15 * 60 * 1000; // 15 minutes

export function saveResetCode(email: string, code: string): void {
  const normalized = email.trim().toLowerCase();
  resetEntries.set(normalized, {
    email: normalized,
    code: code.trim(),
    expiresAt: Date.now() + EXPIRATION_TIME_MS,
  });
}

export function verifyResetCode(email: string, code: string): boolean {
  const normalized = email.trim().toLowerCase();
  const entry = resetEntries.get(normalized);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    resetEntries.delete(normalized);
    return false;
  }
  return entry.code === code.trim();
}

export function clearResetCode(email: string): void {
  const normalized = email.trim().toLowerCase();
  resetEntries.delete(normalized);
}
