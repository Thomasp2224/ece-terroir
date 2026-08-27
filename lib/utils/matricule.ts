/**
 * Utilitaires pour la gestion des matricules adhérents et la vérification QR Code
 */

export function getMemberMatricule(user: { id?: string; email?: string; fullName?: string }): string {
  const seed = (user.email || user.fullName || user.id || 'terroir').toLowerCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const positiveNum = Math.abs(hash) % 9000 + 1000;
  return `ECE-TERR-2026-${positiveNum}`;
}

export function getVerificationCode(matricule: string): string {
  const num = matricule.split('-')[3] || '2026';
  return `QR-AUTH-${num}-ECE-TERROIR-2026-VALIDE`;
}

export function getVerificationUrl(matricule: string, baseUrl?: string): string {
  if (typeof window !== 'undefined' && !baseUrl) {
    return `${window.location.origin}/verifier?id=${encodeURIComponent(matricule)}`;
  }
  const base = baseUrl || 'http://localhost:3000';
  return `${base}/verifier?id=${encodeURIComponent(matricule)}`;
}
