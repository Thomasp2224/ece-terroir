'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, Calendar, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Badge & Emoji icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-[#14281D] text-[#D4AF37] border-2 border-[#D4AF37]/50 shadow-2xl flex items-center justify-center text-4xl mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
            🧀🍷
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-mono font-extrabold border border-[#D4AF37]/40 shadow-md">
            Erreur 404
          </span>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#14281D]">
            Cette page s&apos;est égarée dans les alpages !
          </h1>
          <p className="text-sm text-[#78716C] leading-relaxed max-w-md mx-auto">
            La meule ou le flacon que vous cherchez n&apos;est plus à cette adresse. Rejoignez la table des convives ou explorez nos festins en cours.
          </p>
        </div>

        {/* Quick links buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#14281D] hover:bg-[#203D2D] text-[#FAF7F2] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/40 hover:scale-105"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <Link
            href="/evenements"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F6F1EA] text-[#58111A] font-bold text-xs border border-[#EAE2D8] shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            <Calendar className="w-4 h-4 text-[#58111A]" />
            <span>Les Événements</span>
          </Link>
        </div>

        {/* Footer help note */}
        <p className="text-[11px] text-[#A8A29E] pt-4 border-t border-[#EAE2D8]">
          ECE Terroir • Confrérie Gastronomique de l&apos;ECE Paris
        </p>

      </div>
    </div>
  );
}
