'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  Tablet, 
  RotateCw, 
  RefreshCw, 
  X, 
  QrCode, 
  ExternalLink, 
  Sliders, 
  Eye, 
  Check, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface DevicePreset {
  id: string;
  name: string;
  type: 'phone' | 'tablet';
  width: number;
  height: number;
  hasDynamicIsland?: boolean;
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', type: 'phone', width: 393, height: 852, hasDynamicIsland: true },
  { id: 'galaxy-s24', name: 'Galaxy S24', type: 'phone', width: 360, height: 800, hasDynamicIsland: false },
  { id: 'iphone-se', name: 'iPhone SE / Compact', type: 'phone', width: 375, height: 667, hasDynamicIsland: false },
  { id: 'ipad-mini', name: 'iPad Mini', type: 'tablet', width: 768, height: 1024, hasDynamicIsland: false },
];

const PAGES = [
  { name: 'Accueil', path: '/' },
  { name: 'Événements', path: '/evenements' },
  { name: 'Boutique Merch', path: '/boutique' },
  { name: 'Adhésion (10€)', path: '/adhesion' },
  { name: 'Mon Profil & Pass', path: '/profil' },
  { name: 'Journal / Actus', path: '/actualites' },
  { name: 'À Propos', path: '/a-propos' },
  { name: 'Contrôle QR', path: '/verifier' },
  { name: 'Admin', path: '/admin' },
];

