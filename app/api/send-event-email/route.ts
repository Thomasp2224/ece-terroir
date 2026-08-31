import { NextRequest, NextResponse } from 'next/server';
import { sendEventTicketEmail, EventTicketEmailParams } from '@/lib/email/mailer';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { isEceEmail, normalizeEmail } from '@/lib/utils/auth-security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `send-event-email:${ip}`,
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
    const ticket = body as EventTicketEmailParams;

    const email = normalizeEmail(ticket.userEmail || '');
    if (!email || !isEceEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Adresse email destinataire invalide (doit être @edu.ece.fr ou @ece.fr).' },
        { status: 400 }
      );
    }

    if (!ticket.eventTitle || typeof ticket.eventTitle !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Titre de l\'événement manquant ou invalide.' },
        { status: 400 }
      );
    }

    const res = await sendEventTicketEmail({
      eventTitle: ticket.eventTitle.trim(),
      eventDate: (ticket.eventDate || 'Date à confirmer').trim(),
      eventLocation: (ticket.eventLocation || 'Campus ECE Eiffel 1').trim(),
      userName: (ticket.userName || 'Épicurien ECE').trim(),
      userEmail: email,
      ticketCode: (ticket.ticketCode || `BILLET-${Math.floor(1000 + Math.random() * 9000)}`).trim(),
      priceCents: Number(ticket.priceCents) || 0,
    });

    return NextResponse.json({
      success: true,
      dispatchStatus: res.mode,
      recipient: email,
      eventTitle: ticket.eventTitle,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

