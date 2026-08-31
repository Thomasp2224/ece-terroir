'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur applicative capturée :', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Error Badge */}
        <div className="w-20 h-20 rounded-3xl bg-[#58111A] text-[#D4AF37] border-2 border-[#D4AF37]/50 shadow-2xl flex items-center justify-center mx-auto shadow-red-950/20">
          <AlertCircle className="w-10 h-10" />
        </div>

        {/* Text */}
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase tracking-wider">
            Un accroc en cuisine
          </span>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#14281D]">
            Une erreur inattendue est survenue
          </h1>
          <p className="text-sm text-[#78716C] leading-relaxed max-w-md mx-auto">
            Pas d&apos;inquiétude, nos sommeliers et cuisiniers sont sur le coup. Vous pouvez recharger la page ou revenir à l&apos;accueil.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#58111A] hover:bg-[#722F37] text-[#FAF7F2] font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/40 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
            <span>Réessayer</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F6F1EA] text-[#14281D] font-bold text-xs border border-[#EAE2D8] shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            <Home className="w-4 h-4 text-[#14281D]" />
            <span>Accueil</span>
          </Link>
        </div>

        {/* Contact Support */}
        <p className="text-xs text-[#78716C] pt-4">
          Le problème persiste ? Écrivez au Bureau :{' '}
          <a href="mailto:eceterroir@gmail.com" className="text-[#58111A] font-bold underline">
            eceterroir@gmail.com
          </a>
        </p>

      </div>
    </div>
  );
}
