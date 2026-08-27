'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { MembershipRequest, PaymentMethodMembership } from '@/lib/types';
import { formatPrice, formatDateFrench } from '@/lib/utils';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  CreditCard, 
  Banknote, 
  Send, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Users, 
  Utensils, 
  ShoppingBag, 
  UserCheck,
  AlertCircle
} from 'lucide-react';
import EpicureanPassCard from '@/components/membership/EpicureanPassCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TiltCard from '@/components/ui/TiltCard';

export default function AdhesionPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { requestMembership, membershipRequests } = useData();

  // Registration for non-logged-in visitors
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPromo, setVisitorPromo] = useState('Ingé 2 (Promo 2028)');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodMembership>('helloasso');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if current user already has a pending request in data context
  const existingPendingRequest = user
    ? membershipRequests.find(
        (r) =>
          (r.userId === user.id || r.userEmail.toLowerCase() === user.email.toLowerCase()) &&
          r.status === 'pending'
      )
    : null;

  const isAlreadyMember = user && (user.role === 'member' || user.role === 'admin' || user.membershipStatus === 'active');
  const isPendingValidation = user && (user.membershipStatus === 'pending' || !!existingPendingRequest);

  const perks = [
    {
      icon: Utensils,
      title: 'Tarifs réduits sur tous les gueuletons & dégustations',
      desc: 'Bénéficiez de jusqu\'à 30% de réduction immédiate sur l\'ensemble des événements gastronomiques et soirées.',
    },
    {
      icon: Award,
      title: 'Accès exclusif aux meules rares & commandes groupées',
      desc: 'Accédez à des fromages fermiers AOP médaillés et salaisons d\'alpage introuvables en grande distribution.',
    },
    {
      icon: ShoppingBag,
      title: 'Remise permanente sur la boutique officielle',
      desc: 'Réductions privilégiées sur les hoodies brodés, les planches de dégustation en chêne et les couteaux.',
    },
    {
      icon: Users,
      title: 'Droit de vote à l\'Assemblée Générale & Éligibilité',
      desc: 'Prenez part aux décisions de l\'association, proposez des idées de voyages et rejoignez le bureau.',
    },
  ];

  // Handle registration + membership request for non-logged-in users
  const handleRegisterAndSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const loginRes = await login(visitorEmail, visitorName, 'visitor', visitorPromo);
    if (!loginRes.success) {
      setErrorMessage(loginRes.error || 'Erreur lors de la création de compte.');
      setIsSubmitting(false);
      return;
    }

    // Now user is registered as visitor, submit the membership request
    const newReq: MembershipRequest = {
      id: `req-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      userName: visitorName,
      userEmail: visitorEmail.trim().toLowerCase(),
      userPromo: visitorPromo,
      amountCents: 1000, // 10.00 €
      paymentMethod: paymentMethod,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: paymentNotes || `Cotisation réglée via ${paymentMethod}.`,
    };

    requestMembership(newReq);
    setIsSubmitting(false);
    setSuccessMessage('Votre compte non-membre a été créé et votre demande d\'adhésion a été transmise au bureau !');
  };

  // Handle membership request for logged-in visitor
  const handleSubscribeLoggedIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const newReq: MembershipRequest = {
      id: `req-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPromo: user.promo || 'ECE Paris',
      amountCents: 1000,
      paymentMethod: paymentMethod,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: paymentNotes || `Cotisation réglée via ${paymentMethod}.`,
    };

    requestMembership(newReq);
    setIsSubmitting(false);
    setSuccessMessage('Votre demande d\'adhésion a bien été enregistrée et est en attente de validation par le bureau.');
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Campagne d&apos;Adhésion 2026-2027
          </div>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl text-[#58111A]">
            Rejoignez la Grande Famille ECE Terroir
          </h1>
          <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
            Prenez votre cotisation annuelle pour soutenir l&apos;association et profiter de tarifs privilégiés sur tous nos grands gueuletons, fromages fermiers et événements gastronomiques.
          </p>
        </ScrollReveal>

        {/* Success / Error Notification */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* CASE 1 : ALREADY MEMBER */}
        {isAlreadyMember && (
          <ScrollReveal direction="up" className="p-8 sm:p-10 rounded-3xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/50 shadow-2xl text-center space-y-6">
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#58111A] text-xs font-extrabold uppercase">
                Adhésion Active • Année 2026-2027
              </span>
              <h2 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#FDFBF7]">
                Vous êtes déjà Membre Officiel !
              </h2>
              <p className="text-xs sm:text-sm text-[#D8CCC0]">
                Félicitations <strong>{user?.fullName}</strong>, votre cotisation pour l&apos;année universitaire est validée. Vous profitez d&apos;ores et déjà de tous les avantages adhérents sur la billetterie et la boutique.
              </p>
            </div>

            <div className="py-4">
              <EpicureanPassCard user={user!} interactive={true} showControls={true} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/evenements"
                className="px-6 py-3 rounded-2xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold hover:bg-[#722F37] transition-all border border-[#D4AF37]/40 shadow-lg"
              >
                Découvrir les Événements
              </Link>
              <Link
                href="/profil"
                className="px-6 py-3 rounded-2xl bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FDFBF7] text-xs font-bold transition-all border border-white/20"
              >
                Voir mon Profil Membre
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* ======================================================== */}
        {/* CASE 2 : PENDING VALIDATION                              */}
        {/* ======================================================== */}
        {isPendingValidation && !isAlreadyMember && (
          <ScrollReveal direction="up" className="p-8 sm:p-10 rounded-3xl bg-[#58111A] text-[#FDFBF7] border border-[#D4AF37]/50 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#14281D] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold uppercase">
                ⏳ Paiement en cours de vérification
              </span>
              <h2 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#FDFBF7]">
                Votre Cotisation est en Attente de Validation
              </h2>
              <p className="text-xs sm:text-sm text-[#D8CCC0] leading-relaxed">
                Votre demande d&apos;adhésion de <strong>10,00 €</strong> a bien été enregistrée. Le Trésorier ou un Administrateur du Bureau ECE Terroir va vérifier votre paiement sous peu.
              </p>
              <p className="text-xs text-[#D4AF37] font-semibold">
                Dès validation, votre compte passera instantanément au statut de Membre Officiel !
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/profil"
                className="px-6 py-3 rounded-2xl bg-[#FFFFFF] text-[#58111A] text-xs font-bold hover:bg-[#F6F1EA] transition-all shadow-lg"
              >
                Accéder à mon Profil
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* ======================================================== */}
        {/* GRID: PERKS & SUBSCRIPTION CARD                          */}
        {/* ======================================================== */}
        {!isAlreadyMember && !isPendingValidation && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Perks List */}
            <ScrollReveal direction="left" className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h3 className="font-serif-title font-bold text-2xl text-[#1D1917]">
                  Pourquoi adhérer à ECE Terroir ?
                </h3>
                <p className="text-xs sm:text-sm text-[#78716C]">
                  L&apos;adhésion est ouverte à tous les étudiants de l&apos;ECE Paris passionnés par la bonne chère, les produits authentiques et les moments de partage conviviaux.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {perks.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <TiltCard
                      key={idx}
                      maxTilt={5}
                      className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-2.5 hover:border-[#D4AF37] transition-all"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif-title font-bold text-sm text-[#1D1917]">{p.title}</h4>
                      <p className="text-xs text-[#78716C] leading-relaxed">{p.desc}</p>
                    </TiltCard>
                  );
                })}
              </div>

              {/* Quality Guarantee Callout */}
              <div className="p-6 rounded-3xl bg-[#1B3B2B]/10 border border-[#1B3B2B]/30 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-[#1B3B2B] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[#1B3B2B]">
                  <h5 className="font-bold text-sm">Engagement 100% Produits Français & Artisans</h5>
                  <p className="leading-relaxed">
                    Votre cotisation finance directement l&apos;achat de meules entières AOP chez nos affineurs partenaires, la logistique et l&apos;organisation d&apos;ateliers d&apos;exception.
                  </p>
                </div>
              </div>

              {/* Pass Épicurien Preview */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#58111A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Inclus avec votre adhésion
                    </span>
                    <h4 className="font-serif-title font-bold text-base text-[#1D1917]">
                      Votre Pass Épicurien & Carte d&apos;Adhérent 2026-2027
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-[10px] font-bold">
                    HD & Mobile
                  </span>
                </div>
                <p className="text-xs text-[#78716C]">
                  Générée à vos nom et promo, personnalisée avec matricule unique et QR code de vérification pour vos entrées et tarifs réduits.
                </p>
                <div className="pt-2">
                  <EpicureanPassCard
                    user={{
                      id: 'demo-card-preview',
                      email: 'etudiant@edu.ece.fr',
                      fullName: visitorName || 'Futur Adhérent ECE',
                      promo: visitorPromo || 'Ingé 2 (Promo 2028)',
                      role: 'member',
                      status: 'active',
                      membershipStatus: 'active',
                      favoriteTerroirs: ['Bourgogne', 'Jura', 'Auvergne'],
                      createdAt: new Date().toISOString(),
                      lastLogin: new Date().toISOString(),
                    }}
                    interactive={true}
                    showControls={false}
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Right Col: Cotisation Form Card */}
            <ScrollReveal direction="right" delay={0.15} className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border-2 border-[#D4AF37]/50 p-6 sm:p-8 shadow-xl space-y-6">
              {/* Card Header & Price */}
              <div className="space-y-3 pb-6 border-b border-[#F6F1EA] text-center">
                <span className="px-3 py-1 rounded-full bg-[#58111A] text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider">
                  Cotisation Annuelle 2026-2027
                </span>
                <div className="pt-2">
                  <span className="font-serif-title font-extrabold text-4xl sm:text-5xl text-[#58111A]">
                    10,00 €
                  </span>
                  <span className="text-xs text-[#78716C] block mt-1">
                    Valable pour toute l&apos;année universitaire
                  </span>
                </div>
              </div>

              {/* CASE A: User is already logged in as Visitor */}
              {user ? (
                <form onSubmit={handleSubscribeLoggedIn} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                    <span className="font-bold text-[#1D1917] block">Adhérent : {user.fullName}</span>
                    <span className="text-[#78716C] block">{user.email} • {user.promo || 'ECE Paris'}</span>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1.5">
                      Moyen de paiement de la cotisation :
                    </label>
                    <div className="space-y-2">
                      <label 
                        className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          paymentMethod === 'helloasso'
                            ? 'border-[#58111A] bg-[#58111A]/5 text-[#58111A]'
                            : 'border-[#EAE2D8] bg-[#FDFBF7] text-[#1D1917]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="helloasso"
                          checked={paymentMethod === 'helloasso'}
                          onChange={() => setPaymentMethod('helloasso')}
                          className="w-4 h-4 text-[#58111A]"
                        />
                        <CreditCard className="w-4 h-4 text-[#58111A]" />
                        <div className="flex-1">
                          <span className="font-bold block">Paiement en ligne (HelloAsso / CB)</span>
                          <span className="text-[10px] text-[#78716C]">Paiement sécurisé sans frais</span>
                        </div>
                      </label>

                      <label 
                        className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          paymentMethod === 'cash_foyer'
                            ? 'border-[#58111A] bg-[#58111A]/5 text-[#58111A]'
                            : 'border-[#EAE2D8] bg-[#FDFBF7] text-[#1D1917]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_foyer"
                          checked={paymentMethod === 'cash_foyer'}
                          onChange={() => setPaymentMethod('cash_foyer')}
                          className="w-4 h-4 text-[#58111A]"
                        />
                        <Banknote className="w-4 h-4 text-[#1B3B2B]" />
                        <div className="flex-1">
                          <span className="font-bold block">Espèces / Lydia au Foyer des Élèves</span>
                          <span className="text-[10px] text-[#78716C]">Règlement direct lors des permanences du midi</span>
                        </div>
                      </label>

                      <label 
                        className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          paymentMethod === 'lydia_transfer'
                            ? 'border-[#58111A] bg-[#58111A]/5 text-[#58111A]'
                            : 'border-[#EAE2D8] bg-[#FDFBF7] text-[#1D1917]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="lydia_transfer"
                          checked={paymentMethod === 'lydia_transfer'}
                          onChange={() => setPaymentMethod('lydia_transfer')}
                          className="w-4 h-4 text-[#58111A]"
                        />
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                        <div className="flex-1">
                          <span className="font-bold block">Virement bancaire / Lydia direct</span>
                          <span className="text-[10px] text-[#78716C]">Sur le compte officiel ECE Terroir</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">
                      Remarque / Référence de paiement (optionnel) :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Virement effectué le 25/08 ou Réf HelloAsso"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/30 hover:scale-[1.01]"
                  >
                    <span>{isSubmitting ? 'Envoi en cours...' : 'Régler ma cotisation (10,00 €)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-[#78716C] leading-tight">
                    🔒 Une fois votre paiement validé par le trésorier, votre profil passera automatiquement en statut Membre.
                  </p>
                </form>
              ) : (
                /* CASE B: User is a non-logged-in visitor -> registration + subscription in 1 step! */
                <form onSubmit={handleRegisterAndSubscribe} className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#58111A]/5 border border-[#58111A]/20 text-[#58111A]">
                    <span className="font-bold block text-xs">Étape 1 : Créer votre compte non-membre</span>
                    <span className="text-[10px] text-[#78716C]">Renseignez vos coordonnées pour activer votre adhésion</span>
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Nom complet :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maxime Lefebvre"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Adresse Email :</label>
                    <input
                      type="email"
                      required
                      placeholder="maxime.lefebvre@edu.ece.fr"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Promo / Statut :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ingé 2 (Promo 2028)"
                      value={visitorPromo}
                      onChange={(e) => setVisitorPromo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#78716C] mb-1">Moyen de règlement :</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodMembership)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] font-bold text-[#58111A]"
                    >
                      <option value="helloasso">💳 En ligne via HelloAsso / CB</option>
                      <option value="cash_foyer">💶 Espèces / Lydia au Foyer des Élèves</option>
                      <option value="lydia_transfer">🏛️ Virement Bancaire</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#58111A] text-[#FDFBF7] font-bold text-xs hover:bg-[#722F37] transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/30 hover:scale-[1.01] mt-2"
                  >
                    <span>{isSubmitting ? 'Création & Envoi...' : 'Créer mon compte & Adhérer (10 €)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-[#78716C] pt-1">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="font-bold text-[#58111A] underline">
                      Se connecter ici
                    </Link>
                  </p>
                </form>
              )}
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  );
}
