'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, QrCode, MapPin, Award, Shield, Crown } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';

interface TopHeaderProps {
  onOpenCart?: () => void;
}

export function TopHeader({ onOpenCart }: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member' || user?.membershipStatus === 'active';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <header className="sticky top-3 z-30 mb-6">
      <div className="liquid-glass rounded-3xl p-2.5 sm:p-3 border border-white/80 shadow-lg flex items-center justify-between gap-3 bg-white/75 backdrop-blur-xl">
        
        {/* Left : Mobile Logo & Location */}
        <div className="flex items-center gap-3">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#14281D] to-[#264E3A] p-1.5 flex items-center justify-center border border-[#D4AF37]/40 shadow-sm">
              <Image src="/logo.png" alt="ECE Terroir" width={24} height={24} className="object-contain" />
            </div>
            <span className="font-serif-title font-extrabold text-sm text-[#14281D]">
              ECE Terroir
            </span>
          </Link>

          {/* Desktop Live Beacon */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE2D8] text-[11px] font-bold text-[#14281D]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Foyer Eiffel 1 (10 Rue Sextius Michel)</span>
          </div>
        </div>

        {/* Center : Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une raclette, un hoodie, un saucisson..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#F4EFEA]/80 border border-[#EAE2D8] focus:border-[#D4AF37] focus:bg-white text-xs text-[#1D1917] placeholder-[#A8A29E] outline-none transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-2.5 pointer-events-none" />
        </form>

        {/* Right : Action Buttons based on User Role */}
        <div className="flex items-center gap-2">
          
          {/* Admin shortcut if logged as Bureau Admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#14281D] text-[#D4AF37] text-xs font-extrabold border border-[#D4AF37]/40 shadow hover:scale-105 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Panneau Bureau</span>
            </Link>
          )}

          {/* Non-member / Visitor CTA */}
          {!isMember && !isAdmin && (
            <Link
              href="/adhesion"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#14281D] to-[#1E3D2C] text-[#D4AF37] text-xs font-extrabold border border-[#D4AF37]/30 shadow hover:scale-105 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cotisation 10€</span>
            </Link>
          )}

          {/* Member Quick Pass QR Modal Trigger */}
          {isMember && !isAdmin && (
            <Link
              href="/profil"
              className="p-2 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#EAE2D8] text-[#14281D] transition-all flex items-center gap-1.5"
              title="Mon Pass Épicurien"
            >
              <QrCode className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden xl:inline text-xs font-bold">Mon Pass</span>
            </Link>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={handleCartClick}
            className="relative p-2 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#EAE2D8] text-[#14281D] transition-all flex items-center justify-center"
            title="Panier Click & Collect"
          >
            <ShoppingBag className="w-4 h-4 text-[#14281D]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#58111A] text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
