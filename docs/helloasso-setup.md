# ⚡ Guide de Configuration HelloAsso — ECE Terroir

Ce document récapitule les étapes pour finaliser l'interconnexion entre le compte **HelloAsso** de l'association et la plateforme web **ECE Terroir**.

---

## 1. Webhook Automatique en Temps Réel (Recommandé)

Le Webhook permet à votre site de recevoir instantanément les paiements et adhésions effectués sur HelloAsso, de créer les profils dans Supabase, d'attribuer le matricule et d'expédier le Pass Épicurien par email depuis `eceterroir@gmail.com`.

### Étapes sur le compte HelloAsso :
1. Connectez-vous sur [admin.helloasso.com](https://admin.helloasso.com/).
2. Rendez-vous dans **Paramètres** (ou **Intégrations & API**) > **Webhooks / Notifications**.
3. Cliquez sur **Ajouter une notification**.
4. Renseignez l'URL suivante :
   ```
   https://ece-terroir.vercel.app/api/webhooks/helloasso
   ```
5. Cochez les événements :
   - `Order` (Commande effectuée / Adhésion validée)
   - `Payment` (Paiement validé)
   - `Form` (Formulaire soumis)
6. Enregistrez.

---

## 2. Synchronisation Manuelle via l'API v5 (Optionnel)

Si vous souhaitez utiliser le bouton **« 🔄 Synchroniser avec HelloAsso »** dans le Dashboard Bureau (`/admin`) :

1. Sur HelloAsso, allez dans **Paramètres** > **Intégrations & API** > **Identifiants API**.
2. Récupérez :
   - **Client ID**
   - **Client Secret**
   - **Slug de l'organisation** (ex: `ece-terroir`)
3. Ajoutez ces variables dans votre fichier `.env.local` et sur Vercel :
   ```env
   HELLOASSO_CLIENT_ID=votre_client_id
   HELLOASSO_CLIENT_SECRET=votre_client_secret
   HELLOASSO_ORGANIZATION_SLUG=ece-terroir
   ```

---

## 3. Endpoints & Fichiers Créés dans le Projet

| Fichier | Rôle |
| :--- | :--- |
| `app/api/webhooks/helloasso/route.ts` | Endpoint de réception des webhooks HelloAsso (Mise à jour Supabase + Envoi email Pass Épicurien) |
| `lib/helloasso/client.ts` | Client OAuth2 & API v5 HelloAsso pour l'import des commandes et membres |
| `app/api/helloasso/sync/route.ts` | Route API déclenchée par le bouton Admin pour la synchronisation à la demande |
| `lib/email/mailer.ts` | Service SMTP Gmail (`eceterroir@gmail.com`) pour les emails d'adhésion, commandes et billets |
