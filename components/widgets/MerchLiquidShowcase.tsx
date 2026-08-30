'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Plus, Check } from 'lucide-react';
import { useData } from '@/lib/context/DataContext';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import ProductDetailModal from '@/components/shop/ProductDetailModal';
import { MerchProduct } from '@/lib/types';

export function MerchLiquidShowcase() {
  const { products } = useData();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const isMemberActive = user?.role === 'member' || user?.role === 'admin' || user?.membershipStatus === 'active';

  // Take top 3 products
  const featuredProducts = products.slice(0, 3);

  const handleQuickAdd = (p: MerchProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(p, p.sizes ? p.sizes[0] : undefined);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <>
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              Échoppe Officielle • Nouveautés
            </div>
            <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#14281D]">
              Le Vestiaire & L&apos;Art de la Table
            </h3>
          </div>

          <Link
            href="/boutique"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#14281D] hover:text-[#2D5A3F] transition-colors"
          >
            <span>Toute la boutique</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>

        {/* 3 Grid Showcase Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredProducts.map((product) => {
            const memberPriceCents = Math.round(product.priceCents * 0.85);
            const displayPriceCents = isMemberActive ? memberPriceCents : product.priceCents;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="p-3.5 rounded-2xl bg-white/75 border border-[#EAE2D8] hover:border-[#D4AF37]/60 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3 group/item relative"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] p-2 flex items-center justify-center border border-[#EAE2D8]/60">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/item:scale-105 transition-transform duration-300"
                  />
                  {isMemberActive && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#14281D] text-[#D4AF37] text-[9px] font-extrabold shadow border border-[#D4AF37]/40">
                      -15% Pass
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h4 className="font-serif-title font-bold text-sm text-[#14281D] group-hover/item:text-[#2D5A3F] transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-black text-sm text-[#14281D]">
                      {formatPrice(displayPriceCents)}
                    </span>
                    {isMemberActive && (
                      <span className="text-xs text-[#A8A29E] line-through">
                        {formatPrice(product.priceCents)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Add CTA */}
                <button
                  onClick={(e) => handleQuickAdd(product, e)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    addedId === product.id
                      ? 'bg-emerald-700 text-white shadow'
                      : 'skeuo-btn-cream text-[#14281D] hover:text-[#14281D]'
                  }`}
                >
                  {addedId === product.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Ajouté !</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Full Link */}
        <div className="sm:hidden pt-1 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14281D]"
          >
            <span>Voir tous les produits ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
