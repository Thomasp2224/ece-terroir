'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { formatDateFrench, formatPrice } from '@/lib/utils';
import { 
  User, 
  Ticket, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  LogOut, 
  Edit3, 
  X, 
  CheckCircle2, 
  Heart,
  GraduationCap,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  FileText,
  Printer,
  Download,
  Eye,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import EpicureanPassCard from '@/components/membership/EpicureanPassCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TiltCard from '@/components/ui/TiltCard';
import OrderVoucherModal from '@/components/shop/OrderVoucherModal';
import { MerchOrder } from '@/lib/types';
import { 
  downloadMembershipCertificateHD, 
  printMembershipCertificate, 
  generateMembershipCertificateCanvas 
} from '@/lib/utils/certificate-generator';

export default function ProfilPage() {
  const { user, logout, updateProfile } = useAuth();
  const { events, orders, updateUser, deleteUser, membershipRequests } = useData();
  const router = useRouter();

  // Edit profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [promo, setPromo] = useState(user?.promo || 'ING4 (Promo 2028)');
  const [bio, setBio] = useState(user?.bio || 'Étudiant épicurien de l\'ECE Paris.');
  const [favoriteTerroirs, setFavoriteTerroirs] = useState(
    user?.favoriteTerroirs?.join(', ') || 'Bourgogne, Jura, Savoie'
  );
  const [successToast, setSuccessToast] = useState('');

  // Certificate modal and generation state
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certPreviewUrl, setCertPreviewUrl] = useState<string | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  // Click & Collect voucher modal state
  const [selectedOrderVoucher, setSelectedOrderVoucher] = useState<MerchOrder | null>(null);

  const handleDeleteAccount = () => {
    if (!user) return;
    deleteUser(user.id);
    logout();
    router.push('/login');
  };

  const handlePreviewCertificate = async () => {
    if (!user) return;
    setIsGeneratingCert(true);
    try {
      const canvas = await generateMembershipCertificateCanvas(user);
      setCertPreviewUrl(canvas.toDataURL('image/png'));
      setIsCertModalOpen(true);
    } catch (err) {
      console.error('Erreur génération attestation:', err);
      alert('Erreur lors de la génération de l\'attestation.');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!user) return;
    setIsGeneratingCert(true);
    try {
      await downloadMembershipCertificateHD(user);
      setSuccessToast('Attestation d\'adhésion A4 téléchargée avec succès !');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Erreur téléchargement attestation:', err);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const handlePrintCertificate = async () => {
    if (!user) return;
    await printMembershipCertificate(user);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-[#FDFBF7]">
        <div className="w-16 h-16 rounded-full bg-[#58111A]/10 text-[#58111A] flex items-center justify-center border border-[#58111A]/20 shadow-inner">
          <User className="w-8 h-8 text-[#58111A]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#58111A]">Espace Profil & Pass Épicurien</h2>
          <p className="text-xs sm:text-sm text-[#78716C]">Connectez-vous pour retrouver votre Pass 3D, votre Attestation A4 officielle et vos bons Click & Collect.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#722F37] transition-all"
          >
            Se connecter
          </Link>
          <Link
            href="/adhesion"
            className="px-6 py-3 rounded-2xl bg-[#14281D] text-[#D4AF37] text-xs font-bold shadow-md hover:bg-[#1B3B2B] transition-all border border-[#D4AF37]/30"
          >
            Prendre ma cotisation (10€)
          </Link>
        </div>

        {/* Quick Demo Switcher for Preview / Collaborators */}
        <div className="pt-6 border-t border-[#EAE2D8] w-full max-w-md space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#58111A] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            ⚡ Démo 1-Clic Collaborateurs :
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            <button
              onClick={() => {
                const { login: doLogin } = useAuth();
              }}
              className="hidden"
            />
            <Link
              href="/login"
              className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D4AF37]/40 hover:border-[#58111A] text-xs font-bold text-[#58111A] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <span>👑 Jules (Président)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] hover:border-[#14281D] text-xs font-bold text-[#14281D] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <span>🧀 Léonard (Membre Actif)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      fullName,
      promo,
      bio,
      favoriteTerroirs: favoriteTerroirs.split(',').map((t) => t.trim()).filter(Boolean),
    };
    updateProfile(updated);
    if (user.id) {
      updateUser(user.id, updated);
    }
    setIsEditing(false);
    setSuccessToast('Votre profil a été mis à jour avec succès !');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const isPendingMembership = 
    user.membershipStatus === 'pending' || 
    membershipRequests.some(r => (r.userId === user.id || r.userEmail.toLowerCase() === user.email.toLowerCase()) && r.status === 'pending');

  const isOfficialMember = user.role === 'member' || user.role === 'admin' || user.membershipStatus === 'active';

  const myTickets = events.slice(0, 2);

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-[#1B3B2B]/10 border border-[#1B3B2B]/30 text-xs font-bold text-[#1B3B2B] flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#1B3B2B]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* User Card Banner */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#58111A] text-[#FDFBF7] p-8 sm:p-10 border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#14281D] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-serif-title font-extrabold text-3xl shadow-lg shrink-0">
              {user.fullName.charAt(0)}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-title font-extrabold text-2xl sm:text-3xl">
                  {user.fullName}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                  {user.role === 'admin' ? '🛡️ Admin Bureau' : user.role === 'member' ? '🍷 Membre Adhérent' : '👤 Visiteur Non-Membre'}
                </span>
              </div>
              <p className="text-xs text-[#D8CCC0]">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#D4AF37] font-semibold">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {user.promo || 'ECE Paris'}
                </span>
                {user.favoriteTerroirs && user.favoriteTerroirs.length > 0 && (
                  <span className="flex items-center gap-1 text-[#FDFBF7]/80 text-[11px]">
                    <Heart className="w-3 h-3 text-[#D4AF37]" />
                    Terroirs : {user.favoriteTerroirs.join(' • ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setFullName(user.fullName);
                setPromo(user.promo || 'ING4 (Promo 2028)');
                setBio(user.bio || '');
                setFavoriteTerroirs(user.favoriteTerroirs?.join(', ') || '');
                setIsEditing(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FDFBF7] font-bold text-xs border border-white/20 shadow-md transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Modifier mon profil</span>
            </button>

            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-[#1B3B2B] text-[#D4AF37] hover:bg-[#264E3A] font-bold text-xs border border-[#D4AF37]/40 shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dashboard Admin</span>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-[#FDFBF7] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Membership Status Card & Epicurean Pass */}
        {isOfficialMember ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif-title font-bold text-2xl text-[#58111A] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#D4AF37]" />
                  Mon Pass Épicurien Officiel 2026-2027
                </h2>
                <p className="text-xs text-[#78716C]">
                  Votre carte d&apos;adhérent numérique officielle. Cliquez sur la carte pour ouvrir le QR Code en grand pour le scan ou téléchargez-la en HD.
                </p>
              </div>
              <Link
                href="/evenements"
                className="px-4 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] hover:bg-[#722F37] font-bold text-xs border border-[#D4AF37]/30 transition-colors shrink-0 text-center w-fit"
              >
                Voir les dégustations adhérents &rarr;
              </Link>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border-2 border-[#D4AF37]/40 shadow-xl flex flex-col items-center">
              <EpicureanPassCard user={user} interactive={true} showControls={true} />
            </div>

            {/* Official Certificate & Fiscal Receipt Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#14281D] via-[#1B3B2B] to-[#14281D] text-[#FDFBF7] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                      Document Officiel A4
                    </span>
                    <span className="text-xs text-[#D8CCC0]">Signé & Sceau Confrérie</span>
                  </div>
                  <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#FDFBF7]">
                    Attestation d&apos;Adhésion & Reçu de Cotisation 2026-2027
                  </h3>
                  <p className="text-xs text-[#D8CCC0] max-w-xl leading-relaxed">
                    Certificat officiel avec matricule, horodatage d&apos;encaissement (10,00 €), tampon doré et QR code de vérification pour vos justificatifs BDE, école ou remboursements.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isGeneratingCert}
                  className="px-4 py-3 rounded-2xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-lg transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingCert ? 'Génération...' : 'Télécharger (A4 HD)'}</span>
                </button>

                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] font-bold text-xs border border-white/20 shadow-md transition-all flex items-center gap-2"
                  title="Imprimer directement le document"
                >
                  <Printer className="w-4 h-4 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>

                <button
                  onClick={handlePreviewCertificate}
                  className="px-4 py-3 rounded-2xl bg-[#FFFFFF] text-[#14281D] hover:bg-[#F6F1EA] font-bold text-xs transition-all shadow-md flex items-center gap-2"
                  title="Prévisualiser le document"
                >
                  <Eye className="w-4 h-4 text-[#58111A]" />
                  <span>Aperçu</span>
                </button>
              </div>
            </div>
          </div>
        ) : isPendingMembership ? (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-950">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0 animate-pulse">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Demande d&apos;Adhésion En Cours
                </span>
                <h3 className="font-serif-title font-bold text-base text-amber-950">
                  Cotisation (10 €) en Attente de Validation par le Bureau
                </h3>
                <p className="text-xs text-amber-800">
                  Votre paiement est en cours de vérification par un administrateur. Dès confirmation, vous passerez en Membre Officiel.
                </p>
              </div>
            </div>
            <Link
              href="/adhesion"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shrink-0 text-center"
            >
              Détails de l&apos;adhésion &rarr;
            </Link>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#58111A]/5 border border-[#58111A]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#58111A] tracking-wider">
                  Compte Visiteur Non-Membre
                </span>
                <h3 className="font-serif-title font-bold text-base text-[#1D1917]">
                  Adhérez pour débloquer les tarifs réduits
                </h3>
                <p className="text-xs text-[#78716C]">
                  La cotisation annuelle est de 10 € pour toute l&apos;année universitaire 2026-2027.
                </p>
              </div>
            </div>
            <Link
              href="/adhesion"
              className="px-5 py-2.5 rounded-xl bg-[#58111A] text-[#FDFBF7] hover:bg-[#722F37] font-bold text-xs border border-[#D4AF37]/30 transition-all shadow-md shrink-0 flex items-center gap-1.5 justify-center"
            >
              <span>Prendre ma cotisation (10€)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Bio Card if exists */}
        {user.bio && (
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm text-xs text-[#78716C] space-y-1">
            <span className="font-bold uppercase tracking-wider text-[#58111A] text-[10px]">Biographie / Présentation :</span>
            <p className="text-sm text-[#1D1917] italic leading-relaxed">&ldquo;{user.bio}&rdquo;</p>
          </div>
        )}

        {/* Section 1: Mes Billets HelloAsso */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#58111A]" />
            <h2 className="font-serif-title font-bold text-2xl text-[#58111A]">
              Mes Billets d&apos;Événements (HelloAsso)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTickets.map((evt, idx) => (
              <ScrollReveal key={evt.id} direction="up" delay={idx * 0.1} className="flex">
                <TiltCard
                  maxTilt={5}
                  className="bento-card w-full rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#14281D]/10 text-[#14281D] text-[10px] font-extrabold uppercase border border-[#14281D]/20">
                      Billet Validé • QR Code Actif
                    </span>
                    <h3 className="font-serif-title font-bold text-lg text-[#1D1917]">
                      {evt.title}
                    </h3>
                    <div className="text-xs text-[#78716C] space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#58111A]" /> {formatDateFrench(evt.startDate)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#14281D]" /> {evt.location}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F6F1EA] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#58111A]">
                      {evt.priceCents === 0 ? 'Gratuit' : formatPrice(evt.priceCents)}
                    </span>
                    <a
                      href={evt.helloAssoUrl || 'https://www.helloasso.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-[#58111A] text-[#FDFBF7] text-xs font-semibold hover:bg-[#722F37] flex items-center gap-1 shadow-sm hover:scale-105 transition-all"
                    >
                      <span>Voir sur HelloAsso</span>
                      <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                    </a>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Section 2: Mes Commandes Merch Click & Collect */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1B3B2B]" />
              <h2 className="font-serif-title font-bold text-2xl text-[#1B3B2B]">
                Mes Commandes & Bons de Retrait Click & Collect
              </h2>
            </div>
            <Link
              href="/boutique"
              className="text-xs font-bold text-[#58111A] hover:underline flex items-center gap-1"
            >
              Visiter la boutique &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2D8] space-y-2">
                <ShoppingBag className="w-8 h-8 text-[#D8CCC0] mx-auto" />
                <p className="text-sm font-semibold text-[#1D1917]">Vous n&apos;avez aucune commande en cours.</p>
                <p className="text-xs text-[#78716C]">Découvrez nos hoodies, planches en chêne et accessoires gastronomiques.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-[#FFFFFF] border border-[#EAE2D8] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F6F1EA] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#58111A]">
                          {ord.orderNumber || ord.voucherCode || `CMD-${ord.id}`}
                        </span>
                        <span className="text-xs text-[#78716C]">• Passée le {formatDateFrench(ord.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-bold border border-[#1B3B2B]/20 inline-block w-fit">
                        {ord.status === 'ready_for_pickup'
                          ? 'Prête pour Retrait au Foyer'
                          : ord.status === 'completed'
                          ? 'Retirée'
                          : ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#1D1917]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{item.quantity}x {item.product.name} {item.selectedSize ? `(Taille ${item.selectedSize})` : ''}</span>
                        <span className="font-bold">{formatPrice(item.product.priceCents * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#F6F1EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#58111A] font-semibold">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Retrait : {ord.pickupLocation}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-serif-title font-extrabold text-base sm:text-lg text-[#58111A]">
                        Total : {formatPrice(ord.totalCents)}
                      </span>

                      <button
                        onClick={() => setSelectedOrderVoucher(ord)}
                        className="px-4 py-2 rounded-xl bg-[#58111A] text-[#D4AF37] hover:bg-[#722F37] font-bold text-xs border border-[#D4AF37]/40 shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Bon de Retrait (QR)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section RGPD & Données Personnelles */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif-title font-bold text-base text-[#1D1917] flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1B3B2B]" />
              Protection des Données & Droits RGPD
            </h4>
            <p className="text-xs text-[#78716C]">
              Vos données sont hébergées de façon sécurisée et ne sont jamais partagées à des tiers. Consultez notre{' '}
              <Link href="/confidentialite" className="text-[#58111A] font-bold underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all border border-red-200 shrink-0"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL : EDIT MEMBER PROFILE                              */}
      {/* ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EAE2D8] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#58111A]">Modifier mon Profil</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-lg hover:bg-[#F6F1EA]">
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">Nom complet :</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Promo / Année ECE :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ING4 (Promo 2028)"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Régions & Terroirs Favoris (séparés par des virgules) :</label>
                <input
                  type="text"
                  placeholder="Bourgogne, Jura, Auvergne, Savoie..."
                  value={favoriteTerroirs}
                  onChange={(e) => setFavoriteTerroirs(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">Biographie / À propos de vous :</label>
                <textarea
                  rows={3}
                  placeholder="Parlez-nous de vos goûts, vos spécialités préférées..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#F6F1EA] text-[#78716C] font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-bold shadow-md hover:bg-[#722F37]"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : PREVIEW ATTESTATION OFFICIELLE A4                */}
      {/* ======================================================== */}
      {isCertModalOpen && certPreviewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div 
            className="relative bg-[#FAF7F2] text-[#1D1917] rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border-2 border-[#D4AF37] p-5 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#58111A]">
                    Attestation d&apos;Adhésion & Reçu Officiel
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    Document A4 conforme au Registre Trésorerie • Année 2026-2027
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-[#78716C] hover:text-[#1D1917] transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Image Preview */}
            <div className="bg-[#FFFFFF] p-3 sm:p-4 rounded-2xl border border-[#EAE2D8] shadow-inner max-h-[55vh] overflow-y-auto flex items-center justify-center">
              <img
                src={certPreviewUrl}
                alt="Aperçu Attestation d'Adhésion ECE Terroir"
                className="w-full h-auto object-contain rounded-lg shadow-lg border border-black/10"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-[#78716C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1B3B2B]" />
                <span>Authentifié avec QR Code de sécurité</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrintCertificate}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#1D1917] font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-[#EAE2D8]"
                >
                  <Printer className="w-4 h-4 text-[#58111A]" />
                  <span>Imprimer A4</span>
                </button>

                <button
                  onClick={handleDownloadCertificate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger HD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : CLICK & COLLECT ORDER VOUCHER                    */}
      {/* ======================================================== */}
      <OrderVoucherModal
        order={selectedOrderVoucher}
        onClose={() => setSelectedOrderVoucher(null)}
      />

      {/* ======================================================== */}
      {/* MODAL : CONFIRM ACCOUNT DELETION (RGPD)                  */}
      {/* ======================================================== */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                Supprimer définitivement votre compte ?
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Conformément au RGPD, cette action effacera l&apos;ensemble de vos données de profil ({user?.email}) de la plateforme. Vous serez immédiatement déconnecté.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#F6F1EA] text-[#78716C] text-xs font-semibold hover:bg-[#EAE2D8] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
