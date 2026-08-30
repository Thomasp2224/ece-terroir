import { supabase } from '@/lib/supabase/client';
import { sendMembershipEmail } from '@/lib/email/mailer';

interface HelloAssoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface HelloAssoOrder {
  id: number | string;
  date: string;
  amount: number; // in cents
  payer?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  items?: Array<{
    name: string;
    priceCategory?: string;
    amount: number;
    customFields?: Array<{ name: string; answer: string }>;
  }>;
  formSlug?: string;
  formType?: string;
}

export class HelloAssoService {
  private clientId: string;
  private clientSecret: string;
  private orgSlug: string;
  private baseUrl = 'https://api.helloasso.com';

  constructor() {
    this.clientId = process.env.HELLOASSO_CLIENT_ID || '';
    this.clientSecret = process.env.HELLOASSO_CLIENT_SECRET || '';
    this.orgSlug = process.env.HELLOASSO_ORGANIZATION_SLUG || 'ece-terroir';
  }

  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Obtient un jeton d'accès OAuth2 HelloAsso
   */
  public async getAccessToken(): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);

      const res = await fetch(`${this.baseUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur authentification HelloAsso:', errorText);
        return null;
      }

      const data = (await res.json()) as HelloAssoTokenResponse;
      return data.access_token;
    } catch (err) {
      console.error('Erreur réseau HelloAsso Token:', err);
      return null;
    }
  }

  /**
   * Récupère les formulaires actifs de l'association
   */
  public async getForms(): Promise<any[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      const res = await fetch(`${this.baseUrl}/v5/organizations/${this.orgSlug}/forms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.error('Erreur HelloAsso getForms:', e);
      return [];
    }
  }

  /**
   * Récupère les dernières commandes HelloAsso
   */
  public async getOrders(pageSize = 50): Promise<HelloAssoOrder[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      const res = await fetch(
        `${this.baseUrl}/v5/organizations/${this.orgSlug}/orders?pageIndex=1&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.error('Erreur HelloAsso getOrders:', e);
      return [];
    }
  }

  /**
   * Synchronise toutes les commandes / adhésions HelloAsso avec Supabase
   */
  public async syncWithSupabase(): Promise<{
    syncedCount: number;
    newMembersCount: number;
    errors: string[];
  }> {
    const orders = await this.getOrders(100);
    let syncedCount = 0;
    let newMembersCount = 0;
    const errors: string[] = [];

    for (const order of orders) {
      try {
        const email = order.payer?.email?.toLowerCase().trim();
        const fullName = `${order.payer?.firstName || ''} ${order.payer?.lastName || ''}`.trim() || 'Étudiant ECE';
        if (!email) continue;

        const amountCents = order.amount || 1000;
        const now = order.date || new Date().toISOString();
        const matricule = `ECE-TERR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        // 1. Mettre à jour le profil Supabase
        const { error: profErr } = await supabase.from('profiles').upsert({
          email,
          full_name: fullName,
          role: 'member',
          status: 'active',
          membership_status: 'active',
          membership_payment_method: 'helloasso',
          membership_approved_at: now,
        }, { onConflict: 'email' });

        if (profErr) {
          errors.push(`Erreur profil ${email}: ${profErr.message}`);
          continue;
        }

        // 2. Enregistrer la demande d'adhésion validée
        const reqId = `req-ha-${order.id}`;
        await supabase.from('membership_requests').upsert({
          id: reqId,
          user_id: `usr-ha-${order.id}`,
          user_name: fullName,
          user_email: email,
          amount_cents: amountCents,
          payment_method: 'helloasso',
          status: 'approved',
          requested_at: now,
          reviewed_at: now,
          reviewed_by: 'Sync HelloAsso API',
          notes: `Commande HelloAsso #${order.id} importée automatiquement.`,
        }, { onConflict: 'id' });

        syncedCount++;
        newMembersCount++;
      } catch (err: any) {
        errors.push(`Erreur order #${order.id}: ${err.message}`);
      }
    }

    return {
      syncedCount,
      newMembersCount,
      errors,
    };
  }
}

export const helloAssoService = new HelloAssoService();
