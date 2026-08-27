'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { formatDateFrench } from '@/lib/utils';
import {
  Calendar,
  ShoppingBag,
  Newspaper,
  Info,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Sparkles,
  QrCode
} from 'lucide-react';
import CartDrawer from '../shop/CartDrawer';
import LuxuryButton from '@/components/ui/LuxuryButton';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const { events } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute the closest upcoming event by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const now = new Date().getTime();
  const nextUpcomingEvent = sortedEvents.find((e) => new Date(e.startDate).getTime() >= now) || sortedEvents[0];

  const isGathering = nextUpcomingEvent?.requiresBooking === false || nextUpcomingEvent?.eventType === 'Rassemblement';

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Événements', href: '/evenements', icon: Calendar },
    { name: 'Adhésion (10€)', href: '/adhesion', icon: Sparkles },
    { name: 'Actualités', href: '/actualites', icon: Newspaper },
    { name: 'Boutique', href: '/boutique', icon: ShoppingBag },
    { name: 'L\'Association', href: '/a-propos', icon: Info },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? 'glass-bistrot border-b border-[#D4AF37]/40 shadow-[0_10px_30px_-10px_rgba(88,17,26,0.12)]'
          : 'glass-bistrot border-b border-[#EAE2D8]/80'
          }`}
      >
        {/* Top dynamic announcement banner */}
        {nextUpcomingEvent ? (
          <div className="bg-gradient-to-r from-[#380B11] via-[#58111A] to-[#14281D] text-[#FDFBF7] text-xs py-1.5 px-4 text-center font-medium flex flex-wrap items-center justify-center gap-2 border-b border-[#D4AF37]/30">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0 shadow-[0_0_8px_#D4AF37]"></span>
            <span className="truncate max-w-[90vw] sm:max-w-none">
              {isGathering ? '🎉 Prochain Rassemblement' : '🧀 Prochaine Soirée'} : <strong className="text-[#D4AF37]">{nextUpcomingEvent.title}</strong> le <strong>{formatDateFrench(nextUpcomingEvent.startDate)}</strong> ({nextUpcomingEvent.location})
              {isGathering ? ' — Entrée Libre !' : ` — ${nextUpcomingEvent.remainingSeats > 0 ? `Billetterie ouverte (${nextUpcomingEvent.remainingSeats} places)` : 'Complet !'}`}
            </span>
            <Link
              href="/evenements"
              className="underline font-bold hover:text-[#D4AF37] ml-1 transition-colors whitespace-nowrap"
            >
              {isGathering ? 'Voir les infos →' : 'Réserver ma place →'}
            </Link>
          </div>
        ) : (
          <div className="bg-[#58111A] text-[#FDFBF7] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-[#D4AF37]/20">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Rejoignez l&apos;association ECE Terroir • Découvrez les prochains événements gourmands</span>
            <Link href="/evenements" className="underline font-bold hover:text-[#D4AF37] ml-2 transition-colors">
              Voir le calendrier &rarr;
            </Link>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative h-12 w-14 sm:h-14 sm:w-16 flex items-center justify-center shrink-0 group-hover:scale-108 transition-transform duration-300">
              <img
                src="/logo_eceterroir.png"
                alt="Logo ECE Terroir"
                className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#58111A] tracking-tight group-hover:text-[#722F37] transition-colors leading-none">
                ECE Terroir
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#14281D] tracking-wider uppercase mt-1">
                Art de Vivre ECE Paris
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-2xl text-xs xl:text-sm font-semibold transition-all relative ${isActive
                    ? 'bg-gradient-to-r from-[#58111A] to-[#722F37] text-[#FDFBF7] shadow-md border border-[#D4AF37]/50 font-bold'
                    : 'text-[#1D1917] hover:text-[#58111A] hover:bg-[#F6F1EA]'
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_6px_#D4AF37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Account */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 sm:px-3 sm:py-2.5 rounded-2xl border border-[#EAE2D8] bg-[#FFFFFF] hover:bg-[#F6F1EA] text-[#58111A] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#58111A]" />
              <span className="hidden sm:inline text-xs font-bold text-[#58111A]">Panier</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#58111A] text-[#D4AF37] text-[11px] font-extrabold flex items-center justify-center border border-[#D4AF37] shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/profil"
                  className="p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-[#14281D] text-[#FDFBF7] text-xs font-bold hover:bg-[#1B3B2B] transition-all shadow-sm flex items-center gap-1.5 sm:gap-2 border border-[#D4AF37]/40 hover:scale-105"
                  title="Mon Profil"
                >
                  <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="hidden sm:inline truncate max-w-[120px]">{user.fullName}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#58111A] text-[#D4AF37] text-xs font-extrabold hover:bg-[#722F37] transition-all shadow-sm flex items-center gap-1.5 border border-[#D4AF37]/50 hover:scale-105"
                    title="Dashboard Administration"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="hidden sm:flex p-2 rounded-2xl hover:bg-[#EAE2D8] text-[#78716C] hover:text-[#DC2626] transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <LuxuryButton variant="wine" size="sm" className="shadow-md px-3 sm:px-4">
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Espace Membre</span>
                  <span className="sm:hidden text-xs">Connexion</span>
                </LuxuryButton>
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl border border-[#EAE2D8] bg-[#FFFFFF] hover:bg-[#F6F1EA] text-[#58111A]"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D8] bg-[#FDFBF7] p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive
                    ? 'bg-[#58111A] text-[#FDFBF7]'
                    : 'text-[#1D1917] hover:bg-[#F6F1EA]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile-only User Actions */}
            <div className="pt-3 border-t border-[#EAE2D8] space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#14281D] text-[#FDFBF7] text-sm font-bold border border-[#D4AF37]/40 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Mon Profil & Pass Épicurien</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] font-extrabold uppercase">
                      {user.role === 'admin' ? 'Admin' : 'Adhérent'}
                    </span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#58111A] text-[#D4AF37] text-sm font-bold border border-[#D4AF37]/50 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Dashboard Administration</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-700 text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion ({user.fullName})</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/adhesion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-[#14281D] to-[#1E3A2B] text-[#FDFBF7] text-sm font-bold border border-[#D4AF37]/40 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Pass Épicurien & Cotisation</span>
                  </div>
                  <span className="text-xs font-serif-title font-extrabold text-[#D4AF37]">10 €</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
