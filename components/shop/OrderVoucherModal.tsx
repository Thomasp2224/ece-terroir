'use client';

import React from 'react';
import { MerchOrder } from '@/lib/types';
import { formatPrice, formatDateFrench } from '@/lib/utils';
import { 
  X, 
  Printer, 
  QrCode, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface OrderVoucherModalProps {
  order: MerchOrder | null;
  onClose: () => void;
}

export default function OrderVoucherModal({ order, onClose }: OrderVoucherModalProps) {
  if (!order) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    `ECE-TERROIR-ORDER:${order.orderNumber || order.voucherCode}:${order.userName}:${order.totalCents}`
  )}&color=58-17-26&bgcolor=253-251-247`;

  const handlePrint = () => {
    window.print();
  };

  const isReady = order.status === 'ready_for_pickup';
  const isCompleted = order.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity print:hidden" 
        onClick={onClose}
      />

      {/* Voucher Container */}
      <div 
        className="relative bg-[#FDFBF7] text-[#1D1917] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-[#D4AF37] z-10 animate-in zoom-in-95 duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:max-h-none print:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar (Hidden on Print) */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between bg-[#14281D] text-[#FDFBF7] rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
              Bon de Retrait Officiel Click & Collect
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-[#D4AF37]/40 shadow-sm"
              title="Imprimer le bon"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header with Heraldic Style */}
          <div className="border-b-2 border-dashed border-[#D4AF37]/50 pb-6 text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shadow-md border border-[#D4AF37]/40">
              <span className="font-serif-title font-extrabold text-2xl">ET</span>
            </div>
            
            <h2 className="font-serif-title font-bold text-2xl text-[#58111A]">
              ECE TERROIR — PARIS
            </h2>
            <p className="text-xs text-[#78716C] uppercase tracking-widest font-semibold">
              Association Gastronomique Loi 1901 • Campus Eiffel 1
            </p>

            <div className="pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-[#14281D] text-[#D4AF37] font-mono font-bold text-sm tracking-wider shadow-sm border border-[#D4AF37]/30">
                N° {order.orderNumber || order.voucherCode}
              </span>
            </div>
          </div>

          {/* QR Code & Status Hero */}
          <div className="p-5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-[#D4AF37]/40 shadow-md shrink-0 flex items-center justify-center">
              <img
                src={qrCodeUrl}
                alt="QR Code Bon de Retrait"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : isReady
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isCompleted
                    ? 'Colis Retiré'
                    : isReady
                    ? 'Prêt au Foyer des Élèves'
                    : 'En cours de préparation'}
                </span>
                
                <span className="text-xs text-[#78716C]">
                  Commandé le {formatDateFrench(order.createdAt)}
                </span>
              </div>

              <h3 className="font-serif-title font-bold text-lg text-[#1D1917]">
                Titulaire : {order.userName}
              </h3>
              <p className="text-xs text-[#5C554E]">
                Email : <strong>{order.userEmail}</strong>
              </p>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Présentez ce QR Code ou votre numéro de commande au responsable de la permanence pour retirer votre commande.
              </p>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-[#58111A] uppercase tracking-wider">
              Articles commandés
            </h4>
            
            <div className="rounded-2xl border border-[#EAE2D8] overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F1EA] text-[#78716C] font-bold border-b border-[#EAE2D8]">
                  <tr>
                    <th className="p-3">Article</th>
                    <th className="p-3 text-center">Taille</th>
                    <th className="p-3 text-center">Qté</th>
                    <th className="p-3 text-right">Prix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D8]">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-semibold text-[#1D1917]">
                        {item.product.name}
                      </td>
                      <td className="p-3 text-center text-[#78716C]">
                        {item.selectedSize ? (
                          <span className="px-2 py-0.5 rounded bg-[#F6F1EA] border border-[#EAE2D8] font-bold text-[10px]">
                            {item.selectedSize}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3 text-center font-bold text-[#58111A]">
                        x{item.quantity}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#1D1917]">
                        {formatPrice(item.product.priceCents * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#FAF7F2] border-t-2 border-[#EAE2D8] font-bold">
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-xs uppercase text-[#78716C]">
                      Total TTC :
                    </td>
                    <td className="p-3 text-right font-serif-title font-extrabold text-base text-[#58111A]">
                      {formatPrice(order.totalCents)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pickup Location & Practical instructions */}
          <div className="p-4 rounded-2xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
              <MapPin className="w-4 h-4" />
              <span>Consignes de Retrait sur le Campus :</span>
            </div>
            <p className="text-[#D8CCC0] leading-relaxed">
              📍 <strong>{order.pickupLocation || 'Foyer des Élèves ECE Paris (Bâtiment Eiffel 1, Rez-de-Chaussée)'}</strong>
            </p>
            <div className="flex items-center gap-2 text-[#D8CCC0] pt-1 border-t border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Permanences : Du Lundi au Vendredi de 12h30 à 14h00 et lors de toutes les soirées de l&apos;association.</span>
            </div>
            {order.paymentMethod === 'cash_on_pickup' && (
              <p className="text-amber-300 font-semibold pt-1">
                💳 Mode de règlement : Paiement à la remise en espèces ou Lydia auprès du trésorier.
              </p>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-[#78716C] border-t border-[#EAE2D8] pt-4">
            Pour toute question concernant votre commande, contactez le pôle boutique : <strong>boutique@eceterroir.fr</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
