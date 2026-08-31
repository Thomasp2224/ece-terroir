'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Building, Server, Mail, ArrowLeft, Heart } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function MentionsLegalesPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#14281D] hover:text-[#58111A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* Header */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#14281D] text-[#FAF7F2] p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-md">
            <Scale className="w-3.5 h-3.5" />
            Cadre Légal & Réglementaire
          </div>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl leading-tight">
            Mentions Légales
          </h1>
          <p className="text-sm sm:text-base text-[#D8CCC0]">
            Informations officielles relatives à l&apos;association ECE Terroir et aux conditions d&apos;utilisation de la plateforme web étudiante.
          </p>
        </ScrollReveal>

        {/* Legal Articles */}
        <div className="space-y-6 text-sm text-[#3A3533] leading-relaxed">
          {/* 1. Éditeur du site */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#14281D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">1. Éditeur de la Plateforme</h2>
            </div>
            <p>
              Le site <strong>ECE Terroir</strong> (accessible à l&apos;adresse <code className="text-[#58111A] font-bold">https://ece-terroir.vercel.app</code>) est édité par l&apos;association étudiante <strong>ECE Terroir</strong>, association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#5C554E]">
              <li><strong>Siège social :</strong> Campus ECE Paris — Bâtiment Eiffel 1, 10 Rue Sextius Michel, 75015 Paris.</li>
              <li><strong>Établissement rattaché :</strong> ECE Paris (École d&apos;Ingénieurs).</li>
              <li><strong>Contact électronique :</strong> <a href="mailto:eceterroir@gmail.com" className="text-[#58111A] font-bold underline">eceterroir@gmail.com</a></li>
              <li><strong>Directeur de la publication :</strong> Jules Houry (Président de l&apos;association).</li>
              <li><strong>Responsable technique & développement :</strong> Thomas Petit (Vice-Président Tech).</li>
            </ul>
          </div>

          {/* 2. Hébergement */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">2. Hébergement & Données</h2>
            </div>
            <p>
              La plateforme est hébergée sur des infrastructures cloud haute disponibilité sécurisées :
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#5C554E]">
              <li><strong>Hébergeur Web :</strong> Vercel Inc., 340 S Lemon Ave #1142, Walnut, CA 91789, USA (<a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#58111A] underline">vercel.com</a>).</li>
              <li><strong>Base de Données PostgreSQL :</strong> Supabase Inc., 970 Toa Payoh North #07-04, Singapour / Région AWS Frankfurt (Europe).</li>
              <li><strong>Passerelle de Cotisations :</strong> HelloAsso, 8 Rue Montesquieu, 33000 Bordeaux, France.</li>
            </ul>
          </div>

          {/* 3. Propriété Intellectuelle */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#14281D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">3. Propriété Intellectuelle</h2>
            </div>
            <p>
              L&apos;ensemble des contenus (textes, visuels, logos, blasons, charte graphique bistrot, code source et photographies de terroir) présents sur le site sont la propriété exclusive de l&apos;association <strong>ECE Terroir</strong> ou font l&apos;objet d&apos;une autorisation d&apos;utilisation accordée par leurs auteurs respectifs.
            </p>
            <p className="text-xs text-[#5C554E]">
              Toute reproduction, représentation, modification ou diffusion non autorisée, en tout ou partie, sans l&apos;accord écrit préalable du Bureau d&apos;ECE Terroir, constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </div>

          {/* 4. Contact & Réclamations */}
          <div className="bg-[#14281D] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 shadow-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#FAF7F2]">4. Contactez le Bureau</h2>
            </div>
            <p className="text-xs text-[#D8CCC0]">
              Pour toute question relative au fonctionnement du site, à l&apos;adhésion ou à l&apos;organisation d&apos;un banquet, vous pouvez nous joindre par email à <strong className="text-[#D4AF37]">eceterroir@gmail.com</strong> ou directement en permanence au Foyer des Élèves (Campus Eiffel 1).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
