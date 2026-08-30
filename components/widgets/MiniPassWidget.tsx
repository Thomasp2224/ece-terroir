'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Award, ShieldCheck, Download, ArrowRight, Check, Crown, Lock } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { getMemberMatricule } from '@/lib/utils/matricule';
import { downloadMembershipCertificateHD } from '@/lib/utils/certificate-generator';

export function MiniPassWidget() {
  const { user } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);
  const [isGeneratingA4, setIsGeneratingA4] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isMemberActive = user?.role === 'member' || isAdmin || user?.membershipStatus === 'active';
  const matricule = user ? getMemberMatricule(user) : 'ECE-TERR-2026-VISITEUR';

  const handleDownloadA4 = async () => {
    if (!user) return;
    setIsGeneratingA4(true);
    try {
      await downloadMembershipCertificateHD(user);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingA4(false);
    }
  };

  return (
    <>
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-6 group w-full">
        
        {/* Background Lights */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
              {isAdmin ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Pass Bureau Admin
                </>
              ) : isMemberActive ? (
                <>
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Pass Épicurien Actif
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Statut Visiteur
                </>
              )}
            </div>
            
            {isMemberActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                <Check className="w-3 h-3" />
                2026-2027
              </span>
            )}
          </div>

          {/* 3D Brushed Metal Mini Card */}
          <div
            onClick={() => isMemberActive ? setShowQrModal(true) : null}
            className={`p-4 rounded-2xl border shadow-md transition-all relative overflow-hidden group/card ${
              isMemberActive 
                ? 'bg-gradient-to-br from-[#EAE6DF] via-[#FAF7F2] to-[#D8D2C5] border-[#D4AF37]/50 hover:shadow-xl cursor-pointer' 
                : 'bg-gradient-to-br from-[#F5F2ED] to-[#EAE2D8] border-[#D8CCC0] opacity-80'
            }`}
          >
            {/* Metallic Sheen Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="text-[9px] font-extrabold text-[#78716C] tracking-widest uppercase block">
                  {isAdmin ? 'Matricule Bureau' : isMemberActive ? 'Matricule Adhérent' : 'Aperçu Pass'}
                </span>
                <p className="font-mono text-xs sm:text-sm font-black text-[#14281D] tracking-wider truncate">
                  {matricule}
                </p>
                <p className="text-[10px] font-bold text-[#2D5A3F] flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  {user ? user.fullName : 'Visiteur Découverte'}
                </p>
              </div>

              {/* QR Code Icon with Holographic Border */}
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 border border-[#D4AF37]/40 shadow-inner flex flex-col items-center justify-center shrink-0 group-hover/card:scale-105 transition-transform relative">
                <QrCode className="w-9 h-9 text-[#14281D]" />
                <span className="text-[7px] font-extrabold text-[#78716C] uppercase">
                  {isMemberActive ? 'Scan' : 'Verrouillé'}
                </span>
              </div>
            </div>

            {/* Micro Wax Seal Badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full wax-seal flex items-center justify-center shadow-md">
              <span className="text-[9px] font-serif-title font-black text-[#D4AF37]">ET</span>
            </div>
          </div>

          {/* Perks list */}
          <div className="space-y-1.5 text-xs text-[#5C554E]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Réduction permanente de <strong>-15%</strong> sur l&apos;Échoppe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Priorité de réservation aux banquets et raclettes</span>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="pt-2 border-t border-[#EAE2D8]/80 flex items-center gap-2">
          {isMemberActive ? (
            <>
              <button
                onClick={handleDownloadA4}
                disabled={isGeneratingA4}
                className="flex-1 py-2 px-3 rounded-2xl skeuo-btn-cream text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#14281D]" />
                <span>{isGeneratingA4 ? 'Génération...' : 'Attestation A4'}</span>
              </button>
              <Link
                href={isAdmin ? "/admin" : "/profil"}
                className="p-2 rounded-2xl skeuo-btn-pine flex items-center justify-center"
                title={isAdmin ? "Ouvrir le panneau d'administration" : "Accéder à mon espace profil complet"}
              >
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>
            </>
          ) : (
            <Link
              href="/adhesion"
              className="w-full py-2.5 px-4 rounded-2xl skeuo-btn-pine text-xs font-extrabold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-md"
            >
              <span>Prendre ma Cotisation (10€)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          )}
        </div>

      </div>

      {/* QR Code Big Zoom Modal */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 text-center"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest">
                Contrôle Guichetier Foyer
              </span>
              <h3 className="font-serif-title font-extrabold text-xl text-[#14281D]">
                Pass Épicurien ECE Terroir
              </h3>
              <p className="text-xs text-[#78716C]">
                Présentez ce QR code au bar du Foyer Eiffel 1 pour valider vos consommations et réductions.
              </p>
            </div>

            {/* Big QR Code */}
            <div className="w-48 h-48 mx-auto rounded-2xl bg-[#FAF7F2] p-4 border-2 border-[#14281D] flex flex-col items-center justify-center shadow-inner">
              <QrCode className="w-32 h-32 text-[#14281D]" />
              <span className="font-mono text-[11px] font-bold text-[#14281D] mt-1">
                {matricule}
              </span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#14281D] text-[#FAF7F2] text-xs font-bold hover:bg-[#1E3D2C] transition-all"
            >
              Fermer le QR Code
            </button>
          </div>
        </div>
      )}
    </>
  );
}
