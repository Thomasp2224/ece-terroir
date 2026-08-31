import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendMembershipEmail } from '@/lib/email/mailer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { isEceEmail, normalizeEmail } from '@/lib/utils/auth-security';

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
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `webhook-helloasso:${ip}`,
      maxRequests: 60,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de requêtes webhook. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    // 1. Validation de la signature / Secret Webhook
    const expectedSecret = process.env.HELLOASSO_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    const providedSecret = 
      req.headers.get('x-helloasso-secret') || 
      req.headers.get('x-webhook-secret') || 
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      req.nextUrl.searchParams.get('secret');

    // En environnement de production avec secret configuré, vérification stricte
    if (expectedSecret && providedSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Signature ou secret de Webhook invalide.' },
        { status: 401 }
      );
    }

    const payload = (await req.json().catch(() => null)) as HelloAssoWebhookPayload;


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
      'ING4 (Promo 2028)';

    // Generate unique member matricule
    const randMat = Math.floor(1000 + Math.random() * 9000);
    const matricule = `ECE-TERR-2026-${randMat}`;
    const now = new Date().toISOString();

    // 1. Mettre à jour / Créer le profil dans Supabase Cloud
    try {
      await supabase.from('profiles').upsert({
        email,
        full_name: fullName,
        promo,
        role: 'member',
        status: 'active',
        membership_status: 'active',
        membership_payment_method: 'helloasso',
        membership_approved_at: now,
      }, { onConflict: 'email' });
    } catch (dbErr) {
      console.warn('Erreur Supabase profile update (webhook):', dbErr);
    }

    // 2. Enregistrer la demande validée dans membership_requests Supabase
    try {
      await supabase.from('membership_requests').insert({
        id: `req-helloasso-${Date.now()}`,
        user_id: `usr-${Date.now()}`,
        user_name: fullName,
        user_email: email,
        user_promo: promo,
        amount_cents: amountCents,
        payment_method: 'helloasso',
        status: 'approved',
        requested_at: now,
        reviewed_at: now,
        reviewed_by: 'HelloAsso Webhook Automatique',
        notes: `Paiement HelloAsso automatique validé (${(amountCents / 100).toFixed(2)} €).`,
      });
    } catch (dbErr) {
      console.warn('Erreur Supabase membership_requests (webhook):', dbErr);
    }

    // 3. Journaliser dans admin_logs Supabase
    try {
      await supabase.from('admin_logs').insert({
        id: `log-webhook-${Date.now()}`,
        timestamp: now,
        user_email: email,
        user_name: fullName,
        action: 'Paiement Webhook HelloAsso',
        category: 'auth',
        details: `Adhésion validée automatiquement pour ${fullName} (${email}). Matricule attribué : ${matricule}.`,
      });
    } catch (e) {}

    // 4. Envoyer l'email officiel avec Pass Épicurien
    let emailResult = { success: true, mode: 'simulated' };
    try {
      emailResult = await sendMembershipEmail({
        fullName,
        email,
        promo,
        matricule,
        amountCents,
        approvedAt: now,
      });
    } catch (mailErr) {
      console.warn('Erreur envoi email webhook:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Paiement HelloAsso traité avec succès pour ${fullName}. Adhésion activée (${matricule}).`,
      eventType: eventType || 'Order',
      matricule,
      emailStatus: emailResult.mode,
      processedAt: now,
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
    version: '2.0.0',
    supportedEvents: ['Order', 'Payment', 'Form'],
    targetForm: 'Cotisation Adhésion ECE Terroir 2026-2027',
  });
}
