'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Flame, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Percent, 
  QrCode, 
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';

export function PromoHiveWidget() {
  const { user } = useAuth();
  const { users, membershipRequests } = useData();

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member' || user?.membershipStatus === 'active';

  // ========================================================
  // 1. CAS ADMIN : STATISTIQUES INTERNES & PILOTAGE TRÉSORERIE
  // ========================================================
  if (isAdmin) {
    const totalMembers = users.filter((u) => u.role === 'member' || u.role === 'admin' || u.membershipStatus === 'active').length;
    const pendingRequests = membershipRequests.filter((r) => r.status === 'pending').length;
    const estimatedCotisations = totalMembers * 10;

    const promoData = [
      { promo: 'ING3 (2027)', count: 28, max: 35, lead: true },
      { promo: 'ING2 (2028)', count: 22, max: 35, lead: false },
      { promo: 'ING4 (2026)', count: 18, max: 30, lead: false },
      { promo: 'ING1 (2029)', count: 15, max: 30, lead: false },
      { promo: 'ING5 & Alumni', count: 12, max: 25, lead: false },
    ];

    return (
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-[#D4AF37]/50 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-4 bg-gradient-to-br from-white/90 to-[#FAF7F2]">
        
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Admin */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/40 shadow-sm">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              Stats Bureau • Privé Admin
            </div>
            <span className="text-[11px] font-extrabold text-[#14281D] bg-[#D4AF37]/20 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
              {totalMembers} Cotisants
            </span>
          </div>
          <h3 className="font-serif-title font-extrabold text-xl text-[#14281D]">
            Baromètre de Trésorerie & Adhésions
          </h3>
        </div>

        {/* Financial Overview Chips */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-white border border-[#EAE2D8] shadow-sm">
            <span className="text-[10px] font-bold text-[#78716C] uppercase block">Cotisations 10€</span>
            <span className="font-serif-title font-extrabold text-lg text-[#14281D]">
              {estimatedCotisations} €
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-[#EAE2D8] shadow-sm">
            <span className="text-[10px] font-bold text-[#78716C] uppercase block">À Valider</span>
            <span className={`font-serif-title font-extrabold text-lg ${pendingRequests > 0 ? 'text-[#58111A]' : 'text-emerald-700'}`}>
              {pendingRequests} demandes
            </span>
          </div>
        </div>

        {/* Promo Breakdown */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Répartition par Promo ECE :
          </span>
          {promoData.slice(0, 3).map((item, idx) => {
            const percent = Math.round((item.count / item.max) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#14281D] flex items-center gap-1">
                    {item.promo}
                    {item.lead && <span className="text-[9px] text-[#D4AF37]">👑 1er</span>}
                  </span>
                  <span className="text-[#78716C]">{item.count} inscrits ({percent}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EAE2D8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#14281D] to-[#D4AF37]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Admin */}
        <div className="pt-2 border-t border-[#EAE2D8]">
          <Link
            href="/admin"
            className="w-full py-2 px-3 rounded-xl skeuo-btn-pine text-xs font-bold flex items-center justify-center gap-2 shadow"
          >
            <span>Ouvrir le Panneau Admin</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </div>

      </div>
    );
  }

  // ========================================================
  // 2. CAS MEMBRE : AVANTAGES & PRIVILÈGES DU BON VIVANT
  // ========================================================
  if (isMember) {
    return (
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-4">
        
        {/* Header Membre */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              Confrérie des Bons Vivants
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Pass 2026-2027
            </span>
          </div>
          <h3 className="font-serif-title font-extrabold text-xl text-[#14281D]">
            Vos Privilèges Adhérent Actifs
          </h3>
        </div>

        {/* Perks Grid */}
        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-white/80 border border-[#EAE2D8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#14281D]/10 text-[#14281D] flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#14281D]">-15% Permanent sur l&apos;Échoppe</p>
              <p className="text-[#78716C] text-[11px]">Sur les pulls, couteaux de Thiers et verres</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-[#EAE2D8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#14281D]/10 text-[#14281D] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#14281D]">Priorité de Réservation aux Banquets</p>
              <p className="text-[#78716C] text-[11px]">Accès coupe-file aux soirées raclettes</p>
            </div>
          </div>
        </div>

        {/* Quick Foyer Status */}
        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#14281D]">Foyer Eiffel 1</span>
          </div>
          <Link href="/profil" className="text-[11px] font-bold text-[#2D5A3F] flex items-center gap-1 hover:underline">
            <span>Mon Pass 3D</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
          </Link>
        </div>

      </div>
    );
  }

  // ========================================================
  // 3. CAS VISITEUR : DÉCOUVERTE DU TERROIR & GUIDE COTISATION
  // ========================================================
  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-4">
      
      {/* Header Visiteur */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Devenez Membre Épicurien
          </div>
          <span className="text-[11px] font-extrabold text-[#58111A]">
            10€ / an
          </span>
        </div>
        <h3 className="font-serif-title font-extrabold text-xl text-[#14281D]">
          Rejoignez la Grande Confrérie
        </h3>
      </div>

      {/* Why Join List */}
      <div className="space-y-2 text-xs text-[#5C554E]">
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-[#EAE2D8]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>Accès privilégié</strong> à tous les festins, raclettes fermières et dégustations.</span>
        </div>
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-[#EAE2D8]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>Pass Épicurien 3D</strong> nominatif avec QR Code de réduction au Foyer.</span>
        </div>
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-[#EAE2D8]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>-15% immédiats</strong> sur le vestiaire et l&apos;artisanat de l&apos;Échoppe.</span>
        </div>
      </div>

      {/* CTA Adhésion */}
      <div className="pt-2 border-t border-[#EAE2D8]">
        <Link
          href="/adhesion"
          className="w-full py-2.5 px-4 rounded-2xl skeuo-btn-pine text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
        >
          <span>Prendre ma Cotisation (10€)</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
        </Link>
      </div>

    </div>
  );
}
