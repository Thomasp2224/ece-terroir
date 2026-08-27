import { NextRequest, NextResponse } from 'next/server';
import { generateMembershipEmailHtml, MembershipEmailData } from '@/lib/utils/email-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const member = (body.member || {}) as Partial<MembershipEmailData>;

    const emailData: MembershipEmailData = {
      fullName: member.fullName || 'Étudiant ECE Paris',
      email: member.email || 'etudiant@edu.ece.fr',
      promo: member.promo || 'Ingé (Promo 2027)',
      matricule: member.matricule || 'ECE-TERR-2026-4580',
      amountCents: member.amountCents || 1000,
      approvedAt: member.approvedAt || new Date().toISOString(),
    };

    const htmlContent = generateMembershipEmailHtml(emailData);

    // Check if RESEND_API_KEY is available
    const resendApiKey = process.env.RESEND_API_KEY;
    let dispatchStatus = 'simulated';

    if (resendApiKey && body.sendRealEmail) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'ECE Terroir <bienvenue@eceterroir.fr>',
            to: [emailData.email],
            subject: `🧀 Bienvenue chez ECE Terroir — Confirmation d'Adhésion (${emailData.matricule})`,
            html: htmlContent,
          }),
        });

        if (resendRes.ok) {
          dispatchStatus = 'sent_via_resend';
        } else {
          const errData = await resendRes.json();
          console.warn('Erreur API Resend:', errData);
          dispatchStatus = 'resend_error_fallback_simulated';
        }
      } catch (e) {
        console.error('Erreur dispatch Resend:', e);
        dispatchStatus = 'network_error_simulated';
      }
    }

    return NextResponse.json({
      success: true,
      dispatchStatus,
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
  // Preview mode: return rendered HTML directly for iframe inspection
  const sampleData: MembershipEmailData = {
    fullName: 'Léonard Brault',
    email: 'leonard.brault@edu.ece.fr',
    promo: 'Ingé 4 (Promo 2028)',
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
