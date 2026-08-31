'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, Eye, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ConfidentialitePage() {
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
            <Lock className="w-3.5 h-3.5" />
            Protection de la Vie Privée & RGPD
          </div>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl leading-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-sm sm:text-base text-[#D8CCC0]">
            Comment l&apos;association ECE Terroir collecte, protège et respecte vos données personnelles d&apos;étudiant de l&apos;ECE Paris.
          </p>
        </ScrollReveal>

        {/* RGPD Articles */}
        <div className="space-y-6 text-sm text-[#3A3533] leading-relaxed">
          {/* 1. Engagement Éthique */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#14281D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">1. Notre Engagement RGPD</h2>
            </div>
            <p>
              L&apos;association <strong>ECE Terroir</strong> s&apos;engage à respecter scrupuleusement le Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et la Loi Informatique et Libertés. 
            </p>
            <p className="text-xs text-[#5C554E]">
              <strong>Principe cardinal :</strong> Vos données ne sont jamais vendues, cédées ou transmises à des tiers publicitaires. Elles servent exclusivement à la gestion interne de la vie associative de l&apos;ECE (adhésions, réservations, accès aux banquets et commandes de merchandising).
            </p>
          </div>

          {/* 2. Données collectées & Finalités */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">2. Données Collectées & Finalités</h2>
            </div>
            <p>Nous collectons uniquement les données strictement nécessaires :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <strong className="text-[#58111A] block font-bold">👤 Identité & Promo</strong>
                <p className="text-[#5C554E]">Nom, prénom et promotion ECE (ING1 à ING5) pour éditer votre Pass Épicurien personnalisé.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <strong className="text-[#58111A] block font-bold">📧 Email Institutionnel</strong>
                <p className="text-[#5C554E]">Votre adresse @edu.ece.fr ou @ece.fr pour vous envoyer vos billets et reçus d&apos;adhésion.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <strong className="text-[#58111A] block font-bold">💳 Statut de Cotisation</strong>
                <p className="text-[#5C554E]">Matricule unique et validation de la cotisation (10€) transmise par HelloAsso ou enregistrée au Foyer.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <strong className="text-[#58111A] block font-bold">🎟️ Émargement & Commandes</strong>
                <p className="text-[#5C554E]">Suivi des entrées scannées lors des soirées raclette et bons de retrait Click & Collect.</p>
              </div>
            </div>
          </div>

          {/* 3. Durée de conservation */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-[#14281D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">3. Durée de Conservation des Données</h2>
            </div>
            <p className="text-xs text-[#5C554E]">
              Les données relatives aux adhésions et cotisations sont conservées pendant toute la durée de l&apos;année universitaire en cours (Saison 2026-2027) ainsi qu&apos;une durée de conservation comptable légale de 5 ans pour les registres de trésorerie de l&apos;association.
            </p>
          </div>

          {/* 4. Vos Droits & Droit à l'Oubli */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#14281D]">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title font-bold text-xl text-[#14281D]">4. Vos Droits & Suppression de Compte</h2>
            </div>
            <p>
              Conformément à la loi, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données personnelles :
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#5C554E]">
              <li><strong>Modification directe :</strong> Vous pouvez modifier vos informations à tout moment depuis votre <Link href="/profil" className="text-[#58111A] font-bold underline">page Profil</Link>.</li>
              <li><strong>Suppression immédiate :</strong> Vous pouvez supprimer définitivement votre compte d&apos;un simple clic dans la section sécurité de votre profil.</li>
              <li><strong>Contact DPO / Bureau :</strong> Pour toute question, écrivez-nous à <a href="mailto:eceterroir@gmail.com" className="text-[#58111A] font-bold underline">eceterroir@gmail.com</a>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
