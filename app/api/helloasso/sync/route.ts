import { NextRequest, NextResponse } from 'next/server';
import { helloAssoService } from '@/lib/helloasso/client';

export async function POST(req: NextRequest) {
  try {
    if (!helloAssoService.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: "L'API HelloAsso n'est pas encore configurée (HELLOASSO_CLIENT_ID et HELLOASSO_CLIENT_SECRET requis).",
        configured: false,
      }, { status: 400 });
    }

    const result = await helloAssoService.syncWithSupabase();
    return NextResponse.json({
      success: true,
      configured: true,
      syncedCount: result.syncedCount,
      newMembersCount: result.newMembersCount,
      errors: result.errors,
      message: `${result.syncedCount} commandes synchronisées avec succès depuis HelloAsso !`,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}

export async function GET() {
  const isConfigured = helloAssoService.isConfigured();
  return NextResponse.json({
    service: 'ECE Terroir — HelloAsso API Synchronization',
    status: isConfigured ? 'configured' : 'needs_credentials',
    configured: isConfigured,
    organizationSlug: process.env.HELLOASSO_ORGANIZATION_SLUG || 'ece-terroir',
    webhookEndpoint: '/api/webhooks/helloasso',
  });
}
