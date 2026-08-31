import { UserProfile } from '@/lib/types';

// Le compte Administrateur Officiel du Bureau
export const INITIAL_FOUNDER_ADMINS: UserProfile[] = [
  {
    id: 'usr-thomas-petit',
    email: 'thomas.petit@edu.ece.fr',
    fullName: 'Thomas Petit',
    promo: 'ING4 (Promo 2028)',
    role: 'admin',
    status: 'active',
    membershipStatus: 'active',
    bio: 'Administrateur & Trésorier Tech d\'ECE Terroir.',
    favoriteTerroirs: ['Lorraine', 'Auvergne', 'Périgord', 'Savoie'],
    passwordHash: '0c6da8ad6da6252af75d25f85a23a62ce125fc4b52f3ac2d9e9f0c9a574a36e9',
    createdAt: '2026-01-12T11:30:00Z',
    lastLogin: new Date().toISOString(),
  }
];

// In-memory singleton user store across API routes
const globalUsers: Map<string, UserProfile> = new Map();

// Initialize exclusively with the 3 Admins
INITIAL_FOUNDER_ADMINS.forEach((u) => {
  globalUsers.set(u.email.toLowerCase(), u);
});

export function getStoredUser(email: string): UserProfile | undefined {
  return globalUsers.get(email.toLowerCase());
}

export function saveStoredUser(user: UserProfile): void {
  globalUsers.set(user.email.toLowerCase(), user);
}

export function getAllStoredUsers(): UserProfile[] {
  return Array.from(globalUsers.values());
}
