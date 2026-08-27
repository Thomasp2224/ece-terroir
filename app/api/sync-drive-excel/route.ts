import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { UserProfile, MembershipRequest } from '@/lib/types';
import { MOCK_USERS, MOCK_MEMBERSHIP_REQUESTS } from '@/lib/mock-data';
import { getMemberMatricule, getVerificationCode, getVerificationUrl } from '@/lib/utils/matricule';
import { formatDateTimeFrench } from '@/lib/utils';

function getGoogleDrivePaths(): string[] {
  if (process.platform !== 'win32') return [];
  const primary = ['G:', 'Mon Drive', 'ECE Terroir - Drive Officiel', 'PÔLE TRÉSORERIE', 'Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx'].join(path.sep);
  const root = ['G:', 'Mon Drive', 'ECE Terroir - Drive Officiel', 'Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx'].join(path.sep);
  return [primary, root];
}

function generateWorkbook(users: UserProfile[], requests: MembershipRequest[], reqOrigin: string) {
  // 1. Feuille 1 : Registre des Utilisateurs & Adhérents
  const memberRows = users.map((user) => {
    const matricule = getMemberMatricule(user);
    const relatedRequest = requests.find(
      (r) => r.userId === user.id || r.userEmail.toLowerCase() === user.email.toLowerCase()
    );

    const isSuspended = user.status === 'suspended' || user.membershipStatus === 'suspended';
    const isMember = user.role === 'member' || user.role === 'admin' || user.membershipStatus === 'active';
    const isPending = user.membershipStatus === 'pending';

    let cotisationStatus = '⚪ Non Adhérent (Visiteur)';
    let expirationDate = 'N/A';
    let montantText = '0,00 €';

    if (isSuspended) {
      cotisationStatus = '⛔ SUSPENDU / BLOQUÉ PAR LE BUREAU';
      expirationDate = 'ACCÈS RÉVOQUÉ';
      montantText = isMember ? '10,00 € (Suspendu)' : '0,00 €';
    } else if (user.role === 'admin') {
      cotisationStatus = '✅ Validée & Active (Bureau Fondateur)';
      expirationDate = '31/08/2027';
      montantText = '10,00 € (Inclus Bureau)';
    } else if (isMember) {
      cotisationStatus = '✅ Validée & Active (2026-2027)';
      expirationDate = '31/08/2027';
      montantText = '10,00 €';
    } else if (isPending) {
      cotisationStatus = '⏳ En attente de validation / paiement';
      expirationDate = 'En cours';
      montantText = '10,00 € (En attente)';
    }

    const paymentMethodLabel = 
      relatedRequest?.paymentMethod === 'helloasso'
        ? 'Carte Bancaire / HelloAsso'
        : relatedRequest?.paymentMethod === 'cash_foyer'
        ? 'Espèces / Lydia au Foyer des Élèves'
        : relatedRequest?.paymentMethod === 'lydia_transfer'
        ? 'Virement Bancaire'
        : user.role === 'admin'
        ? 'Exonéré (Bureau Fondateur)'
        : isMember
        ? 'HelloAsso / En ligne'
        : 'Aucun (Non adhérent)';

    const validatedDate = relatedRequest?.reviewedAt
      ? formatDateTimeFrench(relatedRequest.reviewedAt)
      : isMember
      ? 'Adhésion Initiale 2026'
      : 'N/A';

    return {
      'Matricule Officiel': matricule,
      'Nom & Prénom': user.fullName,
      'Email Étudiant': user.email,
      'Promotion / Filière': user.promo || 'Non renseigné',
      'Rôle Plateforme': user.role === 'admin' ? 'Administrateur Bureau' : user.role === 'member' ? 'Membre Adhérent' : 'Visiteur',
      'Statut Cotisation (10€)': cotisationStatus,
      'Montant Encaissé': montantText,
      'Date Validation': validatedDate,
      'Mode de Paiement': paymentMethodLabel,
      'Date Expiration Pass': expirationDate,
      'Code Unique Contrôle': getVerificationCode(matricule),
      'URL Contrôle Guichetier': getVerificationUrl(matricule, reqOrigin),
      'Terroirs Favoris': user.favoriteTerroirs ? user.favoriteTerroirs.join(', ') : '',
    };
  });

  const memberWorksheet = XLSX.utils.json_to_sheet(memberRows);

  // Largeurs de colonnes optimales
  memberWorksheet['!cols'] = [
    { wch: 22 }, // Matricule
    { wch: 26 }, // Nom
    { wch: 32 }, // Email
    { wch: 24 }, // Promo
    { wch: 22 }, // Rôle
    { wch: 38 }, // Statut
    { wch: 20 }, // Montant
    { wch: 24 }, // Date val
    { wch: 34 }, // Mode
    { wch: 22 }, // Expiration
    { wch: 24 }, // Code
    { wch: 45 }, // URL
    { wch: 30 }, // Terroirs
  ];

  // 2. Feuille 2 : Statistiques & Bilan Financier
  const totalUsers = users.length;
  const activeMembers = users.filter(
    (u) => (u.role === 'member' || u.role === 'admin' || u.membershipStatus === 'active') && u.status !== 'suspended'
  ).length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended' || u.membershipStatus === 'suspended').length;
  const totalCotisationsCents = activeMembers * 1000;

  const statsRows = [
    { 'Indicateur Trésorerie': 'Année Universitaire', 'Valeur': '2026-2027', 'Notes & Détails': 'Exercice en cours' },
    { 'Indicateur Trésorerie': 'Total Utilisateurs Enregistrés', 'Valeur': totalUsers, 'Notes & Détails': 'Comptes actifs sur la plateforme' },
    { 'Indicateur Trésorerie': 'Nombre d\'Adhérents Officiels (Pass Épicurien Actif)', 'Valeur': activeMembers, 'Notes & Détails': 'Membres en règle de cotisation' },
    { 'Indicateur Trésorerie': 'Demandes d\'Adhésion en Attente', 'Valeur': pendingCount, 'Notes & Détails': 'À vérifier et valider par le Bureau' },
    { 'Indicateur Trésorerie': 'Comptes Suspendus / Révoqués', 'Valeur': suspendedCount, 'Notes & Détails': 'Accès aux avantages suspendu' },
    { 'Indicateur Trésorerie': 'Tarif Unitaire Cotisation', 'Valeur': '10,00 €', 'Notes & Détails': 'Pass annuel donnant accès à -15% boutique et soirées' },
    { 'Indicateur Trésorerie': 'Total Cotisations Encaissées (TTC)', 'Valeur': `${(totalCotisationsCents / 100).toFixed(2).replace('.', ',')} €`, 'Notes & Détails': 'Budget d\'exploitation alloué aux festins et matériel' },
    { 'Indicateur Trésorerie': 'Dernière Synchronisation', 'Valeur': new Date().toLocaleString('fr-FR'), 'Notes & Détails': 'Généré automatiquement par la plateforme' },
  ];

  const statsWorksheet = XLSX.utils.json_to_sheet(statsRows);
  statsWorksheet['!cols'] = [
    { wch: 45 },
    { wch: 25 },
    { wch: 55 },
  ];

  // Création du classeur multi-onglets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, memberWorksheet, '📋 Registre Adhérents & Comptes');
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, '📊 Bilan Trésorerie');

  return workbook;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const users: UserProfile[] = body.users && body.users.length > 0 ? body.users : MOCK_USERS;
    const requests: MembershipRequest[] = body.requests && body.requests.length > 0 ? body.requests : MOCK_MEMBERSHIP_REQUESTS;

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const workbook = generateWorkbook(users, requests, origin);
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const savedLocations: string[] = [];
    const errors: string[] = [];

    // 1. Sauvegarde dans Google Drive (si accessible localement)
    const drivePaths = getGoogleDrivePaths();
    for (const drivePath of drivePaths) {
      try {
        const dir = path.dirname(drivePath);
        if (fs.existsSync(dir)) {
          fs.writeFileSync(drivePath, excelBuffer);
          savedLocations.push(drivePath);
        }
      } catch (e: any) {
        errors.push(`Erreur écriture Drive (${drivePath}): ${e.message}`);
      }
    }

    // 2. Sauvegarde locale de secours (compatible environnement local et cloud)
    try {
      const isCloud = !!process.env.VERCEL;
      const localDir = isCloud ? '/tmp' : path.join(process.cwd(), 'public', 'data');
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      const localPath = path.join(localDir, 'Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx');
      fs.writeFileSync(localPath, excelBuffer);
      savedLocations.push(localPath);
    } catch (e: any) {
      errors.push(`Erreur écriture backup: ${e.message}`);
    }

    const activeCount = users.filter(
      (u) => (u.role === 'member' || u.role === 'admin' || u.membershipStatus === 'active') && u.status !== 'suspended'
    ).length;

    return NextResponse.json({
      success: true,
      message: 'Registre Excel des cotisations synchronisé avec succès !',
      savedLocations,
      errors: errors.length > 0 ? errors : undefined,
      totalUsers: users.length,
      activeMembers: activeCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la génération du fichier Excel' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const workbook = generateWorkbook(MOCK_USERS, MOCK_MEMBERSHIP_REQUESTS, origin);
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Registre_Officiel_Adherents_Cotisations_2026-2027.xlsx"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
