'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import CartDrawer from '@/components/shop/CartDrawer';
import Footer from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ece_sidebar_collapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ece_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1D1917] flex relative selection:bg-[#D4AF37]/30 selection:text-[#14281D]">
      
      {/* Desktop Floating Left Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pb-24 lg:pb-8 ${
          mounted && isSidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72'
        } px-3 sm:px-6 pt-3`}
      >
        {/* Top Header Bar */}
        <TopHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto space-y-8">
          {children}
        </main>

        {/* Refined Footer */}
        <div className="mt-16 border-t border-[#EAE2D8]/80 pt-8">
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Shopping Cart Drawer */}
      <CartDrawer />

    </div>
  );
}
