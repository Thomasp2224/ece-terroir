import { NextRequest, NextResponse } from 'next/server';
import { isEceEmail, normalizeEmail } from '@/lib/utils/auth-security';
import { supabase } from '@/lib/supabase/client';
import { getStoredUser } from '@/lib/utils/users-store';
import { saveResetCode } from '@/lib/utils/password-reset-store';
import { sendPasswordResetEmail } from '@/lib/email/mailer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `forgot-pwd:${ip}`,
      maxRequests: 5,
      windowMs: 60 * 1000, // 5 requests max per minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de demandes. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email } = body;
    const normalizedEmail = normalizeEmail(email || '');

    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, error: 'Veuillez saisir votre adresse email.' },
        { status: 400 }
      );
    }

    if (!isEceEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Veuillez utiliser votre adresse institutionnelle ECE Paris (@edu.ece.fr ou @ece.fr).' },
        { status: 400 }
      );
    }

    // 1. Vérifier si l'utilisateur existe
    let fullName = 'Étudiant ECE';
    let userExists = false;

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('email', normalizedEmail)
          .single();
        if (data && !error) {
          fullName = data.full_name || fullName;
          userExists = true;
        }
      }
    } catch (e) {}

    if (!userExists) {
      const stored = getStoredUser(normalizedEmail);
      if (stored) {
        fullName = stored.fullName || fullName;
        userExists = true;
      }
    }

    if (normalizedEmail === 'thomas.petit@edu.ece.fr') {
      fullName = 'Thomas Petit';
      userExists = true;
    }

    if (userExists) {
      // 2. Générer un code à 6 chiffres
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      saveResetCode(normalizedEmail, resetCode);

      // 3. Envoyer l'email
      await sendPasswordResetEmail({
        fullName,
        email: normalizedEmail,
        resetCode,
      });
    }

    // Réponse uniforme et neutre (Protection contre l'énumération d'utilisateurs OWASP)
    return NextResponse.json({
      success: true,
      message: `Si un compte est associé à l'adresse ${normalizedEmail}, un code de sécurité à 6 chiffres vous a été envoyé par email.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la demande de réinitialisation.' },
      { status: 500 }
    );
  }

}
