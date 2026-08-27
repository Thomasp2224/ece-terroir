/**
 * Moteur de génération Canvas pour la Carte d'Adhérent Officielle ECE Terroir
 * Rendu haute résolution (1200x756px @ 300 DPI) avec QR Code scannable et synchronisé
 */

import QRCode from 'qrcode';
import { getVerificationUrl, getVerificationCode } from './matricule';

export interface MemberCardData {
  fullName: string;
  promo?: string;
  role: string;
  memberId: string;
  validUntil?: string;
  favoriteTerroirs?: string[];
}

export async function downloadMemberCardHD(data: MemberCardData) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 756;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Fond luxueux dégradé Bistrot & Velours Vin profond
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#3A0B11'); // Bordeaux très sombre
  bgGrad.addColorStop(0.4, '#58111A'); // Vin signature ECE Terroir
  bgGrad.addColorStop(0.8, '#2D080D');
  bgGrad.addColorStop(1, '#14281D'); // Touche vert sapin dans l'angle
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Trame guillochée & textures de sécurité (Lignes fines en or)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
  ctx.lineWidth = 1;
  for (let i = -width; i < width * 2; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // 3. Cadre & liseré or royal
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Double liseré fin intérieur
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Coins décoratifs
  const corners = [
    [48, 48],
    [width - 48, 48],
    [48, height - 48],
    [width - 48, height - 48],
  ];
  ctx.fillStyle = '#D4AF37';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Header Institutionnel
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('ASSOCIATION ÉPICURIENNE • ECE PARIS EIFFEL', 80, 95);

  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillText('ECE TERROIR', 80, 150);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('CARTE OFFICIELLE D\'ADHÉRENT • ANNÉE 2026 - 2027', 80, 185);

  // Ligne de séparation dorée
  const lineGrad = ctx.createLinearGradient(80, 0, width - 80, 0);
  lineGrad.addColorStop(0, '#D4AF37');
  lineGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.2)');
  lineGrad.addColorStop(1, '#D4AF37');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 215);
  ctx.lineTo(width - 80, 215);
  ctx.stroke();

  // 5. Bloc Informations Adhérent
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('TITULAIRE DE LA CARTE', 80, 275);

  // Nom complet
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px "Playfair Display", Georgia, serif';
  ctx.fillText(data.fullName.toUpperCase(), 80, 335);

  // Rôle & Promotion
  const isBureau = data.role === 'admin';
  const roleText = isBureau ? 'MEMBRE DU BUREAU EXÉCUTIF' : 'MEMBRE ADHÉRENT ACTIF';

  // Badge de rôle
  ctx.fillStyle = isBureau ? '#D4AF37' : '#1B3B2B';
  ctx.fillRect(80, 365, isBureau ? 320 : 280, 36);
  ctx.fillStyle = isBureau ? '#58111A' : '#D4AF37';
  ctx.font = 'bold 16px -apple-system, sans-serif';
  ctx.fillText(roleText, 95, 390);

  // Promotion
  ctx.fillStyle = '#FDFBF7';
  ctx.font = '22px "Playfair Display", serif';
  ctx.fillText(data.promo || 'Étudiant ECE Paris', 80, 445);

  // Matricule Unique
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('MATRICULE ADHÉRENT', 80, 505);

  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.fillText(data.memberId, 80, 545);

  // Date de Validité
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('VALIDITÉ', 400, 505);

  ctx.fillStyle = '#FDFBF7';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.fillText(data.validUntil || '31 / 08 / 2027', 400, 545);

  // 6. Sceau d'Authenticité & Emblème Confrérie (Dessiné à droite)
  const sealX = width - 260;
  const sealY = 360;
  const sealRadius = 85;

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ SCEAU OFFICIEL ★', sealX, sealY - 40);
  ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
  ctx.fillText('ECE', sealX, sealY);
  ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
  ctx.fillText('TERROIR', sealX, sealY + 24);
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('2026 - 2027', sealX, sealY + 48);
  ctx.textAlign = 'left';

  // 7. QR Code Haute Définition Synchronisé avec l'URL de vérification
  const qrX = width - 180;
  const qrY = height - 180;
  const qrSize = 110;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);

  try {
    const verifUrl = getVerificationUrl(data.memberId);
    const qrDataUrl = await QRCode.toDataURL(verifUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#1D1917',
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
  } catch (err) {
    console.error('Erreur génération QR Code:', err);
  }

  // 8. Pied de page & signatures
  ctx.fillStyle = '#D4AF37';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillText('Campus Eiffel 1 • 10 Rue Sextius Michel, 75015 Paris • Registre Pôle Trésorerie', 80, height - 70);

  ctx.fillStyle = '#D8CCC0';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('Scannez le QR Code pour afficher le certificat de validation officiel.', 80, height - 50);

  // Déclencher le téléchargement de l'image
  const sanitizedName = data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const fileName = `Carte_Adherent_ECE_Terroir_${sanitizedName}.png`;

  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
