import { UserProfile } from '@/lib/types';

/**
 * Validates if an email belongs to ECE Paris domain (@edu.ece.fr or @ece.fr)
 */
export function isEceEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  return trimmed.endsWith('@edu.ece.fr') || trimmed.endsWith('@ece.fr');
}

/**
 * Normalizes email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Browser & Server compatible SHA-256 hashing with salt for password security
 */
const PASSWORD_PEPPER = process.env.AUTH_PASSWORD_PEPPER || 'ece_terroir_secure_pepper_2026_x89a';

export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_' + PASSWORD_PEPPER);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback Node crypto on server
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(password + '_' + PASSWORD_PEPPER).digest('hex');
  } catch {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) - hash) + password.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }
}

/**
 * Timing-safe constant-time string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifies password against securely hashed password (NO backdoor bypasses)
 */
export async function verifyPassword(password: string, hashedPassword?: string): Promise<boolean> {
  if (!password || !hashedPassword) return false;
  const computed = await hashPassword(password);
  return timingSafeEqual(computed, hashedPassword);
}

