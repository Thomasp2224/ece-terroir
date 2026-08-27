'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/context/DataContext';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowRight, Sparkles, Plus, MapPin, Check, Tag } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function MerchPreview() {
  const { addItem } = useCart();
  const { products } = useData();
  const featuredProducts = products.slice(0, 3);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleQuickAdd = (product: any) => {
    addItem(product, product.sizes ? product.sizes[0] : undefined);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-bold uppercase tracking-wider mb-3 border border-[#1B3B2B]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Boutique Officielle & Épicerie Fine
            </div>
            <h2 className="font-serif-title font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#58111A] tracking-tight">
              Le Merchandising & Coffrets du Terroir
            </h2>
            <p className="text-sm sm:text-base text-[#78716C] mt-2 max-w-xl">
              Hoodies brodés en coton bio, planches de service en chêne massif et couteaux régionaux. Retrait Click & Collect au Foyer des Élèves.
            </p>
          </div>

          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#58111A] hover:text-[#722F37] group transition-colors px-4 py-2 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm hover:shadow-md"
          >
            <span>Explorer tout le catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </ScrollReveal>

        {/* 3D Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, idx) => (
            <ScrollReveal key={product.id} direction="up" delay={idx * 0.15} className="flex">
              <TiltCard
                maxTilt={7}
                className="w-full bento-card rounded-3xl overflow-hidden flex flex-col justify-between group bg-[#FFFFFF]"
              >
                {/* Product Image with Zoom */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F6F1EA]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-[#14281D] text-[#FDFBF7] text-xs font-bold shadow-md border border-[#D4AF37]/30">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> -15% Pass Adhérent
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#FDFBF7] flex items-center gap-1 border border-white/10">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> Click & Collect Foyer ECE
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#1D1917] group-hover:text-[#58111A] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider">Prix Unitaire</span>
                      <p className="font-serif-title font-extrabold text-xl text-[#58111A]">
                        {formatPrice(product.priceCents)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                        addedProductId === product.id
                          ? 'bg-green-700 text-white'
                          : 'bg-[#58111A] hover:bg-[#722F37] text-[#FDFBF7] hover:scale-105 border border-[#D4AF37]/30'
                      }`}
                    >
                      {addedProductId === product.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Ajouté !</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#D4AF37]" />
                          <span>Ajouter au panier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
