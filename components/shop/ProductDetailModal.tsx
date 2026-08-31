'use client';

import React, { useState } from 'react';
import { MerchProduct } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { 
  X, 
  ShoppingBag, 
  Check, 
  MapPin, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  Layers, 
  Wrench, 
  Scale, 
  Award,
  ChevronRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: MerchProduct | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const isMember = user?.role === 'member' || user?.role === 'admin' || user?.membershipStatus === 'active';

  const [activeTab, setActiveTab] = useState<'description' | 'materials' | 'care'>('description');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes ? product.sizes[0] : '');
  const [activeImage, setActiveImage] = useState<string>(product?.imageUrl || '');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      setSelectedSize(product.sizes ? product.sizes[0] : '');
      setAddedSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const allImages = [product.imageUrl, ...(product.secondaryImages || [])];
  const memberPriceCents = Math.round(product.priceCents * 0.85);

  const handleAddToCart = () => {
    addItem(product, product.sizes ? selectedSize : undefined);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative bg-[#FAF7F2] text-[#1D1917] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-[#D4AF37]/50 z-10 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between bg-[#FFFFFF] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-sm">
              {product.category}
            </span>
            {product.origin && (
              <span className="text-xs text-[#78716C] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {product.origin}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-[#78716C] hover:text-[#1D1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Grid Content */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 flex-1">
          
          {/* LEFT: Photo Gallery (5 COLS) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-white border border-[#EAE2D8] shadow-md group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-bold">
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-[#58111A] scale-105 shadow-md' : 'border-[#EAE2D8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality badge */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2D8] space-y-1 text-xs text-[#78716C]">
              <div className="flex items-center gap-1.5 font-bold text-[#14281D]">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Sélection Officielle ECE Terroir</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Produit sélectionné avec soin auprès d&apos;ateliers et artisans français pour leur longévité.
              </p>
            </div>
          </div>

          {/* RIGHT: Product Specs & Buy Action (7 COLS) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#1D1917] leading-snug">
                {product.name}
              </h2>

              {/* Pricing & Member discount */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE2D8] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">Prix Standard</span>
                  <p className="font-serif-title font-extrabold text-2xl text-[#58111A]">
                    {formatPrice(product.priceCents)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#14281D] text-[#D4AF37] text-[10px] font-extrabold uppercase">
                    <Tag className="w-3 h-3" /> Pass Épicurien (-15%)
                  </span>
                  <p className="font-serif-title font-bold text-lg text-[#14281D]">
                    {formatPrice(memberPriceCents)}
                  </p>
                </div>
              </div>

              {/* Size selector if apparel */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1D1917]">
                    <span>Choisir une taille :</span>
                    <span className="text-[#78716C] font-normal text-[11px]">Coupe unisexe droite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-11 rounded-xl font-bold text-xs transition-all border ${
                          selectedSize === size
                            ? 'bg-[#58111A] text-white border-[#58111A] shadow-md scale-105'
                            : 'bg-white text-[#1D1917] border-[#EAE2D8] hover:border-[#58111A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Navigation for Specs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-[#EAE2D8] pb-2 text-xs">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`font-bold pb-1 transition-colors border-b-2 ${
                      activeTab === 'description' ? 'border-[#58111A] text-[#58111A]' : 'border-transparent text-[#78716C]'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`font-bold pb-1 transition-colors border-b-2 ${
                      activeTab === 'materials' ? 'border-[#58111A] text-[#58111A]' : 'border-transparent text-[#78716C]'
                    }`}
                  >
                    Savoir-Faire & Matières
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`font-bold pb-1 transition-colors border-b-2 ${
                      activeTab === 'care' ? 'border-[#58111A] text-[#58111A]' : 'border-transparent text-[#78716C]'
                    }`}
                  >
                    Entretien
                  </button>
                </div>

                {/* Tab content */}
                <div className="text-xs text-[#5C554E] leading-relaxed min-h-[70px]">
                  {activeTab === 'description' && (
                    <p>{product.description}</p>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-1.5">
                      {product.materials && (
                        <p><strong>Matière(s) :</strong> {product.materials}</p>
                      )}
                      {product.craftsmanship && (
                        <p><strong>Fabrication :</strong> {product.craftsmanship}</p>
                      )}
                      {product.dimensionsOrWeight && (
                        <p><strong>Dimensions & Poids :</strong> {product.dimensionsOrWeight}</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <p>{product.careInstructions || 'Nettoyage classique adapté au produit. Laver avec soin pour préserver les fibres et le bois.'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-[#EAE2D8]">
              <div className="flex items-center gap-3">
                {isMember ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                      addedSuccess
                        ? 'bg-green-700 text-white'
                        : product.stock <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#58111A] text-[#D4AF37] hover:bg-[#722F37] hover:scale-102'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Ajouté au panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                        <span>Ajouter au panier ({formatPrice(memberPriceCents)})</span>
                      </>
                    )}
                  </button>
                ) : (
                  <a
                    href="/adhesion"
                    className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#58111A] to-[#722F37] text-[#D4AF37] hover:text-[#FAF7F2] hover:scale-102 border border-[#D4AF37]/50"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Adhérer pour commander ({formatPrice(memberPriceCents)})</span>
                  </a>
                )}
              </div>

              {/* Click & Collect reassurance notice / Member exclusivity info */}
              {!isMember ? (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 flex items-center gap-2 justify-center text-center">
                  <ShieldCheck className="w-4 h-4 text-[#58111A] shrink-0" />
                  <span>Commande réservée aux membres. Prenez votre Pass (10€/an) pour débloquer l&apos;accès.</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#78716C] flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#58111A]" />
                  <span>Retrait Click & Collect immédiat au Foyer ECE (Bâtiment Eiffel 1)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
