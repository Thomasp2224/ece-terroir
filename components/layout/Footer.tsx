import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Award, MapPin, Mail, Utensils, QrCode, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141716] text-[#FDFBF7] border-t-2 border-[#D4AF37]/50 relative overflow-hidden">
      {/* Decorative subtle texture glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#58111A]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-16 flex items-center justify-start shrink-0">
                <img
                  src="/logo_eceterroir.png"
                  alt="Logo ECE Terroir"
                  className="h-full w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                />
              </div>
              <div>
                <span className="font-serif-title font-extrabold text-xl text-[#FDFBF7]">ECE Terroir</span>
                <p className="text-xs text-[#D4AF37] font-semibold">Association Gastronomique de l&apos;ECE Paris</p>
              </div>
            </div>
            <p className="text-xs text-[#D8CCC0] leading-relaxed">
              Célébrer la gastronomie française, les meules fermières AOP, les salaisons d&apos;exception et l&apos;art du grand banquet entre élèves-ingénieurs.
            </p>
            {/* Social Icons with SVG */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/eceterroir/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1C2220] hover:bg-[#58111A] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all border border-[#D4AF37]/30 hover:scale-110 shadow-lg"
                aria-label="Instagram @eceterroir"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@ece.terroir"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1C2220] hover:bg-[#58111A] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all border border-[#D4AF37]/30 hover:scale-110 shadow-lg"
                aria-label="TikTok @ece.terroir"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.87a8.28 8.28 0 0 0 5-1.63v-3.5a4.87 4.87 0 0 1-1.09.95z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-semibold text-base text-[#D4AF37] tracking-wider uppercase">
              Plateforme & Services
            </h4>
            <ul className="space-y-2 text-xs text-[#D8CCC0]">
              <li>
                <Link href="/evenements" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  &rsaquo; Calendrier & Billetterie HelloAsso
                </Link>
              </li>
              <li>
                <Link href="/adhesion" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-bold text-[#FDFBF7]">
                  &rsaquo; Pass Épicurien & Cotisation (10€)
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  &rsaquo; Actualités & Retours d&apos;Événements
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  &rsaquo; Boutique Merchandising ECE
                </Link>
              </li>
              <li>
                <Link href="/verifier" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  &rsaquo; Portail de Contrôle QR Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engagements */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-semibold text-base text-[#D4AF37] tracking-wider uppercase">
              La Charte Épicurienne
            </h4>
            <div className="space-y-2 text-xs text-[#D8CCC0]">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Producteurs, affineurs et vignerons certifiés AOP/IGP.</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Traçabilité, authenticité et valorisation du circuit court français.</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Paiements et cotisations sécurisés via HelloAsso.</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Campus */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-semibold text-base text-[#D4AF37] tracking-wider uppercase">
              Campus & Permanences
            </h4>
            <div className="space-y-2 text-xs text-[#D8CCC0]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Campus ECE Paris — Bâtiment Eiffel 1<br />10 Rue Sextius Michel, 75015 Paris</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>contact@eceterroir.fr</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1C2220] text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Cotisations Ouvertes 2026-2027
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#2C3833] flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8CCC0] gap-4">
          <p>© 2026-2027 ECE Terroir — Association Gastronomique de l&apos;ECE Paris. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec passion & gastronomie par la Confrérie ECE Terroir 🧀🍷🥖
          </p>
        </div>
      </div>
    </footer>
  );
}
