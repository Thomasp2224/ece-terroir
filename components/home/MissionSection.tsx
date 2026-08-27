'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Compass, HeartHandshake, Sparkles, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function MissionSection() {
  const pillars = [
    {
      icon: Utensils,
      title: 'Fromages & Affinage AOP',
      description: 'Découverte des meules fermières au lait cru, secrets d\'affinage en cave séculaire et dégustations comparatives.',
      tag: 'AOP & Fermier',
      color: 'bg-[#58111A]',
    },
    {
      icon: Sparkles,
      title: 'Charcuteries & Salaisons',
      description: 'Sélection rigoureuse de saucissons de montagne, jambons affinés au grand air, terrines et rillettes artisanales.',
      tag: '100% Artisanal',
      color: 'bg-[#14281D]',
    },
    {
      icon: Compass,
      title: 'Voyages & Immersion',
      description: 'Escapades de plusieurs jours en Auvergne, Savoie et Bordelais à la rencontre des éleveurs et maîtres de chai.',
      tag: 'Grand Air & Caves',
      color: 'bg-[#14281D]',
    },
    {
      icon: HeartHandshake,
      title: 'Banquets & Fraternité',
      description: 'Un esprit chaleureux de bistrot où chaque élève-ingénieur se rassemble autour des plus beaux plats français.',
      tag: 'Esprit Bistrot',
      color: 'bg-[#58111A]',
    },
  ];

  return (
    <section className="py-24 bg-[#F6F1EA] border-y border-[#EAE2D8] relative overflow-hidden">
      {/* Subtle Texture Aura */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#58111A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ======================================================== */}
          {/* LEFT COLUMN: EDITORIAL MANIFESTO (Cols 1 to 5)          */}
          {/* ======================================================== */}
          <ScrollReveal direction="left" className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#58111A]/10 text-[#58111A] text-xs font-bold uppercase tracking-wider border border-[#58111A]/20">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              Le Manifeste Épicurien
            </div>

            <h2 className="font-serif-title font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1D1917] leading-[1.1] text-balance">
              Défendre l&apos;art de la table & les trésors de nos régions.
            </h2>

            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed font-normal">
              Fondée au cœur du campus de l&apos;ECE Paris (Eiffel 1), <strong>ECE Terroir</strong> est née d&apos;une conviction simple : les meilleures amitiés se nouent autour d&apos;une planche de Comté affiné, d&apos;un saucisson d&apos;alpage et d&apos;un bon pain de campagne.
            </p>

            {/* Noble Quote Box */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border-l-4 border-[#D4AF37] border-y border-r border-[#EAE2D8] shadow-md space-y-2">
              <p className="font-serif-title italic text-sm sm:text-base text-[#58111A] leading-relaxed">
                &ldquo;Manger est une nécessité, mais savourer avec passion et transmettre les savoir-faire d&apos;antan est un art.&rdquo;
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#78716C] font-semibold pt-1">
                <span>Le Bureau ECE Terroir 2026-2027</span>
                <span className="font-mono text-[#D4AF37]">Campus Eiffel 1</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#58111A] hover:text-[#722F37] group transition-colors px-5 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm hover:shadow-md"
              >
                <span>Découvrir l&apos;histoire de la Confrérie</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 2x2 BENTO OF PILLARS (Cols 6 to 12)       */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.1} className="flex">
                  <TiltCard
                    maxTilt={6}
                    className="bento-card w-full p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 group cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl ${pillar.color} text-[#FDFBF7] flex items-center justify-center shadow-lg border border-[#D4AF37]/40 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#F6F1EA] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide border border-[#EAE2D8]">
                          {pillar.tag}
                        </span>
                      </div>

                      <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#58111A] group-hover:text-[#722F37] transition-colors leading-snug">
                        {pillar.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F6F1EA] flex items-center justify-between text-xs font-bold text-[#14281D]">
                      <span>Pilier N°0{idx + 1}</span>
                      <span className="text-[#D4AF37] font-mono group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
