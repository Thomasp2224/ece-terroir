import { NextRequest, NextResponse } from 'next/server';
import { helloAssoService } from '@/lib/helloasso/client';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { INITIAL_FOUNDER_ADMINS } from '@/lib/utils/users-store';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `helloasso-sync:${ip}`,
      maxRequests: 15,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de requêtes. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('x-admin-secret') || '';
    const adminKey = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'ece-terroir-admin-secret-2026';
    const isAuthorized = authHeader.replace(/^Bearer\s+/i, '').trim() === adminKey || req.nextUrl.searchParams.get('secret') === adminKey;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Accès refusé : Clé de sécurité administrateur requise pour synchroniser HelloAsso.' },
        { status: 403 }
      );
    }

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
