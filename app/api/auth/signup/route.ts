import { NextRequest, NextResponse } from 'next/server';
import { isEceEmail, normalizeEmail, hashPassword } from '@/lib/utils/auth-security';
import { UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { getStoredUser, saveStoredUser } from '@/lib/utils/users-store';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `signup:${ip}`,
      maxRequests: 5,
      windowMs: 60 * 1000, // max 5 accounts created per minute per IP
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de créations de compte. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password, fullName, promo, favoriteTerroirs } = body;


    const normalizedEmail = normalizeEmail(email || '');

    // 1. Validation de l'adresse email étudiante ECE
    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, error: 'Veuillez saisir votre adresse email étudiante.' },
        { status: 400 }
      );
    }

    if (!isEceEmail(normalizedEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Adresse non autorisée : Vous devez utiliser votre adresse officielle ECE Paris (@edu.ece.fr ou @ece.fr).' 
        },
        { status: 400 }
      );
    }

    // 2. Validation du mot de passe
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // 3. Validation du nom complet
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Veuillez renseigner votre nom et prénom.' },
        { status: 400 }
      );
    }

    // 4. Vérification d'unicité du compte (Protection contre l'écrasement de compte)
    const existingStored = getStoredUser(normalizedEmail);
    if (existingStored) {
      return NextResponse.json(
        { success: false, error: 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter.' },
        { status: 409 }
      );
    }

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data: existingSb } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (existingSb) {
          return NextResponse.json(
            { success: false, error: 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter.' },
            { status: 409 }
          );
        }
      }
    } catch (e) {}

    const hashedPassword = await hashPassword(password);

    // 5. Création du profil utilisateur (Rôle initial : VISITEUR)
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      fullName: fullName.trim(),
      promo: promo || 'ING3 (Promo 2027)',
      role: 'visitor', // TOUJOURS VISITEUR À LA CRÉATION
      status: 'active',
      membershipStatus: 'none', // PAS D'ADHÉSION PAR DÉFAUT
      bio: 'Étudiant à l\'ECE Paris, amateur des terroirs et gastronomie française.',
      favoriteTerroirs: favoriteTerroirs && favoriteTerroirs.length > 0 ? favoriteTerroirs : ['Savoie', 'Bourgogne', 'Jura'],
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Sauvegarder dans le store partagé
    saveStoredUser(newUser);

    // 6. Enregistrement optionnel sur Supabase si configuré
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { error: sbError } = await supabase.from('profiles').insert([
          {
            email: newUser.email,
            full_name: newUser.fullName,
            promo: newUser.promo,
            role: 'visitor',
            status: 'active',
            membership_status: 'none',
            favorite_terroirs: newUser.favoriteTerroirs,
          },
        ]);
        if (sbError) {
          console.warn('Supabase profile insertion notice:', sbError.message);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase non disponible, utilisation du stockage applicatif local.');
    }

    // Réponse sécurisée sans exposer le mot de passe
    const { passwordHash: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Compte étudiant créé avec succès ! Vous êtes actuellement connecté en tant que Visiteur.',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la création du compte.' },
      { status: 500 }
    );
  }
}
