import { NextRequest, NextResponse } from 'next/server';

interface HelloAssoWebhookPayload {
  eventType: 'Order' | 'Payment' | 'Form';
  data: {
    id?: number | string;
    payer?: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth?: string;
    };
    order?: {
      id: number | string;
      formSlug?: string;
      amount?: number;
      items?: Array<{
        name: string;
        priceCategory?: string;
        amount: number;
        customFields?: Record<string, string>;
      }>;
    };
    amount?: number; // en centimes (ex: 1000 = 10.00 €)
    date?: string;
    customFields?: Record<string, string>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as HelloAssoWebhookPayload;

    if (!payload || !payload.data) {
      return NextResponse.json(
        { success: false, error: 'Payload HelloAsso invalide ou manquant' },
        { status: 400 }
      );
    }

    const { data, eventType } = payload;
    const payer = data.payer || {
      firstName: 'Étudiant',
      lastName: 'ECE Paris',
      email: 'etudiant@edu.ece.fr',
    };

    const fullName = `${payer.firstName} ${payer.lastName}`.trim();
    const email = payer.email.toLowerCase().trim();
    const amountCents = data.amount || data.order?.amount || 1000;
    const promo =
      data.customFields?.promo ||
      data.order?.items?.[0]?.customFields?.promo ||
      'Ingé (Campus Eiffel 1)';

    // Generate unique member matricule
    const randMat = Math.floor(1000 + Math.random() * 9000);
    const matricule = `ECE-TERR-2026-${randMat}`;

    const memberData = {
      id: `usr-helloasso-${Date.now()}`,
      email,
      fullName,
      promo,
      role: 'member' as const,
      status: 'active' as const,
      membershipStatus: 'active' as const,
      membershipPaymentMethod: 'helloasso' as const,
      matricule,
      amountCents,
      membershipApprovedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Trigger internal welcome email dispatcher
    let emailStatus = 'dispatched';
    try {
      const emailRes = await fetch(new URL('/api/send-membership-email', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: memberData,
          sendRealEmail: false, // will log or use Resend if key exists
        }),
      });
      const emailResult = await emailRes.json();
      emailStatus = emailResult.success ? 'sent' : 'simulated';
    } catch (e) {
      console.warn('Notification email error (webhook):', e);
      emailStatus = 'simulation_logged';
    }

    return NextResponse.json({
      success: true,
      message: `Paiement HelloAsso traité avec succès pour ${fullName}. Adhésion activée (${matricule}).`,
      eventType: eventType || 'Order',
      matricule,
      member: memberData,
      emailStatus,
      processedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Erreur traitement Webhook HelloAsso:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'ECE Terroir — HelloAsso Webhook Gateway',
    status: 'online',
    version: '1.0.0',
    supportedEvents: ['Order', 'Payment', 'Form'],
    targetForm: 'Cotisation Adhésion ECE Terroir 2026-2027',
  });
}
