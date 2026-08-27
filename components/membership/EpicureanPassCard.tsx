'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { UserProfile } from '@/lib/types';
import { downloadMemberCardHD } from '@/lib/utils/card-generator';
import { getMemberMatricule, getVerificationUrl } from '@/lib/utils/matricule';
import { 
  Award, 
  Sparkles, 
  Download, 
  RotateCw, 
  Maximize2, 
  Check, 
  Copy, 
  QrCode, 
  ShieldCheck, 
  Utensils, 
  ShoppingBag, 
  Users, 
  X,
  ExternalLink,
  FileSpreadsheet,
  ScanLine
} from 'lucide-react';

interface EpicureanPassCardProps {
  user: UserProfile;
  interactive?: boolean;
  showControls?: boolean;
}

export default function EpicureanPassCard({
  user,
  interactive = true,
  showControls = true,
}: EpicureanPassCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // 3D Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const memberMatricule = getMemberMatricule(user);
  const verificationUrl = getVerificationUrl(memberMatricule);

  // Generate high-resolution scannable QR code
  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 360,
      color: {
        dark: '#1D1917',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [verificationUrl]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadMemberCardHD({
        fullName: user.fullName,
        promo: user.promo,
        role: user.role,
        memberId: memberMatricule,
        validUntil: '31 / 08 / 2027',
        favoriteTerroirs: user.favoriteTerroirs,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyMatricule = () => {
    navigator.clipboard.writeText(memberMatricule);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isBureau = user.role === 'admin';

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* 3D Card Container — Clicking opens giant QR Code modal */}
      <div
        className="w-full max-w-lg perspective-1000 cursor-pointer select-none group relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFullscreenModal(true)}
        title="Cliquez pour afficher le QR Code en grand"
      >
        <div
          ref={cardRef}
          className={`relative w-full aspect-[1.586/1] rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${
              rotateY + (isFlipped ? 180 : 0)
            }deg)`,
          }}
        >
          {/* ======================================================== */}
          {/* FACE RECTO : CARTE OFFICIELLE                            */}
          {/* ======================================================== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#420E15] via-[#58111A] to-[#14281D] text-[#FDFBF7] p-5 sm:p-7 border-2 border-[#D4AF37] backface-hidden overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Hologram / Gold Sheen Effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(212, 175, 55, ${glarePos.opacity}) 0%, transparent 60%)`,
              }}
            />

            {/* Guilloché security watermark lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Top Row : Brand & Season + Flip Button */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#14281D] border border-[#D4AF37] p-1.5 flex items-center justify-center shadow-lg">
                  <img
                    src="/logo_eceterroir.png"
                    alt="Logo"
                    className="h-full w-auto object-contain filter drop-shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="font-serif-title font-extrabold text-base sm:text-lg text-[#FDFBF7] tracking-tight leading-none">
                    ECE TERROIR
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase block mt-0.5">
                    Confrérie & Gastronomie • ECE Paris
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide inline-block shadow-sm">
                    {isBureau ? '🛡️ Bureau 2026-2027' : '🍷 Adhérent 2026-2027'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-[#D8CCC0] block mt-0.5 font-mono">
                    Valide : 31/08/2027
                  </span>
                </div>

                {/* Flip button in corner */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30 transition-colors shadow-sm"
                  title="Retourner la carte"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Row : Member Name & Status */}
            <div className="relative z-10 space-y-1 my-auto pt-2">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                Titulaire de la carte
              </span>
              <h4 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#FFFFFF] tracking-tight truncate">
                {user.fullName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#D8CCC0]">
                <span>{user.promo || 'Ingé ECE Paris'}</span>
                <span>•</span>
                <span className="font-semibold text-[#D4AF37]">
                  {isBureau ? 'Bureau Exécutif' : 'Membre Officiel Actif'}
                </span>
              </div>
            </div>

            {/* Bottom Row : Matricule & QR Code */}
            <div className="relative z-10 flex items-end justify-between pt-2 border-t border-[#D4AF37]/30">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-wider text-[#D4AF37] font-bold block">
                  Matricule Adhérent (Drive Trésorerie)
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#FDFBF7] tracking-wider">
                  {memberMatricule}
                </span>
              </div>

              {/* Scannable High-Precision QR Code */}
              <div className="relative group/qr flex items-center gap-1.5">
                <span className="hidden sm:inline-block text-[9px] font-bold text-[#D4AF37] uppercase bg-black/40 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
                  📱 Agrandir
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] p-1 border-2 border-[#D4AF37] flex items-center justify-center shadow-md shrink-0 overflow-hidden ring-2 ring-transparent group-hover/qr:ring-[#D4AF37] transition-all">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code Contrôle" className="w-full h-full object-contain" />
                  ) : (
                    <QrCode className="w-full h-full text-[#1D1917]" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FACE VERSO : AVANTAGES & SIGNATURE                       */}
          {/* ======================================================== */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#14281D] via-[#1E3A2B] to-[#58111A] text-[#FDFBF7] p-5 sm:p-7 border-2 border-[#D4AF37] backface-hidden rotate-y-180 overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Avantages Adhérent ECE Terroir
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#D8CCC0] font-mono">10€ / Année</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                    className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30 transition-colors"
                    title="Retourner au recto"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-[#FDFBF7]">
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Utensils className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>-30% Dégustations</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>-15% Boutique Merch</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Commandes Meules AOP</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Vote AG & Soirées</span>
                </div>
              </div>
            </div>

            {/* Signatures & Localisation */}
            <div className="space-y-2 pt-2 border-t border-[#D4AF37]/30 text-[10px]">
              <div className="flex items-center justify-between text-[#D8CCC0]">
                <span>Signature du Bureau :</span>
                <span className="font-serif-title italic text-[#D4AF37]">Jules Houry (Président)</span>
              </div>
              <p className="text-[9px] text-[#D8CCC0]/80 leading-tight">
                📍 Campus Eiffel 1 • Enregistré au Pôle Trésorerie • Cliquez pour ouvrir le QR Code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Helper text with QR Code trigger indicator */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#78716C]">
        <button
          type="button"
          onClick={() => setIsFullscreenModal(true)}
          className="flex items-center gap-1.5 text-[#58111A] font-bold hover:underline"
        >
          <ScanLine className="w-4 h-4 text-[#D4AF37]" />
          <span>📱 Cliquez sur la carte pour ouvrir le QR Code en grand</span>
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1 text-[#78716C] hover:text-[#1D1917]"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Voir le Recto' : 'Voir les avantages (Verso)'}</span>
        </button>
        <span>•</span>
        <Link
          href={`/verifier?id=${encodeURIComponent(memberMatricule)}`}
          className="flex items-center gap-1 text-[#1B3B2B] font-bold hover:underline"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Page de contrôle &rarr;</span>
        </Link>
      </div>

      {/* Control Buttons */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsFullscreenModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#14281D] hover:bg-[#1E3A2B] text-[#D4AF37] text-xs font-bold transition-all shadow-lg flex items-center gap-2 border border-[#D4AF37]/40 hover:scale-105"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Ouvrir le QR Code (Plein Écran)</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-2xl bg-[#58111A] hover:bg-[#722F37] text-[#FDFBF7] text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-[#D4AF37]/30"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{isDownloading ? 'Génération HD...' : 'Télécharger PNG HD'}</span>
          </button>

          <button
            onClick={handleCopyMatricule}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F6F1EA] text-[#1D1917] text-xs font-bold transition-all border border-[#EAE2D8] shadow-sm flex items-center gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Matricule copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#78716C]" />
                <span>Copier matricule</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : FULLSCREEN GIANT QR CODE MOBILE / DESKTOP        */}
      {/* ======================================================== */}
      {isFullscreenModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsFullscreenModal(false)}
        >
          <div 
            className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#58111A] text-[#FDFBF7] rounded-3xl p-5 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-5 sm:space-y-6 text-center animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#14281D] border border-[#D4AF37] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-left">
                  <span className="font-serif-title font-bold text-sm text-[#FDFBF7] block leading-none">
                    Pass Épicurien
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                    QR Code Officiel de Contrôle
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsFullscreenModal(false)}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-[#D8CCC0] hover:text-white transition-colors"
                title="Fermer (Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Giant High-Precision Scannable QR Code */}
            <div className="space-y-3">
              <div className="w-56 h-56 sm:w-72 sm:h-72 mx-auto bg-white p-3 sm:p-4 rounded-3xl border-4 border-[#D4AF37] shadow-2xl flex items-center justify-center relative group">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="QR Code Adhérent ECE Terroir" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-full h-full text-[#1D1917]" />
                )}

                {/* Scan Frame Corners Overlay */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#58111A]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#58111A]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#58111A]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#58111A]" />
              </div>

              <p className="text-xs text-[#D8CCC0]">
                Présentez ce QR Code aux permanences au Foyer ou à l&apos;entrée des soirées.
              </p>
            </div>

            {/* Member Details */}
            <div className="space-y-1 bg-black/30 p-4 rounded-2xl border border-white/10">
              <h3 className="font-serif-title font-extrabold text-2xl text-white tracking-tight">
                {user.fullName}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-[#D4AF37] font-bold uppercase tracking-wider">
                  {isBureau ? '🛡️ Bureau ECE Terroir' : '🍷 Membre Adhérent Actif'}
                </span>
                <span>•</span>
                <span className="text-[#D8CCC0] font-mono font-bold">{memberMatricule}</span>
              </div>
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-green-400 font-semibold">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Cotisation 10 € validée • Registre Google Drive synchronisé</span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href={`/verifier?id=${encodeURIComponent(memberMatricule)}`}
                onClick={() => setIsFullscreenModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Tester le scan en direct</span>
              </Link>

              <button
                onClick={() => {
                  handleDownload();
                }}
                disabled={isDownloading}
                className="py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#58111A] text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Téléchargement...' : 'Télécharger PNG'}</span>
              </button>
            </div>

            <button
              onClick={() => setIsFullscreenModal(false)}
              className="w-full py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-[#D8CCC0] text-xs font-semibold transition-colors"
            >
              Fermer le Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
