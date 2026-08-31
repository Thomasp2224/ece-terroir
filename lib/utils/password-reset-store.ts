import crypto from 'crypto';

// In-memory store for password reset codes with 15-minute expiration & attempt limiting
interface ResetEntry {
  email: string;
  code: string;
  expiresAt: number; // timestamp in ms
  attempts: number;
}

const resetEntries: Map<string, ResetEntry> = new Map();

const EXPIRATION_TIME_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Max 5 failed guesses per token

export function saveResetCode(email: string, code: string): void {
  const normalized = email.trim().toLowerCase();
  resetEntries.set(normalized, {
    email: normalized,
    code: code.trim(),
    expiresAt: Date.now() + EXPIRATION_TIME_MS,
    attempts: 0,
  });
}

export function verifyResetCode(email: string, code: string): { valid: boolean; error?: string } {
  const normalized = email.trim().toLowerCase();
  const entry = resetEntries.get(normalized);

  if (!entry) {
    return { valid: false, error: 'Aucune demande de réinitialisation en cours ou code expiré.' };
  }

  if (Date.now() > entry.expiresAt) {
    resetEntries.delete(normalized);
    return { valid: false, error: 'Ce code de sécurité a expiré (délai de 15 minutes dépassé).' };
  }

  entry.attempts += 1;

  if (entry.attempts > MAX_ATTEMPTS) {
    resetEntries.delete(normalized);
    return { valid: false, error: 'Trop de tentatives erronées. Ce code a été révoqué par mesure de sécurité. Veuillez refaire une demande.' };
  }

  const expectedCode = entry.code;
  const providedCode = code.trim();

  // Timing-safe comparison
  const isMatch = 
    expectedCode.length === providedCode.length &&
    crypto.timingSafeEqual(Buffer.from(expectedCode), Buffer.from(providedCode));

  if (!isMatch) {
    const remaining = MAX_ATTEMPTS - entry.attempts;
    return { 
      valid: false, 
      error: `Code de sécurité incorrect (${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}).` 
    };
  }

  return { valid: true };
}

export function clearResetCode(email: string): void {
  const normalized = email.trim().toLowerCase();
  resetEntries.delete(normalized);
}

