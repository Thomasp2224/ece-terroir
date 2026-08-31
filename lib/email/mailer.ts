import nodemailer from 'nodemailer';

/**
 * Robust HTML entity escaping to prevent HTML / Template injection (XSS in webmail)
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Configuration du transporteur SMTP (Gmail ou personnalisé)
function getTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

const DEFAULT_FROM = process.env.SMTP_FROM || `"ECE Terroir • Confrérie" <${process.env.SMTP_USER || 'eceterroir@gmail.com'}>`;

// ==============================================================================
// 1. EMAIL D'ADHÉSION & PASS ÉPICURIEN OFFICIEL
// ==============================================================================
export interface MembershipEmailParams {
  fullName: string;
  email: string;
  promo: string;
  matricule: string;
  amountCents?: number;
  approvedAt?: string;
}

export function generateMembershipEmailHtml(params: MembershipEmailParams): string {
  const safeFullName = escapeHtml(params.fullName);
  const safePromo = escapeHtml(params.promo);
  const safeMatricule = escapeHtml(params.matricule);

  const dateStr = params.approvedAt 
    ? new Date(params.approvedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez ECE Terroir</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1D1917; }
    .container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE2D8; box-shadow: 0 20px 40px rgba(20,40,29,0.08); }
    .header { background: linear-gradient(135deg, #14281D 0%, #264E3A 100%); padding: 40px 30px; text-align: center; color: #FAF7F2; border-bottom: 3px solid #D4AF37; }
    .header h1 { margin: 15px 0 5px; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #D4AF37; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 35px 30px; }
    .pass-card { background: linear-gradient(135deg, #FAF7F2 0%, #EAE6DF 100%); border: 2px solid #D4AF37; border-radius: 20px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 20px rgba(212,175,55,0.15); }
    .matricule { font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 900; color: #14281D; letter-spacing: 2px; margin: 8px 0; }
    .perks-list { margin: 20px 0; padding: 0; list-style: none; }
    .perk-item { padding: 10px 0; border-bottom: 1px solid #F3EDE2; font-size: 13px; display: flex; align-items: center; }
    .btn { display: inline-block; background-color: #14281D; color: #FAF7F2 !important; text-decoration: none; padding: 14px 28px; border-radius: 16px; font-weight: 800; font-size: 13px; margin-top: 20px; box-shadow: 0 4px 12px rgba(20,40,29,0.25); }
    .footer { background-color: #F4EFEA; padding: 25px 30px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EAE2D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 32px;">🧀✨</div>
      <p>Association Gastronomique ECE Paris</p>
      <h1>Bienvenue dans la Confrérie !</h1>
    </div>

    <div class="content">
      <p style="font-size: 15px; line-height: 1.6;">Bonjour <strong>${safeFullName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #5C554E;">
        Le Bureau d'<strong>ECE Terroir</strong> a le grand plaisir de vous confirmer la validation officielle de votre cotisation pour l'année universitaire <strong>2026-2027</strong>.
      </p>

      <div class="pass-card">
        <span style="font-size: 10px; font-weight: 800; color: #78716C; text-transform: uppercase; letter-spacing: 1px;">Pass Épicurien Officiel</span>
        <div class="matricule">${safeMatricule}</div>
        <p style="margin: 0; font-size: 12px; color: #2D5A3F; font-weight: bold;">
          ${safeFullName} • ${safePromo}
        </p>
        <p style="margin: 4px 0 0; font-size: 10px; color: #78716C;">
          Adhésion validée le ${dateStr}
        </p>
      </div>

      <h3 style="font-size: 15px; color: #14281D; margin-top: 25px;">Vos Privilèges Adhérent Actifs :</h3>
      <ul class="perks-list">
        <li class="perk-item">🎁 <strong>-15% immédiats et permanents</strong> sur l'Échoppe (pulls, couteaux de Thiers, verres).</li>
        <li class="perk-item">🧀 <strong>Accès prioritaire et tarifs réduits</strong> sur toutes les soirées raclettes et banquets.</li>
        <li class="perk-item">🍷 <strong>Dégustations exclusives de meules AOP</strong> au Foyer Eiffel 1.</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://ece-terroir.vercel.app/profil" class="btn">
          Accéder à mon Pass 3D & Attestation →
        </a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px;"><strong>ECE Terroir — Association Loi 1901</strong></p>
      <p style="margin: 0;">Campus ECE Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendMembershipEmail(params: MembershipEmailParams) {
  const transporter = getTransporter();
  const html = generateMembershipEmailHtml(params);
  const subject = `🧀 Bienvenue chez ECE Terroir — Confirmation d'Adhésion (${params.matricule})`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi email d'adhésion à ${params.email} (Matricule: ${params.matricule})`);
    return { success: true, mode: 'simulated', subject, recipient: params.email };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    to: params.email,
    subject,
    html,
  });

  return { success: true, mode: 'smtp_real', messageId: info.messageId, recipient: params.email };
}

// ==============================================================================
// 2. EMAIL DE CONFIRMATION DE COMMANDE ÉCHOPPE TERROIR (CLICK & COLLECT)
// ==============================================================================
export interface OrderEmailParams {
  orderNumber: string;
  userName: string;
  userEmail: string;
  items: Array<{ name: string; quantity: number; priceCents: number; size?: string }>;
  totalCents: number;
  pickupLocation?: string;
}

export function generateOrderEmailHtml(params: OrderEmailParams): string {
  const safeOrderNumber = escapeHtml(params.orderNumber);
  const safeUserName = escapeHtml(params.userName);
  const safePickupLocation = escapeHtml(params.pickupLocation || 'Foyer des Élèves — Campus ECE Eiffel 1');

  const itemsHtml = (params.items || []).map((it) => `
    <tr style="border-bottom: 1px solid #EAE2D8;">
      <td style="padding: 10px 0; font-size: 13px;">
        <strong>${escapeHtml(it.name)}</strong> ${it.size ? `<span style="color: #78716C;">(Taille ${escapeHtml(it.size)})</span>` : ''}
      </td>
      <td style="padding: 10px 0; text-align: center; font-size: 13px;">x${Number(it.quantity) || 1}</td>
      <td style="padding: 10px 0; text-align: right; font-size: 13px; font-weight: bold; color: #14281D;">
        ${(((it.priceCents || 0) * (it.quantity || 1)) / 100).toFixed(2)} €
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Confirmation de Commande ECE Terroir</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1D1917; }
    .container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE2D8; box-shadow: 0 20px 40px rgba(20,40,29,0.08); }
    .header { background: linear-gradient(135deg, #58111A 0%, #14281D 100%); padding: 35px 30px; text-align: center; color: #FAF7F2; border-bottom: 3px solid #D4AF37; }
    .content { padding: 35px 30px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .pickup-box { background-color: #FAF7F2; border: 1px solid #D4AF37; border-radius: 16px; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 32px;">📦✨</div>
      <h1 style="margin: 10px 0 5px; font-size: 24px;">Commande Confirmée !</h1>
      <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">
        Réf : ${safeOrderNumber}
      </p>
    </div>

    <div class="content">
      <p style="font-size: 15px;">Bonjour <strong>${safeUserName}</strong>,</p>
      <p style="font-size: 14px; color: #5C554E;">
        Merci pour votre commande sur l'Échoppe ECE Terroir. Vos trésors artisanaux sont réservés et en cours de préparation par l'équipe du Bureau.
      </p>

      <table class="table">
        <thead>
          <tr style="border-bottom: 2px solid #14281D; text-align: left; font-size: 11px; text-transform: uppercase; color: #78716C;">
            <th style="padding-bottom: 8px;">Article</th>
            <th style="padding-bottom: 8px; text-align: center;">Qté</th>
            <th style="padding-bottom: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top: 15px; font-size: 14px; font-weight: bold;">Total Réglé / À Régler :</td>
            <td style="padding-top: 15px; font-size: 16px; font-weight: 900; text-align: right; color: #14281D;">
              ${((params.totalCents || 0) / 100).toFixed(2)} €
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="pickup-box">
        <h4 style="margin: 0 0 5px; color: #14281D; font-size: 14px;">📍 Point de Retrait Click & Collect :</h4>
        <p style="margin: 0; font-size: 12px; color: #5C554E; line-height: 1.5;">
          <strong>${safePickupLocation}</strong><br>
          Présentez votre numéro de commande <strong>${safeOrderNumber}</strong> lors de la prochaine permanence ou du banquet de terroir.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOrderEmail(params: OrderEmailParams) {
  const transporter = getTransporter();
  const html = generateOrderEmailHtml(params);
  const subject = `📦 Confirmation de votre commande ${params.orderNumber} — Échoppe ECE Terroir`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi confirmation de commande ${params.orderNumber} à ${params.userEmail}`);
    return { success: true, mode: 'simulated', subject, recipient: params.userEmail };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    to: params.userEmail,
    subject,
    html,
  });

  return { success: true, mode: 'smtp_real', messageId: info.messageId, recipient: params.userEmail };
}

// ==============================================================================
// 3. EMAIL BILLET ÉLECTRONIQUE / RÉSERVATION ÉVÉNEMENT
// ==============================================================================
export interface EventTicketEmailParams {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  userName: string;
  userEmail: string;
  ticketCode: string;
  priceCents: number;
}

export function generateEventTicketEmailHtml(params: EventTicketEmailParams): string {
  const safeEventTitle = escapeHtml(params.eventTitle);
  const safeEventDate = escapeHtml(params.eventDate);
  const safeEventLocation = escapeHtml(params.eventLocation || 'Campus ECE Eiffel 1');
  const safeUserName = escapeHtml(params.userName);
  const safeTicketCode = escapeHtml(params.ticketCode);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Votre Billet pour ${safeEventTitle}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE2D8; box-shadow: 0 20px 40px rgba(20,40,29,0.08); }
    .header { background: linear-gradient(135deg, #14281D 0%, #58111A 100%); padding: 35px 30px; text-align: center; color: #FAF7F2; border-bottom: 3px solid #D4AF37; }
    .ticket { background: #FAF7F2; border: 2px dashed #D4AF37; border-radius: 20px; padding: 25px; margin: 25px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 32px;">🎟️🧀</div>
      <h1 style="margin: 10px 0 5px; font-size: 22px;">Billet Électronique Officiel</h1>
      <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">
        ECE Terroir Festins & Dégustations
      </p>
    </div>

    <div style="padding: 30px;">
      <p style="font-size: 15px;">Bonjour <strong>${safeUserName}</strong>,</p>
      <p style="font-size: 14px; color: #5C554E;">
        Votre place est confirmée pour l'événement gastronomique suivant :
      </p>

      <div class="ticket">
        <h2 style="margin: 0 0 10px; color: #14281D; font-size: 18px;">${safeEventTitle}</h2>
        <p style="margin: 5px 0; font-size: 13px; color: #58111A; font-weight: bold;">
          📅 ${safeEventDate}
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #5C554E;">
          📍 ${safeEventLocation}
        </p>
        <div style="margin-top: 15px; font-family: monospace; font-size: 16px; font-weight: 900; color: #14281D; letter-spacing: 2px;">
          CODE : ${safeTicketCode}
        </div>
      </div>

      <p style="font-size: 12px; color: #78716C; text-align: center;">
        Présentez ce code ou votre Pass Épicurien à l'entrée pour le scan en direct par le Bureau.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendEventTicketEmail(params: EventTicketEmailParams) {
  const transporter = getTransporter();
  const html = generateEventTicketEmailHtml(params);
  const subject = `🎟️ Votre billet pour : ${params.eventTitle} — ECE Terroir`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi billet pour ${params.eventTitle} à ${params.userEmail}`);
    return { success: true, mode: 'simulated', subject, recipient: params.userEmail };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    to: params.userEmail,
    subject,
    html,
  });

  return { success: true, mode: 'smtp_real', messageId: info.messageId, recipient: params.userEmail };
}
