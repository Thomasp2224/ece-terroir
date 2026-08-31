import { UserProfile } from '@/lib/types';

// The 3 official Founding Administrators
export const INITIAL_FOUNDER_ADMINS: UserProfile[] = [
  {
    id: 'usr-jules-houry',
    email: 'jules.houry@edu.ece.fr',
    fullName: 'Jules Houry',
    promo: 'ING4 (Promo 2028)',
    role: 'admin',
    status: 'active',
    membershipStatus: 'active',
    bio: 'Président d\'ECE Terroir • Passionné des terroirs et fromages d\'alpage.',
    favoriteTerroirs: ['Auvergne', 'Jura', 'Savoie'],
    passwordHash: 'abc4ae174d70fb80797e2e1109002bc5a68cbd2d238ac644de819f349d2ddd8e', // ECE-Terroir-2026!
    createdAt: '2026-01-10T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-thomas-petit',
    email: 'thomas.petit@edu.ece.fr',
    fullName: 'Thomas Petit',
    promo: 'ING4 (Promo 2028)',
    role: 'admin',
    status: 'active',
    membershipStatus: 'active',
    bio: 'Administrateur & Trésorier Tech d\'ECE Terroir.',
    favoriteTerroirs: ['Lorraine', 'Auvergne', 'Périgord'],
    passwordHash: 'abc4ae174d70fb80797e2e1109002bc5a68cbd2d238ac644de819f349d2ddd8e', // ECE-Terroir-2026!
    createdAt: '2026-01-12T11:30:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-leonard-brault',
    email: 'leonard.brault@edu.ece.fr',
    fullName: 'Léonard Brault',
    promo: 'ING4 (Promo 2028)',
    role: 'admin',
    status: 'active',
    membershipStatus: 'active',
    bio: 'Administrateur Bureau d\'ECE Terroir.',
    favoriteTerroirs: ['Savoie', 'Pays Basque', 'Bourgogne'],
    passwordHash: 'abc4ae174d70fb80797e2e1109002bc5a68cbd2d238ac644de819f349d2ddd8e', // ECE-Terroir-2026!
    createdAt: '2026-02-01T14:00:00Z',
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
