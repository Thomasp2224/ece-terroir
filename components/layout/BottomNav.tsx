'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ShoppingBag, Newspaper, User } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { itemCount } = useCart();

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home, badge: null },
    { href: '/evenements', label: 'Soirées', icon: Calendar, badge: null },
    { href: '/boutique', label: 'Boutique', icon: ShoppingBag, badge: itemCount > 0 ? itemCount : null },
    { href: '/actualites', label: 'Gazette', icon: Newspaper, badge: null },
    { href: user ? '/profil' : '/login', label: user ? 'Mon Pass' : 'Connexion', icon: User, badge: null },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50">
      <nav className="liquid-glass bg-white/90 backdrop-blur-2xl rounded-3xl p-1.5 border border-white/90 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#14281D] font-extrabold bg-[#14281D]/10'
                  : 'text-[#78716C] hover:text-[#14281D]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#14281D] stroke-[2.5]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#58111A] text-white text-[9px] font-bold flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
