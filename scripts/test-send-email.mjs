import { sendMembershipEmail } from '../lib/email/mailer.ts';

// Set environment variables
process.env.SMTP_USER = 'eceterroir@gmail.com';
process.env.SMTP_PASS = 'ddjcdeafvsnkmhah';
process.env.SMTP_HOST = 'smtp.gmail.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_FROM = '"ECE Terroir • Confrérie" <eceterroir@gmail.com>';

async function run() {
  console.log('Envoi d\'un email de test d\'adhésion en direct à eceterroir@gmail.com...');
  const res = await sendMembershipEmail({
    fullName: 'Thomas Petit',
    email: 'eceterroir@gmail.com',
    promo: 'ING4 (Promo 2028)',
    matricule: 'ECE-TERR-2026-0001',
    amountCents: 1000,
    approvedAt: new Date().toISOString(),
  });
  console.log('Résultat:', res);
}

run();
