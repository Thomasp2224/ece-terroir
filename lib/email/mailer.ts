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

const DEFAULT_FROM = process.env.SMTP_FROM || `"ECE Terroir" <${process.env.SMTP_USER || 'eceterroir@gmail.com'}>`;

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
    .footer { background-color: #F4EFEA; padding: 25px 30px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EAE2D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>Association Gastronomique ECE Paris</p>
      <h1>Bienvenue dans la Confrerie !</h1>
    </div>

    <div class="content">
      <p style="font-size: 15px; line-height: 1.6;">Bonjour <strong>${safeFullName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #5C554E;">
        Le Bureau d'<strong>ECE Terroir</strong> a le plaisir de vous confirmer la validation de votre adhesion pour l'annee universitaire <strong>2026-2027</strong>.
      </p>

      <div class="pass-card">
        <span style="font-size: 10px; font-weight: 800; color: #78716C; text-transform: uppercase; letter-spacing: 1px;">Pass Epicurien Officiel</span>
        <div class="matricule">${safeMatricule}</div>
        <p style="margin: 5px 0 0; font-size: 12px; color: #5C554E;">
          Statut : <strong>Membre Adherent Actif</strong> • ${safePromo}
        </p>
      </div>

      <p style="font-size: 13px; color: #78716C; line-height: 1.6;">
        Retrouvez votre Pass en 3D, votre attestation d'adhesion A4 et vos acces membres directement sur votre espace etudiant.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px;"><strong>ECE Terroir — Association Gastronomique de l'ECE Paris</strong></p>
      <p style="margin: 0;">Campus Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendMembershipEmail(params: MembershipEmailParams) {
  const transporter = getTransporter();
  const html = generateMembershipEmailHtml(params);
  const subject = `[ECE Terroir] Confirmation d'adhesion - Pass Epicurien (${params.matricule})`;

  const text = `Bonjour ${params.fullName},

Bienvenue dans la Confrerie ECE Terroir !
Votre cotisation pour l'annee 2026-2027 a ete validee par le Bureau.

Votre Pass Epicurien : ${params.matricule}
Statut : Membre Adherent Actif (${params.promo})

Retrouvez votre Pass 3D, vos reductions boutique et votre attestation A4 officielle sur :
https://ece-terroir.vercel.app/profil

Association ECE Terroir — Campus ECE Paris
10 Rue Sextius Michel, 75015 Paris`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi email d'adhésion à ${params.email} (Matricule: ${params.matricule})`);
    return { success: true, mode: 'simulated', subject, recipient: params.email };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    replyTo: 'eceterroir@gmail.com',
    to: params.email,
    subject,
    text,
    html,
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
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
    .footer { background-color: #F4EFEA; padding: 20px 30px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EAE2D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 10px 0 5px; font-size: 24px;">Commande Confirmee !</h1>
      <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">
        Reference : ${safeOrderNumber}
      </p>
    </div>

    <div class="content">
      <p style="font-size: 15px;">Bonjour <strong>${safeUserName}</strong>,</p>
      <p style="font-size: 14px; color: #5C554E;">
        Merci pour votre commande sur l'Echoppe ECE Terroir. Vos articles sont reserves et en cours de preparation par le Bureau.
      </p>

      <table class="table">
        <thead>
          <tr style="border-bottom: 2px solid #14281D; text-align: left; font-size: 11px; text-transform: uppercase; color: #78716C;">
            <th style="padding-bottom: 8px;">Article</th>
            <th style="padding-bottom: 8px; text-align: center;">Qte</th>
            <th style="padding-bottom: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top: 15px; font-size: 14px; font-weight: bold;">Total Regle :</td>
            <td style="padding-top: 15px; font-size: 16px; font-weight: 900; text-align: right; color: #14281D;">
              ${((params.totalCents || 0) / 100).toFixed(2)} €
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="pickup-box">
        <h4 style="margin: 0 0 5px; color: #14281D; font-size: 14px;">Point de Retrait Click & Collect :</h4>
        <p style="margin: 0; font-size: 12px; color: #5C554E; line-height: 1.5;">
          <strong>${safePickupLocation}</strong><br>
          Presentez votre numero de commande <strong>${safeOrderNumber}</strong> ou le QR Code accessible sur votre profil.
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px;"><strong>ECE Terroir — Association Gastronomique de l'ECE Paris</strong></p>
      <p style="margin: 0;">Campus Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOrderEmail(params: OrderEmailParams) {
  const transporter = getTransporter();
  const html = generateOrderEmailHtml(params);
  const subject = `[ECE Terroir] Confirmation de votre commande ${params.orderNumber}`;

  const text = `Bonjour ${params.userName},

Votre commande ${params.orderNumber} sur l'Echoppe ECE Terroir est confirmee !
Montant total : ${((params.totalCents || 0) / 100).toFixed(2)} €
Point de retrait : ${params.pickupLocation || 'Foyer des Eleves — Campus ECE Eiffel 1'}

Retrouvez votre bon de retrait avec QR Code sur :
https://ece-terroir.vercel.app/profil

Association ECE Terroir — Campus ECE Paris`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi confirmation de commande ${params.orderNumber} à ${params.userEmail}`);
    return { success: true, mode: 'simulated', subject, recipient: params.userEmail };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    replyTo: 'eceterroir@gmail.com',
    to: params.userEmail,
    subject,
    text,
    html,
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
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
    .footer { background-color: #F4EFEA; padding: 20px 30px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EAE2D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 10px 0 5px; font-size: 22px;">Billet Electronique Officiel</h1>
      <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">
        ECE Terroir Festins & Degustations
      </p>
    </div>

    <div style="padding: 30px;">
      <p style="font-size: 15px;">Bonjour <strong>${safeUserName}</strong>,</p>
      <p style="font-size: 14px; color: #5C554E;">
        Votre place est confirmee pour l'evenement suivant :
      </p>

      <div class="ticket">
        <h2 style="margin: 0 0 10px; color: #14281D; font-size: 18px;">${safeEventTitle}</h2>
        <p style="margin: 5px 0; font-size: 13px; color: #58111A; font-weight: bold;">
          Date : ${safeEventDate}
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #5C554E;">
          Lieu : ${safeEventLocation}
        </p>
        <div style="margin-top: 15px; font-family: monospace; font-size: 16px; font-weight: 900; color: #14281D; letter-spacing: 2px;">
          CODE : ${safeTicketCode}
        </div>
      </div>

      <p style="font-size: 12px; color: #78716C; text-align: center;">
        Presentez ce code ou votre Pass Epicurien a l'entree pour l'emargement.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px;"><strong>ECE Terroir — Association Gastronomique de l'ECE Paris</strong></p>
      <p style="margin: 0;">Campus Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendEventTicketEmail(params: EventTicketEmailParams) {
  const transporter = getTransporter();
  const html = generateEventTicketEmailHtml(params);
  const subject = `[ECE Terroir] Votre billet pour : ${params.eventTitle}`;

  const text = `Bonjour ${params.userName},

Votre place pour "${params.eventTitle}" est confirmee !
Date : ${params.eventDate}
Lieu : ${params.eventLocation}
Code de verification : ${params.ticketCode}

Presentez ce code a l'entree pour le scan par le Bureau.

Association ECE Terroir — Campus ECE Paris`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi billet pour ${params.eventTitle} à ${params.userEmail}`);
    return { success: true, mode: 'simulated', subject, recipient: params.userEmail };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    replyTo: 'eceterroir@gmail.com',
    to: params.userEmail,
    subject,
    text,
    html,
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
  });

  return { success: true, mode: 'smtp_real', messageId: info.messageId, recipient: params.userEmail };
}

// ==============================================================================
// 4. EMAIL DE RÉINITIALISATION DE MOT DE PASSE (SÉCURITÉ)
// ==============================================================================
export interface PasswordResetEmailParams {
  fullName: string;
  email: string;
  resetCode: string;
  resetLink?: string;
}

export function generatePasswordResetEmailHtml(params: PasswordResetEmailParams): string {
  const safeFullName = escapeHtml(params.fullName);
  const safeResetCode = escapeHtml(params.resetCode);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Reinitialisation de votre mot de passe ECE Terroir</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 560px; margin: 30px auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE2D8; box-shadow: 0 20px 40px rgba(20,40,29,0.08); }
    .header { background-color: #14281D; color: #FAF7F2; padding: 35px 30px; text-align: center; border-bottom: 2px solid #D4AF37; }
    .content { padding: 35px 30px; }
    .code-box { background: #FAF7F2; border: 2px dashed #D4AF37; border-radius: 16px; padding: 20px; text-align: center; margin: 25px 0; }
    .code { font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #58111A; }
    .footer { background-color: #F4EFEA; padding: 20px 30px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EAE2D8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 10px 0 5px; font-size: 22px;">Reinitialisation de Mot de Passe</h1>
      <p style="margin: 0; font-size: 12px; color: #D4AF37; font-weight: bold; text-transform: uppercase;">
        Plateforme Etudiante ECE Terroir
      </p>
    </div>

    <div class="content">
      <p style="font-size: 15px;">Bonjour <strong>${safeFullName}</strong>,</p>
      <p style="font-size: 14px; color: #5C554E; line-height: 1.6;">
        Nous avons recu une demande de reinitialisation de mot de passe pour votre compte etudiant ECE Terroir (<strong style="color: #14281D;">${escapeHtml(params.email)}</strong>).
      </p>

      <div class="code-box">
        <span style="font-size: 11px; font-weight: 800; color: #78716C; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
          Votre Code de Securite Temporaire :
        </span>
        <div class="code">${safeResetCode}</div>
        <p style="margin: 8px 0 0; font-size: 11px; color: #A8A29E;">
          Ce code est valable pendant <strong>15 minutes</strong>.
        </p>
      </div>

      <p style="font-size: 13px; color: #78716C; line-height: 1.5;">
        Saisissez ce code a 6 chiffres sur la page de connexion pour definir votre nouveau mot de passe. Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer cet email en toute securite.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px;"><strong>ECE Terroir — Association Gastronomique de l'ECE Paris</strong></p>
      <p style="margin: 0;">Campus Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendPasswordResetEmail(params: PasswordResetEmailParams) {
  const transporter = getTransporter();
  const html = generatePasswordResetEmailHtml(params);
  const subject = `[ECE Terroir] Code de verification : ${params.resetCode}`;

  const text = `Bonjour ${params.fullName},

Voici votre code de securite temporaire pour reinitialiser votre mot de passe ECE Terroir : ${params.resetCode}

Ce code est valable pendant 15 minutes.
Saisissez-le sur la page de connexion pour choisir votre nouveau mot de passe.

Si vous n'avez pas demande cette reinitialisation, vous pouvez ignorer ce message.

Association ECE Terroir — Campus ECE Paris
10 Rue Sextius Michel, 75015 Paris`;

  if (!transporter) {
    console.log(`[SMTP SIMULÉ] Envoi code reset ${params.resetCode} à ${params.email}`);
    return { success: true, mode: 'simulated', subject, recipient: params.email };
  }

  const info = await transporter.sendMail({
    from: DEFAULT_FROM,
    replyTo: 'eceterroir@gmail.com',
    to: params.email,
    subject,
    text,
    html,
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
  });

  return { success: true, mode: 'smtp_real', messageId: info.messageId, recipient: params.email };
}
