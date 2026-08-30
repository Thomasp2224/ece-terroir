import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, ShoppingBag, ArrowRight, Award, Users, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { LiveEventCountdownWidget } from '@/components/widgets/LiveEventCountdownWidget';
import { MiniPassWidget } from '@/components/widgets/MiniPassWidget';
import { MerchLiquidShowcase } from '@/components/widgets/MerchLiquidShowcase';
import { PromoHiveWidget } from '@/components/widgets/PromoHiveWidget';
import { SocialLiveFeedWidget } from '@/components/widgets/SocialLiveFeedWidget';
import UpcomingEventsPreview from '@/components/home/UpcomingEventsPreview';
import BureauSection from '@/components/home/BureauSection';

export default function HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Hero Bento Banner — Liquid Glass Pine */}
      <section className="relative rounded-3xl liquid-glass-pine p-6 sm:p-10 border border-[#D4AF37]/35 shadow-2xl overflow-hidden text-[#FAF7F2]">
        
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14281D]/90 border border-[#D4AF37]/40 shadow-md backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-[#FAF7F2] uppercase">
                Confrérie Gastronomique • Campus ECE Paris
              </span>
            </div>

            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] leading-[1.1] tracking-tight">
              L&apos;Art de Vivre & les <span className="gold-text-shimmer">Terroirs de France</span>
            </h1>

            <p className="text-sm sm:text-base text-[#D8CCC0] max-w-2xl leading-relaxed">
              Banquets au feu de bois, dégustations d&apos;AOP d&apos;exception, voyages œnologiques et échoppe artisanale pour tous les élèves ingénieurs de l&apos;ECE Paris.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/evenements"
                className="px-6 py-3 rounded-2xl skeuo-btn-pine text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Voir les Banquets & Soirées</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>
              <Link
                href="/adhesion"
                className="px-6 py-3 rounded-2xl skeuo-btn-cream text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md hover:scale-105 transition-all text-[#14281D]"
              >
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Prendre mon Pass (10€)</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
              <div>
                <span className="font-serif-title font-bold text-xl sm:text-2xl text-[#D4AF37]">85 kg</span>
                <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider">Raclette AOP / an</p>
              </div>
              <div>
                <span className="font-serif-title font-bold text-xl sm:text-2xl text-[#FAF7F2]">140+</span>
                <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider">Épicuriens Actifs</p>
              </div>
              <div>
                <span className="font-serif-title font-bold text-xl sm:text-2xl text-[#D4AF37]">100%</span>
                <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider">Fait Maison & AOP</p>
              </div>
            </div>

          </div>

          {/* Right Floating Logo Emblem */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group animate-float-slow">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/30 via-emerald-500/20 to-[#D4AF37]/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-48 sm:w-56 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl flex items-center justify-center">
                <Image
                  src="/logo_eceterroir.png"
                  alt="Blason Officiel ECE Terroir"
                  width={220}
                  height={220}
                  className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Top Interactive Dynamic Widgets Row (Countdown + Mini Pass) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <LiveEventCountdownWidget />
        </div>
        <div className="lg:col-span-5 flex">
          <MiniPassWidget />
        </div>
      </section>

      {/* 3. Middle Modular Widgets Row (Merch Showcase + Ruche des Promos) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <MerchLiquidShowcase />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <PromoHiveWidget />
        </div>
      </section>

      {/* 4. Social Live Feed Polaroids */}
      <section>
        <SocialLiveFeedWidget />
      </section>

      {/* 5. Complete Events Section */}
      <section>
        <UpcomingEventsPreview />
      </section>

      {/* 6. Bureau Section */}
      <section>
        <BureauSection />
      </section>

    </div>
  );
}
