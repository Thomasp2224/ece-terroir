import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, normalizeEmail } from '@/lib/utils/auth-security';
import { supabase } from '@/lib/supabase/client';
import { getStoredUser, saveStoredUser } from '@/lib/utils/users-store';
import { verifyResetCode, clearResetCode } from '@/lib/utils/password-reset-store';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `reset-pwd:${ip}`,
      maxRequests: 10,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de tentatives. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, code, newPassword } = body;
    const normalizedEmail = normalizeEmail(email || '');

    if (!normalizedEmail || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Veuillez renseigner tous les champs (email, code et nouveau mot de passe).' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // 1. Vérification du code de sécurité
    const checkResult = verifyResetCode(normalizedEmail, code);
    if (!checkResult.valid) {
      return NextResponse.json(
        { success: false, error: checkResult.error || 'Code de sécurité invalide ou expiré.' },
        { status: 400 }
      );
    }


    // 2. Hash du nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // 3. Mise à jour dans Supabase
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase
          .from('profiles')
          .update({
            password_hash: hashedPassword,
            last_login: new Date().toISOString(),
          })
          .eq('email', normalizedEmail);
      }
    } catch (e) {}

    // 4. Mise à jour dans le store mémoire
    const stored = getStoredUser(normalizedEmail);
    if (stored) {
      saveStoredUser({
        ...stored,
        passwordHash: hashedPassword,
        lastLogin: new Date().toISOString(),
      });
    }

    // 5. Nettoyage du code utilisé
    clearResetCode(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la réinitialisation du mot de passe.' },
      { status: 500 }
    );
  }
}
