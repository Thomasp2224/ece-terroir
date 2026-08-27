'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, ShoppingBag, ArrowRight, Sparkles, Flame, Users, Wine, MapPin } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import LuxuryButton from '@/components/ui/LuxuryButton';
import AnimatedText from '@/components/ui/AnimatedText';

const HERO_BACKGROUNDS = [
  {
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2000&auto=format&fit=crop',
    caption: 'Banquets & Festins aux Chandelles',
  },
  {
    url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2000&auto=format&fit=crop',
    caption: 'Alpages & Fromages Fermiers d\'Origine',
  },
  {
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2000&auto=format&fit=crop',
    caption: 'Planches Gourmandes & Salaisons Artisanales',
  },
  {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop',
    caption: 'Tradition & Terroirs de France',
  },
];

export default function Hero() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-rotate background visuals smoothly every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex items-center justify-center bg-[#141716] text-[#FDFBF7] overflow-hidden select-none"
    >
      {/* 1. Cinematic Background Carousel with Soft Cross-Fades */}
      {HERO_BACKGROUNDS.map((bg, idx) => (
        <div
          key={bg.url}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 ${
            idx === currentBgIndex ? 'opacity-35 scale-100' : 'opacity-0 scale-110'
          }`}
          style={{ backgroundImage: `url('${bg.url}')` }}
        />
      ))}

      {/* Atmospheric Vignette & Deep Terroir Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14281D]/90 via-[#141716]/80 to-[#141716]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(20,24,22,0.85)_100%)]" />

      {/* 2. Interactive Ambient Light Aura (follows mouse) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: `${mousePos.x || 50}%`,
          top: `${mousePos.y || 40}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(88, 17, 26, 0.35) 45%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center space-y-8">
        {/* Floating Noble Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#58111A]/90 border border-[#D4AF37]/60 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#FDFBF7] uppercase">
            Confrérie Épicurienne • Campus ECE Paris
          </span>
        </div>

        {/* Central 3D Floating Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer animate-float-slow">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/30 via-[#58111A]/40 to-[#D4AF37]/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-44 sm:w-56 md:w-64 p-2 transition-transform duration-500 group-hover:scale-105">
              <img
                src="/logo_eceterroir.png"
                alt="Logo Officiel ECE Terroir"
                className="w-full h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>
        </div>

        {/* Headline with Staggered Word Reveal */}
        <div className="space-y-4 max-w-4xl mx-auto px-2">
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FDFBF7] tracking-tight leading-[1.12] break-words">
            <AnimatedText
              text="La passion du terroir, l'art du banquet & du partage."
              highlightWords={['terroir', 'banquet', 'partage']}
            />
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-[#D8CCC0] max-w-2xl mx-auto leading-relaxed text-pretty font-medium">
            L&apos;association gastronomique officielle de l&apos;ECE Paris. Dégustations de meules AOP, charcuteries d&apos;exception, voyages du goût et convivialité pour tous les bons vivants.
          </p>
        </div>

        {/* Primary Interactive CTAs with Luxury Shimmer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
          <Link href="/evenements" className="w-full sm:w-auto">
            <LuxuryButton variant="wine" size="lg" className="w-full sm:w-auto">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
              <span>Explorer les Événements & Soirées</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform duration-300" />
            </LuxuryButton>
          </Link>

          <Link href="/adhesion" className="w-full sm:w-auto">
            <LuxuryButton variant="forest" size="lg" className="w-full sm:w-auto">
              <Wine className="w-5 h-5 text-[#D4AF37]" />
              <span>Pass Épicurien & Cotisation (10€)</span>
            </LuxuryButton>
          </Link>
        </div>

        {/* 3. Interactive Stats Grid in 3D Bento Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 pt-8 max-w-4xl mx-auto">
          <TiltCard
            maxTilt={9}
            className="p-5 rounded-3xl bg-[#1B3B2B]/70 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#D4AF37]">
              <Users className="w-4 h-4" />
              <span className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#FFFFFF]">450+</span>
            </div>
            <p className="text-xs text-[#D8CCC0] font-semibold tracking-wide">Bons Vivants & Membres</p>
          </TiltCard>

          <TiltCard
            maxTilt={9}
            className="p-5 rounded-3xl bg-[#1B3B2B]/70 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#D4AF37]">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#FFFFFF]">24+</span>
            </div>
            <p className="text-xs text-[#D8CCC0] font-semibold tracking-wide">Festins & Dégustations</p>
          </TiltCard>

          <TiltCard
            maxTilt={9}
            className="p-5 rounded-3xl bg-[#1B3B2B]/70 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#D4AF37]">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#FFFFFF]">12</span>
            </div>
            <p className="text-xs text-[#D8CCC0] font-semibold tracking-wide">Régions de Terroir</p>
          </TiltCard>

          <TiltCard
            maxTilt={9}
            className="p-5 rounded-3xl bg-[#1B3B2B]/70 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-[#D4AF37]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#FFFFFF]">100%</span>
            </div>
            <p className="text-xs text-[#D8CCC0] font-semibold tracking-wide">Artisans Français</p>
          </TiltCard>
        </div>

        {/* Carousel slide indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {HERO_BACKGROUNDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBgIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentBgIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
              title={`Afficher le visuel ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