export default function MobilePreviewSimulator() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isInsideIframe, setIsInsideIframe] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState<number>(0.9);
  const [activePath, setActivePath] = useState(pathname || '/');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [tunnelUrl, setTunnelUrl] = useState('https://sixty-toys-chew.loca.lt');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Detect if we are already rendered inside an iframe to prevent recursive embedding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (window.self !== window.top) {
          setIsInsideIframe(true);
        }
      } catch (e) {
        setIsInsideIframe(true);
      }
    }
  }, []);

  // 2. Keyboard shortcut: Alt + M to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'm') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 3. Keep active path in sync with current page when opened
  useEffect(() => {
    if (pathname) {
      setActivePath(pathname);
    }
  }, [pathname]);

  // 4. Generate QR code for mobile scanning
  useEffect(() => {
    QRCode.toDataURL(tunnelUrl, {
      margin: 1,
      width: 260,
      color: {
        dark: '#58111A',
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl).catch(console.error);
  }, [tunnelUrl]);

  if (isInsideIframe) {
    return null;
  }

  const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const deviceHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = activePath;
    }
  };

  const handleNavigate = (path: string) => {
    setActivePath(path);
    if (iframeRef.current) {
      iframeRef.current.src = path;
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="group px-4 py-2.5 rounded-full bg-[#14281D]/90 hover:bg-[#14281D] text-[#FDFBF7] font-bold text-xs shadow-2xl border-2 border-[#D4AF37] backdrop-blur-md flex items-center gap-2.5 hover:scale-105 transition-all"
            title="Ouvrir le simulateur mobile (Raccourci : Alt + M)"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            <Smartphone className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Aperçu Mobile</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
              Alt+M
            </span>
          </button>
        </div>
      )}

      {/* Fullscreen Simulator Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0E0C]/95 backdrop-blur-2xl flex flex-col text-[#FDFBF7] overflow-hidden animate-in fade-in duration-200">
          {/* Top Control Bar */}
          <header className="h-16 px-4 sm:px-6 bg-[#141A17] border-b border-[#D4AF37]/30 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            {/* Left: Branding & Device selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="hidden md:block">
                  <h3 className="font-serif-title font-bold text-sm text-[#FDFBF7]">Simulateur Responsive</h3>
                  <p className="text-[10px] text-[#D4AF37]">ECE Terroir Mobile Preview</p>
                </div>
              </div>

              {/* Devices Switcher */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                {DEVICE_PRESETS.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedDevice.id === device.id
                        ? 'bg-[#58111A] text-[#FDFBF7] shadow-sm border border-[#D4AF37]/50'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {device.type === 'phone' ? (
                      <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : (
                      <Tablet className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                    <span className="hidden sm:inline">{device.name}</span>
                    <span className="sm:hidden">{device.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Quick Page Selector & Orientation */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                <span className="text-[11px] text-neutral-400 font-semibold">Page :</span>
                <select
                  value={activePath}
                  onChange={(e) => handleNavigate(e.target.value)}
                  className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37]"
                >
                  {PAGES.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.name} ({p.path})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className={`p-2 rounded-xl border transition-all ${
                  isLandscape
                    ? 'bg-[#D4AF37] text-[#58111A] border-[#D4AF37] font-bold'
                    : 'bg-black/30 border-white/10 text-neutral-300 hover:text-white'
                }`}
                title="Pivoter (Portrait / Paysage)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-black/30 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
                title="Recharger la page"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Scale, QR Code on Phone & Close */}
            <div className="flex items-center gap-2">
              {/* Zoom Scale Buttons */}
              <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                {[0.75, 0.85, 0.95, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                      scale === s
                        ? 'bg-white/20 text-[#D4AF37]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {Math.round(s * 100)}%
                  </button>
                ))}
              </div>

              {/* QR Code Button */}
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#1B3B2B] hover:bg-[#264E3A] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="Scanner pour tester sur votre vrai téléphone"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Vrai Téléphone</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-950/60 hover:text-red-300 text-neutral-300 transition-all border border-white/10"
                title="Fermer le simulateur (Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Quick Page pills for mobile screens */}
          <div className="lg:hidden px-4 py-2 bg-[#101412] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            {PAGES.map((p) => (
              <button
                key={p.path}
                onClick={() => handleNavigate(p.path)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap font-bold text-xs ${
                  activePath === p.path
                    ? 'bg-[#58111A] text-white'
                    : 'bg-white/5 text-neutral-400'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Device Mockup Canvas */}
          <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-[radial-gradient(#1A221E_1px,transparent_1px)] [background-size:20px_20px]">
            <div
              className="transition-all duration-300 flex flex-col items-center justify-center origin-center"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              {/* Phone / Tablet Bezel Frame */}
              <div
                className="relative bg-[#1A1F1D] border-[12px] border-[#2E3532] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  width: `${deviceWidth}px`,
                  height: `${deviceHeight}px`,
                  borderRadius: selectedDevice.type === 'phone' ? '54px' : '36px',
                }}
              >
                {/* Dynamic Island / Camera Notch */}
                {selectedDevice.hasDynamicIsland && !isLandscape && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-2.5 pointer-events-none shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20" />
                    <div className="w-3 h-3 rounded-full bg-[#081528] border border-blue-500/30 ring-1 ring-blue-500/20" />
                  </div>
                )}

                {/* Status Bar simulation */}
                <div className="h-6 w-full bg-transparent px-6 flex items-center justify-between text-[11px] font-semibold text-neutral-400 select-none pointer-events-none z-20 shrink-0 pt-1">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2 rounded-sm border border-neutral-400 p-[1px] flex items-center">
                      <div className="w-2.5 h-full bg-neutral-300 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Interactive Iframe */}
                <div className="flex-1 w-full relative bg-[#FDFBF7] overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={activePath}
                    title="Mobile Preview Frame"
                    className="w-full h-full border-0 bg-[#FDFBF7]"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  />
                </div>

                {/* Home Indicator Bar */}
                <div className="h-4 w-full bg-transparent flex items-center justify-center pointer-events-none z-20 shrink-0 pb-1">
                  <div className="w-32 h-1 bg-neutral-400/60 rounded-full" />
                </div>
              </div>

              {/* Dimensions badge below */}
              <div className="mt-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                <span>{deviceWidth} × {deviceHeight} px</span>
                <span>•</span>
                <span className="text-[#D4AF37] font-semibold">{selectedDevice.name}</span>
                {isLandscape && <span className="text-emerald-400 font-bold">(Paysage)</span>}
              </div>
            </div>
          </main>

          {/* QR Code Modal to test on Real Smartphone */}
          {showQrModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="max-w-md w-full rounded-3xl bg-[#141A17] border-2 border-[#D4AF37]/50 p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/40 shadow-lg">
                  <Smartphone className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif-title font-bold text-2xl text-[#FDFBF7]">
                    Tester sur votre Vrai Téléphone
                  </h3>
                  <p className="text-xs text-[#D8CCC0]">
                    Scannez ce QR Code avec l&apos;appareil photo de votre smartphone pour ouvrir le site directement en conditions réelles :
                  </p>
                </div>

                {qrCodeDataUrl && (
                  <div className="p-4 rounded-2xl bg-white max-w-xs mx-auto shadow-xl border-4 border-[#D4AF37]/40">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code d'accès mobile"
                      className="w-full h-auto rounded-lg mx-auto"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-[#D4AF37] break-all select-all">
                  {tunnelUrl}
                </div>

                <p className="text-[11px] text-neutral-400">
                  💡 <em>Note : Lors de la 1ère visite sur le lien, cliquez sur le bouton bleu &quot;Click to Submit&quot; sur votre téléphone.</em>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
