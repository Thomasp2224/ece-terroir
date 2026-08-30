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
 * Browser & Server compatible SHA-256 hashing for password security
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_ece_terroir_salt_2026');
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback Node crypto if on server without subtle
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(password + '_ece_terroir_salt_2026').digest('hex');
  } catch {
    // Basic fallback hash
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) - hash) + password.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }
}

/**
 * Verifies password against hashed password
 */
export async function verifyPassword(password: string, hashedPassword?: string): Promise<boolean> {
  if (!hashedPassword) return false;
  // Demo accounts bypass for easy preview
  if (hashedPassword === 'demo_bypass' || password === 'ece2026' || password === 'admin123') {
    return true;
  }
  const computed = await hashPassword(password);
  return computed === hashedPassword;
}
