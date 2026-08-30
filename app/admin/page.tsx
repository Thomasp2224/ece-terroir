'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { 
  EventItem, 
  BlogPost, 
  MerchProduct, 
  UserProfile, 
  AdminLog, 
  SocialPost, 
  MembershipRequest, 
  EventType, 
  PostCategory, 
  UserRole, 
  UserStatus 
} from '@/lib/types';
import { formatPrice, formatDateFrench, formatDateTimeFrench } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import EpicureanPassCard from '@/components/membership/EpicureanPassCard';
import { 
  ShieldCheck, 
  Calendar, 
  Newspaper, 
  ShoppingBag, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Package, 
  Users, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  X, 
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  Share2,
  Heart,
  MessageCircle,
  CreditCard,
  Banknote,
  Send,
  Award,
  Check,
  XCircle,
  FileSpreadsheet,
  QrCode,
  Zap,
  Mail,
  Play,
  Eye,
  Terminal,
  Code,
  Copy,
  CheckCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import CheckInScannerModal from '@/components/admin/CheckInScannerModal';
import * as XLSX from 'xlsx';

const EVENT_IMAGE_PRESETS = [
  { label: 'Fromages & Charcuteries', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Alpages & Montagne', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Soirée Raclette', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Buffet & Planches', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop' },
];

const POST_IMAGE_PRESETS = [
  { label: 'Meule de Comté', url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Terroirs d\'Auvergne', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Artisans Fromagers', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop' },
];

const MERCH_IMAGE_PRESETS = [
  { label: 'Planche en Chêne', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Couteau de Poche', url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Hoodie / Textile', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Coffret Gourmand', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop' },
];

const SOCIAL_IMAGE_PRESETS = [
  { label: 'Dégustation Soirée', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop' },
  { label: 'Raclette Foyer', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop' },
  { label: 'Planches & Merch', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop' },
  { label: 'Couteau & Saucisson', url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { 
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
    updateOrderStatus,
    addUser,
    updateUser,
    deleteUser,
    addSocialPost,
    updateSocialPost,
    deleteSocialPost,
    approveMembership,
    rejectMembership,
    syncDriveExcel,
    undoCheckIn,
    clearCheckInsForEvent,
    addAdminLog,
    clearAdminLogs,
    resetToDefaults
  } = useData();

  const [activeTab, setActiveTab] = useState<'events' | 'posts' | 'social' | 'merch' | 'orders' | 'memberships' | 'users' | 'logs' | 'checkins' | 'webhooks'>('memberships');
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannerEventId, setScannerEventId] = useState<string>('');
  const [checkInEventFilter, setCheckInEventFilter] = useState<string>('all');
  const [checkInSearch, setCheckInSearch] = useState<string>('');

  // Webhook & Email Simulator states
  const [webhookSimName, setWebhookSimName] = useState('Alexandre Dumas');
  const [webhookSimEmail, setWebhookSimEmail] = useState('alexandre.dumas@edu.ece.fr');
  const [webhookSimPromo, setWebhookSimPromo] = useState('ING4 (Promo 2028)');
  const [webhookSimAmount, setWebhookSimAmount] = useState('10.00');
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ id: string; timestamp: string; status: 'success' | 'error'; message: string; matricule?: string; member?: any }>>([
    {
      id: 'log-init',
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Passerelle HelloAsso Webhooks prête sur /api/webhooks/helloasso',
    }
  ]);
  const [emailPreviewModalOpen, setEmailPreviewModalOpen] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string>('');
  const [testEmailAddress, setTestEmailAddress] = useState(user?.email || 'admin@eceterroir.fr');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);

  // Form states for creation
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('Dégustation');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Campus ECE Eiffel 1');
  const [newEventPrice, setNewEventPrice] = useState('12');
  const [newEventCapacity, setNewEventCapacity] = useState('50');
  const [newEventRequiresBooking, setNewEventRequiresBooking] = useState(true);
  const [newEventHelloAsso, setNewEventHelloAsso] = useState('');
  const [newEventCover, setNewEventCover] = useState(EVENT_IMAGE_PRESETS[0].url);
  const [newEventDesc, setNewEventDesc] = useState('');

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Dégustation');
  const [newPostCover, setNewPostCover] = useState(POST_IMAGE_PRESETS[0].url);
  const [newPostContent, setNewPostContent] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<'Textile' | 'Verre & Sommelerie' | 'Accessoires' | 'Coffrets Gourmands'>('Accessoires');
  const [newProdPrice, setNewProdPrice] = useState('19');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState(MERCH_IMAGE_PRESETS[0].url);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPromo, setNewUserPromo] = useState('ING4 (Promo 2028)');
  const [newUserRole, setNewUserRole] = useState<UserRole>('member');

  // Social form state
  const [newSocialPlatform, setNewSocialPlatform] = useState<'instagram' | 'tiktok'>('instagram');
  const [newSocialContent, setNewSocialContent] = useState('');
  const [newSocialMedia, setNewSocialMedia] = useState(SOCIAL_IMAGE_PRESETS[0].url);
  const [newSocialLikes, setNewSocialLikes] = useState('250');
  const [newSocialComments, setNewSocialComments] = useState('18');
  const [newSocialUrl, setNewSocialUrl] = useState('https://www.instagram.com/eceterroir/');

  // Search & filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState<string>('all');

  // Edit Modals state
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingProduct, setEditingProduct] = useState<MerchProduct | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialPost | null>(null);

  // Deletion confirm modal
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'event' | 'post' | 'product' | 'user' | 'social'; id: string; name: string } | null>(null);
  const [inspectingPassUser, setInspectingPassUser] = useState<UserProfile | null>(null);

  const [alertSuccess, setAlertSuccess] = useState('');

  const triggerSuccess = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(''), 3500);
  };

  // Pending membership count
  const pendingMemberships = membershipRequests.filter((r) => r.status === 'pending');

  // --- Handlers for Events ---
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const isGathering = !newEventRequiresBooking || newEventType === 'Rassemblement';

    const created: EventItem = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      slug: newEventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newEventDesc || 'Événement officiel de l\'association ECE Terroir.',
      eventType: newEventType,
      startDate: newEventDate ? new Date(newEventDate).toISOString() : new Date().toISOString(),
      location: newEventLocation,
      coverImageUrl: newEventCover,
      priceCents: isGathering ? 0 : Math.round(parseFloat(newEventPrice || '0') * 100),
      helloAssoUrl: isGathering ? undefined : (newEventHelloAsso || 'https://www.helloasso.com'),
      capacity: isGathering ? 0 : parseInt(newEventCapacity || '50', 10),
      remainingSeats: isGathering ? 0 : parseInt(newEventCapacity || '50', 10),
      requiresBooking: !isGathering,
      featured: true,
    };
    addEvent(created);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventRequiresBooking(true);
    triggerSuccess(isGathering ? 'Rassemblement libre publié !' : 'Événement avec billetterie publié !');
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    updateEvent(editingEvent.id, editingEvent);
    setEditingEvent(null);
    triggerSuccess('Événement modifié avec succès !');
  };

  // --- Handlers for Posts ---
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      slug: newPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: newPostContent.slice(0, 120) + '...',
      content: newPostContent,
      coverImageUrl: newPostCover,
      category: newPostCategory,
      author: {
        name: user?.fullName || 'Bureau ECE Terroir',
        role: 'Admin Bureau',
      },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: Math.max(2, Math.round(newPostContent.split(' ').length / 150)),
      tags: ['Actualité', 'Gastronomie', 'ECE Terroir'],
    };
    addPost(created);
    setNewPostTitle('');
    setNewPostContent('');
    triggerSuccess('Article de blog publié avec succès !');
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    updatePost(editingPost.id, editingPost);
    setEditingPost(null);
    triggerSuccess('Article modifié avec succès !');
  };

  // --- Handlers for Products ---
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MerchProduct = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newProdDesc || 'Produit exclusif aux couleurs d\'ECE Terroir.',
      priceCents: Math.round(parseFloat(newProdPrice || '0') * 100),
      category: newProdCat,
      stock: parseInt(newProdStock || '10', 10),
      imageUrl: newProdImage,
      sizes: newProdCat === 'Textile' ? ['S', 'M', 'L', 'XL'] : undefined,
    };
    addProduct(created);
    setNewProdName('');
    setNewProdDesc('');
    triggerSuccess('Nouveau produit ajouté à la boutique !');
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    triggerSuccess('Produit de la boutique mis à jour !');
  };

  // --- Handlers for Users ---
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUserEmail.trim().toLowerCase();
    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: newUserName,
      email: trimmed,
      promo: newUserPromo,
      role: newUserRole,
      status: 'active',
      membershipStatus: newUserRole === 'member' || newUserRole === 'admin' ? 'active' : 'none',
      createdAt: new Date().toISOString(),
      lastLogin: 'Jamais connecté',
    };
    addUser(created);
    setNewUserName('');
    setNewUserEmail('');
    triggerSuccess(`Utilisateur ${created.fullName} enregistré avec succès !`);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
    triggerSuccess(`Profil utilisateur ${editingUser.fullName} mis à jour !`);
  };

  // --- Handlers for HelloAsso Webhooks & Emailing ---
  const handleSimulateHelloAsso = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingWebhook(true);
    try {
      const res = await fetch('/api/webhooks/helloasso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'Order',
          data: {
            payer: {
              firstName: webhookSimName.split(' ')[0] || 'Alexandre',
              lastName: webhookSimName.split(' ').slice(1).join(' ') || 'Dumas',
              email: webhookSimEmail,
            },
            amount: Math.round(parseFloat(webhookSimAmount) * 100),
            customFields: { promo: webhookSimPromo },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'success',
            message: `✅ Paiement HelloAsso validé : ${data.member.fullName} (${data.matricule})`,
            matricule: data.matricule,
            member: data.member,
          },
          ...prev,
        ]);
        // Also ensure student is in users list as member
        const existing = users.find((u) => u.email.toLowerCase() === webhookSimEmail.toLowerCase());
        if (!existing) {
          addUser({
            id: data.member.id,
            fullName: data.member.fullName,
            email: data.member.email,
            promo: data.member.promo,
            role: 'member',
            status: 'active',
            membershipStatus: 'active',
            membershipPaymentMethod: 'helloasso',
            createdAt: new Date().toISOString(),
          });
        }
        triggerSuccess(`Adhésion HelloAsso validée avec succès ! Matricule : ${data.matricule}`);
      } else {
        setWebhookLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'error',
            message: `❌ Échec Webhook : ${data.error}`,
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      setWebhookLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'error',
          message: `❌ Erreur réseau : ${err.message}`,
        },
        ...prev,
      ]);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  const handleOpenEmailPreview = async () => {
    try {
      const res = await fetch('/api/send-membership-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            fullName: webhookSimName,
            email: webhookSimEmail,
            promo: webhookSimPromo,
            matricule: 'ECE-TERR-2026-4580',
            amountCents: Math.round(parseFloat(webhookSimAmount) * 100),
          },
        }),
      });
      const data = await res.json();
      setEmailPreviewHtml(data.previewHtml);
      setEmailPreviewModalOpen(true);
    } catch (e) {
      console.error('Erreur prévisualisation email:', e);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    try {
      const res = await fetch('/api/send-membership-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            fullName: webhookSimName,
            email: testEmailAddress,
            promo: webhookSimPromo,
            matricule: 'ECE-TERR-2026-4580',
            amountCents: Math.round(parseFloat(webhookSimAmount) * 100),
          },
          sendRealEmail: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(`Email envoyé (${data.dispatchStatus}) vers ${testEmailAddress} !`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // --- Handlers for Social Posts ---
  const handleCreateSocial = (e: React.FormEvent) => {
    e.preventDefault();
    const isInsta = newSocialPlatform === 'instagram';
    const created: SocialPost = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      author: 'ECE Terroir',
      handle: isInsta ? '@eceterroir' : '@ece.terroir',
      content: newSocialContent,
      mediaUrl: newSocialMedia,
      likesCount: parseInt(newSocialLikes || '100', 10),
      commentsCount: parseInt(newSocialComments || '5', 10),
      postUrl: newSocialUrl || (isInsta ? 'https://www.instagram.com/eceterroir/' : 'https://www.tiktok.com/@ece.terroir'),
      publishedAt: new Date().toISOString(),
    };
    addSocialPost(created);
    setNewSocialContent('');
    triggerSuccess(`Post ${isInsta ? 'Instagram' : 'TikTok'} ajouté au flux !`);
  };

  const handleUpdateSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;
    updateSocialPost(editingSocial.id, editingSocial);
    setEditingSocial(null);
    triggerSuccess('Publication réseaux mise à jour !');
  };

  // --- Handlers for Memberships Approval / Rejection ---
  const handleApproveMembership = (req: MembershipRequest) => {
    approveMembership(req.id, user?.fullName || 'Administrateur Bureau');
    triggerSuccess(`Adhésion validée pour ${req.userName} ! Son compte est désormais Membre Officiel.`);
  };

  const handleRejectMembership = (req: MembershipRequest) => {
    if (confirm(`Voulez-vous refuser la demande d'adhésion de ${req.userName} ?`)) {
      rejectMembership(req.id, user?.fullName || 'Administrateur Bureau');
      triggerSuccess(`Demande d'adhésion de ${req.userName} refusée.`);
    }
  };

  // --- Deletion Execution ---
  const executeDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'event') {
      deleteEvent(deleteConfirm.id);
      triggerSuccess(`L'événement « ${deleteConfirm.name} » a été supprimé.`);
    } else if (deleteConfirm.type === 'post') {
      deletePost(deleteConfirm.id);
      triggerSuccess(`L'article « ${deleteConfirm.name} » a été supprimé.`);
    } else if (deleteConfirm.type === 'product') {
      deleteProduct(deleteConfirm.id);
      triggerSuccess(`Le produit « ${deleteConfirm.name} » a été retiré.`);
    } else if (deleteConfirm.type === 'user') {
      deleteUser(deleteConfirm.id);
      triggerSuccess(`L'utilisateur « ${deleteConfirm.name} » a été supprimé.`);
    } else if (deleteConfirm.type === 'social') {
      deleteSocialPost(deleteConfirm.id);
      triggerSuccess(`Le post réseaux « ${deleteConfirm.name} » a été supprimé.`);
    }
    setDeleteConfirm(null);
  };

  // --- Filtered Users & Logs ---
  const filteredUsers = users.filter((u) => {
    const matchSearch = 
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.promo && u.promo.toLowerCase().includes(userSearch.toLowerCase()));
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  const filteredLogs = adminLogs.filter((l) => {
    const matchSearch = 
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.userEmail.toLowerCase().includes(logSearch.toLowerCase());
    const matchCategory = logCategoryFilter === 'all' || l.category === logCategoryFilter;
    return matchSearch && matchCategory;
  });

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adminLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    triggerSuccess('Fichier de logs exporté en JSON !');
  };

  // Contrôle d'accès strict : Réservé exclusivement aux comptes du Bureau Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full liquid-glass rounded-3xl p-8 text-center space-y-5 border border-red-200 shadow-2xl bg-white/90">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#58111A] flex items-center justify-center mx-auto border border-red-200 shadow-inner">
            <Lock className="w-8 h-8 text-[#58111A]" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#14281D] px-3 py-1 rounded-full">
              Accès Restreint au Bureau
            </span>
            <h1 className="font-serif-title font-extrabold text-2xl text-[#14281D]">
              Espace Administrateur Réservé
            </h1>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Cet espace est strictement réservé aux membres du Bureau officiel d&apos;ECE Terroir. Les données d&apos;adhésions, statistiques et trésorerie sont protégées.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-2xl skeuo-btn-pine text-xs font-extrabold flex items-center justify-center gap-2 shadow"
            >
              <span>Se Connecter avec un Compte Bureau</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-2xl skeuo-btn-cream text-xs font-bold flex items-center justify-center text-[#14281D]"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="rounded-3xl bg-[#14281D] text-[#FDFBF7] p-8 sm:p-10 border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Espace Administrateur Sécurisé
            </div>
            <h1 className="font-serif-title font-extrabold text-2xl sm:text-4xl">
              Dashboard Bureau ECE Terroir
            </h1>
            <p className="text-xs sm:text-sm text-[#D8CCC0]">
              Gestion globale : adhésions & cotisations, événements, blog, réseaux, boutique, membres et audit de sécurité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Voulez-vous réinitialiser toutes les données aux valeurs par défaut ?')) {
                  resetToDefaults();
                  triggerSuccess('Données réinitialisées aux valeurs initiales.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-[#D8CCC0] hover:text-[#FDFBF7] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Réinitialiser les données"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              onClick={() => {
                setScannerEventId(events[0]?.id || 'evt-1');
                setIsScannerModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#58111A] text-xs font-extrabold hover:bg-amber-300 transition-all shadow-md flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mode Guichetier (Scan QR)</span>
            </button>

            <Link
              href="/profil"
              className="px-4 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold hover:bg-[#722F37] transition-all"
            >
              Voir mon profil
            </Link>
          </div>
        </div>

        {/* Alert message */}
        {alertSuccess && (
          <div className="p-4 rounded-2xl bg-[#1B3B2B]/10 border border-[#1B3B2B]/30 text-xs font-bold text-[#1B3B2B] flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#1B3B2B]" />
            <span>{alertSuccess}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#EAE2D8] pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'memberships'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
            <span>Cotisations ({membershipRequests.length})</span>
            {pendingMemberships.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold animate-pulse">
                {pendingMemberships.length} en attente
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('checkins')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'checkins'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#D4AF37]" />
            <span>🎟️ Émargement Soirées ({checkIns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Événements ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Newspaper className="w-4 h-4 text-[#D4AF37]" />
            <span>Blog ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Flux Réseaux ({socialPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('merch')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'merch'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Boutique ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Membres & Visiteurs ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'webhooks'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            <span>⚡ HelloAsso & Emailing</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-[#58111A] text-[#FDFBF7] shadow-md'
                : 'bg-[#FFFFFF] text-[#78716C] border border-[#EAE2D8] hover:bg-[#F6F1EA]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#D4AF37]" />
            <span>Logs ({adminLogs.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 0: MEMBERSHIPS & COTISATIONS VALIDATION QUEUE        */}
        {/* ======================================================== */}
        {activeTab === 'memberships' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Cotisations en attente :</span>
                <p className="font-serif-title font-extrabold text-3xl text-amber-600">
                  {pendingMemberships.length}
                </p>
                <span className="text-[11px] text-[#78716C]">À vérifier et valider</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Membres Actifs Validés :</span>
                <p className="font-serif-title font-extrabold text-3xl text-[#1B3B2B]">
                  {users.filter(u => u.role === 'member' || u.role === 'admin').length}
                </p>
                <span className="text-[11px] text-[#78716C]">Adhérents officiels 2026-2027</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Montant Cotisations :</span>
                <p className="font-serif-title font-extrabold text-3xl text-[#58111A]">
                  {formatPrice(membershipRequests.filter(r => r.status === 'approved').length * 1000)}
                </p>
                <span className="text-[11px] text-[#78716C]">Encaissés au budget de l&apos;asso</span>
              </div>
            </div>

            {/* Google Drive Excel Integration Banner */}
            <div className="p-6 rounded-3xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                      Synchronisé Google Drive
                    </span>
                    <span className="text-xs text-[#D8CCC0]">Pôle Trésorerie ECE Terroir</span>
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#FDFBF7]">
                    Registre Officiel des Adhérents & Cotisations (.xlsx)
                  </h4>
                  <p className="text-[11px] text-[#D8CCC0] font-mono break-all">
                    📁 G:\Mon Drive\ECE Terroir - Drive Officiel\PÔLE TRÉSORERIE\Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={async () => {
                    setIsSyncingDrive(true);
                    const res = await syncDriveExcel();
                    setIsSyncingDrive(false);
                    if (res.success) {
                      triggerSuccess('Fichier Excel synchronisé sur le Google Drive (PÔLE TRÉSORERIE) !');
                    } else {
                      alert('Erreur synchronisation : ' + (res.error || 'Vérifiez le chemin G:'));
                    }
                  }}
                  disabled={isSyncingDrive}
                  className="px-4 py-2.5 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-md transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                  <span>{isSyncingDrive ? 'Synchronisation...' : 'Synchroniser le Drive'}</span>
                </button>

                <a
                  href="/api/sync-drive-excel"
                  download="Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] font-bold text-xs border border-white/20 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Télécharger Excel (.xlsx)</span>
                </a>

                <Link
                  href="/verifier"
                  className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] text-[#1B3B2B] hover:bg-[#F6F1EA] font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#58111A]" />
                  <span>Portail Contrôle QR</span>
                </Link>
              </div>
            </div>

            {/* Pending Requests Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-[#1D1917] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Demandes d&apos;Adhésion en Attente ({pendingMemberships.length})
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Cliquez sur « Valider le paiement » pour promouvoir instantanément le profil Visiteur en Membre Officiel.
                  </p>
                </div>
              </div>

              {pendingMemberships.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] text-center space-y-2 text-xs text-[#78716C]">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="font-bold text-sm text-[#1D1917]">Aucune cotisation en attente !</p>
                  <p>Toutes les demandes d&apos;adhésion ont été traitées.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingMemberships.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif-title font-extrabold text-lg shrink-0">
                          {req.userName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-serif-title font-bold text-base text-[#1D1917]">
                              {req.userName}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#58111A]/10 text-[#58111A] text-[10px] font-extrabold">
                              {req.userPromo || 'ECE Paris'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              {req.paymentMethod === 'helloasso'
                                ? '💳 HelloAsso / CB'
                                : req.paymentMethod === 'cash_foyer'
                                ? '💶 Espèces Foyer'
                                : '🏛️ Virement'}
                            </span>
                          </div>

                          <p className="text-xs text-[#78716C]">
                            {req.userEmail} • Demande envoyée le {formatDateTimeFrench(req.requestedAt)}
                          </p>

                          {req.notes && (
                            <p className="text-xs text-[#58111A] font-semibold bg-[#F6F1EA] px-2.5 py-1 rounded-xl w-fit">
                              💬 {req.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="font-serif-title font-extrabold text-base text-[#58111A] mr-2">
                          {formatPrice(req.amountCents)}
                        </span>

                        <button
                          onClick={() => handleApproveMembership(req)}
                          className="px-4 py-2 rounded-xl bg-[#1B3B2B] text-[#FDFBF7] hover:bg-[#264E3A] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 text-[#D4AF37]" />
                          <span>Valider le paiement</span>
                        </button>

                        <button
                          onClick={() => handleRejectMembership(req)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
                          title="Refuser l'adhésion"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved / Processed History */}
            <div className="space-y-4 pt-4 border-t border-[#EAE2D8]">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                Historique des Adhésions Validées ({membershipRequests.filter(r => r.status === 'approved').length})
              </h3>
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] shadow-sm overflow-hidden divide-y divide-[#F6F1EA]">
                {membershipRequests.filter(r => r.status === 'approved').map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1917] text-sm">{req.userName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">
                          ✅ Adhésion Validée
                        </span>
                        <span className="text-[#78716C]">• {req.userEmail} ({req.userPromo})</span>
                      </div>
                      <p className="text-[11px] text-[#78716C]">
                        Validée le {req.reviewedAt ? formatDateTimeFrench(req.reviewedAt) : 'Récemment'} par <strong>{req.reviewedBy || 'Bureau'}</strong> • {formatPrice(req.amountCents)}
                      </p>
                    </div>

                    <span className="font-serif-title font-extrabold text-sm text-[#1B3B2B]">
                      {req.paymentMethod === 'helloasso' ? 'HelloAsso' : req.paymentMethod === 'cash_foyer' ? 'Espèces' : 'Virement'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: EVENTS & GATHERINGS MANAGER                       */}
        {/* ======================================================== */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Publier un Événement
              </h3>
              <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Titre de l&apos;événement :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Soirée Dégustation d'Automne"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <ImageUploader
                  label="Photo de couverture"
                  value={newEventCover}
                  onChange={setNewEventCover}
                  presetSuggestions={EVENT_IMAGE_PRESETS}
                />

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Type d&apos;événement :</label>
                  <select
                    value={newEventType}
                    onChange={(e) => {
                      const type = e.target.value as EventType;
                      setNewEventType(type);
                      if (type === 'Rassemblement') {
                        setNewEventRequiresBooking(false);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  >
                    <option value="Dégustation">Dégustation Gourmande</option>
                    <option value="Rassemblement">Rassemblement Libre (Sans Réservation)</option>
                    <option value="Soirée">Soirée & Banquet</option>
                    <option value="Voyage">Voyage Gastronomique</option>
                    <option value="Atelier">Atelier Artisan</option>
                    <option value="Conférence">Conférence</option>
                  </select>
                </div>

                <div 
                  onClick={() => setNewEventRequiresBooking(!newEventRequiresBooking)}
                  className="p-3 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] flex items-center gap-2.5 cursor-pointer hover:bg-[#EAE2D8] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!newEventRequiresBooking}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#58111A]"
                  />
                  <div>
                    <span className="font-bold text-[#1D1917] block">Rassemblement libre / Accès direct</span>
                    <span className="text-[10px] text-[#78716C]">Pas de billetterie HelloAsso ni de limitation de places</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Date et heure :</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Lieu :</label>
                  <input
                    type="text"
                    required
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                {newEventRequiresBooking && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-[#78716C] mb-1">Tarif (€) :</label>
                        <input
                          type="number"
                          value={newEventPrice}
                          onChange={(e) => setNewEventPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#78716C] mb-1">Capacité places :</label>
                        <input
                          type="number"
                          value={newEventCapacity}
                          onChange={(e) => setNewEventCapacity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Lien Billetterie HelloAsso :</label>
                      <input
                        type="url"
                        placeholder="https://www.helloasso.com/associations/..."
                        value={newEventHelloAsso}
                        onChange={(e) => setNewEventHelloAsso(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Description :</label>
                  <textarea
                    rows={3}
                    placeholder="Détails du programme..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md mt-2"
                >
                  Publier l&apos;Événement
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                Événements Publiés ({events.length})
              </h3>
              <div className="space-y-3">
                {events.map((evt) => {
                  const isGathering = evt.requiresBooking === false || evt.eventType === 'Rassemblement';

                  return (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={evt.coverImageUrl}
                          alt={evt.title}
                          className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-[#58111A]/10 text-[#58111A] text-[10px] font-bold">
                              {evt.eventType}
                            </span>
                            {isGathering && (
                              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                                🎉 Accès Libre
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif-title font-bold text-sm text-[#1D1917]">{evt.title}</h4>
                          <p className="text-[11px] text-[#78716C]">
                            {formatDateFrench(evt.startDate)} • {evt.location} • {isGathering ? 'Gratuit' : formatPrice(evt.priceCents)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setEditingEvent(evt)}
                          className="p-2 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier & Photo</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'event', id: evt.id, name: evt.title })}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BLOG POSTS MANAGER                                */}
        {/* ======================================================== */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Rédiger un Article
              </h3>
              <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Titre de l&apos;article :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Les secrets du Comté AOP"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <ImageUploader
                  label="Photo de l'article"
                  value={newPostCover}
                  onChange={setNewPostCover}
                  presetSuggestions={POST_IMAGE_PRESETS}
                />

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Catégorie :</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as PostCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  >
                    <option value="Dégustation">Dégustation</option>
                    <option value="Voyage">Voyage</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Vie de l'asso">Vie de l&apos;asso</option>
                    <option value="Recette & Astuce">Recette & Astuce</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Contenu (Markdown supporté) :</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Rédigez le texte avec ### Titres..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md mt-2"
                >
                  Publier l&apos;Article
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">Articles en ligne ({posts.length})</h3>
              <div className="space-y-3">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={p.coverImageUrl}
                        alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded bg-[#1B3B2B]/10 text-[#1B3B2B] text-[10px] font-bold">
                          {p.category}
                        </span>
                        <h4 className="font-serif-title font-bold text-sm text-[#1D1917]">{p.title}</h4>
                        <p className="text-[11px] text-[#78716C]">Par {p.author.name} • {formatDateFrench(p.publishedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setEditingPost(p)}
                        className="p-2 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifier & Photo</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'post', id: p.id, name: p.title })}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SOCIAL MEDIA FEED MANAGER (INSTAGRAM & TIKTOK)     */}
        {/* ======================================================== */}
        {activeTab === 'social' && (
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#1B3B2B] text-[#FDFBF7] border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Comptes Officiels ECE Terroir Connectés
                </span>
                <p className="font-serif-title font-bold text-lg sm:text-xl">
                  Synchronisation Instagram & TikTok
                </p>
                <p className="text-xs text-[#D8CCC0]">
                  Les publications ajoutées ici s&apos;affichent directement sur la page d&apos;accueil et la page Actualités.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.instagram.com/eceterroir/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] text-xs font-bold transition-all border border-[#D4AF37]/30 flex items-center gap-1.5"
                >
                  <span>@eceterroir (Instagram)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://www.tiktok.com/@ece.terroir"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-[#FDFBF7] text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <span>@ece.terroir (TikTok)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form to add social post */}
              <div className="lg:col-span-1 bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-4">
                <h3 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#D4AF37]" /> Ajouter une Publication Réseaux
                </h3>
                <form onSubmit={handleCreateSocial} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Réseau Social :</label>
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => {
                        const plat = e.target.value as 'instagram' | 'tiktok';
                        setNewSocialPlatform(plat);
                        setNewSocialUrl(plat === 'instagram' ? 'https://www.instagram.com/eceterroir/' : 'https://www.tiktok.com/@ece.terroir');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] font-semibold text-[#58111A]"
                    >
                      <option value="instagram">📸 Instagram (@eceterroir)</option>
                      <option value="tiktok">🎵 TikTok (@ece.terroir)</option>
                    </select>
                  </div>

                  <ImageUploader
                    label="Image ou miniature du post / Reel"
                    value={newSocialMedia}
                    onChange={setNewSocialMedia}
                    presetSuggestions={SOCIAL_IMAGE_PRESETS}
                  />

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Texte / Légende du post :</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Ex: Soirée raclette d'anthologie au campus..."
                      value={newSocialContent}
                      onChange={(e) => setNewSocialContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Likes :</label>
                      <input
                        type="number"
                        value={newSocialLikes}
                        onChange={(e) => setNewSocialLikes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Commentaires :</label>
                      <input
                        type="number"
                        value={newSocialComments}
                        onChange={(e) => setNewSocialComments(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Lien direct vers la publication :</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.instagram.com/p/... ou https://www.tiktok.com/..."
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md mt-2"
                  >
                    Ajouter au Flux du Site
                  </button>
                </form>
              </div>

              {/* Social Posts List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                  Publications en Ligne sur le Site ({socialPosts.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socialPosts.map((sp) => (
                    <div
                      key={sp.id}
                      className="bg-[#FFFFFF] border border-[#EAE2D8] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative h-44 w-full bg-black">
                        <img
                          src={sp.mediaUrl}
                          alt={sp.content}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#FDFBF7] border border-[#D4AF37]/30">
                            {sp.platform === 'instagram' ? '📸 Instagram' : '🎵 TikTok'} • {sp.handle}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-[#1D1917] line-clamp-2 leading-relaxed">
                          {sp.content}
                        </p>

                        <div className="pt-3 border-t border-[#F6F1EA] flex items-center justify-between text-xs text-[#78716C]">
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="flex items-center gap-1 text-[#58111A] font-bold">
                              <Heart className="w-3.5 h-3.5 fill-current" /> {sp.likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5" /> {sp.commentsCount}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={sp.postUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[#F6F1EA] text-[#58111A] hover:bg-[#EAE2D8]"
                              title="Ouvrir le lien"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setEditingSocial(sp)}
                              className="p-1.5 rounded-lg bg-[#F6F1EA] text-[#58111A] hover:bg-[#EAE2D8]"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'social', id: sp.id, name: sp.content.slice(0, 30) + '...' })}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MERCH PRODUCTS MANAGER                            */}
        {/* ======================================================== */}
        {activeTab === 'merch' && (
          <div className="space-y-8">
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Ajouter un Produit au Catalogue
              </h3>
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Nom du produit :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Planche en Chêne Massif"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Catégorie :</label>
                    <select
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    >
                      <option value="Accessoires">Accessoires & Découpe</option>
                      <option value="Textile">Textile</option>
                      <option value="Coffrets Gourmands">Coffrets Gourmands</option>
                      <option value="Verre & Sommelerie">Verre & Sommelerie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Prix TTC (€) :</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Stock initial :</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Photo du produit"
                  value={newProdImage}
                  onChange={setNewProdImage}
                  presetSuggestions={MERCH_IMAGE_PRESETS}
                />

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Description :</label>
                  <textarea
                    rows={2}
                    placeholder="Description du produit..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md"
                  >
                    Ajouter au Catalogue
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                Inventaire des Produits ({products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-[#EAE2D8] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#58111A]">{prod.category}</span>
                        <h4 className="font-serif-title font-bold text-sm text-[#1D1917] line-clamp-1">{prod.name}</h4>
                        <p className="text-xs font-bold text-[#58111A] mt-0.5">{formatPrice(prod.priceCents)}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F6F1EA] space-y-3">
                      <div className="p-2.5 rounded-2xl bg-[#F6F1EA] flex items-center justify-between">
                        <span className="text-xs font-bold text-[#78716C]">Stock :</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStock(prod.id, -1)}
                            className="w-7 h-7 rounded-lg bg-[#FFFFFF] border border-[#EAE2D8] hover:bg-[#EAE2D8] text-xs font-bold text-[#58111A]"
                          >
                            -
                          </button>
                          <span className="font-serif-title font-extrabold text-base text-[#1D1917] min-w-[24px] text-center">
                            {prod.stock}
                          </span>
                          <button
                            onClick={() => updateStock(prod.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#FFFFFF] border border-[#EAE2D8] hover:bg-[#EAE2D8] text-xs font-bold text-[#58111A]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="px-3 py-1.5 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier & Photo</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'product', id: prod.id, name: prod.name })}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ORDERS TRACKER                                    */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
              Commandes Click & Collect Campus ({orders.length})
            </h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F6F1EA] gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1D1917]">Commande #{order.id}</span>
                        <span className="text-xs text-[#78716C]">• {order.userName} ({order.userEmail})</span>
                      </div>
                      <p className="text-xs text-[#78716C]">Lieu de retrait : {order.pickupLocation}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-xs font-bold text-[#58111A] focus:outline-none"
                      >
                        <option value="pending">En attente</option>
                        <option value="ready_for_pickup">Prête pour retrait</option>
                        <option value="completed">Retirée / Complétée</option>
                        <option value="cancelled">Annulée</option>
                      </select>

                      <span className="font-serif-title font-extrabold text-lg text-[#58111A]">
                        {formatPrice(order.totalCents)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#1D1917]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>
                          {item.quantity}x {item.product.name} {item.selectedSize ? `(Taille ${item.selectedSize})` : ''}
                        </span>
                        <span className="font-bold">{formatPrice(item.product.priceCents * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: USERS & ROLES MANAGER                             */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-4">
              <h3 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Enregistrer un Nouvel Utilisateur
              </h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Nom complet :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sarah Cohen"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Adresse Email :</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.cohen@edu.ece.fr"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Promo / Statut :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ingé 2 (Promo 2028)"
                    value={newUserPromo}
                    onChange={(e) => setNewUserPromo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Rôle accordé :</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  >
                    <option value="visitor">👤 Visiteur (Non-Membre)</option>
                    <option value="member">🍷 Membre Adhérent</option>
                    <option value="admin">🛡️ Admin Bureau</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md"
                  >
                    Ajouter l&apos;utilisateur
                  </button>
                </div>
              </form>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou promo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#58111A]" />
                {['all', 'admin', 'member', 'visitor'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      userRoleFilter === role
                        ? 'bg-[#58111A] text-[#FDFBF7]'
                        : 'bg-[#F6F1EA] text-[#78716C] hover:bg-[#EAE2D8]'
                    }`}
                  >
                    {role === 'all' ? 'Tous' : role === 'admin' ? 'Admins' : role === 'member' ? 'Membres' : 'Visiteurs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table / Grid */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] shadow-sm overflow-hidden">
              <div className="divide-y divide-[#F6F1EA]">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FDFBF7] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#14281D] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-serif-title font-bold text-lg shrink-0">
                        {u.fullName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif-title font-bold text-sm text-[#1D1917]">{u.fullName}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              u.role === 'admin'
                                ? 'bg-[#D4AF37]/20 text-[#58111A] border border-[#D4AF37]'
                                : u.role === 'member'
                                ? 'bg-[#1B3B2B]/10 text-[#1B3B2B]'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {u.role === 'admin' ? '🛡️ Admin' : u.role === 'member' ? '🍷 Membre' : '👤 Visiteur'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              u.membershipStatus === 'active' || u.role === 'member' || u.role === 'admin'
                                ? 'bg-green-100 text-green-700'
                                : u.membershipStatus === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {u.membershipStatus === 'active' || u.role === 'member' || u.role === 'admin'
                              ? 'Cotisation Active'
                              : u.membershipStatus === 'pending'
                              ? 'Cotisation En Attente'
                              : 'Non Adhérent'}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716C]">{u.email} • {u.promo || 'ECE Paris'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setInspectingPassUser(u)}
                        className="px-3 py-1.5 rounded-xl bg-[#58111A]/10 hover:bg-[#58111A]/20 text-[#58111A] text-xs font-bold flex items-center gap-1 transition-colors border border-[#58111A]/20"
                        title="Voir et télécharger le Pass Épicurien"
                      >
                        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Pass</span>
                      </button>

                      <button
                        onClick={() => setEditingUser(u)}
                        className="px-3 py-1.5 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => {
                          const newStatus = u.status === 'active' ? 'suspended' : 'active';
                          updateUser(u.id, { status: newStatus });
                          triggerSuccess(`Statut de ${u.fullName} changé en : ${newStatus}`);
                        }}
                        className={`p-1.5 rounded-xl text-xs font-semibold ${
                          u.status === 'active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                            : 'bg-green-50 hover:bg-green-100 text-green-700'
                        }`}
                        title={u.status === 'active' ? 'Suspendre l\'accès' : 'Réactiver l\'accès'}
                      >
                        {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setDeleteConfirm({ type: 'user', id: u.id, name: u.fullName })}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: AUDIT LOGS & ACCESS HISTORY                       */}
        {/* ======================================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-title font-bold text-xl text-[#1D1917] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#58111A]" />
                  Journaux d&apos;Audit & Sécurité ({adminLogs.length} événements)
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Historique infalsifiable de toutes les connexions admin, cotisations validées, créations, modifications et suppressions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLogs}
                  className="px-4 py-2 rounded-xl bg-[#1B3B2B] text-[#FDFBF7] font-bold text-xs hover:bg-[#264E3A] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Exporter Logs (JSON)</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Voulez-vous purger tous les journaux d\'audit ?')) {
                      clearAdminLogs();
                      triggerSuccess('Journaux d\'audit purgés.');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purger</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer par action, utilisateur, détail..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['all', 'auth', 'event', 'product', 'post', 'user', 'security'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLogCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      logCategoryFilter === cat
                        ? 'bg-[#58111A] text-[#FDFBF7]'
                        : 'bg-[#F6F1EA] text-[#78716C] hover:bg-[#EAE2D8]'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] shadow-sm overflow-hidden">
              <div className="divide-y divide-[#F6F1EA]">
                {filteredLogs.length === 0 ? (
                  <p className="p-8 text-center text-xs text-[#78716C]">Aucun journal correspondant.</p>
                ) : (
                  filteredLogs.map((log) => {
                    const categoryColors: Record<string, string> = {
                      auth: 'bg-blue-100 text-blue-800 border-blue-200',
                      event: 'bg-purple-100 text-purple-800 border-purple-200',
                      post: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      product: 'bg-amber-100 text-amber-800 border-amber-200',
                      user: 'bg-rose-100 text-rose-800 border-rose-200',
                      security: 'bg-red-100 text-red-800 border-red-200',
                      order: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    };

                    return (
                      <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs hover:bg-[#FDFBF7] transition-colors">
                        <div className="space-y-1.5 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${categoryColors[log.category] || 'bg-gray-100 text-gray-800'}`}>
                              {log.category}
                            </span>
                            <span className="font-bold text-sm text-[#1D1917]">{log.action}</span>
                            <span className="text-[11px] text-[#78716C]">par <strong className="text-[#58111A]">{log.userName}</strong> ({log.userEmail})</span>
                          </div>
                          <p className="text-[#3A3533] leading-relaxed text-xs">{log.details}</p>
                        </div>

                        <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 text-[11px] text-[#78716C]">
                          <span className="flex items-center gap-1 font-semibold text-[#1B3B2B]">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            {formatDateTimeFrench(log.timestamp)}
                          </span>
                          {log.ipAddress && (
                            <span className="text-[10px] bg-[#F6F1EA] px-2 py-0.5 rounded-lg border border-[#EAE2D8]">
                              {log.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: CHECK-IN & ÉMARGEMENT EN DIRECT                   */}
        {/* ======================================================== */}
        {activeTab === 'checkins' && (
          <div className="space-y-8">
            {/* Top KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Total Entrées Pointées :</span>
                <p className="font-serif-title font-extrabold text-3xl text-[#58111A]">
                  {checkIns.length}
                </p>
                <span className="text-[11px] text-[#78716C]">Émargements enregistrés sur les soirées</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Adhérents Pass Épicurien :</span>
                <p className="font-serif-title font-extrabold text-3xl text-[#1B3B2B]">
                  {checkIns.filter((c) => c.isMember).length}
                </p>
                <span className="text-[11px] text-[#78716C]">Membres à jour de cotisation</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-1">
                <span className="text-xs font-bold text-[#78716C] uppercase">Visiteurs Non-Adhérents :</span>
                <p className="font-serif-title font-extrabold text-3xl text-amber-600">
                  {checkIns.filter((c) => !c.isMember).length}
                </p>
                <span className="text-[11px] text-[#78716C]">Tarifs pleins / À convertir en adhérents</span>
              </div>
            </div>

            {/* Guichetier Quick Launcher Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14281D] text-[#FDFBF7] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg shrink-0">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                      Scan Caméra & QR Ultra-Rapide
                    </span>
                    <span className="text-xs text-[#D8CCC0]">Entrées Foyer & Banquets</span>
                  </div>
                  <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#FDFBF7]">
                    Mode Guichetier Mobile & Contrôle d&apos;Accès Plein Écran
                  </h3>
                  <p className="text-xs text-[#D8CCC0] max-w-xl leading-relaxed">
                    Scannez les QR Codes des Pass Épicuriens à la chaîne avec bips audio de confirmation, détection anti-doublon et affichage instantané de la validité de la cotisation.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setScannerEventId(events[0]?.id || 'evt-1');
                    setIsScannerModalOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-[#D4AF37] text-[#58111A] font-extrabold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Ouvrir le Mode Guichetier</span>
                </button>
              </div>
            </div>

            {/* Event Attendance Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                  Jauges d&apos;Affluence par Soirée ({events.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((evt) => {
                  const evtCheckIns = checkIns.filter((c) => c.eventId === evt.id);
                  const count = evtCheckIns.length;
                  const rate = Math.min(100, Math.round((count / (evt.capacity || 50)) * 100));

                  return (
                    <div
                      key={evt.id}
                      className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={evt.coverImageUrl}
                          alt={evt.title}
                          className="w-20 h-20 rounded-2xl object-cover border border-[#EAE2D8] shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-[10px] font-bold">
                            {evt.eventType} • {formatDateFrench(evt.startDate)}
                          </span>
                          <h4 className="font-serif-title font-bold text-base text-[#1D1917] truncate">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-[#78716C] truncate">{evt.location}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-[#F6F1EA]">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#1D1917]">
                          <span>Présents pointés :</span>
                          <span className="text-[#58111A] font-bold">
                            {count} / {evt.capacity} <span className="text-[11px] text-[#78716C]">({rate}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#F6F1EA] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#58111A] transition-all duration-500"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <button
                          onClick={() => {
                            setScannerEventId(evt.id);
                            setIsScannerModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#FDFBF7] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Scanner l&apos;entrée</span>
                        </button>

                        <button
                          onClick={() => {
                            const records = evtCheckIns.map((c, idx) => ({
                              'N°': idx + 1,
                              'Date & Heure': new Date(c.checkedInAt).toLocaleString('fr-FR'),
                              'Matricule Adhérent': c.userMatricule,
                              'Nom & Prénom': c.userName,
                              'Promotion ECE': c.userPromo || 'ECE Paris',
                              'Email': c.userEmail,
                              'Statut': c.isMember ? 'Membre Adhérent' : 'Visiteur',
                              'Guichetier': c.checkedInBy,
                            }));
                            const ws = XLSX.utils.json_to_sheet(records);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, 'Émargement');
                            XLSX.writeFile(wb, `Emargement_${evt.slug}_${new Date().toISOString().slice(0, 10)}.xlsx`);
                            triggerSuccess('Feuille d\'émargement exportée en Excel !');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#1D1917] text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[#EAE2D8]"
                          title="Exporter la liste des présents en Excel"
                        >
                          <Download className="w-3.5 h-3.5 text-[#58111A]" />
                          <span>Excel</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Records Ledger */}
            <div className="space-y-4 bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                    Registre Global des Émargements
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Historique en temps réel des scans et pointages effectués par les membres du bureau.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={checkInEventFilter}
                    onChange={(e) => setCheckInEventFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Tous les événements ({checkIns.length})</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title} ({checkIns.filter((c) => c.eventId === evt.id).length})
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Chercher par nom, matricule..."
                      value={checkInSearch}
                      onChange={(e) => setCheckInSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-xs focus:outline-none focus:border-[#58111A]"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE2D8] bg-[#F6F1EA] text-[#78716C] font-bold">
                      <th className="p-3 rounded-l-xl">Heure de scan</th>
                      <th className="p-3">Événement</th>
                      <th className="p-3">Adhérent / Titulaire</th>
                      <th className="p-3">Promotion</th>
                      <th className="p-3">Statut Pass</th>
                      <th className="p-3">Contrôlé par</th>
                      <th className="p-3 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F6F1EA]">
                    {checkIns
                      .filter((c) => {
                        const matchEvent = checkInEventFilter === 'all' || c.eventId === checkInEventFilter;
                        const matchSearch =
                          c.userName.toLowerCase().includes(checkInSearch.toLowerCase()) ||
                          c.userMatricule.toLowerCase().includes(checkInSearch.toLowerCase()) ||
                          c.userEmail.toLowerCase().includes(checkInSearch.toLowerCase());
                        return matchEvent && matchSearch;
                      })
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="p-3 font-mono text-[#58111A] font-bold">
                            {new Date(c.checkedInAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-semibold text-[#1D1917] max-w-xs truncate">
                            {c.eventTitle}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-[#1D1917] block">{c.userName}</span>
                            <span className="text-[10px] font-mono text-[#78716C]">{c.userMatricule}</span>
                          </td>
                          <td className="p-3 text-[#78716C]">{c.userPromo || 'ECE Paris'}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                c.isMember
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {c.isMember ? '✓ Membre Adhérent' : '⚠️ Visiteur'}
                            </span>
                          </td>
                          <td className="p-3 text-[#78716C]">{c.checkedInBy}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Annuler l'émargement pour ${c.userName} ?`)) {
                                  undoCheckIn(c.id);
                                  triggerSuccess(`Émargement annulé pour ${c.userName}.`);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Annuler l'émargement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: HELLOASSO WEBHOOKS & EMAIL PRESTIGE DISPATCHER      */}
        {/* ======================================================== */}
        {activeTab === 'webhooks' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Gateway Banner */}
            <div className="p-6 rounded-3xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/50 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                      Passerelle Webhook Active
                    </span>
                    <span className="text-xs text-[#D8CCC0]">HelloAsso API v5 & Emailing Automatisé</span>
                  </div>
                  <h3 className="font-serif-title font-bold text-lg text-[#FDFBF7]">
                    Automatisation des Paiements de Cotisations & Expédition des Attestations A4
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#D8CCC0] font-mono">
                    <span>Endpoint Webhook :</span>
                    <code className="px-2 py-0.5 rounded-lg bg-black/40 text-[#D4AF37] border border-white/10">
                      POST /api/webhooks/helloasso
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + '/api/webhooks/helloasso');
                        setCopiedWebhookUrl(true);
                        setTimeout(() => setCopiedWebhookUrl(false), 2000);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-[#D4AF37] transition-colors"
                      title="Copier l'URL du webhook"
                    >
                      {copiedWebhookUrl ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleOpenEmailPreview}
                  className="px-4 py-2.5 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu Email Bistrot Chic</span>
                </button>
              </div>
            </div>

            {/* 2-Column Grid: Webhook Simulator + Email Dispatcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: HELLOASSO SIMULATOR FORM (7 COLS) */}
              <div className="lg:col-span-7 bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif-title font-bold text-xl text-[#58111A] flex items-center gap-2">
                    <Play className="w-5 h-5 text-[#D4AF37]" /> Simulateur d&apos;Événement Webhook HelloAsso
                  </h4>
                  <p className="text-xs text-[#78716C] mt-1">
                    Simulez la réception instantanée d&apos;un paiement de cotisation en ligne (10,00 €) pour tester la création automatique du matricule et l&apos;email de bienvenue.
                  </p>
                </div>

                <form onSubmit={handleSimulateHelloAsso} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Nom et Prénom de l&apos;étudiant :</label>
                      <input
                        type="text"
                        required
                        value={webhookSimName}
                        onChange={(e) => setWebhookSimName(e.target.value)}
                        placeholder="Ex: Alexandre Dumas"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-[#1D1917] font-semibold focus:outline-none focus:border-[#58111A]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Email étudiant (@edu.ece.fr) :</label>
                      <input
                        type="email"
                        required
                        value={webhookSimEmail}
                        onChange={(e) => setWebhookSimEmail(e.target.value)}
                        placeholder="etudiant@edu.ece.fr"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-[#1D1917] font-semibold focus:outline-none focus:border-[#58111A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Promotion / Classe :</label>
                      <select
                        value={webhookSimPromo}
                        onChange={(e) => setWebhookSimPromo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-[#1D1917] font-semibold"
                      >
                        <option value="ING1 (Promo 2031)">ING1 (Promo 2031)</option>
                        <option value="ING2 (Promo 2030)">ING2 (Promo 2030)</option>
                        <option value="ING3 (Promo 2029)">ING3 (Promo 2029)</option>
                        <option value="ING4 (Promo 2028)">ING4 (Promo 2028)</option>
                        <option value="ING5 (Promo 2027)">ING5 (Promo 2027)</option>
                        <option value="Bachelor ECE">Bachelor ECE</option>
                        <option value="Alumni ECE Paris">Alumni ECE Paris</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Montant Cotisation (€) :</label>
                      <input
                        type="number"
                        step="1"
                        value={webhookSimAmount}
                        onChange={(e) => setWebhookSimAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-[#1D1917] font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE2D8] space-y-2">
                    <span className="font-bold text-[#58111A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Actions automatisées déclenchées par ce Webhook :
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#78716C] text-[11px]">
                      <li>Création / Promotion immédiate en compte <strong>Membre Actif</strong>.</li>
                      <li>Attribution du matricule officiel sécurisé <strong>ECE-TERR-2026-XXXX</strong>.</li>
                      <li>Déclenchement du service d&apos;envoi d&apos;email de bienvenue avec attestation A4 jointe.</li>
                      <li>Inscription dans le registre Trésorerie synchronisé Google Drive.</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={isSimulatingWebhook}
                    className="w-full py-3.5 rounded-2xl bg-[#58111A] hover:bg-[#722F37] text-[#FDFBF7] font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/50 disabled:opacity-50"
                  >
                    <Zap className={`w-4 h-4 text-[#D4AF37] ${isSimulatingWebhook ? 'animate-bounce' : ''}`} />
                    <span>{isSimulatingWebhook ? 'Traitement du Webhook...' : '⚡ Déclencher le Paiement HelloAsso (10,00 €)'}</span>
                  </button>
                </form>

                {/* Console Log outputs */}
                <div className="space-y-2 pt-4 border-t border-[#EAE2D8]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1D1917] flex items-center gap-1.5 text-xs">
                      <Terminal className="w-4 h-4 text-[#58111A]" /> Journal des Webhooks Récents ({webhookLogs.length})
                    </span>
                    <button
                      onClick={() => setWebhookLogs([])}
                      className="text-[11px] text-[#78716C] hover:text-red-600"
                    >
                      Effacer
                    </button>
                  </div>

                  <div className="bg-[#14281D] text-[#FDFBF7] p-4 rounded-2xl font-mono text-[11px] space-y-2 max-h-52 overflow-y-auto border border-[#D4AF37]/30">
                    {webhookLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 border-b border-white/10 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#D4AF37] shrink-0">
                          [{new Date(log.timestamp).toLocaleTimeString('fr-FR')}]
                        </span>
                        <span className={log.status === 'success' ? 'text-green-300' : 'text-red-300'}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: EMAIL PREVIEW & DISPATCH PANEL (5 COLS) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                
                {/* Email Dispatcher Card */}
                <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-[#1D1917]">
                        Expédition Email de Prestige
                      </h4>
                      <span className="text-xs text-[#78716C]">Template HTML & Attestation PDF</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#78716C]">Passerelle SMTP / API :</span>
                      <span className="font-mono font-bold text-[#1B3B2B] bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px]">
                        Prêt (Resend / Mode Sandbox)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#78716C]">Expéditeur officiel :</span>
                      <span className="font-mono text-[#58111A]">bienvenue@eceterroir.fr</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#78716C]">Pièce jointe :</span>
                      <span className="font-bold text-[#D4AF37]">Attestation_Adhesion_A4.pdf</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#78716C]">
                      Tester l&apos;envoi vers votre adresse email :
                    </label>
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="votre.email@edu.ece.fr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-xs text-[#1D1917] font-semibold"
                    />

                    <button
                      onClick={handleSendTestEmail}
                      disabled={isSendingTestEmail}
                      className="w-full py-3 rounded-xl bg-[#1B3B2B] hover:bg-[#264E3A] text-[#FDFBF7] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/40 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isSendingTestEmail ? 'Envoi en cours...' : 'Envoyer un Email de Test Réel'}</span>
                    </button>
                  </div>
                </div>

                {/* Email Live Preview Trigger Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#58111A] to-[#380B11] text-[#FDFBF7] border border-[#D4AF37]/50 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Rendu Visuel Client</span>
                  </div>
                  <h4 className="font-serif-title font-bold text-lg text-white">
                    Modèle d&apos;Email « Bistrot Chic »
                  </h4>
                  <p className="text-xs text-[#D8CCC0] leading-relaxed">
                    Prévisualisez l&apos;email officiel reçu par l&apos;étudiant avec sa carte dorée, ses signatures présidentielles et le récapitulatif fiscal de sa cotisation.
                  </p>

                  <button
                    onClick={handleOpenEmailPreview}
                    className="w-full py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#58111A] font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ouvrir l&apos;Aperçu de l&apos;Email</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier l&apos;Utilisateur</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Nom complet :</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Promo :</label>
                <input
                  type="text"
                  value={editingUser.promo || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, promo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Rôle :</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  >
                    <option value="visitor">Visiteur</option>
                    <option value="member">Membre</option>
                    <option value="admin">Admin Bureau</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Statut :</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  >
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : EDIT SOCIAL POST                                 */}
      {/* ======================================================== */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier la Publication Réseaux</h3>
              <button onClick={() => setEditingSocial(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleUpdateSocial} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Réseau :</label>
                <select
                  value={editingSocial.platform}
                  onChange={(e) => {
                    const plat = e.target.value as 'instagram' | 'tiktok';
                    setEditingSocial({
                      ...editingSocial,
                      platform: plat,
                      handle: plat === 'instagram' ? '@eceterroir' : '@ece.terroir',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] font-bold text-[#58111A]"
                >
                  <option value="instagram">📸 Instagram (@eceterroir)</option>
                  <option value="tiktok">🎵 TikTok (@ece.terroir)</option>
                </select>
              </div>

              <ImageUploader
                label="Photo ou visuel du post"
                value={editingSocial.mediaUrl}
                onChange={(url) => setEditingSocial({ ...editingSocial, mediaUrl: url })}
                presetSuggestions={SOCIAL_IMAGE_PRESETS}
              />

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Texte de la publication :</label>
                <textarea
                  rows={3}
                  required
                  value={editingSocial.content}
                  onChange={(e) => setEditingSocial({ ...editingSocial, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Likes :</label>
                  <input
                    type="number"
                    value={editingSocial.likesCount}
                    onChange={(e) => setEditingSocial({ ...editingSocial, likesCount: parseInt(e.target.value || '0', 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Commentaires :</label>
                  <input
                    type="number"
                    value={editingSocial.commentsCount}
                    onChange={(e) => setEditingSocial({ ...editingSocial, commentsCount: parseInt(e.target.value || '0', 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Lien direct :</label>
                <input
                  type="url"
                  required
                  value={editingSocial.postUrl}
                  onChange={(e) => setEditingSocial({ ...editingSocial, postUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : EDIT EVENT                                       */}
      {/* ======================================================== */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier l&apos;Événement & Photo</h3>
              <button onClick={() => setEditingEvent(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Titre :</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <ImageUploader
                label="Photo de couverture de l'événement"
                value={editingEvent.coverImageUrl}
                onChange={(url) => setEditingEvent({ ...editingEvent, coverImageUrl: url })}
                presetSuggestions={EVENT_IMAGE_PRESETS}
              />

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Type :</label>
                <select
                  value={editingEvent.eventType}
                  onChange={(e) => {
                    const type = e.target.value as EventType;
                    setEditingEvent({
                      ...editingEvent,
                      eventType: type,
                      requiresBooking: type === 'Rassemblement' ? false : (editingEvent.requiresBooking ?? true)
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                >
                  <option value="Dégustation">Dégustation</option>
                  <option value="Rassemblement">Rassemblement Libre</option>
                  <option value="Voyage">Voyage</option>
                  <option value="Soirée">Soirée</option>
                  <option value="Atelier">Atelier</option>
                  <option value="Conférence">Conférence</option>
                </select>
              </div>

              <div 
                onClick={() => setEditingEvent({ ...editingEvent, requiresBooking: !editingEvent.requiresBooking })}
                className="p-3 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] flex items-center gap-2.5 cursor-pointer hover:bg-[#EAE2D8] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={editingEvent.requiresBooking === false || editingEvent.eventType === 'Rassemblement'}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-[#58111A]"
                />
                <div>
                  <span className="font-bold text-[#1D1917] block">Rassemblement libre / Accès direct</span>
                  <span className="text-[10px] text-[#78716C]">Pas de billetterie HelloAsso ni réservation nécessaire</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Lieu :</label>
                <input
                  type="text"
                  required
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              {editingEvent.requiresBooking !== false && editingEvent.eventType !== 'Rassemblement' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Prix (€) :</label>
                      <input
                        type="number"
                        value={editingEvent.priceCents / 100}
                        onChange={(e) => setEditingEvent({ ...editingEvent, priceCents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                        className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#78716C] mb-1">Places restantes :</label>
                      <input
                        type="number"
                        value={editingEvent.remainingSeats}
                        onChange={(e) => setEditingEvent({ ...editingEvent, remainingSeats: parseInt(e.target.value || '0', 10) })}
                        className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Lien Billetterie HelloAsso :</label>
                    <input
                      type="url"
                      value={editingEvent.helloAssoUrl || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, helloAssoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Description :</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : EDIT BLOG POST                                   */}
      {/* ======================================================== */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier l&apos;Article & Photo</h3>
              <button onClick={() => setEditingPost(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleUpdatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Titre de l&apos;article :</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <ImageUploader
                label="Photo de couverture de l'article"
                value={editingPost.coverImageUrl}
                onChange={(url) => setEditingPost({ ...editingPost, coverImageUrl: url })}
                presetSuggestions={POST_IMAGE_PRESETS}
              />

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Catégorie :</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as PostCategory })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                >
                  <option value="Dégustation">Dégustation</option>
                  <option value="Voyage">Voyage</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Vie de l'asso">Vie de l&apos;asso</option>
                  <option value="Recette & Astuce">Recette & Astuce</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Contenu (Markdown supporté) :</label>
                <textarea
                  rows={6}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value, excerpt: e.target.value.slice(0, 120) + '...' })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : EDIT PRODUCT                                     */}
      {/* ======================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier le Produit & Photo</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Nom du produit :</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <ImageUploader
                label="Photo du produit"
                value={editingProduct.imageUrl}
                onChange={(url) => setEditingProduct({ ...editingProduct, imageUrl: url })}
                presetSuggestions={MERCH_IMAGE_PRESETS}
              />

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Catégorie :</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                >
                  <option value="Accessoires">Accessoires & Découpe</option>
                  <option value="Textile">Textile</option>
                  <option value="Coffrets Gourmands">Coffrets Gourmands</option>
                  <option value="Verre & Sommelerie">Verre & Sommelerie</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Prix (€) :</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingProduct.priceCents / 100}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceCents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#78716C] mb-1">Stock :</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value || '0', 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Description :</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : CONFIRM DELETION                                 */}
      {/* ======================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 max-w-sm w-full border border-[#EAE2D8] shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-title font-bold text-lg text-[#1D1917]">Confirmer la suppression</h3>
              <p className="text-xs text-[#78716C]">
                Êtes-vous sûr de vouloir supprimer définitivement <strong>« {deleteConfirm.name} »</strong> ?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="py-2 px-4 rounded-xl bg-[#F6F1EA] text-[#78716C] font-bold text-xs hover:bg-[#EAE2D8] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={executeDelete}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-[#FDFBF7] font-bold text-xs transition-colors shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : INSPECT EPICUREAN PASS                           */}
      {/* ======================================================== */}
      {inspectingPassUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-[#D4AF37]/50 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif-title font-bold text-lg text-[#58111A]">
                  Pass Épicurien Officiel — {inspectingPassUser.fullName}
                </h3>
              </div>
              <button onClick={() => setInspectingPassUser(null)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <div className="py-2 flex justify-center">
              <EpicureanPassCard user={inspectingPassUser} interactive={true} showControls={true} />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : EMAIL PRESTIGE LIVE PREVIEW                      */}
      {/* ======================================================== */}
      {emailPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-3xl w-full h-[90vh] border-2 border-[#D4AF37]/60 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 bg-[#58111A] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-serif-title font-bold text-base text-[#FDFBF7]">
                    Aperçu de l&apos;Email Transactionnel — ECE Terroir
                  </h3>
                  <span className="text-[11px] text-[#D8CCC0]">
                    Objet : 🧀 Bienvenue chez ECE Terroir — Confirmation d&apos;Adhésion
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEmailPreviewModalOpen(false)}
                className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-[#F4EFEA] p-2 sm:p-4 overflow-hidden">
              <iframe
                title="Email Preview"
                srcDoc={emailPreviewHtml}
                className="w-full h-full rounded-2xl border border-[#EAE2D8] bg-white shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : LIVE GUICHETIER SCANNER                          */}
      {/* ======================================================== */}
      {isScannerModalOpen && (
        <CheckInScannerModal
          initialEventId={scannerEventId || events[0]?.id || 'evt-1'}
          onClose={() => setIsScannerModalOpen(false)}
        />
      )}
    </div>
  );
}
