'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { MerchProduct } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Plus, MapPin, Sparkles, Filter, Check, ShieldCheck, Tag, Eye } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductDetailModal from '@/components/shop/ProductDetailModal';

export default function BoutiquePage() {
  const { addItem } = useCart();
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);

  const categories = ['all', 'Textile', 'Verre & Sommelerie', 'Accessoires', 'Coffrets Gourmands'];

  const filteredProducts = products.filter((prod) => {
    return selectedCategory === 'all' || prod.category === selectedCategory;
  });

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: MerchProduct) => {
    const size = product.sizes ? selectedSizes[product.id] || product.sizes[0] : undefined;
    addItem(product, size);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#14281D] text-[#FDFBF7] p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#58111A]/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-md">
              <ShoppingBag className="w-3.5 h-3.5" />
              Boutique Officielle ECE Terroir
            </div>
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl leading-tight">
              Merchandising & Produits d&apos;Exception
            </h1>
            <p className="text-sm sm:text-base text-[#D8CCC0]">
              Commandez vos hoodies brodés, planches en chêne massif gravées, couteaux de terroir et coffrets gourmands. Retrait <strong>Click & Collect</strong> direct sur le campus de l&apos;ECE Paris (Eiffel 1).
            </p>
          </div>
        </ScrollReveal>

        {/* Click & Collect Banner Info */}
        <ScrollReveal direction="up" delay={0.1} className="p-4 sm:p-6 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#58111A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#14281D] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1D1917]">Point de retrait officiel : Campus ECE Paris</p>
              <p className="text-[#78716C]">Foyer des Élèves (Bâtiment Eiffel 1). Règlement possible en ligne ou en espèces/Lydia au retrait.</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#D4AF37]/40 text-[#58111A] font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> -15% Pass Épicurien
          </span>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal direction="up" delay={0.15} className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[#58111A] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#58111A] text-[#FDFBF7] shadow-sm font-extrabold'
                  : 'bg-[#F6F1EA] text-[#78716C] hover:text-[#58111A] hover:bg-[#EAE2D8]'
              }`}
            >
              {cat === 'all' ? 'Tous les produits' : cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Product Grid with TiltCard */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#D8CCC0] mx-auto" />
            <h3 className="font-serif-title font-bold text-xl text-[#58111A]">Échoppe en cours d&apos;approvisionnement</h3>
            <p className="text-sm text-[#78716C]">
              Les articles officiels de la saison (hoodies brodés, planches gravées et accessoires) seront bientôt disponibles à la commande.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => {
            const currentSize = product.sizes ? selectedSizes[product.id] || product.sizes[0] : null;

            return (
              <ScrollReveal key={product.id} direction="up" delay={idx * 0.08} className="flex">
                <TiltCard
                  maxTilt={6}
                  className="bento-card w-full rounded-3xl overflow-hidden flex flex-col justify-between bg-[#FFFFFF] cursor-pointer group hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image & Badges */}
                  <div>
                    <div className="relative h-64 w-full overflow-hidden bg-[#F6F1EA]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-1">
                        <span className="px-3 py-1 rounded-full bg-[#14281D] text-[#FDFBF7] text-xs font-bold shadow-md border border-[#D4AF37]/30">
                          {product.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#FDFBF7] border border-white/10">
                          Stock : {product.stock} dispo
                        </span>
                      </div>

                      {/* Quick View hover badge */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[#58111A] font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-4 h-4 text-[#D4AF37]" />
                          Fiche Détaillée & Savoir-Faire
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-serif-title font-bold text-lg text-[#1D1917] group-hover:text-[#58111A] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Size Selector if textile */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div 
                          className="pt-2 space-y-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] uppercase font-bold text-[#78716C]">Taille :</span>
                          <div className="flex items-center gap-2">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(product.id, size)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                                  currentSize === size
                                    ? 'bg-[#58111A] text-[#FDFBF7] shadow-sm font-extrabold'
                                    : 'bg-[#F6F1EA] text-[#78716C] hover:bg-[#EAE2D8]'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer / Price & Add */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#78716C] uppercase font-bold">Prix</span>
                        <p className="font-serif-title font-extrabold text-xl text-[#58111A]">
                          {formatPrice(product.priceCents)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md ${
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
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
