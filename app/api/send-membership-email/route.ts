import { NextRequest, NextResponse } from 'next/server';
import { sendMembershipEmail, generateMembershipEmailHtml, MembershipEmailParams } from '@/lib/email/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const member = (body.member || {}) as Partial<MembershipEmailParams>;

    const emailData: MembershipEmailParams = {
      fullName: member.fullName || 'Étudiant ECE Paris',
      email: member.email || 'etudiant@edu.ece.fr',
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

export async function GET() {
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
    },
  });
}
