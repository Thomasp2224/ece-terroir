'use client';

import React from 'react';
import Image from 'next/image';
import BureauSection from '@/components/home/BureauSection';
import MissionSection from '@/components/home/MissionSection';
import { Award, Shield, Heart, Utensils, BookOpen, Sparkles } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AProposPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#14281D] text-[#FDFBF7] p-8 sm:p-16 relative overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#58111A]/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-md">
              <BookOpen className="w-3.5 h-3.5" />
              L&apos;Histoire de l&apos;Association
            </div>
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight">
              Défendre l&apos;Art du Bien-Manger & les Terroirs de France à l&apos;ECE Paris
            </h1>
            <p className="text-base sm:text-lg text-[#D8CCC0] leading-relaxed">
              Depuis sa création, ECE Terroir s&apos;est donné pour mission d&apos;offrir aux élèves-ingénieurs une parenthèse gourmande, humaine et généreuse au cœur de leur vie étudiante.
            </p>
          </div>
        </ScrollReveal>

        {/* Narrative & History Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left" className="space-y-6 text-[#3A3533] leading-relaxed text-sm sm:text-base">
            <h2 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#58111A]">
              Une Histoire de Passion et de Grands Gueuletons
            </h2>
            <p>
              Tout est parti d&apos;un constat simple : la vie en école d&apos;ingénieurs est intense, rythmée par les projets technologiques et les sessions de code. Mais que serait l&apos;excellence française sans sa gastronomie de terroir et ses produits fermiers d&apos;exception ?
            </p>
            <p>
              Quelques étudiants passionnés ont alors décidé d&apos;importer les meilleures meules de fromages au lait cru, saucissons de montagne et terrines artisanales directement au foyer de l&apos;école. Ce qui n&apos;était au départ qu&apos;une dégustation entre copains s&apos;est transformé en l&apos;une des associations les plus rassembleuses et festives de l&apos;ECE Paris.
            </p>
            <p>
              Aujourd&apos;hui, ECE Terroir organise des dizaines de festins par an, des soirées raclettes géantes à la meule, des voyages immersifs dans les fermes régionales et collabore avec des maîtres affineurs et artisans passionnés de toute la France.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <TiltCard maxTilt={5} className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50">
              <img
                src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop"
                alt="Dégustation conviviale ECE Terroir"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#58111A]/85 via-transparent to-transparent flex items-end p-8">
                <p className="text-sm font-semibold text-[#FDFBF7] italic font-serif-title">
                  &ldquo;La découverte d&apos;un mets nouveau fait plus pour le bonheur du genre humain que la découverte d&apos;une étoile.&rdquo; — Brillat-Savarin
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>

        {/* Charte Terroir */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#58111A]">
              La Charte d&apos;Engagement ECE Terroir
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Nos 3 engagements fondateurs pour chaque festin, atelier et sélection gourmande.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <TiltCard maxTilt={5} className="bento-card p-6 rounded-3xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-3">
              <Award className="w-8 h-8 text-[#D4AF37]" />
              <h4 className="font-serif-title font-bold text-lg text-[#58111A]">Qualité & Authenticité</h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Priorité absolue aux appellations AOP/IGP, au lait cru, aux élevages respectueux et aux artisans indépendants.
              </p>
            </TiltCard>

            <TiltCard maxTilt={5} className="bento-card p-6 rounded-3xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-3">
              <Shield className="w-8 h-8 text-[#14281D]" />
              <h4 className="font-serif-title font-bold text-lg text-[#58111A]">Accessibilité Étudiante</h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Rendre les grands mets accessibles aux bourses étudiantes grâce aux commandes groupées et à la subvention de l&apos;association.
              </p>
            </TiltCard>

            <TiltCard maxTilt={5} className="bento-card p-6 rounded-3xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-3">
              <Heart className="w-8 h-8 text-[#58111A]" />
              <h4 className="font-serif-title font-bold text-lg text-[#58111A]">Transmission & Partage</h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Faire découvrir l&apos;histoire de nos fromages, de nos cépages et le travail des femmes et hommes qui nourrissent la France.
              </p>
            </TiltCard>
          </div>
        </ScrollReveal>
      </div>

      {/* Embedded Bureau & Mission */}
      <MissionSection />
      <BureauSection />
    </div>
  );
}
