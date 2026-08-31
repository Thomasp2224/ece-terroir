import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Award, MapPin, Mail, Utensils, QrCode, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="rounded-3xl liquid-glass-pine text-[#FAF7F2] p-8 sm:p-12 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
      
      {/* Background Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-[#D4AF37]/40 shadow-inner">
                <Image
                  src="/logo.png"
                  alt="ECE Terroir"
                  width={36}
                  height={36}
                  className="object-contain filter brightness-110"
                />
              </div>
              <div>
                <span className="font-serif-title font-extrabold text-xl text-[#FAF7F2]">ECE Terroir</span>
                <p className="text-xs text-[#D4AF37] font-semibold">Confrérie de l&apos;ECE Paris</p>
              </div>
            </div>
            <p className="text-xs text-[#D8CCC0] leading-relaxed">
              Célébrer la gastronomie française, les meules fermières AOP, les salaisons d&apos;exception et l&apos;art du grand banquet entre élèves-ingénieurs.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-[#D4AF37] tracking-wider uppercase">
              Plateforme & Services
            </h4>
            <ul className="space-y-2 text-xs text-[#D8CCC0]">
              <li>
                <Link href="/evenements" className="hover:text-[#D4AF37] transition-colors">
                  &rsaquo; Calendrier des Banquets
                </Link>
              </li>
              <li>
                <Link href="/adhesion" className="hover:text-[#D4AF37] transition-colors font-bold text-white">
                  &rsaquo; Pass Épicurien & Cotisation (10€)
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-[#D4AF37] transition-colors">
                  &rsaquo; Échoppe Merchandising
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-[#D4AF37] transition-colors">
                  &rsaquo; Gazette & Actualités
                </Link>
              </li>
              <li>
                <Link href="/verifier" className="hover:text-[#D4AF37] transition-colors">
                  &rsaquo; Contrôle des Billets QR Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Charte */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-[#D4AF37] tracking-wider uppercase">
              La Charte Épicurienne
            </h4>
            <div className="space-y-2 text-xs text-[#D8CCC0]">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>100% Producteurs & Artisans Français AOP/AOC</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Boutique solidaire à prix coûtant étudiant</span>
              </div>
            </div>
          </div>

          {/* Col 4: Siège & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-[#D4AF37] tracking-wider uppercase">
              Campus Eiffel 1
            </h4>
            <div className="space-y-2 text-xs text-[#D8CCC0]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>10 Rue Sextius Michel, 75015 Paris</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:eceterroir@gmail.com" className="hover:text-[#D4AF37] underline">eceterroir@gmail.com</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Legal */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A8A29E]">
          <p>© 2026-2027 ECE Terroir (Association Loi 1901) • Campus ECE Paris</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/mentions-legales" className="hover:text-[#D4AF37] transition-colors">Mentions Légales</Link>
            <Link href="/confidentialite" className="hover:text-[#D4AF37] transition-colors">Confidentialité & RGPD</Link>
            <Link href="/a-propos" className="hover:text-[#D4AF37] transition-colors">À Propos</Link>
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors font-bold text-[#D4AF37]">Bureau Admin</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
