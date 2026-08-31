import { NextRequest, NextResponse } from 'next/server';
import { UserRole, UserStatus, MembershipStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { INITIAL_FOUNDER_ADMINS } from '@/lib/utils/users-store';

const ALLOWED_ROLES: UserRole[] = ['visitor', 'member', 'admin'];
const ALLOWED_STATUSES: UserStatus[] = ['active', 'pending', 'suspended'];
const ALLOWED_MEMBERSHIP_STATUSES: MembershipStatus[] = ['none', 'pending', 'active', 'rejected', 'suspended'];

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `promote:${ip}`,
      maxRequests: 20,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de requêtes. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get('authorization') || '';
    const adminKey = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Body parsing
    const body = await req.json().catch(() => ({}));
    const { userId, newRole, newStatus, newMembershipStatus, reviewerEmail, adminSecret } = body;

    // Authorization verification
    const isHeaderAuthorized = adminKey && authHeader.replace(/^Bearer\s+/i, '') === adminKey;
    const isSecretAuthorized = adminKey && adminSecret === adminKey;
    const isFounderAdmin = reviewerEmail && INITIAL_FOUNDER_ADMINS.some((a) => a.email.toLowerCase() === reviewerEmail.toLowerCase());

    if (!isHeaderAuthorized && !isSecretAuthorized && !isFounderAdmin) {
      return NextResponse.json(
        { success: false, error: 'Accès refusé : Privilèges Administrateur requis pour cette opération.' },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Identifiant utilisateur requis.' },
        { status: 400 }
      );
    }

    // Role & status validation
    if (newRole && !ALLOWED_ROLES.includes(newRole)) {
      return NextResponse.json({ success: false, error: 'Rôle utilisateur invalide.' }, { status: 400 });
    }
    if (newStatus && !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json({ success: false, error: 'Statut utilisateur invalide.' }, { status: 400 });
    }
    if (newMembershipStatus && !ALLOWED_MEMBERSHIP_STATUSES.includes(newMembershipStatus)) {
      return NextResponse.json({ success: false, error: 'Statut d\'adhésion invalide.' }, { status: 400 });
    }

    // Mise à jour sur Supabase si configuré
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const updatePayload: any = {};
        if (newRole) updatePayload.role = newRole;
        if (newStatus) updatePayload.status = newStatus;
        if (newMembershipStatus) {
          updatePayload.membership_status = newMembershipStatus;
          if (newMembershipStatus === 'active') {
            updatePayload.membership_approved_at = new Date().toISOString();
          }
        }

        await supabase
          .from('profiles')
          .update(updatePayload)
          .eq('id', userId);
      }
    } catch (e) {
      console.warn('Supabase update notice:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Utilisateur mis à jour avec succès (Rôle : ${newRole || 'inchangé'}, Statut : ${newStatus || 'inchangé'}, Cotisation : ${newMembershipStatus || 'inchangée'}).`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la mise à jour du rôle utilisateur.' },
      { status: 500 }
    );
  }
}

