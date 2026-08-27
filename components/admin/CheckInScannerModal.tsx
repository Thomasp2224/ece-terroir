'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { EventItem, CheckInRecord, UserProfile } from '@/lib/types';
import { formatDateFrench, formatPrice } from '@/lib/utils';
import { getMemberMatricule } from '@/lib/utils/matricule';
import { 
  ShieldCheck, 
  X, 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Users, 
  Clock, 
  Download, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  UserCheck, 
  Trash2,
  Maximize2,
  Minimize2,
  Flame,
  Camera,
  Keyboard,
  RefreshCw,
  Flashlight,
  VideoOff
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Html5Qrcode } from 'html5-qrcode';

interface CheckInScannerModalProps {
  initialEventId?: string;
  onClose: () => void;
}

// Simple Web Audio API sound generator for instant feedback
function playSound(type: 'success' | 'warning' | 'error') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'success') {
      // Harmonic chime (A5 -> E6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } else if (type === 'warning') {
      // Two mid beeps
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(350, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Low buzzer error
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio might be blocked before first user interaction
  }
}

/**
 * Extracts student matricule or query string from QR Code payload
 * Supports: plain matricule, query params (?id=...), JSON payloads, and order strings
 */
function parseQrCodePayload(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();

  // If it's a URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const idParam = url.searchParams.get('id') || url.searchParams.get('matricule') || url.searchParams.get('code');
      if (idParam) return idParam;
      // Or last path segment
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) return segments[segments.length - 1];
    } catch {
      // fallback to plain string
    }
  }

  // If it's prefixed format (e.g. ECE-TERROIR-ORDER:CMD-2026-8941:...)
  if (trimmed.startsWith('ECE-TERROIR-ORDER:')) {
    const parts = trimmed.split(':');
    return parts[1] || trimmed;
  }

  // If it's JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      return parsed.matricule || parsed.id || parsed.code || trimmed;
    } catch {
      // fallback
    }
  }

  return trimmed;
}

