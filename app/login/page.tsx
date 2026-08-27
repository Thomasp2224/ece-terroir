'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { UserRole } from '@/lib/types';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, AlertCircle, User, Clock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { addAdminLog } = useData();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, fullName || (role === 'visitor' ? 'Visiteur' : 'Étudiant ECE'), role);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Une erreur est survenue.');
    } else {
      addAdminLog(
        role === 'admin' ? 'Connexion Admin' : role === 'member' ? 'Connexion Membre' : 'Connexion Visiteur',
        'auth',
        `Connexion réussie pour ${fullName || email} avec le rôle ${role}.`,
        { name: fullName || email, email }
      );
      router.push(role === 'admin' ? '/admin' : '/profil');
    }
  };

  const handleQuickLogin = async (asType: 'admin' | 'member' | 'visitor' | 'pending_visitor') => {
    setLoading(true);
    if (asType === 'admin') {
      await login('jules.houry@edu.ece.fr', 'Jules Houry (Président)', 'admin', 'Ingé 4 (Promo 2028)');
      addAdminLog(
        'Connexion Rapide Admin',
        'auth',
        'Connexion du Président Jules Houry au Dashboard d\'administration.',
        { name: 'Jules Houry (Président)', email: 'jules.houry@edu.ece.fr' }
      );
      router.push('/admin');
    } else if (asType === 'member') {
      await login('leonard.brault@edu.ece.fr', 'Léonard Brault', 'member', 'Ingé 4 (Promo 2028)');
      addAdminLog(
        'Connexion Rapide Membre',
        'auth',
        'Connexion membre de Léonard Brault.',
        { name: 'Léonard Brault', email: 'leonard.brault@edu.ece.fr' }
      );
      router.push('/profil');
    } else if (asType === 'pending_visitor') {
      await login('maxime.lefebvre@edu.ece.fr', 'Maxime Lefebvre', 'visitor', 'Ingé 2 (Promo 2028)');
      addAdminLog(
        'Connexion Visiteur Cotisation en Attente',
        'auth',
        'Connexion de Maxime Lefebvre (demande d\'adhésion en cours).',
        { name: 'Maxime Lefebvre', email: 'maxime.lefebvre@edu.ece.fr' }
      );
      router.push('/profil');
    } else {
      await login('chloe.moreau@edu.ece.fr', 'Chloé Moreau', 'visitor', 'Ingé 1 (Promo 2029)');
      addAdminLog(
        'Connexion Visiteur Non-Membre',
        'auth',
        'Connexion visiteur de Chloé Moreau.',
        { name: 'Chloé Moreau', email: 'chloe.moreau@edu.ece.fr' }
      );
      router.push('/profil');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-md w-full space-y-8 bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#EAE2D8] shadow-xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative w-28 sm:w-32 mx-auto flex items-center justify-center">
            <img
              src="/logo_eceterroir.png"
              alt="Logo ECE Terroir"
              className="w-full h-auto object-contain filter drop-shadow-md"
            />
          </div>
          <h2 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#58111A]">
            Espace Compte ECE Terroir
          </h2>
          <p className="text-xs text-[#78716C]">
            Connectez-vous ou créez votre profil pour accéder aux événements, à la boutique et à votre adhésion.
          </p>
        </div>

        {/* Adhesion Promotion Banner */}
        <div className="p-3.5 rounded-2xl bg-[#58111A]/5 border border-[#58111A]/20 flex items-center justify-between text-xs text-[#58111A]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Pas encore adhérent ?</span>
          </div>
          <Link href="/adhesion" className="font-bold underline hover:text-[#722F37]">
            Prendre ma cotisation (10€) &rarr;
          </Link>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1.5">
              Nom complet :
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Maxime Lefebvre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1.5">
              Adresse Email :
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="prenom.nom@edu.ece.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1.5">
              Type de profil / Rôle :
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setRole('visitor')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                  role === 'visitor'
                    ? 'border-[#58111A] bg-[#58111A] text-[#FDFBF7]'
                    : 'border-[#EAE2D8] bg-[#F6F1EA] text-[#78716C]'
                }`}
              >
                👤 Visiteur
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                  role === 'member'
                    ? 'border-[#58111A] bg-[#58111A] text-[#FDFBF7]'
                    : 'border-[#EAE2D8] bg-[#F6F1EA] text-[#78716C]'
                }`}
              >
                🍷 Membre
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                  role === 'admin'
                    ? 'border-[#58111A] bg-[#58111A] text-[#FDFBF7]'
                    : 'border-[#EAE2D8] bg-[#F6F1EA] text-[#78716C]'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#58111A] text-[#FDFBF7] font-semibold text-xs hover:bg-[#722F37] transition-all shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/30"
          >
            <span>{loading ? 'Connexion en cours...' : 'Accéder à mon Espace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="pt-4 border-t border-[#EAE2D8] space-y-3 text-center">
          <p className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
            ⚡ Accès Rapides Démo (Tester les rôles)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('visitor')}
              className="p-2 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#1D1917] font-bold text-xs border border-[#EAE2D8] transition-colors flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-[#78716C]" />
              <span>Visiteur (Chloé)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('pending_visitor')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>En attente (Maxime)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('member')}
              className="p-2 rounded-xl bg-[#1B3B2B]/10 hover:bg-[#1B3B2B]/20 text-[#1B3B2B] font-bold text-xs border border-[#1B3B2B]/30 transition-colors"
            >
              🍷 Membre (Léonard)
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-xl bg-[#58111A]/10 hover:bg-[#58111A]/20 text-[#58111A] font-bold text-xs border border-[#58111A]/30 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin (Jules)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
