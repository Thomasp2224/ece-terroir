import { NextRequest, NextResponse } from 'next/server';
import { UserRole, UserStatus, MembershipStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, newRole, newStatus, newMembershipStatus, reviewerEmail } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Identifiant utilisateur requis.' },
        { status: 400 }
      );
    }

    // Mise à jour sur Supabase si connecté
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
