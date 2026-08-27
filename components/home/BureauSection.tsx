'use client';

import React, { useState } from 'react';
import { MOCK_BUREAU } from '@/lib/mock-data';
import { Award, Quote, Camera, Sparkles } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BureauSection() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Decorative Warm Auras */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#58111A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A]/10 text-[#58111A] text-xs font-bold uppercase tracking-wider border border-[#58111A]/20">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            La Confrérie Associative
          </div>
          <h2 className="font-serif-title font-extrabold text-3xl sm:text-5xl text-[#58111A] tracking-tight">
            Le Bureau Exécutif 2026-2027
          </h2>
          <p className="text-sm sm:text-base text-[#78716C]">
            Des élèves-ingénieurs engagés pour faire rayonner la gastronomie française, les artisans de terroirs et la convivialité sur le campus ECE.
          </p>
        </ScrollReveal>

        {/* Members Grid in 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_BUREAU.map((member, idx) => {
            const hasPhoto = Boolean(
              member.imageUrl && member.imageUrl.trim().length > 0 && !imageErrors[idx]
            );
            const initials = member.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1} className="flex">
                <TiltCard
                  maxTilt={8}
                  className="bento-card w-full rounded-3xl overflow-hidden bg-[#FFFFFF] flex flex-col justify-between group border border-[#EAE2D8] hover:border-[#D4AF37]/60 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Photo or Fallback Avatar */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-[#14281D] to-[#1E3A2B] flex flex-col items-center justify-center p-6 text-center">
                    {hasPhoto ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        onError={() => setImageErrors((prev) => ({ ...prev, [idx]: true }))}
                        className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        {/* Monogram Badge with Gold Trim */}
                        <div className="w-20 h-20 rounded-full bg-[#58111A] border-2 border-[#D4AF37] flex items-center justify-center font-serif-title font-extrabold text-2xl text-[#D4AF37] shadow-2xl ring-4 ring-[#D4AF37]/30 group-hover:scale-110 transition-transform duration-300">
                          {initials}
                        </div>

                        {/* Photo à venir Badge */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58111A]/90 text-[#FDFBF7] text-[10px] font-bold border border-[#D4AF37]/50 shadow-md">
                          <Camera className="w-3 h-3 text-[#D4AF37]" />
                          Photo officielle à venir
                        </span>
                      </div>
                    )}

                    {/* Hover Quote Overlay with Film Glass */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#58111A] via-[#58111A]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 pointer-events-none">
                      <p className="text-xs text-[#FDFBF7] italic flex items-start gap-1.5 leading-relaxed text-left font-serif-title">
                        <Quote className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="p-6 space-y-1.5 text-center bg-white">
                    <h3 className="font-serif-title font-extrabold text-lg text-[#1D1917] group-hover:text-[#58111A] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#58111A] uppercase tracking-wider">
                      {member.role}
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#78716C] font-semibold">
                      <span className="px-2 py-0.5 rounded-full bg-[#F6F1EA] text-[#1B3B2B] border border-[#EAE2D8]">
                        {member.promo}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
