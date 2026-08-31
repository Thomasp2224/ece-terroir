import { NextRequest, NextResponse } from 'next/server';
import { sendMembershipEmail, generateMembershipEmailHtml, MembershipEmailParams } from '@/lib/email/mailer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { isEceEmail, normalizeEmail } from '@/lib/utils/auth-security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `send-membership-email:${ip}`,
      maxRequests: 10,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop d'envois d'emails. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const member = (body.member || {}) as Partial<MembershipEmailParams>;

    const email = normalizeEmail(member.email || '');
    if (!email || !isEceEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresse email destinataire invalide (doit être une adresse @edu.ece.fr ou @ece.fr).' },
        { status: 400 }
      );
    }

    const emailData: MembershipEmailParams = {
      fullName: (member.fullName || 'Étudiant ECE Paris').trim(),
      email,
      promo: member.promo || 'ING4 (Promo 2028)',
      matricule: member.matricule || 'ECE-TERR-2026-4580',
      amountCents: member.amountCents || 1000,
      approvedAt: member.approvedAt || new Date().toISOString(),
    };

    const sendResult = await sendMembershipEmail(emailData);
    const htmlContent = generateMembershipEmailHtml(emailData);

    return NextResponse.json({
      success: true,
      dispatchStatus: sendResult.mode,
      recipient: emailData.email,
      matricule: emailData.matricule,
      subject: `🧀 Bienvenue chez ECE Terroir — Confirmation d'Adhésion (${emailData.matricule})`,
      previewHtml: htmlContent,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sampleData: MembershipEmailParams = {
    fullName: 'Léonard Brault',
    email: 'leonard.brault@edu.ece.fr',
    promo: 'ING4 (Promo 2028)',
    matricule: 'ECE-TERR-2026-8941',
    amountCents: 1000,
    approvedAt: new Date().toISOString(),
  };

  const html = generateMembershipEmailHtml(sampleData);
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

