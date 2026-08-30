import nodemailer from 'nodemailer';

const pass = 'ddjcdeafvsnkmhah';

const potentialEmails = [
  'eceterroir@gmail.com',
  'ece.terroir@gmail.com',
  'terroirece@gmail.com',
  'asso.eceterroir@gmail.com',
  'thomas.petit@edu.ece.fr',
  'thomasp2224@gmail.com',
];

async function testConnection() {
  for (const email of potentialEmails) {
    console.log(`Tentative de connexion avec ${email}...`);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: pass,
      },
    });

    try {
      await transporter.verify();
      console.log(`\n🎉 SUCCÈS ! L'adresse email connectée est : ${email}\n`);
      return email;
    } catch (err) {
      console.log(`Échec pour ${email}: ${err.message}`);
    }
  }
}

testConnection();
