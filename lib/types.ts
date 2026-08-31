export type UserRole = 'visitor' | 'member' | 'admin';

export type UserStatus = 'active' | 'pending' | 'suspended';

export type MembershipStatus = 'none' | 'pending' | 'active' | 'rejected' | 'suspended';

export type PaymentMethodMembership = 'helloasso' | 'cash_foyer' | 'lydia_transfer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  promo?: string;
  role: UserRole;
  status: UserStatus;
  membershipStatus?: MembershipStatus;
  membershipRequestedAt?: string;
  membershipApprovedAt?: string;
  membershipPaymentMethod?: PaymentMethodMembership;
  avatarUrl?: string;
  bio?: string;
  favoriteTerroirs?: string[];
  passwordHash?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPromo?: string;
  amountCents: number;
  paymentMethod: PaymentMethodMembership;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface AdminLog {
  id: string;
  timestamp: string; // ISO string
  userEmail: string;
  userName: string;
  action: string;
  category: 'auth' | 'event' | 'post' | 'product' | 'order' | 'user' | 'security';
  details: string;
  ipAddress?: string;
}

export type EventType = 'Dégustation' | 'Voyage' | 'Soirée' | 'Atelier' | 'Conférence' | 'Rassemblement';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  eventType: EventType;
  startDate: string; // ISO String
  endDate?: string;
  location: string;
  coverImageUrl: string;
  priceCents: number; // Prix Membre Adhérent
  nonMemberPriceCents?: number; // Prix Non-Membre / Visiteur
  helloAssoUrl?: string;
  helloAssoWidgetCode?: string;
  capacity: number;
  remainingSeats: number;
  requiresBooking?: boolean; // false si c'est un rassemblement en accès libre
  featured?: boolean;
}

export type PostCategory = 'Dégustation' | 'Voyage' | 'Vie de l\'asso' | 'Partenariat' | 'Recette & Astuce';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  coverImageUrl: string;
  category: PostCategory;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
}

export interface MerchProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  secondaryImages?: string[];
  category: 'Textile' | 'Verre & Sommelerie' | 'Accessoires' | 'Coffrets Gourmands';
  sizes?: string[]; // e.g. ['S', 'M', 'L', 'XL']
  stock: number;
  featured?: boolean;
  origin?: string; // e.g. 'Fabriqué à Thiers, Auvergne'
  craftsmanship?: string; // e.g. 'Gravure laser haute précision sur chêne massif français'
  materials?: string; // e.g. '100% Chêne français certifié PEFC, finition huile de lin'
  careInstructions?: string; // e.g. 'Ne pas laver au lave-vaisselle. Huiler 1x/an.'
  dimensionsOrWeight?: string; // e.g. '40 x 20 x 2.5 cm — 1.2 kg'
}

export interface CartItem {
  product: MerchProduct;
  quantity: number;
  selectedSize?: string;
}

export interface MerchOrder {
  id: string;
  orderNumber: string; // e.g. 'CMD-2026-8941'
  voucherCode: string; // e.g. 'CMD-2026-8941'
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  totalCents: number;
  paymentMethod: 'online' | 'cash_on_pickup';
  status: 'pending' | 'ready_for_pickup' | 'completed' | 'cancelled';
  pickupLocation: string;
  pickupNotes?: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  author: string;
  handle: string;
  content: string;
  mediaUrl: string;
  likesCount: number;
  commentsCount: number;
  postUrl: string;
  publishedAt: string;
}

export interface CheckInRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userMatricule: string;
  userName: string;
  userEmail: string;
  userPromo?: string;
  isMember: boolean;
  checkedInAt: string; // ISO String
  checkedInBy: string; // Nom de l'admin / bénévole qui a scanné
  entryStatus: 'valid' | 'warning_non_member' | 'duplicate';
  notes?: string;
}

