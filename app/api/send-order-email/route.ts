import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail, OrderEmailParams } from '@/lib/email/mailer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { isEceEmail, normalizeEmail } from '@/lib/utils/auth-security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `send-order-email:${ip}`,
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
    const order = body as OrderEmailParams;

    const email = normalizeEmail(order.userEmail || '');
    if (!email || !isEceEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresse email destinataire invalide (doit être @edu.ece.fr ou @ece.fr).' },
        { status: 400 }
      );
    }

    if (!order.orderNumber || typeof order.orderNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Numéro de commande manquant ou invalide.' },
        { status: 400 }
      );
    }

    const res = await sendOrderEmail({
      orderNumber: order.orderNumber.trim(),
      userName: (order.userName || 'Adhérent ECE Terroir').trim(),
      userEmail: email,
      items: Array.isArray(order.items) ? order.items : [],
      totalCents: Number(order.totalCents) || 0,
      pickupLocation: (order.pickupLocation || 'Foyer des Élèves — Campus ECE Eiffel 1').trim(),
    });

    return NextResponse.json({
      success: true,
      dispatchStatus: res.mode,
      recipient: email,
      orderNumber: order.orderNumber,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

