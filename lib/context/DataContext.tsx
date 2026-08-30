'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventItem, BlogPost, MerchProduct, MerchOrder, UserProfile, AdminLog, SocialPost, MembershipRequest, CheckInRecord } from '@/lib/types';
import { MOCK_EVENTS, MOCK_POSTS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USERS, MOCK_ADMIN_LOGS, MOCK_SOCIAL_POSTS, MOCK_MEMBERSHIP_REQUESTS, MOCK_CHECK_INS } from '@/lib/mock-data';
import { getMemberMatricule } from '@/lib/utils/matricule';

interface DataContextType {
  events: EventItem[];
  posts: BlogPost[];
  products: MerchProduct[];
  orders: MerchOrder[];
  users: UserProfile[];
  adminLogs: AdminLog[];
  socialPosts: SocialPost[];
  membershipRequests: MembershipRequest[];
  checkIns: CheckInRecord[];
  // Events CRUD
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  // Posts CRUD
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updated: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  // Products CRUD
  addProduct: (product: MerchProduct) => void;
  updateProduct: (id: string, updated: Partial<MerchProduct>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, delta: number) => void;
  // Orders
  createOrder: (orderData: Omit<MerchOrder, 'id' | 'orderNumber' | 'voucherCode' | 'createdAt'>) => MerchOrder;
  updateOrderStatus: (orderId: string, status: 'pending' | 'ready_for_pickup' | 'completed' | 'cancelled') => void;
  // Users CRUD
  addUser: (user: UserProfile) => void;
  updateUser: (id: string, updated: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  // Social Posts CRUD
  addSocialPost: (post: SocialPost) => void;
  updateSocialPost: (id: string, updated: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;
  // Membership / Cotisations
  requestMembership: (request: MembershipRequest) => void;
  approveMembership: (requestId: string, reviewerName?: string) => void;
  rejectMembership: (requestId: string, reviewerName?: string) => void;
  syncDriveExcel: (customUsers?: UserProfile[], customRequests?: MembershipRequest[]) => Promise<any>;
  // Check-ins / Émargement Soirées
  checkInMember: (
    eventId: string,
    query: string,
    adminName?: string,
    notes?: string
  ) => {
    success: boolean;
    record?: CheckInRecord;
    user?: UserProfile;
    reason: 'ok' | 'warning_non_member' | 'already_checked_in' | 'not_found';
    message: string;
  };
  undoCheckIn: (checkInId: string) => void;
  clearCheckInsForEvent: (eventId: string) => void;
  // Logs
  addAdminLog: (action: string, category: AdminLog['category'], details: string, userOverride?: { name: string; email: string }) => void;
  clearAdminLogs: () => void;
  // Reset
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'ece_terroir_events_v3',
  POSTS: 'ece_terroir_posts_v3',
  PRODUCTS: 'ece_terroir_products_v3',
  ORDERS: 'ece_terroir_orders_v3',
  USERS: 'ece_terroir_users_v3',
  LOGS: 'ece_terroir_logs_v3',
  SOCIAL_POSTS: 'ece_terroir_social_posts_v3',
  MEMBERSHIPS: 'ece_terroir_memberships_v3',
  CHECK_INS: 'ece_terroir_checkins_v3',
};

import { supabase } from '@/lib/supabase/client';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
  const [products, setProducts] = useState<MerchProduct[]>(MOCK_PRODUCTS);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(MOCK_ADMIN_LOGS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(MOCK_MEMBERSHIP_REQUESTS);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(MOCK_CHECK_INS);
  const [orders, setOrders] = useState<MerchOrder[]>(MOCK_ORDERS);

  // Load from localStorage on mount with safe fallback + fetch live Supabase data
  useEffect(() => {
    try {
      const loadArray = <T,>(key: string, fallback: T[]): T[] => {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          return fallback;
        } catch {
          return fallback;
        }
      };

      setEvents(loadArray(STORAGE_KEYS.EVENTS, MOCK_EVENTS));
      setPosts(loadArray(STORAGE_KEYS.POSTS, MOCK_POSTS));
      setProducts(loadArray(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS));
      setOrders(loadArray(STORAGE_KEYS.ORDERS, MOCK_ORDERS));
      setUsers(loadArray(STORAGE_KEYS.USERS, MOCK_USERS));
      setAdminLogs(loadArray(STORAGE_KEYS.LOGS, MOCK_ADMIN_LOGS));
      setSocialPosts(loadArray(STORAGE_KEYS.SOCIAL_POSTS, MOCK_SOCIAL_POSTS));
      setMembershipRequests(loadArray(STORAGE_KEYS.MEMBERSHIPS, MOCK_MEMBERSHIP_REQUESTS));
      setCheckIns(loadArray(STORAGE_KEYS.CHECK_INS, MOCK_CHECK_INS));
    } catch (e) {
      console.warn('Erreur lors du chargement des données depuis localStorage', e);
    }

    // Charger toutes les entités réelles depuis Supabase Cloud
    const fetchSupabaseLive = async () => {
      try {
        // 1. Profils
        const { data: profiles } = await supabase.from('profiles').select('*');
        if (profiles && profiles.length > 0) {
          const mappedProfiles: UserProfile[] = profiles.map((p) => ({
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            promo: p.promo,
            role: p.role,
            status: p.status,
            membershipStatus: p.membership_status,
            bio: p.bio,
            favoriteTerroirs: p.favorite_terroirs || [],
            createdAt: p.created_at,
            lastLogin: p.updated_at || p.created_at,
          }));
          setUsers(mappedProfiles);
          try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mappedProfiles));
          } catch (e) {}
        }

        // 2. Demandes d'adhésion
        const { data: reqs } = await supabase.from('membership_requests').select('*');
        if (reqs && reqs.length > 0) {
          const mappedReqs: MembershipRequest[] = reqs.map((r) => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name,
            userEmail: r.user_email,
            userPromo: r.user_promo,
            amountCents: r.amount_cents,
            paymentMethod: r.payment_method,
            status: r.status,
            requestedAt: r.requested_at,
            notes: r.notes,
          }));
          setMembershipRequests(mappedReqs);
          try {
            localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(mappedReqs));
          } catch (e) {}
        }

        // 3. Événements
        const { data: dbEvents } = await supabase.from('events').select('*').order('start_date', { ascending: true });
        if (dbEvents !== null) {
          const mappedEvents: EventItem[] = dbEvents.map((e) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            description: e.description,
            longDescription: e.long_description,
            eventType: e.event_type,
            startDate: e.start_date,
            endDate: e.end_date,
            location: e.location,
            coverImageUrl: e.cover_image_url,
            priceCents: e.price_cents,
            helloAssoUrl: e.helloasso_url,
            capacity: e.capacity,
            remainingSeats: e.remaining_seats,
            requiresBooking: e.requires_booking,
            featured: e.featured,
          }));
          setEvents(mappedEvents);
          try {
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mappedEvents));
          } catch (e) {}
        }

        // 4. Produits Boutique
        const { data: dbProducts } = await supabase.from('products').select('*');
        if (dbProducts !== null) {
          const mappedProducts: MerchProduct[] = dbProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            priceCents: p.price_cents,
            imageUrl: p.image_url,
            secondaryImages: p.secondary_images || [],
            category: p.category,
            sizes: p.sizes || [],
            stock: p.stock,
            featured: p.featured,
            origin: p.origin,
            craftsmanship: p.craftsmanship,
            materials: p.materials,
            careInstructions: p.care_instructions,
            dimensionsOrWeight: p.dimensions_or_weight,
          }));
          setProducts(mappedProducts);
          try {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mappedProducts));
          } catch (e) {}
        }

        // 5. Articles Gazette
        const { data: dbPosts } = await supabase.from('posts').select('*').order('published_at', { ascending: false });
        if (dbPosts !== null) {
          const mappedPosts: BlogPost[] = dbPosts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: p.content,
            coverImageUrl: p.cover_image_url,
            category: p.category,
            author: {
              name: p.author_name,
              role: p.author_role,
              avatarUrl: p.author_avatar,
            },
            publishedAt: p.published_at,
            readTimeMinutes: p.read_time_minutes,
            tags: p.tags || [],
          }));
          setPosts(mappedPosts);
          try {
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mappedPosts));
          } catch (e) {}
        }

        // 6. Scans / Checkins
        const { data: dbCheckins } = await supabase.from('event_checkins').select('*').order('checked_in_at', { ascending: false });
        if (dbCheckins !== null) {
          const mappedCheckins: CheckInRecord[] = dbCheckins.map((c) => ({
            id: c.id,
            eventId: c.event_id,
            eventTitle: c.event_title,
            userId: c.user_id,
            userMatricule: c.user_matricule,
            userName: c.user_name,
            userEmail: c.user_email,
            userPromo: c.user_promo,
            isMember: c.is_member,
            checkedInAt: c.checked_in_at,
            checkedInBy: c.checked_in_by,
            entryStatus: c.entry_status,
            notes: c.notes,
          }));
          setCheckIns(mappedCheckins);
          try {
            localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(mappedCheckins));
          } catch (e) {}
        }

        // 7. Logs d'audit
        const { data: dbLogs } = await supabase.from('admin_logs').select('*').order('timestamp', { ascending: false }).limit(100);
        if (dbLogs && dbLogs.length > 0) {
          const mappedLogs: AdminLog[] = dbLogs.map((l) => ({
            id: l.id,
            timestamp: l.timestamp,
            userEmail: l.user_email,
            userName: l.user_name,
            action: l.action,
            category: l.category,
            details: l.details,
            ipAddress: l.ip_address,
          }));
          setAdminLogs(mappedLogs);
          try {
            localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(mappedLogs));
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Supabase fetch error:', err);
      }
    };

    fetchSupabaseLive();
  }, []);

  // Helpers to persist in localStorage
  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch (e) {}
  };

  const savePosts = (updated: BlogPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveProducts = (updated: MerchProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveOrders = (updated: MerchOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveUsers = (updated: UserProfile[]) => {
    setUsers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveLogs = (updated: AdminLog[]) => {
    setAdminLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveSocialPosts = (updated: SocialPost[]) => {
    setSocialPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(updated));
    } catch (e) {}
  };

  const saveMembershipRequests = (updated: MembershipRequest[]) => {
    setMembershipRequests(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(updated));
    } catch (e) {}
  };

  // --- Audit Log Function ---
  const addAdminLog = (
    action: string,
    category: AdminLog['category'],
    details: string,
    userOverride?: { name: string; email: string }
  ) => {
    const newLog: AdminLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userEmail: userOverride?.email || 'admin@edu.ece.fr',
      userName: userOverride?.name || 'Administrateur Bureau',
      action,
      category,
      details,
      ipAddress: '192.168.1.42',
    };
    const updated = [newLog, ...adminLogs].slice(0, 100);
    saveLogs(updated);
    try {
      supabase.from('admin_logs').insert({
        id: newLog.id,
        timestamp: newLog.timestamp,
        user_email: newLog.userEmail,
        user_name: newLog.userName,
        action: newLog.action,
        category: newLog.category,
        details: newLog.details,
        ip_address: newLog.ipAddress,
      }).then();
    } catch (e) {}
  };

  const clearAdminLogs = () => {
    saveLogs([]);
  };

  // --- Events CRUD ---
  const addEvent = (event: EventItem) => {
    const updated = [event, ...events];
    saveEvents(updated);
    addAdminLog('Création Événement', 'event', `Création de l'événement « ${event.title} » (${event.eventType}).`);
    try {
      supabase.from('events').insert({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        long_description: event.longDescription,
        event_type: event.eventType,
        start_date: event.startDate,
        end_date: event.endDate,
        location: event.location,
        cover_image_url: event.coverImageUrl,
        price_cents: event.priceCents,
        helloasso_url: event.helloAssoUrl,
        capacity: event.capacity,
        remaining_seats: event.remainingSeats,
        requires_booking: event.requiresBooking,
        featured: event.featured,
      }).then();
    } catch (e) {}
  };

  const updateEvent = (id: string, updatedFields: Partial<EventItem>) => {
    const updated = events.map((evt) => (evt.id === id ? { ...evt, ...updatedFields } : evt));
    saveEvents(updated);
    addAdminLog('Modification Événement', 'event', `Modification de l'événement ID ${id} (${updatedFields.title || 'Détails'}).`);
    try {
      const payload: any = {};
      if (updatedFields.title) payload.title = updatedFields.title;
      if (updatedFields.slug) payload.slug = updatedFields.slug;
      if (updatedFields.description) payload.description = updatedFields.description;
      if (updatedFields.longDescription !== undefined) payload.long_description = updatedFields.longDescription;
      if (updatedFields.eventType) payload.event_type = updatedFields.eventType;
      if (updatedFields.startDate) payload.start_date = updatedFields.startDate;
      if (updatedFields.endDate !== undefined) payload.end_date = updatedFields.endDate;
      if (updatedFields.location) payload.location = updatedFields.location;
      if (updatedFields.coverImageUrl) payload.cover_image_url = updatedFields.coverImageUrl;
      if (updatedFields.priceCents !== undefined) payload.price_cents = updatedFields.priceCents;
      if (updatedFields.helloAssoUrl !== undefined) payload.helloasso_url = updatedFields.helloAssoUrl;
      if (updatedFields.capacity !== undefined) payload.capacity = updatedFields.capacity;
      if (updatedFields.remainingSeats !== undefined) payload.remaining_seats = updatedFields.remainingSeats;
      if (updatedFields.requiresBooking !== undefined) payload.requires_booking = updatedFields.requiresBooking;
      if (updatedFields.featured !== undefined) payload.featured = updatedFields.featured;

      supabase.from('events').update(payload).eq('id', id).then();
    } catch (e) {}
  };

  const deleteEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    const updated = events.filter((evt) => evt.id !== id);
    saveEvents(updated);
    addAdminLog('Suppression Événement', 'event', `Suppression de l'événement « ${target?.title || id} »`);
    try {
      supabase.from('events').delete().eq('id', id).then();
    } catch (e) {}
  };

  // --- Posts CRUD ---
  const addPost = (post: BlogPost) => {
    const updated = [post, ...posts];
    savePosts(updated);
    addAdminLog('Publication Article', 'post', `Publication du nouvel article « ${post.title} » dans ${post.category}.`);
    try {
      supabase.from('posts').insert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image_url: post.coverImageUrl,
        category: post.category,
        author_name: post.author.name,
        author_role: post.author.role,
        author_avatar: post.author.avatarUrl,
        read_time_minutes: post.readTimeMinutes,
        tags: post.tags,
      }).then();
    } catch (e) {}
  };

  const updatePost = (id: string, updatedFields: Partial<BlogPost>) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    savePosts(updated);
    addAdminLog('Modification Article', 'post', `Mise à jour de l'article ID ${id}.`);
    try {
      const payload: any = {};
      if (updatedFields.title) payload.title = updatedFields.title;
      if (updatedFields.slug) payload.slug = updatedFields.slug;
      if (updatedFields.excerpt) payload.excerpt = updatedFields.excerpt;
      if (updatedFields.content) payload.content = updatedFields.content;
      if (updatedFields.coverImageUrl) payload.cover_image_url = updatedFields.coverImageUrl;
      if (updatedFields.category) payload.category = updatedFields.category;
      if (updatedFields.author?.name) payload.author_name = updatedFields.author.name;
      if (updatedFields.author?.role) payload.author_role = updatedFields.author.role;
      if (updatedFields.author?.avatarUrl) payload.author_avatar = updatedFields.author.avatarUrl;
      if (updatedFields.readTimeMinutes) payload.read_time_minutes = updatedFields.readTimeMinutes;
      if (updatedFields.tags) payload.tags = updatedFields.tags;

      supabase.from('posts').update(payload).eq('id', id).then();
    } catch (e) {}
  };

  const deletePost = (id: string) => {
    const target = posts.find((p) => p.id === id);
    const updated = posts.filter((p) => p.id !== id);
    savePosts(updated);
    addAdminLog('Suppression Article', 'post', `Suppression de l'article « ${target?.title || id} »`);
    try {
      supabase.from('posts').delete().eq('id', id).then();
    } catch (e) {}
  };

  // --- Products CRUD ---
  const addProduct = (product: MerchProduct) => {
    const updated = [product, ...products];
    saveProducts(updated);
    addAdminLog('Ajout Produit Merch', 'product', `Nouveau produit ajouté : « ${product.name} » (${(product.priceCents / 100).toFixed(2)} €).`);
    try {
      supabase.from('products').insert({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price_cents: product.priceCents,
        image_url: product.imageUrl,
        secondary_images: product.secondaryImages || [],
        category: product.category,
        sizes: product.sizes || [],
        stock: product.stock,
        featured: product.featured,
        origin: product.origin,
        craftsmanship: product.craftsmanship,
        materials: product.materials,
        care_instructions: product.careInstructions,
        dimensions_or_weight: product.dimensionsOrWeight,
      }).then();
    } catch (e) {}
  };

  const updateProduct = (id: string, updatedFields: Partial<MerchProduct>) => {
    const updated = products.map((prod) => (prod.id === id ? { ...prod, ...updatedFields } : prod));
    saveProducts(updated);
    addAdminLog('Modification Produit', 'product', `Modification du produit ID ${id}.`);
    try {
      const payload: any = {};
      if (updatedFields.name) payload.name = updatedFields.name;
      if (updatedFields.slug) payload.slug = updatedFields.slug;
      if (updatedFields.description) payload.description = updatedFields.description;
      if (updatedFields.priceCents !== undefined) payload.price_cents = updatedFields.priceCents;
      if (updatedFields.imageUrl) payload.image_url = updatedFields.imageUrl;
      if (updatedFields.secondaryImages) payload.secondary_images = updatedFields.secondaryImages;
      if (updatedFields.category) payload.category = updatedFields.category;
      if (updatedFields.sizes) payload.sizes = updatedFields.sizes;
      if (updatedFields.stock !== undefined) payload.stock = updatedFields.stock;
      if (updatedFields.featured !== undefined) payload.featured = updatedFields.featured;
      if (updatedFields.origin) payload.origin = updatedFields.origin;
      if (updatedFields.craftsmanship) payload.craftsmanship = updatedFields.craftsmanship;
      if (updatedFields.materials) payload.materials = updatedFields.materials;
      if (updatedFields.careInstructions) payload.care_instructions = updatedFields.careInstructions;
      if (updatedFields.dimensionsOrWeight) payload.dimensions_or_weight = updatedFields.dimensionsOrWeight;

      supabase.from('products').update(payload).eq('id', id).then();
    } catch (e) {}
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((prod) => prod.id !== id);
    saveProducts(updated);
    addAdminLog('Retrait Produit', 'product', `Retrait du produit « ${target?.name || id} » de la boutique.`);
    try {
      supabase.from('products').delete().eq('id', id).then();
    } catch (e) {}
  };

  const updateStock = (productId: string, delta: number) => {
    const updated = products.map((prod) => {
      if (prod.id === productId) {
        const newStock = Math.max(0, prod.stock + delta);
        try {
          supabase.from('products').update({ stock: newStock }).eq('id', productId).then();
        } catch (e) {}
        return { ...prod, stock: newStock };
      }
      return prod;
    });
    saveProducts(updated);
    addAdminLog('Ajustement Stock', 'product', `Stock ajusté de ${delta > 0 ? `+${delta}` : delta} pour le produit ID ${productId}.`);
  };

  // --- Orders ---
  const createOrder = (orderData: Omit<MerchOrder, 'id' | 'orderNumber' | 'voucherCode' | 'createdAt'>): MerchOrder => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-2026-${randNum}`;
    const newOrder: MerchOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      voucherCode: orderNumber,
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    saveOrders(updated);
    addAdminLog(
      'Nouvelle Commande Merch',
      'order',
      `Commande ${orderNumber} (${(newOrder.totalCents / 100).toFixed(2)} €) créée par ${newOrder.userName}.`
    );

    // Déclencher l'envoi de l'email de confirmation de commande
    try {
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: newOrder.orderNumber,
          userName: newOrder.userName,
          userEmail: newOrder.userEmail,
          items: newOrder.items.map((it) => ({
            name: it.product?.name || 'Produit Terroir',
            quantity: it.quantity,
            priceCents: it.product?.priceCents || 0,
            size: it.selectedSize,
          })),
          totalCents: newOrder.totalCents,
          pickupLocation: 'Foyer des Élèves — Campus ECE Eiffel 1',
        }),
      }).catch((e) => console.warn('Erreur envoi email commande:', e));
    } catch (e) {}

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'ready_for_pickup' | 'completed' | 'cancelled') => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
    addAdminLog('Statut Commande', 'order', `Commande #${orderId} passée au statut : ${status}.`);
  };

  // --- Excel Drive Sync Helper ---
  const syncDriveExcel = async (customUsers?: UserProfile[], customRequests?: MembershipRequest[]) => {
    try {
      const res = await fetch('/api/sync-drive-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: customUsers || users,
          requests: customRequests || membershipRequests,
        }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Erreur synchronisation Drive Excel:', err);
      return { success: false, error: String(err) };
    }
  };

  // --- Users CRUD ---
  const addUser = (user: UserProfile) => {
    const updated = [user, ...users];
    saveUsers(updated);
    addAdminLog('Création Utilisateur', 'user', `Compte créé pour ${user.fullName} (${user.email}) avec le rôle ${user.role}.`);
    syncDriveExcel(updated, membershipRequests);
  };

  const updateUser = (id: string, updatedFields: Partial<UserProfile>) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...updatedFields } : u));
    saveUsers(updated);

    // Also update session user if current user matches
    try {
      const currentSession = localStorage.getItem('ece_terroir_user');
      if (currentSession) {
        const parsed = JSON.parse(currentSession);
        if (parsed.id === id || parsed.email === updatedFields.email) {
          const updatedSession = { ...parsed, ...updatedFields };
          localStorage.setItem('ece_terroir_user', JSON.stringify(updatedSession));
        }
      }
    } catch (e) {}

    addAdminLog('Modification Utilisateur', 'user', `Profil mis à jour pour l'utilisateur ID ${id} (${updatedFields.role ? `Nouveau rôle : ${updatedFields.role}` : ''} ${updatedFields.status ? `Nouveau statut : ${updatedFields.status}` : ''}).`);
    syncDriveExcel(updated, membershipRequests);
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    addAdminLog('Suppression Utilisateur', 'user', `Suppression du compte de ${target?.fullName || id} (${target?.email}).`);
    syncDriveExcel(updated, membershipRequests);
  };

  // --- Social Posts CRUD ---
  const addSocialPost = (post: SocialPost) => {
    const updated = [post, ...socialPosts];
    saveSocialPosts(updated);
    addAdminLog('Ajout Post Réseaux', 'post', `Publication synchronisée depuis ${post.platform} (@${post.handle}).`);
  };

  const updateSocialPost = (id: string, updatedFields: Partial<SocialPost>) => {
    const updated = socialPosts.map((sp) => (sp.id === id ? { ...sp, ...updatedFields } : sp));
    saveSocialPosts(updated);
    addAdminLog('Modification Post Réseaux', 'post', `Mise à jour du post réseaux ID ${id}.`);
  };

  const deleteSocialPost = (id: string) => {
    const target = socialPosts.find((sp) => sp.id === id);
    const updated = socialPosts.filter((sp) => sp.id !== id);
    saveSocialPosts(updated);
    addAdminLog('Suppression Post Réseaux', 'post', `Suppression du post réseaux de ${target?.handle || id}.`);
  };

  // --- Membership & Cotisation Workflow ---
  const requestMembership = (request: MembershipRequest) => {
    const updatedRequests = [request, ...membershipRequests];
    saveMembershipRequests(updatedRequests);

    // Update user profile status to pending
    const updatedUsers = users.map((u) => {
      if (u.id === request.userId || u.email.toLowerCase() === request.userEmail.toLowerCase()) {
        return {
          ...u,
          membershipStatus: 'pending' as const,
          membershipRequestedAt: request.requestedAt,
          membershipPaymentMethod: request.paymentMethod,
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // Update current session user if matching
    try {
      const currentSession = localStorage.getItem('ece_terroir_user');
      if (currentSession) {
        const parsed = JSON.parse(currentSession);
        if (parsed.id === request.userId || parsed.email.toLowerCase() === request.userEmail.toLowerCase()) {
          const updatedSession = {
            ...parsed,
            membershipStatus: 'pending',
            membershipRequestedAt: request.requestedAt,
            membershipPaymentMethod: request.paymentMethod,
          };
          localStorage.setItem('ece_terroir_user', JSON.stringify(updatedSession));
        }
      }
    } catch (e) {}

    try {
      supabase.from('membership_requests').insert({
        id: request.id,
        user_id: request.userId,
        user_name: request.userName,
        user_email: request.userEmail,
        user_promo: request.userPromo,
        amount_cents: request.amountCents,
        payment_method: request.paymentMethod,
        status: request.status,
        requested_at: request.requestedAt,
        notes: request.notes,
      }).then();

      supabase.from('profiles').update({
        membership_status: 'pending',
        membership_requested_at: request.requestedAt,
        membership_payment_method: request.paymentMethod,
      }).eq('email', request.userEmail.toLowerCase()).then();
    } catch (e) {}

    addAdminLog(
      'Demande de Cotisation',
      'user',
      `Nouvelle adhésion demandée par ${request.userName} (${request.userEmail}) via ${request.paymentMethod} (10,00 €).`
    );
    syncDriveExcel(updatedUsers, updatedRequests);
  };

  const approveMembership = (requestId: string, reviewerName: string = 'Admin Bureau') => {
    const targetReq = membershipRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date().toISOString();

    // 1. Update Request
    const updatedRequests = membershipRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'approved' as const, reviewedAt: now, reviewedBy: reviewerName }
        : r
    );
    saveMembershipRequests(updatedRequests);

    // 2. Update User Profile: promote from visitor to member!
    const updatedUsers = users.map((u) => {
      if (u.id === targetReq.userId || u.email.toLowerCase() === targetReq.userEmail.toLowerCase()) {
        return {
          ...u,
          role: 'member' as const,
          membershipStatus: 'active' as const,
          membershipApprovedAt: now,
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // 3. Update current session if matching
    try {
      const currentSession = localStorage.getItem('ece_terroir_user');
      if (currentSession) {
        const parsed = JSON.parse(currentSession);
        if (parsed.id === targetReq.userId || parsed.email.toLowerCase() === targetReq.userEmail.toLowerCase()) {
          const updatedSession = {
            ...parsed,
            role: 'member',
            membershipStatus: 'active',
            membershipApprovedAt: now,
          };
          localStorage.setItem('ece_terroir_user', JSON.stringify(updatedSession));
        }
      }
    } catch (e) {}

    try {
      supabase.from('membership_requests').update({
        status: 'approved',
        reviewed_at: now,
        reviewed_by: reviewerName,
      }).eq('id', requestId).then();

      supabase.from('profiles').update({
        role: 'member',
        membership_status: 'active',
        membership_approved_at: now,
      }).eq('email', targetReq.userEmail.toLowerCase()).then();
    } catch (e) {}

    addAdminLog(
      'Validation Cotisation & Adhésion',
      'user',
      `Paiement de la cotisation (10,00 €) validé pour ${targetReq.userName} (${targetReq.userEmail}). Profil promu au statut Membre et synchronisé dans le fichier Excel du Google Drive (PÔLE TRÉSORERIE).`
    );

    // 4. Déclencher l'envoi de l'email officiel avec Pass Épicurien
    try {
      fetch('/api/send-membership-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            fullName: targetReq.userName,
            email: targetReq.userEmail,
            promo: targetReq.userPromo || 'ING4 (Promo 2028)',
            matricule: `ECE-TERR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            amountCents: targetReq.amountCents || 1000,
            approvedAt: now,
          },
        }),
      }).catch((e) => console.warn('Erreur envoi email adhésion:', e));
    } catch (e) {}

    // 5. Synchronisation automatique de l'Excel sur le Google Drive officiel !
    syncDriveExcel(updatedUsers, updatedRequests);
  };

  const rejectMembership = (requestId: string, reviewerName: string = 'Admin Bureau') => {
    const targetReq = membershipRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const now = new Date().toISOString();

    const updatedRequests = membershipRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'rejected' as const, reviewedAt: now, reviewedBy: reviewerName }
        : r
    );
    saveMembershipRequests(updatedRequests);

    const updatedUsers = users.map((u) => {
      if (u.id === targetReq.userId || u.email.toLowerCase() === targetReq.userEmail.toLowerCase()) {
        return {
          ...u,
          membershipStatus: 'rejected' as const,
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    try {
      supabase.from('membership_requests').update({
        status: 'rejected',
        reviewed_at: now,
        reviewed_by: reviewerName,
      }).eq('id', requestId).then();

      supabase.from('profiles').update({
        membership_status: 'rejected',
      }).eq('email', targetReq.userEmail.toLowerCase()).then();
    } catch (e) {}

    addAdminLog(
      'Refus Cotisation',
      'user',
      `Demande d'adhésion refusée pour ${targetReq.userName} (${targetReq.userEmail}).`
    );
    syncDriveExcel(updatedUsers, updatedRequests);
  };

  const saveCheckIns = (updated: CheckInRecord[]) => {
    setCheckIns(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
    } catch (e) {}
  };

  // --- Handlers for Check-in / Émargement aux Soirées ---
  const checkInMember = (
    eventId: string,
    query: string,
    adminName: string = 'Administrateur Bureau',
    notes?: string
  ) => {
    const targetEvent = events.find((e) => e.id === eventId);
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return {
        success: false,
        reason: 'not_found' as const,
        message: 'Veuillez saisir un matricule, un nom ou scanner un QR code.',
      };
    }

    // Extract matricule/id if a full verification URL was scanned
    let parsedQuery = cleanQuery;
    if (cleanQuery.includes('id=')) {
      try {
        const url = new URL(query.trim());
        parsedQuery = (url.searchParams.get('id') || cleanQuery).toLowerCase();
      } catch {
        const match = cleanQuery.match(/id=([a-z0-9_-]+)/i);
        if (match) parsedQuery = match[1].toLowerCase();
      }
    }

    // Find user by matricule, id, email, or name
    const foundUser = users.find((u) => {
      const mat = getMemberMatricule(u).toLowerCase();
      return (
        mat === parsedQuery ||
        u.id.toLowerCase() === parsedQuery ||
        u.email.toLowerCase() === parsedQuery ||
        u.fullName.toLowerCase().includes(parsedQuery)
      );
    });

    if (!foundUser) {
      return {
        success: false,
        reason: 'not_found' as const,
        message: `Aucun membre trouvé pour "${query}". Vérifiez l'orthographe ou inscrivez le profil.`,
      };
    }

    const userMat = getMemberMatricule(foundUser);
    const isMember =
      foundUser.role === 'member' ||
      foundUser.role === 'admin' ||
      foundUser.membershipStatus === 'active';
    const isSuspended =
      foundUser.status === 'suspended' ||
      foundUser.membershipStatus === 'suspended';

    if (isSuspended) {
      return {
        success: false,
        user: foundUser,
        reason: 'warning_non_member' as const,
        message: `⛔ ACCÈS REFUSÉ : Le compte de ${foundUser.fullName} est suspendu par le Bureau.`,
      };
    }

    // Check duplicate check-in for this specific event
    const existingCheckIn = checkIns.find(
      (c) =>
        c.eventId === eventId &&
        (c.userId === foundUser.id || c.userMatricule.toLowerCase() === userMat.toLowerCase())
    );

    if (existingCheckIn) {
      const timeFormatted = new Date(existingCheckIn.checkedInAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        success: false,
        record: existingCheckIn,
        user: foundUser,
        reason: 'already_checked_in' as const,
        message: `⚠️ ATTENTION DOUBLON : ${foundUser.fullName} a DÉJÀ émargé à ${timeFormatted} (scanné par ${existingCheckIn.checkedInBy}).`,
      };
    }

    const entryStatus: 'valid' | 'warning_non_member' = isMember
      ? 'valid'
      : 'warning_non_member';

    const newRecord: CheckInRecord = {
      id: `chk-${Date.now()}`,
      eventId,
      eventTitle: targetEvent?.title || 'Soirée Terroir',
      userId: foundUser.id,
      userMatricule: userMat,
      userName: foundUser.fullName,
      userEmail: foundUser.email,
      userPromo: foundUser.promo,
      isMember,
      checkedInAt: new Date().toISOString(),
      checkedInBy: adminName,
      entryStatus,
      notes: notes || (isMember ? 'Pass Épicurien Validé' : 'Visiteur non-adhérent (Tarif plein)'),
    };

    const updatedCheckIns = [newRecord, ...checkIns];
    saveCheckIns(updatedCheckIns);

    try {
      supabase.from('event_checkins').insert({
        id: newRecord.id,
        event_id: newRecord.eventId,
        event_title: newRecord.eventTitle,
        user_id: newRecord.userId,
        user_matricule: newRecord.userMatricule,
        user_name: newRecord.userName,
        user_email: newRecord.userEmail,
        user_promo: newRecord.userPromo,
        is_member: newRecord.isMember,
        checked_in_at: newRecord.checkedInAt,
        checked_in_by: newRecord.checkedInBy,
        entry_status: newRecord.entryStatus,
        notes: newRecord.notes,
      }).then();
    } catch (e) {}

    addAdminLog(
      'Émargement Soirée',
      'event',
      `Émargement validé pour ${foundUser.fullName} (${userMat}) à « ${targetEvent?.title || eventId} » (Scanné par ${adminName}).`
    );

    return {
      success: true,
      record: newRecord,
      user: foundUser,
      reason: isMember ? ('ok' as const) : ('warning_non_member' as const),
      message: isMember
        ? `✅ ENTRÉE VALIDÉE : ${foundUser.fullName} • Pass Épicurien & Cotisation OK`
        : `⚠️ ENTRÉE VALIDÉE (Non-Adhérent) : ${foundUser.fullName} n'a pas de cotisation active (tarif plein).`,
    };
  };

  const undoCheckIn = (checkInId: string) => {
    const target = checkIns.find((c) => c.id === checkInId);
    const updated = checkIns.filter((c) => c.id !== checkInId);
    saveCheckIns(updated);
    if (target) {
      addAdminLog(
        'Annulation Émargement',
        'event',
        `Émargement annulé pour ${target.userName} (${target.eventTitle}).`
      );
    }
  };

  const clearCheckInsForEvent = (eventId: string) => {
    const updated = checkIns.filter((c) => c.eventId !== eventId);
    saveCheckIns(updated);
    addAdminLog(
      'Réinitialisation Émargement',
      'event',
      `Liste d'émargement réinitialisée pour l'événement ID ${eventId}.`
    );
  };

  const resetToDefaults = () => {
    saveEvents(MOCK_EVENTS);
    savePosts(MOCK_POSTS);
    saveProducts(MOCK_PRODUCTS);
    saveUsers(MOCK_USERS);
    saveLogs(MOCK_ADMIN_LOGS);
    saveSocialPosts(MOCK_SOCIAL_POSTS);
    saveMembershipRequests(MOCK_MEMBERSHIP_REQUESTS);
    saveCheckIns(MOCK_CHECK_INS);
    addAdminLog('Réinitialisation Données', 'security', 'Toutes les données de l\'application ont été réinitialisées aux valeurs par défaut.');
    syncDriveExcel(MOCK_USERS, MOCK_MEMBERSHIP_REQUESTS);
  };

  return (
    <DataContext.Provider
      value={{
        events,
        posts,
        products,
        orders,
        users,
        adminLogs,
        socialPosts,
        membershipRequests,
        checkIns,
        addEvent,
        updateEvent,
        deleteEvent,
        addPost,
        updatePost,
        deletePost,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        createOrder,
        updateOrderStatus,
        addUser,
        updateUser,
        deleteUser,
        addSocialPost,
        updateSocialPost,
        deleteSocialPost,
        requestMembership,
        approveMembership,
        rejectMembership,
        syncDriveExcel,
        checkInMember,
        undoCheckIn,
        clearCheckInsForEvent,
        addAdminLog,
        clearAdminLogs,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
