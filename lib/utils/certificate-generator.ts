/**
 * Moteur de génération Canvas pour l'Attestation d'Adhésion & Reçu de Cotisation Officiel ECE Terroir
 * Rendu haute résolution A4 (1754 × 2480 px @ 150-300 DPI) avec QR Code scannable et signatures
 */

import QRCode from 'qrcode';
import { UserProfile } from '@/lib/types';
import { getMemberMatricule, getVerificationCode, getVerificationUrl } from './matricule';

export interface CertificateData {
  fullName: string;
  email: string;
  promo?: string;
  role: string;
  matricule: string;
  paymentMethod?: string;
  approvedAt?: string;
  reviewerName?: string;
}

/**
 * Génère le canvas haute résolution de l'Attestation A4
 */
export async function generateMembershipCertificateCanvas(user: UserProfile): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1754; // Format A4 portrait
  const height = 2480;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de créer le contexte 2D Canvas');

  const matricule = getMemberMatricule(user);
  const securityCode = getVerificationCode(matricule);
  const isBureau = user.role === 'admin';
  const roleTitle = isBureau ? 'Membre du Bureau Exécutif' : 'Membre Adhérent Titulaire du Pass Épicurien';
  const paymentMethodLabel = 
    user.membershipPaymentMethod === 'helloasso'
      ? 'Carte Bancaire / HelloAsso Sécurisé'
      : user.membershipPaymentMethod === 'cash_foyer'
      ? 'Espèces / Lydia au Foyer des Élèves'
      : user.membershipPaymentMethod === 'lydia_transfer'
      ? 'Virement Bancaire / Lydia Direct'
      : 'Cotisation Encaissée (HelloAsso)';

  const formattedDate = user.membershipApprovedAt
    ? new Date(user.membershipApprovedAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  // 1. Fond Parchemin Crème Lin & Filigrane subtil
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, width, height);

  // Micro-texture guillochée de fond
  ctx.strokeStyle = 'rgba(88, 17, 26, 0.025)';
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + 200);
    ctx.stroke();
  }

  // 2. Double cadre prestigieux bordeaux & or
  const margin = 70;
  ctx.strokeStyle = '#58111A';
  ctx.lineWidth = 6;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Liseré or intérieur
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(margin + 16, margin + 16, width - (margin + 16) * 2, height - (margin + 16) * 2);

  // Coins décoratifs
  const corners = [
    [margin + 16, margin + 16],
    [width - (margin + 16), margin + 16],
    [margin + 16, height - (margin + 16)],
    [width - (margin + 16), height - (margin + 16)],
  ];

  ctx.fillStyle = '#D4AF37';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. En-tête Institutionnel
  ctx.textAlign = 'center';
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('RÉPUBLIQUE FRANÇAISE • ENSEIGNEMENT SUPÉRIEUR ET RECHERCHE', width / 2, 140);

  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillText('CONFRÉRIE DE L\'ECE TERROIR', width / 2, 205);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.fillText('ASSOCIATION GASTRONOMIQUE OFFICIELLE DE L\'ECE PARIS', width / 2, 245);

  ctx.fillStyle = '#78716C';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Association Loi 1901 • RNA : W751239845 • Campus Eiffel 1, 10 Rue Sextius Michel, 75015 Paris', width / 2, 280);

  // Ligne de séparation ornée
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 350, 310);
  ctx.lineTo(width / 2 + 350, 310);
  ctx.stroke();

  // 4. Titre Solennel du Document
  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('ATTESTATION OFFICIELLE D\'ADHÉSION', width / 2, 380);

  ctx.fillStyle = '#14281D';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillText('& REÇU DE COTISATION ANNUELLE', width / 2, 420);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
  ctx.fillText('EXERCICE UNIVERSITAIRE 2026 — 2027', width / 2, 460);

  // 5. Texte Déclaratif
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1D1917';
  ctx.font = '19px "Playfair Display", Georgia, serif';
  ctx.fillText('Le Bureau Exécutif de l\'association ECE Terroir certifie par la présente que l\'élève-ingénieur(e) :', 140, 530);

  // 6. Cadre Nominatif Adhérent
  const userBoxY = 570;
  const userBoxHeight = 350;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(140, userBoxY, width - 280, userBoxHeight);
  ctx.strokeStyle = '#EAE2D8';
  ctx.lineWidth = 2;
  ctx.strokeRect(140, userBoxY, width - 280, userBoxHeight);

  // Liseré gauche bordeaux
  ctx.fillStyle = '#58111A';
  ctx.fillRect(140, userBoxY, 14, userBoxHeight);

  // Nom complet
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('NOM & PRÉNOM DU TITULAIRE', 180, userBoxY + 45);

  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 38px "Playfair Display", Georgia, serif';
  ctx.fillText(user.fullName.toUpperCase(), 180, userBoxY + 95);

  // Qualité / Rôle
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('QUALITÉ / STATUT ASSOCIATIF', 180, userBoxY + 155);

  ctx.fillStyle = isBureau ? '#58111A' : '#14281D';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.fillText(roleTitle, 180, userBoxY + 190);

  // Promo
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('CAMPUS & PROMOTION', 180, userBoxY + 250);

  ctx.fillStyle = '#1D1917';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.fillText(user.promo || 'Campus ECE Paris Eiffel 1', 180, userBoxY + 285);

  // Email
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('ADRESSE ACADÉMIQUE', 950, userBoxY + 155);

  ctx.fillStyle = '#1D1917';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillText(user.email, 950, userBoxY + 190);

  // Matricule
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('MATRICULE OFFICIEL UNIQUE', 950, userBoxY + 250);

  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 26px "Courier New", monospace';
  ctx.fillText(matricule, 950, userBoxY + 285);

  // 7. Bloc Reçu Financier & Comptable (Pour justificatif)
  const payBoxY = 970;
  const payBoxHeight = 360;

  ctx.fillStyle = '#14281D';
  ctx.fillRect(140, payBoxY, width - 280, payBoxHeight);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(140, payBoxY, width - 280, payBoxHeight);

  // Header du bloc trésorerie
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
  ctx.fillText('RÉCÉPISSÉ DE TRÉSORERIE & PAIEMENT DE LA COTISATION', 180, payBoxY + 50);

  // Grille 2 colonnes
  ctx.fillStyle = '#D8CCC0';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Montant encaissé :', 180, payBoxY + 110);
  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
  ctx.fillText('10,00 € TTC (Dix Euros)', 400, payBoxY + 110);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Objet du règlement :', 180, payBoxY + 160);
  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText('Cotisation annuelle d\'adhésion • Pass Épicurien 2026-2027', 400, payBoxY + 160);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Moyen de paiement :', 180, payBoxY + 210);
  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText(paymentMethodLabel, 400, payBoxY + 210);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Date de validation :', 180, payBoxY + 260);
  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText(formattedDate, 400, payBoxY + 260);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Enregistrement :', 180, payBoxY + 310);
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.fillText('PÔLE TRÉSORERIE/Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx', 400, payBoxY + 310);

  // 8. Droits & Avantages Conférés
  const perksY = 1380;
  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
  ctx.fillText('DROITS & PRIVILÈGES CONFÉRÉS PAR CETTE ADHÉSION :', 140, perksY);

  const perksList = [
    '• Accès aux tarifs préférentiels adhérents (-30%) sur l\'ensemble des dégustations de meules, banquets et soirées.',
    '• Droit de commande prioritaire sur les arrivages de meules d\'alpage entières et coffrets de producteurs.',
    '• Remise permanente sur les articles et textiles de la boutique officielle ECE Terroir.',
    '• Droit de vote à l\'Assemblée Générale et éligibilité aux fonctions du Bureau Exécutif pour 2026-2027.',
  ];

  ctx.fillStyle = '#44403C';
  ctx.font = '16px -apple-system, sans-serif';
  perksList.forEach((perk, i) => {
    ctx.fillText(perk, 140, perksY + 40 + i * 32);
  });

  // 9. Sceau d'Authenticité & QR Code
  const bottomY = 1600;

  // Sceau Confrérie dessiné à gauche
  const sealX = 320;
  const sealY = bottomY + 200;
  const sealR = 110;

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(88, 17, 26, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('★ CONFRÉRIE OFFICIELLE ★', sealX, sealY - 50);

  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('ECE', sealX, sealY);
  ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
  ctx.fillText('TERROIR', sealX, sealY + 30);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.fillText('SCEAU DU BUREAU 2026-2027', sealX, sealY + 65);

  // QR Code officiel scannable au centre-droit
  const qrX = 640;
  const qrY = bottomY + 90;
  const qrSize = 220;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

  try {
    const verifUrl = getVerificationUrl(matricule);
    const qrDataUrl = await QRCode.toDataURL(verifUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#14281D',
        light: '#FFFFFF',
      },
    });

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => resolve();
    });
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch (e) {
    console.error('Erreur dessin QR Code sur attestation', e);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('SCANNER POUR VÉRIFIER L\'AUTHENTICITÉ', qrX + qrSize / 2, qrY + qrSize + 32);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#58111A';
  ctx.fillText(securityCode, qrX + qrSize / 2, qrY + qrSize + 50);

  // 10. Signatures Officielles
  const sigX1 = 1050;
  const sigX2 = 1380;
  const sigY = bottomY + 120;

  ctx.textAlign = 'center';

  // Signature 1 : Président
  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 16px "Playfair Display", Georgia, serif';
  ctx.fillText('Pour le Bureau Exécutif,', sigX1, sigY);
  ctx.font = 'bold 18px "Playfair Display", serif';
  ctx.fillText('Jules HOURY', sigX1, sigY + 30);
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillStyle = '#78716C';
  ctx.fillText('Président Fondateur', sigX1, sigY + 50);

  // Signature stylisée
  ctx.fillStyle = '#58111A';
  ctx.font = 'italic 26px "Playfair Display", cursive';
  ctx.fillText('J. Houry', sigX1, sigY + 110);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX1 - 70, sigY + 125);
  ctx.lineTo(sigX1 + 70, sigY + 125);
  ctx.stroke();

  // Signature 2 : Trésorier
  ctx.fillStyle = '#58111A';
  ctx.font = 'bold 16px "Playfair Display", Georgia, serif';
  ctx.fillText('Pour le Pôle Trésorerie,', sigX2, sigY);
  ctx.font = 'bold 18px "Playfair Display", serif';
  ctx.fillText('Léonard BRAULT', sigX2, sigY + 30);
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillStyle = '#78716C';
  ctx.fillText('Trésorier Général', sigX2, sigY + 50);

  // Signature stylisée
  ctx.fillStyle = '#14281D';
  ctx.font = 'italic 26px "Playfair Display", cursive';
  ctx.fillText('L. Brault', sigX2, sigY + 110);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX2 - 70, sigY + 125);
  ctx.lineTo(sigX2 + 70, sigY + 125);
  ctx.stroke();

  // 11. Pied de Page Légal A4
  ctx.textAlign = 'center';
  ctx.fillStyle = '#78716C';
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillText('Document officiel délivré par ECE Terroir • Valable pour toute l\'année universitaire jusqu\'au 31 août 2027.', width / 2, height - 120);
  ctx.fillText('Toute falsification expose aux sanctions prévues par le règlement intérieur de l\'ECE Paris et l\'article 441-1 du Code Pénal.', width / 2, height - 95);

  return canvas;
}

/**
 * Télécharge directement l'Attestation en PNG / PDF HD
 */
export async function downloadMembershipCertificateHD(user: UserProfile): Promise<void> {
  const canvas = await generateMembershipCertificateCanvas(user);
  const sanitizedName = user.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const fileName = `Attestation_Adhesion_ECE_Terroir_${sanitizedName}_2026-2027.png`;

  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ouvre la boîte d'impression native pour impression directe en format A4
 */
export async function printMembershipCertificate(user: UserProfile): Promise<void> {
  const canvas = await generateMembershipCertificateCanvas(user);
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenêtres pop-up pour imprimer l\'attestation.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Attestation d'Adhésion ECE Terroir — ${user.fullName}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FAF7F2;
        }
        img {
          width: 100vw;
          height: 100vh;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="${dataUrl}" onload="window.print();window.close();" />
    </body>
    </html>
  `);
  printWindow.document.close();
}
