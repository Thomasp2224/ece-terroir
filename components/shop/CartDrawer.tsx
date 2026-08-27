'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { MerchOrder } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, ArrowRight, MapPin, QrCode, Ticket } from 'lucide-react';
import Link from 'next/link';
import OrderVoucherModal from './OrderVoucherModal';

export default function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, removeItem, updateQuantity, totalCents, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useData();
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<MerchOrder | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'online' | 'cash_on_pickup'>('cash_on_pickup');

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;

    const newOrder = createOrder({
      userId: user?.id || 'usr-guest',
      userEmail: user?.email || 'visiteur@edu.ece.fr',
      userName: user?.fullName || 'Étudiant ECE Paris',
      items: [...items],
      totalCents,
      paymentMethod: paymentMode,
      status: 'ready_for_pickup',
      pickupLocation: 'Foyer des Élèves ECE Paris (Bâtiment Eiffel 1)',
      pickupNotes: 'Bon de retrait généré via la boutique en ligne.',
    });

    setCreatedOrder(newOrder);
    setIsOrdered(true);
    clearCart();
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsOrdered(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleCloseDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] text-[#1D1917] shadow-2xl flex flex-col border-l border-[#EAE2D8]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE2D8] flex items-center justify-between bg-[#F6F1EA]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#58111A] text-[#FDFBF7] flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="font-serif-title font-bold text-xl text-[#58111A]">Votre Panier Terroir</h2>
                <p className="text-xs text-[#78716C]">Retrait Click & Collect Campus ECE</p>
              </div>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="p-2 rounded-full hover:bg-[#EAE2D8] transition-colors text-[#78716C] hover:text-[#1D1917]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isOrdered && createdOrder ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-[#1B3B2B]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#58111A] bg-[#F6F1EA] px-3 py-1 rounded-full border border-[#EAE2D8]">
                    N° {createdOrder.orderNumber}
                  </span>
                  <h3 className="font-serif-title font-bold text-2xl text-[#58111A] pt-2">Commande Enregistrée !</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    Votre commande est prête pour le retrait au <strong>Foyer Eiffel 1</strong>.
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/40 text-left space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#D4AF37]">
                    <MapPin className="w-4 h-4" />
                    <span>Lieu de remise :</span>
                  </div>
                  <p className="text-xs text-[#D8CCC0]">
                    Foyer des Élèves ECE Paris (Bâtiment Eiffel 1).
                  </p>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <button
                    onClick={() => setShowVoucherModal(true)}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#58111A] text-[#D4AF37] font-bold text-xs sm:text-sm hover:bg-[#722F37] transition-all shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/50"
                  >
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                    <span>Ouvrir mon Bon de Retrait (QR Code)</span>
                  </button>

                  <button
                    onClick={handleCloseDrawer}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#EAE2D8] text-xs font-semibold text-[#78716C] hover:bg-[#FAF7F2] transition-colors"
                  >
                    Fermer le panier
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <ShoppingBag className="w-16 h-16 text-[#D8CCC0]" />
                <h3 className="font-serif-title font-semibold text-xl text-[#58111A]">Votre panier est vide</h3>
                <p className="text-sm text-[#78716C]">
                  Découvrez nos hoodies exclusifs, verres gravés et coffrets gourmands.
                </p>
                <Link
                  href="/boutique"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#58111A] text-[#FDFBF7] font-medium text-sm hover:bg-[#722F37] transition-all shadow-md flex items-center gap-2"
                >
                  Visiter la Boutique <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || 'default'}-${idx}`}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex gap-4 items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D8]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[#1D1917] truncate">{item.product.name}</h4>
                    {item.selectedSize && (
                      <span className="inline-block px-2 py-0.5 mt-1 rounded bg-[#F6F1EA] text-[10px] font-bold text-[#58111A]">
                        Taille : {item.selectedSize}
                      </span>
                    )}
                    <p className="text-xs font-bold text-[#58111A] mt-1">
                      {formatPrice(item.product.priceCents)}
                    </p>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="text-[#78716C] hover:text-[#DC2626] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-[#EAE2D8] rounded-lg bg-[#F6F1EA]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="p-1 hover:bg-[#EAE2D8] rounded-l transition-colors"
                      >
                        <Minus className="w-3 h-3 text-[#58111A]" />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="p-1 hover:bg-[#EAE2D8] rounded-r transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#58111A]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {!isOrdered && items.length > 0 && (
            <div className="p-6 border-t border-[#EAE2D8] bg-[#F6F1EA] space-y-4">
              {/* Pickup info */}
              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EAE2D8] text-xs text-[#58111A] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Retrait sur le campus :</span> Foyer des Élèves ECE Paris (Eiffel 1).
                </div>
              </div>

              {/* Payment selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#78716C]">Mode de règlement :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash_on_pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      paymentMode === 'cash_on_pickup'
                        ? 'border-[#58111A] bg-[#58111A] text-[#FDFBF7] shadow-sm'
                        : 'border-[#EAE2D8] bg-[#FFFFFF] text-[#78716C] hover:border-[#58111A]'
                    }`}
                  >
                    💵 Au Retrait (Espèces/Lydia)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('online')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      paymentMode === 'online'
                        ? 'border-[#58111A] bg-[#58111A] text-[#FDFBF7] shadow-sm'
                        : 'border-[#EAE2D8] bg-[#FFFFFF] text-[#78716C] hover:border-[#58111A]'
                    }`}
                  >
                    💳 En Ligne (HelloAsso/CB)
                  </button>
                </div>
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-[#78716C]">Total de la commande :</span>
                <span className="font-serif-title font-extrabold text-2xl text-[#58111A]">
                  {formatPrice(totalCents)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-[#58111A] text-[#FDFBF7] font-semibold text-sm hover:bg-[#722F37] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-[#D4AF37]/30"
              >
                Confirmer ma Commande Click & Collect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Voucher Modal */}
      <OrderVoucherModal
        order={showVoucherModal ? createdOrder : null}
        onClose={() => setShowVoucherModal(false)}
      />
    </div>
  );
}
