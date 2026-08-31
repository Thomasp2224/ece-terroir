import { NextRequest, NextResponse } from 'next/server';
import { normalizeEmail, verifyPassword } from '@/lib/utils/auth-security';
import { UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { getStoredUser } from '@/lib/utils/users-store';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `login:${ip}`,
      maxRequests: 10,
      windowMs: 60 * 1000, // 10 attempts per minute per IP
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de tentatives de connexion. Veuillez réessayer dans ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    const normalizedEmail = normalizeEmail(email || '');


    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { success: false, error: 'Veuillez saisir votre adresse email et votre mot de passe.' },
        { status: 400 }
      );
    }

    // 1. Recherche dans Supabase si actif
    let foundUser: UserProfile | null = null;
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', normalizedEmail)
          .single();
        if (data && !error) {
          foundUser = {
            id: data.id,
            email: data.email,
            fullName: data.full_name,
            promo: data.promo,
            role: data.role,
            status: data.status,
            membershipStatus: data.membership_status,
            bio: data.bio,
            favoriteTerroirs: data.favorite_terroirs,
            createdAt: data.created_at,
            lastLogin: new Date().toISOString(),
          };
        }
      }
    } catch (e) {}

    // 2. Recherche dans le store partagé (utilisateurs inscrits + mock users)
    if (!foundUser) {
      const stored = getStoredUser(normalizedEmail);
      if (stored) {
        foundUser = {
          ...stored,
          lastLogin: new Date().toISOString(),
        };
      }
    }

    // Si l'utilisateur n'existe pas
    if (!foundUser) {
      return NextResponse.json(
        { success: false, error: 'Aucun compte associé à cette adresse email. Veuillez créer un compte.' },
        { status: 404 }
      );
    }

    // Vérification stricte du mot de passe
    const isPasswordValid = await verifyPassword(password, foundUser.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect. Veuillez réessayer.' },
        { status: 401 }
      );
    }

    // Vérification de compte suspendu
    if (foundUser.status === 'suspended' || foundUser.membershipStatus === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Ce compte a été suspendu par le Bureau ECE Terroir.' },
        { status: 403 }
      );
    }

    const { passwordHash: _, ...safeUser } = foundUser;

    return NextResponse.json({
      success: true,
      message: `Connexion réussie. Bienvenue, ${safeUser.fullName} !`,
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la connexion.' },
      { status: 500 }
    );
  }
}
