# 📸 Guide du Flux Instagram en Direct — ECE Terroir

Le site est interconnecté en temps réel avec le compte Instagram officiel **[@eceterroir](https://www.instagram.com/eceterroir/)** via le connecteur **Behold.so**.

---

## 1. Fonctionnement Automatique 365j/an

* Chaque nouvelle publication postée sur le compte Instagram est automatiquement récupérée et affichée dans le widget de la page d'accueil.
* Les images sont hébergées sur le CDN permanent de Behold.so (aucun lien expiré de Meta).
* Les likes réels, la date et le lien direct vers le post sont inclus.

---

## 2. Configuration & Variables d'Environnement

* **Feed ID** : `r9AjyLBzjUahSGLW8RwD`
* **URL du Flux JSON** : `https://feeds.behold.so/r9AjyLBzjUahSGLW8RwD`

### Variable à configurer sur Vercel (Project Settings > Environment Variables) :
```env
INSTAGRAM_FEED_URL=https://feeds.behold.so/r9AjyLBzjUahSGLW8RwD
NEXT_PUBLIC_INSTAGRAM_FEED_URL=https://feeds.behold.so/r9AjyLBzjUahSGLW8RwD
```

---

## 3. Fichiers du Projet

* `app/api/instagram/feed/route.ts` : Route API backend avec cache Next.js ISR (revalidation automatique toutes les 30 min).
* `components/widgets/SocialLiveFeedWidget.tsx` : Widget interactif affichant les polaroids animés sur la page d'accueil.
