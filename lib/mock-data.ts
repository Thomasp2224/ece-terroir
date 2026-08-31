import { BlogPost, EventItem, MerchProduct, SocialPost, MembershipRequest, CheckInRecord, MerchOrder, AdminLog } from './types';

export const MOCK_EVENTS: EventItem[] = [];

export const MOCK_POSTS: BlogPost[] = [];

export const MOCK_PRODUCTS: MerchProduct[] = [];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [];

export const MOCK_ORDERS: MerchOrder[] = [];

export const MOCK_CHECK_INS: CheckInRecord[] = [];

export const MOCK_CHECKINS: CheckInRecord[] = [];

export const MOCK_ADMIN_LOGS: AdminLog[] = [];

export const MOCK_MEMBERSHIP_REQUESTS: MembershipRequest[] = [];

export const MOCK_BUREAU = [
  {
    name: 'Jules Houry',
    role: 'Président',
    promo: 'ECE Promo 2028 (Majeure Data & IA)',
    quote: 'Transmettre la passion des terroirs et faire de chaque banquet un moment inoubliable.',
    imageUrl: '',
  },
  {
    name: 'Thomas Petit',
    role: 'Secrétaire Général',
    promo: 'ECE Promo 2028 (Majeure Data & IA)',
    quote: 'La Lorraine dans le cœur, le bon pâté et les mirabelles sur la table !',
    imageUrl: '',
  },
  {
    name: 'Léonard Brault',
    role: 'Trésorier',
    promo: 'ECE Promo 2028 (Majeure Finance)',
    quote: 'Des comptes aussi savoureux et équilibrés qu\'une meule de Comté 24 mois.',
    imageUrl: '',
  },
];

export const MOCK_USERS = [
  {
    id: 'usr-thomas-petit',
    email: 'thomas.petit@edu.ece.fr',
    fullName: 'Thomas Petit',
    promo: 'ING4 (Promo 2028)',
    role: 'admin' as const,
    status: 'active' as const,
    membershipStatus: 'active' as const,
    bio: 'Administrateur & Trésorier Tech d\'ECE Terroir • Spécialités régionales et salaisons.',
    favoriteTerroirs: ['Lorraine', 'Auvergne', 'Périgord', 'Savoie'],
    passwordHash: '0c6da8ad6da6252af75d25f85a23a62ce125fc4b52f3ac2d9e9f0c9a574a36e9',
    createdAt: '2026-01-12T11:30:00Z',
    lastLogin: '2026-08-25T18:15:00Z',
  }
];
