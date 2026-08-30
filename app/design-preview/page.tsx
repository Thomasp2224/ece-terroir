'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight, ShieldCheck, Eye, Layers, Compass } from 'lucide-react';

export default function DesignPreviewPage() {
  const [selectedOption, setSelectedOption] = useState<number>(3);

  const options = [
    {
      id: 1,
      title: 'Option 1 : Néo-Skeuomorphisme & Liquid Glass',
      tag: 'Moderne & Aérien',
      color: 'bg-emerald-900 text-emerald-200',
      image: '/mockups/neo_skeuo_liquid_glass_1788116328619.jpg',
      description: 'Cartes en verre dépoli (Liquid Glass), reflets spéculaires dorés, biseaux doux et fond crème. Idéal pour une expérience technologique et épurée.',
      highlights: ['Translucidité dépolie', 'Reflets dorés fins', 'Boutons bombés subtils', 'Grande légèreté visuelle']
    },
    {
      id: 2,
      title: 'Option 2 : Skeuomorphisme Authentique & Terroir Pur',
      tag: 'Rustique & Théâtral',
      color: 'bg-amber-900 text-amber-200',
      image: '/mockups/pure_terroir_skeuomorphism_1788116342825.jpg',
      description: 'Habillage complet en bois de chêne massif sculpté, sidebar en cuir vert sapin surpiqué, boutons en laiton et sceau de cire 3D.',
      highlights: ['Bois de chêne français 3D', 'Cuir vert sapin texturé', 'Boutons en laiton biseautés', 'Tableau en liège & parchemin']
    },
    {
      id: 3,
      title: 'Option 3 : Hybride Néo-Bistrot de Luxe (Recommandé)',
      tag: 'Le Mix Parfait — Recommandé',
      color: 'bg-[#58111A] text-[#D4AF37]',
      image: '/mockups/hybrid_neo_bistro_luxury_1788116529024.jpg',
      description: 'Le parfait équilibre : Cartes en Liquid Glass translucide sur fond crème parchemin, avec sceaux de cire 3D bordeaux, boutons bombés vert sapin à liseré or et pass en métal brossé gravé.',
      highlights: ['Liquid Glass dépoli lumineux', 'Sceaux de cire bordeaux en relief', 'Boutons bombés Sapin & Or', 'Polaroids inclinés réseaux']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1D1917] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14281D] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            Studio de Design ECE Terroir
          </div>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl text-[#14281D]">
            Comparateur des 3 Styles Visuels
          </h1>
          <p className="text-sm sm:text-base text-[#78716C]">
            Sélectionnez une option pour agrandir la maquette et inspecter les matières (Liquid Glass, Chêne sculpté, Sceaux de cire et Cuir vert sapin).
          </p>
        </div>

        {/* 3 Tabs / Cards Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={`p-6 rounded-3xl cursor-pointer transition-all border-2 flex flex-col justify-between space-y-4 shadow-lg ${
                selectedOption === opt.id
                  ? 'bg-white border-[#D4AF37] shadow-2xl scale-[1.02] ring-4 ring-[#D4AF37]/20'
                  : 'bg-[#F4EFEA] border-[#EAE2D8] hover:border-[#14281D]/40 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${opt.color}`}>
                    {opt.tag}
                  </span>
                  {selectedOption === opt.id && (
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#58111A] flex items-center justify-center font-bold text-xs shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#14281D]">
                  {opt.title}
                </h3>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE2D8]/60 space-y-1.5">
                {opt.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#78716C]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Big Mockup Display */}
        {selectedOption && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D8] pb-4">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Aperçu Grand Format</span>
                <h2 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#14281D]">
                  {options.find(o => o.id === selectedOption)?.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#78716C]">Cliquez sur l&apos;image pour l&apos;ouvrir en plein écran</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 group">
              <a 
                href={options.find(o => o.id === selectedOption)?.image} 
                target="_blank" 
                rel="noreferrer"
                className="block cursor-zoom-in"
              >
                <img
                  src={options.find(o => o.id === selectedOption)?.image}
                  alt={options.find(o => o.id === selectedOption)?.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
