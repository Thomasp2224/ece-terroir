'use client';

import React from 'react';
import { Users, Flame, Sparkles, Trophy, MapPin, Beer } from 'lucide-react';
import { useData } from '@/lib/context/DataContext';

export function PromoHiveWidget() {
  const { users } = useData();

  // Calculate promo stats
  const promoData = [
    { promo: 'ING3', count: 28, max: 40, color: 'from-[#14281D] to-[#2D5A3F]', lead: true },
    { promo: 'ING2', count: 22, max: 40, color: 'from-[#264E3A] to-[#3A6B4F]', lead: false },
    { promo: 'ING4', count: 18, max: 35, color: 'from-[#3A6B4F] to-[#4D8C67]', lead: false },
    { promo: 'ING1', count: 15, max: 35, color: 'from-[#4D8C67] to-[#6AA883]', lead: false },
    { promo: 'ING5 & Alumni', count: 12, max: 30, color: 'from-[#D4AF37] to-[#E5C158]', lead: false },
  ];

  const totalMembers = users.filter((u) => u.role === 'member' || u.role === 'admin' || u.membershipStatus === 'active').length;

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-5">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
            La Ruche des Promos
          </div>
          <span className="text-[11px] font-bold text-[#14281D] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            ING3 en tête
          </span>
        </div>
        <h3 className="font-serif-title font-extrabold text-xl text-[#14281D]">
          Mobilisation & Esprit de Corps
        </h3>
      </div>

      {/* Promo Bars */}
      <div className="space-y-2.5">
        {promoData.map((item, idx) => {
          const percent = Math.round((item.count / item.max) * 100);

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#14281D] flex items-center gap-1.5">
                  {item.promo}
                  {item.lead && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#14281D] border border-[#D4AF37]/40">
                      👑 1er
                    </span>
                  )}
                </span>
                <span className="text-[#78716C]">{item.count} adhérents ({percent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE2D8] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Foyer Status Pill */}
      <div className="p-3 rounded-2xl bg-white/70 border border-[#EAE2D8] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#14281D]">Foyer Eiffel 1</span>
        </div>
        <span className="text-[11px] text-[#78716C]">
          Planches de dégustation disponibles
        </span>
      </div>

    </div>
  );
}
