'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Home, 
  Calendar, 
  ShoppingBag, 
  Newspaper, 
  Compass, 
  User, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Award,
  LogOut,
  Crown
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { useData } from '@/lib/context/DataContext';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { events, membershipRequests } = useData();

  const pendingCount = membershipRequests ? membershipRequests.filter((r) => r.status === 'pending').length : 0;
  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member' || user?.membershipStatus === 'active';

  // Navigation Items (Accessible par TOUS les utilisateurs)
  const navItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: Home,
      badge: null,
    },
    {
      href: '/evenements',
      label: 'Événements',
      icon: Calendar,
      badge: events.length > 0 ? `${events.length}` : null,
      badgeColor: 'bg-[#14281D] text-[#D4AF37] border border-[#D4AF37]/30',
    },
    {
      href: '/boutique',
      label: 'Échoppe Terroir',
      icon: ShoppingBag,
      badge: itemCount > 0 ? `${itemCount}` : null,
      badgeColor: 'bg-[#58111A] text-white',
    },
    {
      href: '/actualites',
      label: 'Gazette & News',
      icon: Newspaper,
      badge: 'Nouveau',
      badgeColor: 'bg-[#D4AF37]/20 text-[#14281D] border border-[#D4AF37]/40 font-bold',
    },
    {
      href: '/a-propos',
      label: 'La Confrérie',
      icon: Compass,
      badge: null,
    },
  ];

  const adminItem = {
    href: '/admin',
    label: 'Bureau & Admin',
    icon: Shield,
    badge: pendingCount > 0 ? `${pendingCount}` : null,
    badgeColor: 'bg-[#58111A] text-white animate-pulse',
  };

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between fixed top-3 left-3 bottom-3 z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Liquid Glass Pine Sidebar Container */}
      <div className="h-full w-full rounded-3xl liquid-glass flex flex-col justify-between p-3.5 border border-white/80 shadow-2xl relative overflow-hidden bg-white/75 backdrop-blur-xl">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#14281D]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header / Brand */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between px-1.5 pt-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#14281D] to-[#264E3A] p-1.5 flex items-center justify-center border border-[#D4AF37]/40 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/logo.png"
                  alt="ECE Terroir Logo"
                  width={28}
                  height={28}
                  className="object-contain filter brightness-110"
                />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-serif-title font-extrabold text-sm text-[#14281D] tracking-tight truncate">
                    ECE Terroir
                  </span>
                  <span className="text-[10px] font-bold text-[#78716C] tracking-wider uppercase">
                    Paris • Confrérie
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl hover:bg-white/80 text-[#78716C] hover:text-[#14281D] border border-transparent hover:border-[#EAE2D8] transition-all"
              title={isCollapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#14281D] to-[#1E3D2C] text-[#FAF7F2] shadow-md border border-[#D4AF37]/40 scale-[1.02]'
                      : 'text-[#5C554E] hover:text-[#14281D] hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <div className={`flex items-center justify-center ${isActive ? 'text-[#D4AF37]' : 'text-[#78716C] group-hover:text-[#14281D]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {isActive && (
                    <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#D4AF37]" />
                  )}
                </Link>
              );
            })}

            {/* ONGLET ADMINISTRATION : STRICTEMENT RÉSERVÉ AUX ADMINS */}
            {isAdmin && (
              <div className="pt-2">
                <div className="h-[1px] bg-[#EAE2D8]/60 my-2" />
                <Link
                  href={adminItem.href}
                  title={isCollapsed ? adminItem.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    pathname.startsWith('/admin')
                      ? 'bg-[#14281D] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md'
                      : 'text-[#58111A] hover:text-[#14281D] hover:bg-white/60 bg-red-50/50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{adminItem.label}</span>
                      {adminItem.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${adminItem.badgeColor}`}>
                          {adminItem.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Section : Mini Profil & Pass Épicurien */}
        <div className="space-y-3 pt-3 border-t border-[#EAE2D8]/80 relative z-10">
          
          {/* Quick Member / Cotisation Banner */}
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#F4EFEA] to-white border border-[#D4AF37]/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#14281D] text-[#D4AF37] flex items-center justify-center">
                    {isAdmin ? <Crown className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[11px] font-extrabold text-[#14281D]">
                    {isAdmin ? 'Bureau Admin' : isMember ? 'Pass Épicurien' : 'Visiteur'}
                  </span>
                </div>
                {isMember && (
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                )}
              </div>

              {!isMember && !isAdmin ? (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] text-[#78716C]">
                    Cotisation 10€ pour profiter de tous les festins et de -15%.
                  </p>
                  <Link
                    href="/adhesion"
                    className="block text-center py-1.5 px-2.5 rounded-xl skeuo-btn-pine text-[10px] font-extrabold shadow-sm"
                  >
                    Prendre mon Pass (10€)
                  </Link>
                </div>
              ) : (
                <div className="pt-0.5">
                  <p className="text-[10px] text-[#78716C] truncate">
                    {user?.promo || 'Promo ECE Paris'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#14281D] text-[#D4AF37] flex items-center justify-center shadow-sm" title={isAdmin ? 'Bureau' : isMember ? 'Pass Actif' : 'Visiteur'}>
                {isAdmin ? <Crown className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              </div>
            </div>
          )}

          {/* User Account / Login Button */}
          {user ? (
            <div className="flex items-center justify-between gap-2 px-1">
              <Link
                href="/profil"
                className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-[#14281D] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                  {user.fullName.charAt(0)}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#14281D] truncate leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-[#78716C] truncate">
                      {isAdmin ? '👑 Bureau' : isMember ? '🧀 Membre' : 'Visiteur'}
                    </p>
                  </div>
                )}
              </Link>

              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-[#78716C] hover:text-[#58111A] hover:bg-white/80 transition-all"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl skeuo-btn-cream text-xs font-bold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#14281D]" />
              {!isCollapsed && <span>Se Connecter</span>}
            </Link>
          )}

        </div>

      </div>
    </aside>
  );
}
