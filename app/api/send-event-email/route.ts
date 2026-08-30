import { NextRequest, NextResponse } from 'next/server';
import { sendEventTicketEmail, EventTicketEmailParams } from '@/lib/email/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ticket = body as EventTicketEmailParams;

    if (!ticket.userEmail || !ticket.eventTitle) {
      return NextResponse.json(
        { success: false, error: 'Données de réservation incomplètes' },
        { status: 400 }
      );
    }

    const res = await sendEventTicketEmail({
      eventTitle: ticket.eventTitle,
      eventDate: ticket.eventDate,
      eventLocation: ticket.eventLocation || 'Campus ECE Eiffel 1',
      userName: ticket.userName || 'Épicurien ECE',
      userEmail: ticket.userEmail,
      ticketCode: ticket.ticketCode || `BILLET-${Math.floor(1000 + Math.random() * 9000)}`,
      priceCents: ticket.priceCents || 0,
    });

    return NextResponse.json({
      success: true,
      dispatchStatus: res.mode,
      recipient: ticket.userEmail,
      eventTitle: ticket.eventTitle,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
