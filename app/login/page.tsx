'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Award,
  Crown
} from 'lucide-react';
import { isEceEmail } from '@/lib/utils/auth-security';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user } = useAuth();
  const { addAdminLog } = useData();

  // Mode : 'login' ou 'signup'
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [promo, setPromo] = useState('ING3 (Promo 2027)');
  const [selectedTerroirs, setSelectedTerroirs] = useState<string[]>(['Savoie', 'Bourgogne']);

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Erreur lors de la connexion.');
    } else {
      setSuccessMsg('Connexion réussie ! Redirection...');
      addAdminLog(
        'Connexion Utilisateur',
        'auth',
        `Connexion de l'étudiant ${email}.`,
        { name: email, email }
      );
      setTimeout(() => {
        router.push(email.includes('jules') || email.includes('thomas') || email.includes('leonard') ? '/admin' : '/profil');
      }, 500);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!isEceEmail(email)) {
      setError('Vous devez utiliser votre adresse étudiante officielle ECE Paris (@edu.ece.fr ou @ece.fr).');
      return;
    }

    setLoading(true);

    const result = await signup({
      email,
      password,
      fullName,
      promo,
      favoriteTerroirs: selectedTerroirs,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Une erreur est survenue lors de la création du compte.');
    } else {
      setSuccessMsg('Compte étudiant créé avec succès ! Vous êtes connecté en tant que Visiteur.');
      addAdminLog(
        'Création de Compte Étudiant',
        'auth',
        `Nouvel étudiant inscrit : ${fullName} (${email}, promo ${promo}). Statut initial : Visiteur.`,
        { name: fullName, email }
      );
      setTimeout(() => {
        router.push('/adhesion');
      }, 1000);
    }
  };

  const handleQuickLogin = async (asType: 'jules' | 'thomas' | 'leonard') => {
    setLoading(true);
    setError('');
    if (asType === 'jules') {
      await login('jules.houry@edu.ece.fr', 'admin123');
      router.push('/admin');
    } else if (asType === 'thomas') {
      await login('thomas.petit@edu.ece.fr', 'admin123');
      router.push('/admin');
    } else {
      await login('leonard.brault@edu.ece.fr', 'admin123');
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 liquid-glass p-6 sm:p-9 rounded-3xl border border-white/90 shadow-2xl relative overflow-hidden bg-white/80">
        
        {/* Top Radial Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#14281D] to-[#264E3A] p-2.5 flex items-center justify-center border border-[#D4AF37]/40 shadow-md">
            <Image
              src="/logo.png"
              alt="ECE Terroir"
              width={42}
              height={42}
              className="object-contain filter brightness-110"
            />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#14281D]">
              Espace Compte Étudiant
            </h1>
            <p className="text-xs text-[#78716C]">
              Association Gastronomique • Campus ECE Paris
            </p>
          </div>
        </div>

        {/* 2-Tabs Selector */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F3EDE2] border border-[#EAE2D8] text-xs font-bold relative z-10">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-[#14281D] text-[#FAF7F2] shadow-md'
                : 'text-[#78716C] hover:text-[#14281D]'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === 'signup'
                ? 'bg-[#14281D] text-[#FAF7F2] shadow-md'
                : 'text-[#78716C] hover:text-[#14281D]'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1 : CONNEXION */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#14281D] block">
                Adresse Email Étudiante ECE Paris
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@edu.ece.fr"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] placeholder-[#A8A29E] outline-none shadow-inner"
                />
                <Mail className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#14281D] block">
                  Mot de Passe
                </label>
                <span className="text-[10px] text-[#78716C]">Min. 6 caractères</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] placeholder-[#A8A29E] outline-none shadow-inner"
                />
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl skeuo-btn-pine text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se Connecter à mon Compte'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>
        )}

        {/* TAB 2 : CRÉATION DE COMPTE (SIGN UP) */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 relative z-10">
            
            {/* Nom complet */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#14281D] block">
                Nom & Prénom
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Alexandre Dumas"
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] placeholder-[#A8A29E] outline-none shadow-inner"
                />
                <User className="w-4 h-4 text-[#78716C] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Email @edu.ece.fr */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#14281D] block">
                Email Étudiant Officiel ECE (@edu.ece.fr)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexandre.dumas@edu.ece.fr"
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] placeholder-[#A8A29E] outline-none shadow-inner"
                />
                <Mail className="w-4 h-4 text-[#78716C] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Mot de passe & Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#14281D] block">
                  Mot de Passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 car."
                  className="w-full px-3 py-2 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#14281D] block">
                  Confirmation
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer"
                  className="w-full px-3 py-2 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Promotion */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#14281D] block">
                Promotion / Filière
              </label>
              <select
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-white border border-[#EAE2D8] focus:border-[#D4AF37] text-xs text-[#1D1917] outline-none shadow-inner"
              >
                <option value="ING1 (Promo 2029)">ING1 (Promo 2029)</option>
                <option value="ING2 (Promo 2028)">ING2 (Promo 2028)</option>
                <option value="ING3 (Promo 2027)">ING3 (Promo 2027)</option>
                <option value="ING4 (Promo 2026)">ING4 (Promo 2026)</option>
                <option value="ING5 (Promo 2025)">ING5 (Promo 2025)</option>
                <option value="Alumni ECE">Alumni ECE Paris</option>
                <option value="Enseignant / Staff ECE">Enseignant / Staff ECE</option>
              </select>
            </div>

            {/* Notice Rôle Initial */}
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/40 text-[11px] text-[#5C554E] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#14281D]">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Statut à l&apos;inscription : Visiteur</span>
              </div>
              <p className="leading-tight text-[#78716C]">
                Votre compte sera créé en tant que Visiteur. Le Pass Épicurien et vos réductions (-15%) s&apos;activeront dès souscription et validation de votre cotisation 10€.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl skeuo-btn-pine text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
            >
              <span>{loading ? 'Création en cours...' : 'Créer mon Compte Épicurien'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>
        )}

        {/* Quick Access Bureau Admins */}
        <div className="pt-4 border-t border-[#EAE2D8] space-y-2 relative z-10">
          <span className="text-[10px] font-extrabold text-[#78716C] uppercase tracking-wider block text-center">
            👑 Accès Rapide Bureau Administrateurs (1 clic) :
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('jules')}
              className="p-2 rounded-2xl bg-white border border-[#D4AF37]/50 hover:border-[#14281D] text-[10px] font-bold text-[#14281D] shadow-sm hover:shadow transition-all flex flex-col items-center justify-center text-center gap-0.5"
            >
              <Crown className="w-3 h-3 text-[#D4AF37]" />
              <span>Jules (Président)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('thomas')}
              className="p-2 rounded-2xl bg-white border border-[#D4AF37]/50 hover:border-[#14281D] text-[10px] font-bold text-[#14281D] shadow-sm hover:shadow transition-all flex flex-col items-center justify-center text-center gap-0.5"
            >
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>Thomas (Tech)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('leonard')}
              className="p-2 rounded-2xl bg-white border border-[#D4AF37]/50 hover:border-[#14281D] text-[10px] font-bold text-[#14281D] shadow-sm hover:shadow transition-all flex flex-col items-center justify-center text-center gap-0.5"
            >
              <Award className="w-3 h-3 text-[#D4AF37]" />
              <span>Léonard (Bureau)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
