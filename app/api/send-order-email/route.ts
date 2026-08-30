import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail, OrderEmailParams } from '@/lib/email/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = body as OrderEmailParams;

    if (!order.userEmail || !order.orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Données de commande incomplètes' },
        { status: 400 }
      );
    }

    const res = await sendOrderEmail({
      orderNumber: order.orderNumber,
      userName: order.userName || 'Adhérent ECE Terroir',
      userEmail: order.userEmail,
      items: order.items || [],
      totalCents: order.totalCents || 0,
      pickupLocation: order.pickupLocation || 'Foyer des Élèves — Campus ECE Eiffel 1',
    });

    return NextResponse.json({
      success: true,
      dispatchStatus: res.mode,
      recipient: order.userEmail,
      orderNumber: order.orderNumber,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
