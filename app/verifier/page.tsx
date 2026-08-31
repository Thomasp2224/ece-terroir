'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/lib/context/DataContext';
import { UserProfile } from '@/lib/types';
import { getMemberMatricule, getVerificationCode } from '@/lib/utils/matricule';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  FileSpreadsheet, 
  Check, 
  ArrowRight,
  AlertTriangle,
  Clock,
  Ban
} from 'lucide-react';

function VerifierContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const { users, membershipRequests } = useData();
  const [searchMatricule, setSearchMatricule] = useState(queryId);
  const [matchedMember, setMatchedMember] = useState<UserProfile | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('fr-FR'));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const performSearch = (mat: string) => {
    const cleanQuery = mat.trim().toLowerCase();
    if (!cleanQuery) {
      setMatchedMember(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    // Find in users list by exact matricule or ID
    const found = users.find((u) => {
      const userMatricule = getMemberMatricule(u).toLowerCase();
      const matchMatricule = userMatricule === cleanQuery;
      const matchId = u.id.toLowerCase() === cleanQuery;
      return matchMatricule || matchId;
    });

    setMatchedMember(found || null);
  };

  useEffect(() => {
    if (queryId) {
      setSearchMatricule(queryId);
      performSearch(queryId);
    }
  }, [queryId, users]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchMatricule);
  };


  const isSuspended = matchedMember?.status === 'suspended' || matchedMember?.membershipStatus === 'suspended';
  const isMember = matchedMember && (matchedMember.role === 'member' || matchedMember.role === 'admin' || matchedMember.membershipStatus === 'active') && !isSuspended;
  const isPending = matchedMember?.membershipStatus === 'pending' && !isSuspended;
  const isVisitor = matchedMember && !isMember && !isPending && !isSuspended;

  const matriculeCode = matchedMember ? getMemberMatricule(matchedMember) : '';
  const securityCode = matchedMember ? (isSuspended ? 'ACCÈS-RÉVOQUÉ-SUSPENDU' : getVerificationCode(matriculeCode)) : '';

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-bold uppercase tracking-wider border border-[#1B3B2B]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Système de Contrôle & Authentification Officiel
          </div>
          <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#58111A]">
            Vérification de Carte d&apos;Adhérent
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto">
            Portail de contrôle des QR Codes et matricules de l&apos;association ECE Terroir, synchronisé en direct avec le Registre Officiel du Pôle Trésorerie (Google Drive).
          </p>
        </div>

        {/* Search Bar for manual scan/input */}
        <form onSubmit={handleSearchSubmit} className="bg-[#FFFFFF] p-3.5 sm:p-4 rounded-3xl border border-[#EAE2D8] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Scanner un QR code ou matricule (ex: ECE-TERR-2026-4580)..."
              value={searchMatricule}
              onChange={(e) => setSearchMatricule(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A] font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold hover:bg-[#722F37] transition-all shadow-md shrink-0 text-center"
          >
            Vérifier le Pass
          </button>
        </form>

        {/* Result Card */}
        {matchedMember ? (
          <div className={`bg-[#FFFFFF] rounded-3xl border-2 ${
            isSuspended ? 'border-red-500' : isMember ? 'border-[#D4AF37]' : 'border-amber-400'
          } p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-200`}>
            {/* Top Status Banner */}
            {isSuspended ? (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Ban className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-red-950">
                      ⛔ Compte Suspendu / Pass Révoqué
                    </h3>
                    <span className="text-xs text-red-800">
                      Ce profil est temporairement suspendu par le Bureau. Aucun tarif réduit ne peut être appliqué.
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-xs font-bold text-red-950">
                  {currentTime} (En direct)
                </div>
              </div>
            ) : isMember ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-green-950">
                      Adhésion Officielle Validée & Conforme
                    </h3>
                    <span className="text-xs text-green-800">
                      Cotisation 2026-2027 active • Droit aux tarifs réduits dégustations & soirées
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-green-800 font-mono block">Horodatage de contrôle :</span>
                  <span className="text-xs font-bold text-green-950 font-mono">{currentTime} (En direct)</span>
                </div>
              </div>
            ) : isPending ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-amber-950">
                      Cotisation en Attente de Validation
                    </h3>
                    <span className="text-xs text-amber-800">
                      Demande d&apos;adhésion en cours de traitement par le trésorier.
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-xs font-bold text-amber-950">
                  {currentTime}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-slate-950">
                      Compte Visiteur Non-Adhérent
                    </h3>
                    <span className="text-xs text-slate-700">
                      Aucune cotisation annuelle enregistrée pour 2026-2027.
                    </span>
                  </div>
                </div>
                <Link
                  href="/adhesion"
                  className="px-3 py-1.5 rounded-xl bg-[#58111A] text-white text-xs font-bold shrink-0"
                >
                  Adhérer (10€)
                </Link>
              </div>
            )}

            {/* Member Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Titulaire Adhérent
                </span>
                <h4 className="font-serif-title font-extrabold text-lg text-[#1D1917]">
                  {matchedMember.fullName}
                </h4>
                <p className="text-xs text-[#78716C]">
                  {matchedMember.email ? matchedMember.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : ''}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Matricule Officiel
                </span>
                <p className="font-mono font-extrabold text-base text-[#58111A]">
                  {matriculeCode}
                </p>
                <p className="text-xs text-[#78716C]">{matchedMember.promo || 'Campus ECE Paris'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] space-y-1">
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Statut & Rôle
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isSuspended
                      ? 'bg-red-600 text-white'
                      : matchedMember.role === 'admin'
                      ? 'bg-[#D4AF37] text-[#58111A]'
                      : isMember
                      ? 'bg-[#1B3B2B] text-[#D4AF37]'
                      : 'bg-slate-300 text-slate-800'
                  }`}>
                    {isSuspended ? '⛔ Compte Suspendu' : matchedMember.role === 'admin' ? '🛡️ Bureau Exécutif' : isMember ? '🍷 Membre Adhérent' : '👤 Visiteur'}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold block pt-0.5 ${isMember ? 'text-green-700' : isSuspended ? 'text-red-600' : 'text-slate-600'}`}>
                  {isMember ? '✓ Cotisation 10,00 € Encaissée' : isSuspended ? '✕ Droits Révoqués' : '✕ Pas de cotisation active'}
                </span>
              </div>
            </div>

            {/* Google Drive Registry Certificate */}
            <div className="p-5 rounded-2xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                    Registre Pôle Trésorerie ECE Terroir
                  </span>
                  <p className="text-xs font-semibold text-[#FDFBF7] break-all">
                    Enregistré dans le Drive Officiel : <code className="text-[11px] text-[#D4AF37] font-mono break-all">PÔLE TRÉSORERIE/Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx</code>
                  </p>
                  <p className="text-[11px] text-[#D8CCC0]">
                    Code de conformité : <span className="font-mono text-[#D4AF37]">{securityCode}</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  isSuspended ? 'bg-red-600 text-white' : isMember ? 'bg-[#D4AF37] text-[#58111A]' : 'bg-slate-600 text-white'
                }`}>
                  {isSuspended ? 'ACCÈS SUSPENDU' : isMember ? 'Valide jusqu\'au 31/08/2027' : 'NON ADHÉRENT'}
                </span>
              </div>
            </div>

            {/* Active Perks summary if active member */}
            {isMember && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider block">
                  Droits & Avantages Actifs :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EAE2D8] flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                    <span>Tarif réduit sur toutes les dégustations</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EAE2D8] flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                    <span>-15% permanents sur la boutique</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EAE2D8] flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                    <span>Accès prioritaire aux meules AOP</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : hasSearched ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border-2 border-red-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-title font-bold text-xl text-[#1D1917]">
                Matricule ou Adhérent Non Trouvé
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto">
                Ce matricule <strong>« {searchMatricule} »</strong> n&apos;existe pas ou le compte a été supprimé de la base de données.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/adhesion"
                className="px-5 py-2.5 rounded-2xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold hover:bg-[#722F37] transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Prendre une cotisation (10€)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* Quick Demo Shortcuts */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm space-y-3">
          <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider block">
            ⚡ Matricules Adhérents de Démonstration à Tester :
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {users.slice(0, 5).map((u) => {
              const mat = getMemberMatricule(u);
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setSearchMatricule(mat);
                    performSearch(mat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 ${
                    u.status === 'suspended'
                      ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                      : u.role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200'
                      : 'bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] border-[#EAE2D8]'
                  }`}
                >
                  <span>{mat}</span>
                  <span className="text-[11px] text-[#78716C] font-sans">
                    ({u.fullName.split(' ')[0]} - {u.status === 'suspended' ? 'Suspendu' : u.role})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifierPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#78716C]">Chargement du module de vérification...</div>}>
      <VerifierContent />
    </Suspense>
  );
}
