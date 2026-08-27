export interface MembershipEmailData {
  fullName: string;
  email: string;
  promo?: string;
  matricule: string;
  amountCents: number;
  approvedAt?: string;
}

/**
 * Generates the luxury HTML email template "Bistrot Chic"
 */
export function generateMembershipEmailHtml(data: MembershipEmailData): string {
  const amountFormatted = (data.amountCents / 100).toFixed(2).replace('.', ',') + ' €';
  const validationDate = new Date(data.approvedAt || Date.now()).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez ECE Terroir — Confirmation d'Adhésion Officielle</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4EFEA;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1D1917;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #FDFBF7;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #EAE2D8;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #380B11 0%, #58111A 60%, #14281D 100%);
      padding: 40px 30px;
      text-align: center;
      color: #FDFBF7;
      position: relative;
    }
    .crest {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      background-color: #58111A;
      border: 2px solid #D4AF37;
      border-radius: 16px;
      color: #D4AF37;
      font-size: 24px;
      font-weight: 900;
      font-family: Georgia, serif;
      margin-bottom: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .title {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      color: #FDFBF7;
      letter-spacing: 0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #D4AF37;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 6px;
      font-weight: 700;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-family: Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: #58111A;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .pass-card {
      background: linear-gradient(145deg, #14281D 0%, #1B3B2B 100%);
      border: 2px solid #D4AF37;
      border-radius: 18px;
      padding: 24px;
      color: #FDFBF7;
      margin: 24px 0;
      box-shadow: 0 6px 20px rgba(20,40,29,0.2);
    }
    .pass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(212,175,55,0.3);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .pass-badge {
      background-color: #D4AF37;
      color: #58111A;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .pass-matricule {
      font-family: monospace;
      font-size: 15px;
      font-weight: 700;
      color: #D4AF37;
      letter-spacing: 1px;
    }
    .pass-name {
      font-family: Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #FFFFFF;
    }
    .pass-promo {
      font-size: 12px;
      color: #D8CCC0;
      margin: 4px 0 0 0;
    }
    .receipt-box {
      background-color: #F6F1EA;
      border: 1px dashed #D4AF37;
      border-radius: 14px;
      padding: 16px 20px;
      margin: 20px 0;
      font-size: 13px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .receipt-row:last-child {
      margin-bottom: 0;
      border-top: 1px solid #EAE2D8;
      padding-top: 6px;
      font-weight: 700;
      color: #58111A;
    }
    .cta-button {
      display: block;
      width: fit-content;
      margin: 28px auto 10px auto;
      background-color: #58111A;
      color: #FDFBF7 !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      border: 1px solid #D4AF37;
      box-shadow: 0 4px 15px rgba(88,17,26,0.3);
    }
    .signatures {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #EAE2D8;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #78716C;
    }
    .sig-col {
      text-align: left;
    }
    .sig-name {
      font-weight: 700;
      color: #58111A;
      margin-top: 2px;
    }
    .footer {
      background-color: #0E1C14;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #D8CCC0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    
    <!-- HEADER -->
    <div class="header">
      <div class="crest">ET</div>
      <h1 class="title">ECE TERROIR — PARIS</h1>
      <div class="subtitle">Confirmation d'Adhésion Officielle</div>
    </div>

    <!-- BODY -->
    <div class="content">
      <h2 class="greeting">Félicitations et bienvenue dans la Confrérie, ${data.fullName} !</h2>
      
      <p style="font-size: 14px; color: #5C554E;">
        Le Bureau de l'association <strong>ECE Terroir</strong> a le plaisir de vous confirmer la validation définitive de votre adhésion pour l'année universitaire <strong>2026-2027</strong>.
      </p>

      <!-- DIGITAL PASS SUMMARY -->
      <div class="pass-card">
        <div class="pass-header">
          <span class="pass-badge">Pass Épicurien Actif</span>
          <span class="pass-matricule">${data.matricule}</span>
        </div>
        <p class="pass-name">${data.fullName}</p>
        <p class="pass-promo">${data.promo || 'Campus ECE Paris Eiffel 1'}</p>
      </div>

      <!-- FISCAL RECEIPT BLOCK -->
      <div class="receipt-box">
        <div class="receipt-row">
          <span style="color: #78716C;">Objet :</span>
          <strong>Cotisation Annuelle ECE Terroir 2026-2027</strong>
        </div>
        <div class="receipt-row">
          <span style="color: #78716C;">Date d'encaissement :</span>
          <span>${validationDate}</span>
        </div>
        <div class="receipt-row">
          <span style="color: #78716C;">Mode de paiement :</span>
          <span>HelloAsso (Paiement Sécurisé en Ligne)</span>
        </div>
        <div class="receipt-row">
          <span>Montant Réglé TTC :</span>
          <span style="font-size: 15px;">${amountFormatted}</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #5C554E; line-height: 1.6;">
        🛡️ <strong>Vos privilèges membres débloqués dès aujourd'hui :</strong><br>
        • Accès privilégié et tarif réduit sur toutes les grandes dégustations de l'année.<br>
        • <strong>-15% de remise permanente</strong> sur toute la boutique officielle ECE Terroir (hoodies brodés, planches en chêne, couteaux).<br>
        • Participation prioritaire aux visites chez nos producteurs partenaires et voyages terroirs.
      </p>

      <!-- ACTION BUTTON -->
      <a href="https://eceterroir.fr/profil" class="cta-button">
        Accéder à mon Pass Épicurien & Attestation A4 &rarr;
      </a>

      <!-- SIGNATURES -->
      <div class="signatures">
        <div class="sig-col">
          <span>Le Président</span>
          <div class="sig-name">Jules Houry</div>
        </div>
        <div class="sig-col" style="text-align: right;">
          <span>Le Trésorier</span>
          <div class="sig-name">Léonard Brault</div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <strong>ECE Terroir</strong> — Association Loi 1901 (RNA : W751239845)<br>
      Campus ECE Paris, 10 Rue Sextius Michel, 75015 Paris<br>
      Contact : contact@eceterroir.fr • Retrait Foyer Bâtiment Eiffel 1
    </div>

  </div>
</body>
</html>
  `.trim();
}