export default function CheckInScannerModal({ initialEventId, onClose }: CheckInScannerModalProps) {
  const { events, users, checkIns, checkInMember, undoCheckIn, clearCheckInsForEvent } = useData();
  const { user: currentUser } = useAuth();

  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || events[0]?.id || 'evt-1');
  const [activeMode, setActiveMode] = useState<'camera' | 'keyboard' | 'manual'>('camera');
  const [scanQuery, setScanQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [recentScanResult, setRecentScanResult] = useState<{
    success: boolean;
    reason: 'ok' | 'warning_non_member' | 'already_checked_in' | 'not_found';
    message: string;
    record?: CheckInRecord;
    user?: UserProfile;
  } | null>(null);

  const [manualFilter, setManualFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimestamp = useRef<number>(0);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventCheckIns = checkIns.filter((c) => c.eventId === selectedEventId);

  // Core scan processor
  const processScan = useCallback((rawQuery: string) => {
    const cleanQuery = parseQrCodePayload(rawQuery);
    if (!cleanQuery || !currentEvent) return;

    const res = checkInMember(
      currentEvent.id,
      cleanQuery,
      currentUser?.fullName || 'Admin Guichet'
    );

    setRecentScanResult(res);
    setScanQuery('');

    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (res.reason === 'ok') navigator.vibrate([80]);
      else if (res.reason === 'already_checked_in') navigator.vibrate([150, 100, 150]);
      else navigator.vibrate([100, 50]);
    }

    // Play audio feedback
    if (soundEnabled) {
      if (res.reason === 'ok') playSound('success');
      else if (res.reason === 'warning_non_member') playSound('warning');
      else playSound('error');
    }
  }, [currentEvent, checkInMember, currentUser, soundEnabled]);

  // Handle manual / keyboard form submit
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scanQuery.trim()) return;
    processScan(scanQuery);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleManualCheckIn = (userToScan: UserProfile) => {
    if (!currentEvent) return;
    const mat = getMemberMatricule(userToScan);
    processScan(mat);
  };

  // Setup / Teardown Camera with html5-qrcode
  useEffect(() => {
    let isMounted = true;

    if (activeMode === 'camera') {
      setCameraError(null);
      
      const startScanner = async () => {
        try {
          // Stop previous instance if exists
          if (qrScannerRef.current) {
            try {
              if (qrScannerRef.current.isScanning) {
                await qrScannerRef.current.stop();
              }
            } catch (e) {
              console.warn('Error stopping previous scanner:', e);
            }
          }

          const scannerId = 'reader-camera-stream';
          const element = document.getElementById(scannerId);
          if (!element) return;

          const scanner = new Html5Qrcode(scannerId);
          qrScannerRef.current = scanner;

          const config = {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          };

          await scanner.start(
            { facingMode: cameraFacingMode },
            config,
            (decodedText) => {
              // Debounce 1.8s
              const now = Date.now();
              if (now - lastScanTimestamp.current > 1800) {
                lastScanTimestamp.current = now;
                processScan(decodedText);
              }
            },
            () => {
              // Ignore standard frame scan errors
            }
          );

          if (isMounted) {
            setIsCameraActive(true);
            setCameraError(null);
          }
        } catch (err: unknown) {
          console.error('Erreur initialisation caméra:', err);
          if (isMounted) {
            setIsCameraActive(false);
            setCameraError(
              'Impossible d\'accéder à la caméra. Vérifiez les autorisations du navigateur ou utilisez la saisie manuelle.'
            );
          }
        }
      };

      // Slight delay to ensure DOM element is mounted
      const timer = setTimeout(startScanner, 150);
      return () => {
        isMounted = false;
        clearTimeout(timer);
        if (qrScannerRef.current) {
          if (qrScannerRef.current.isScanning) {
            qrScannerRef.current.stop().catch(() => {});
          }
        }
      };
    } else {
      // Stop scanner if switching to keyboard or manual mode
      if (qrScannerRef.current) {
        if (qrScannerRef.current.isScanning) {
          qrScannerRef.current.stop().catch(() => {});
        }
      }
      setIsCameraActive(false);
      if (activeMode === 'keyboard') {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [activeMode, cameraFacingMode, processScan]);

  // Export Check-in sheet to Excel (.xlsx)
  const handleExportCheckInsExcel = () => {
    if (!currentEvent) return;
    const records = eventCheckIns.map((c, idx) => ({
      'N°': idx + 1,
      'Date & Heure': new Date(c.checkedInAt).toLocaleString('fr-FR'),
      'Matricule Adhérent': c.userMatricule,
      'Nom & Prénom': c.userName,
      'Promotion ECE': c.userPromo || 'Campus ECE Paris',
      'Email': c.userEmail,
      'Statut Adhésion': c.isMember ? 'Adhérent Pass Épicurien' : 'Visiteur Non-Adhérent',
      'Guichetier (Contrôlé par)': c.checkedInBy,
      'Notes': c.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Émargement Soirée');

    const fileName = `Emargement_Soiree_${currentEvent.slug || currentEvent.id}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Filtered members for manual search list
  const filteredUsers = users.filter((u) => {
    if (!manualFilter.trim()) return false;
    const q = manualFilter.toLowerCase();
    const mat = getMemberMatricule(u).toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      mat.includes(q) ||
      (u.promo && u.promo.toLowerCase().includes(q))
    );
  });

  const capacity = currentEvent?.capacity || 60;
  const attendanceCount = eventCheckIns.length;
  const attendanceRate = Math.min(100, Math.round((attendanceCount / capacity) * 100));

  return (
    <div className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-hidden ${isFullscreen ? 'p-0 sm:p-0' : ''}`}>
      <div className={`w-full max-w-7xl mx-auto bg-[#14281D] text-[#FDFBF7] rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col flex-1 overflow-hidden animate-in zoom-in-95 duration-200 ${isFullscreen ? 'h-full rounded-none border-0 max-w-none' : 'max-h-[96vh]'}`}>
        
        {/* ======================================================== */}
        {/* TOP BAR : HEADER, EVENT SELECTOR & CONTROLS             */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-[#0E1C14] border-b border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center shadow-lg shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#58111A] text-[10px] font-extrabold uppercase tracking-wide">
                  Mode Guichetier En Direct
                </span>
                <span className="text-xs text-[#D8CCC0]">Scan Caméra & Émargement Soirées</span>
              </div>
              <h2 className="font-serif-title font-bold text-base sm:text-xl text-[#FDFBF7]">
                Pointage des Entrées ECE Terroir
              </h2>
            </div>
          </div>

          {/* Event Selector & Audio / Fullscreen controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setRecentScanResult(null);
              }}
              className="px-3 py-2 rounded-xl bg-[#14281D] text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37] shadow-sm max-w-xs truncate"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({formatDateFrench(evt.startDate)})
                </option>
              ))}
            </select>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled ? 'bg-[#58111A] text-[#D4AF37] border-[#D4AF37]/40' : 'bg-black/30 text-gray-400 border-white/10'
              }`}
              title={soundEnabled ? 'Son activé' : 'Son coupé'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-[#D8CCC0] hover:text-white border border-white/10 transition-colors"
              title={isFullscreen ? 'Quitter plein écran' : 'Mode Plein Écran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/40 hover:bg-red-600/80 text-white transition-colors border border-white/20"
              title="Fermer le guichet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BODY : 2-COLUMN SCANNER & LIVE ATTENDANCE DASHBOARD      */}
        {/* ======================================================== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 overflow-y-auto">
          
          {/* LEFT COLUMN: SCANNER INPUT & LIVE RESULT BANNER (7 COLS) */}
          <div className="lg:col-span-7 space-y-5 flex flex-col justify-start">
            
            {/* Event Summary & Live Gauge */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0E1C14] border border-[#D4AF37]/30 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#D8CCC0]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{currentEvent?.location || 'Foyer des Élèves'}</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{currentEvent ? formatDateFrench(currentEvent.startDate) : ''}</span>
                  </div>
                  <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#FDFBF7]">
                    {currentEvent?.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#D8CCC0] uppercase font-bold tracking-wider block">
                    Présents / Jauge Salle :
                  </span>
                  <p className="font-serif-title font-extrabold text-2xl text-[#D4AF37]">
                    {attendanceCount} <span className="text-sm font-normal text-[#D8CCC0]">/ {capacity}</span>
                  </p>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-green-500 transition-all duration-500 shadow-lg"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#D8CCC0] font-mono">
                  <span>Taux d&apos;affluence : {attendanceRate}%</span>
                  <span>{Math.max(0, capacity - attendanceCount)} places restantes</span>
                </div>
              </div>
            </div>

            {/* SCANNER MODE SELECTOR TABS */}
            <div className="flex items-center gap-2 bg-[#0E1C14] p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveMode('camera')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'camera'
                    ? 'bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md'
                    : 'text-[#D8CCC0] hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Caméra Directe</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('keyboard')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'keyboard'
                    ? 'bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md'
                    : 'text-[#D8CCC0] hover:text-white'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                <span>Clavier / Douchette</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('manual')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'manual'
                    ? 'bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md'
                    : 'text-[#D8CCC0] hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Recherche Manuelle</span>
              </button>
            </div>

            {/* MODE 1: LIVE CAMERA SCANNER */}
            {activeMode === 'camera' && (
              <div className="space-y-3">
                <div className="relative w-full rounded-3xl overflow-hidden bg-black border-2 border-[#D4AF37]/60 shadow-2xl flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px]">
                  
                  {/* html5-qrcode video target */}
                  <div id="reader-camera-stream" className="w-full h-full min-h-[280px] sm:min-h-[320px] object-cover" />

                  {/* Golden Target Brackets & Animated Laser Overlay */}
                  {isCameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative w-52 h-52 sm:w-64 sm:h-64 border-2 border-dashed border-[#D4AF37]/80 rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.3)] overflow-hidden">
                        {/* Laser Beam */}
                        <div 
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_15px_#D4AF37] animate-pulse"
                          style={{
                            animation: 'laserSweep 2s ease-in-out infinite alternate',
                          }}
                        />
                        {/* Corner Gold Brackets */}
                        <div className="absolute top-2 left-2 w-5 h-5 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-lg" />
                        <div className="absolute top-2 right-2 w-5 h-5 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-lg" />
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-lg" />
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-4 border-r-4 border-[#D4AF37] rounded-br-lg" />
                      </div>
                    </div>
                  )}

                  {/* Camera Controls Overlay (Switch camera) */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={() => setCameraFacingMode(cameraFacingMode === 'environment' ? 'user' : 'environment')}
                      className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-[#D4AF37] border border-[#D4AF37]/50 backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
                      title="Changer de caméra"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{cameraFacingMode === 'environment' ? 'Caméra Arrière' : 'Caméra Avant'}</span>
                    </button>
                  </div>

                  {/* Camera Error Display */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <VideoOff className="w-10 h-10 text-amber-400 animate-pulse" />
                      <h4 className="font-serif-title font-bold text-base text-white">Accès Caméra Requis</h4>
                      <p className="text-xs text-[#D8CCC0] max-w-sm leading-relaxed">{cameraError}</p>
                      <button
                        onClick={() => setActiveMode('keyboard')}
                        className="px-4 py-2 rounded-xl bg-[#58111A] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 hover:bg-[#722F37]"
                      >
                        Basculer en saisie manuelle &rarr;
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#D8CCC0] px-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Pointez la caméra vers le QR Code du Pass Épicurien ou du Billet
                  </span>
                  <span className="text-[#D4AF37] font-mono font-semibold">Détection &lt; 300ms</span>
                </div>
              </div>
            )}

            {/* MODE 2: KEYBOARD / USB BARCODE SCANNER */}
            {activeMode === 'keyboard' && (
              <form onSubmit={handleScanSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-[#D8CCC0] uppercase tracking-wider">
                  Saisie Rapide ou Douchette Optique USB :
                </label>
                
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Scanner le QR Code ou taper un matricule (ex: ECE-TERR-2026-4580)..."
                      value={scanQuery}
                      onChange={(e) => setScanQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0E1C14] border-2 border-[#D4AF37] text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3.5 rounded-2xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs sm:text-sm border border-[#D4AF37]/50 shadow-xl transition-all flex items-center gap-2 shrink-0 hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: MANUAL SEARCH & CHECK-IN */}
            {activeMode === 'manual' && (
              <div className="p-4 rounded-3xl bg-[#0E1C14] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#D8CCC0] uppercase tracking-wider block">
                  Recherche manuelle par nom / email / matricule :
                </span>
                <input
                  type="text"
                  placeholder="Tapez un nom (ex: Jules, Léonard, Emma, Thomas)..."
                  value={manualFilter}
                  onChange={(e) => setManualFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14281D] border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                />

                {filteredUsers.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {filteredUsers.map((u) => {
                      const isAlreadyChecked = eventCheckIns.some((c) => c.userId === u.id);
                      return (
                        <div
                          key={u.id}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{u.fullName}</span>
                            <span className="text-[11px] text-[#D8CCC0]">{u.promo || 'ECE'} • {getMemberMatricule(u)}</span>
                          </div>

                          <button
                            onClick={() => handleManualCheckIn(u)}
                            disabled={isAlreadyChecked}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isAlreadyChecked
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-[#58111A] text-[#D4AF37] hover:bg-[#722F37]'
                            }`}
                          >
                            {isAlreadyChecked ? 'Déjà émargé' : 'Émarger'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Tapez les premières lettres du nom pour afficher les résultats.</p>
                )}
              </div>
            )}

            {/* LIVE SCAN RESULT CARD */}
            {recentScanResult && (
              <div className={`p-5 rounded-3xl border-2 transition-all shadow-2xl animate-in zoom-in-95 duration-200 ${
                recentScanResult.reason === 'ok'
                  ? 'bg-green-950/50 border-green-400 text-green-100'
                  : recentScanResult.reason === 'already_checked_in'
                  ? 'bg-red-950/50 border-red-500 text-red-100'
                  : recentScanResult.reason === 'warning_non_member'
                  ? 'bg-amber-950/50 border-amber-400 text-amber-100'
                  : 'bg-slate-900 border-slate-500 text-slate-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                    recentScanResult.reason === 'ok'
                      ? 'bg-green-600'
                      : recentScanResult.reason === 'already_checked_in'
                      ? 'bg-red-600 animate-bounce'
                      : recentScanResult.reason === 'warning_non_member'
                      ? 'bg-amber-500'
                      : 'bg-slate-600'
                  }`}>
                    {recentScanResult.reason === 'ok' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : recentScanResult.reason === 'already_checked_in' ? (
                      <XCircle className="w-7 h-7" />
                    ) : recentScanResult.reason === 'warning_non_member' ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <Search className="w-7 h-7" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        recentScanResult.reason === 'ok'
                          ? 'bg-green-400 text-green-950'
                          : recentScanResult.reason === 'already_checked_in'
                          ? 'bg-red-500 text-white'
                          : recentScanResult.reason === 'warning_non_member'
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-slate-500 text-white'
                      }`}>
                        {recentScanResult.reason === 'ok'
                          ? '✓ Entrée Validée'
                          : recentScanResult.reason === 'already_checked_in'
                          ? '⛔ DOUBLON REFUSÉ'
                          : recentScanResult.reason === 'warning_non_member'
                          ? '⚠️ Tarif Non-Adhérent'
                          : '✕ Non trouvé'}
                      </span>

                      {recentScanResult.user && (
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">
                          {getMemberMatricule(recentScanResult.user)}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-title font-extrabold text-lg text-white truncate">
                      {recentScanResult.user?.fullName || 'Contrôle'}
                    </h4>

                    <p className="text-xs leading-relaxed font-medium">
                      {recentScanResult.message}
                    </p>

                    {recentScanResult.user && (
                      <div className="pt-1 text-[11px] flex flex-wrap items-center gap-2 text-[#D8CCC0]">
                        <span>Promo : <strong>{recentScanResult.user.promo || 'ECE Paris'}</strong></span>
                        <span>•</span>
                        <span>Email : {recentScanResult.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIVE ATTENDANCE LOGS & EXPORT (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="p-4 rounded-3xl bg-[#0E1C14] border border-[#D4AF37]/30 shadow-lg flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif-title font-bold text-sm text-[#FDFBF7]">
                    Historique Émargement ({eventCheckIns.length})
                  </h4>
                </div>

                <button
                  onClick={handleExportCheckInsExcel}
                  className="px-3 py-1.5 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-sm transition-all flex items-center gap-1.5"
                  title="Télécharger la liste des présents en Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel</span>
                </button>
              </div>

              {/* List of checked-in people */}
              <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 max-h-[380px]">
                {eventCheckIns.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-2">
                    <Users className="w-10 h-10 text-gray-600" />
                    <p className="text-xs">Aucun participant émargé pour l&apos;instant.</p>
                    <p className="text-[11px] text-gray-500">Scannez un pass ou pointez un nom pour commencer.</p>
                  </div>
                ) : (
                  eventCheckIns.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#14281D] border border-white/10 hover:border-[#D4AF37]/40 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.isMember ? 'bg-green-400' : 'bg-amber-400'}`} />
                          <span className="font-bold text-[#FDFBF7] truncate">{item.userName}</span>
                          <span className="text-[10px] font-mono text-[#D4AF37]">{item.userMatricule}</span>
                        </div>
                        <div className="text-[10px] text-[#D8CCC0] flex items-center gap-2">
                          <span>{new Date(item.checkedInAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          <span>•</span>
                          <span>Par {item.checkedInBy}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Annuler l'émargement de ${item.userName} ?`)) {
                            undoCheckIn(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-900/50 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                        title="Annuler cet émargement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom reset actions */}
              {eventCheckIns.length > 0 && (
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#D8CCC0]">
                  <span>Total : {eventCheckIns.length} entrées validées</span>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment réinitialiser toutes les entrées de cet événement ?')) {
                        clearCheckInsForEvent(selectedEventId);
                      }
                    }}
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
