import { BlogPost, EventItem, MerchProduct, SocialPost, MembershipRequest } from './types';

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Grande Dégustation : Fromages Fermiers & Charcuteries d\'Exception',
    slug: 'degustation-fromages-charcuteries-automne-2026',
    description: 'Une soirée gourmande réunissant le meilleur de nos terroirs : Saint-Nectaire fermier, Comté 24 mois, Morbier au lait cru et salaisons d\'Auvergne.',
    longDescription: 'Rejoignez-nous pour la soirée incontournable de la rentrée ! Accompagnés par des maîtres affineurs et artisans charcutiers partenaires, découvrez la richesse des traditions fromagères et charcutières françaises. Pains de campagne au levain naturel cuits au feu de bois, beurres d\'alpage et plateaux de salaisons artisanales à volonté.',
    eventType: 'Dégustation',
    startDate: '2026-09-18T19:30:00Z',
    endDate: '2026-09-18T23:00:00Z',
    location: 'Campus ECE Eiffel 1 — Foyer des Élèves',
    coverImageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop',
    priceCents: 1200, // 12.00 €
    helloAssoUrl: 'https://www.helloasso.com/associations/ece-terroir/evenements/degustation-fromages-charcuteries-2026',
    capacity: 60,
    remainingSeats: 14,
    featured: true,
  },
  {
    id: 'evt-2',
    title: 'Week-End Immersion Gastronomique : Alpages & Terroirs de Savoie',
    slug: 'weekend-alpages-terroirs-savoie-2026',
    description: 'Immersion de 2 jours au cœur des alpages : visite de fruitières de Beaufort, ateliers d\'affinage et banquets traditionnels.',
    longDescription: 'Partez à la découverte des traditions culinaires de montagne. Au programme : visite privée de caves d\'affinage séculaires de Beaufort et de Tomme de Savoie fermière, rencontre avec des éleveurs et producteurs passionnés, nuitée en chalet et grand banquet montagnard préparé avec les trésors locaux.',
    eventType: 'Voyage',
    startDate: '2026-10-10T07:00:00Z',
    endDate: '2026-10-11T20:00:00Z',
    location: 'Départ Campus ECE Paris — Direction Beaufort & Tarentaise',
    coverImageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200&auto=format&fit=crop',
    priceCents: 8500, // 85.00 €
    helloAssoUrl: 'https://www.helloasso.com/associations/ece-terroir/evenements/weekend-savoie-2026',
    capacity: 25,
    remainingSeats: 6,
    featured: true,
  },
  {
    id: 'evt-3',
    title: 'Atelier Maître Artisan : Confection de Foie Gras & Terrines de Campagne',
    slug: 'atelier-foie-gras-terrines-2026',
    description: 'Apprenez les secrets d\'assaisonnement et de cuisson au torchon aux côtés d\'un chef charcutier médaillé.',
    longDescription: 'Préparez les fêtes de fin d\'année avec style ! Chaque participant réalisera son propre bocal de terrine ou foie gras artisanal assaisonné selon les recettes traditionnelles du Sud-Ouest, et repartira avec sa création personnalisée ainsi qu\'un livret gourmand exclusif.',
    eventType: 'Atelier',
    startDate: '2026-11-05T18:00:00Z',
    endDate: '2026-11-05T21:00:00Z',
    location: 'Cuisine Pédagogique Partenaire — Paris 15e',
    coverImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    priceCents: 2000, // 20.00 €
    helloAssoUrl: 'https://www.helloasso.com/associations/ece-terroir/evenements/atelier-foie-gras-2026',
    capacity: 20,
    remainingSeats: 8,
    featured: false,
  },
  {
    id: 'evt-4',
    title: 'La Nuit du Terroir : Raclette Suisse à la Meule & Salaisons de Montagne',
    slug: 'nuit-terroir-raclette-meule-2026',
    description: 'Célébration festive annuelle autour de véritables meules de raclette au lait cru raclées au couteau et de charcuteries d\'alpage.',
    longDescription: 'Le rendez-vous convivial le plus attendu de l\'hiver ! Venez déguster des meules entières de raclette fermière au lait cru, servies avec pommes de terre vapeur fondantes, charcuteries fines de montagne, cornichons artisanaux et pain de campagne croustillant.',
    eventType: 'Soirée',
    startDate: '2026-11-19T19:30:00Z',
    endDate: '2026-11-19T23:30:00Z',
    location: 'Campus ECE Eiffel 1 — Cour Centrale & Foyer',
    coverImageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
    priceCents: 1500, // 15.00 €
    helloAssoUrl: 'https://www.helloasso.com/associations/ece-terroir/evenements/soiree-raclette-2026',
    capacity: 80,
    remainingSeats: 32,
    featured: true,
  },
  {
    id: 'evt-5',
    title: 'Gueuleton & Planches du Vendredi Midi',
    slug: 'gueuleton-planches-vendredi-midi',
    description: 'Rassemblement libre au foyer : venez avec vos spécialités régionales ou profitez des planches partagées entre deux cours.',
    longDescription: 'Chaque dernier vendredi du mois, ECE Terroir organise un grand rassemblement convivial et ouvert à tous au Foyer des Élèves. Pas de réservation, pas de billetterie : venez simplement échanger, grignoter un morceau de saucisson ou une tranche de Comté et profiter de la bonne ambiance festive !',
    eventType: 'Rassemblement',
    startDate: '2026-09-25T12:15:00Z',
    endDate: '2026-09-25T14:00:00Z',
    location: 'Campus ECE Eiffel 1 — Foyer des Élèves',
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    priceCents: 0,
    capacity: 0,
    remainingSeats: 0,
    requiresBooking: false,
    featured: true,
  }
];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Les Secrets du Comté AOP : De la prairie jurassienne aux 36 mois d\'affinage',
    slug: 'secrets-du-comte-aop-affinage',
    excerpt: 'L\'herbe fleurie des monts du Jura, le lait cru des vaches Montbéliardes et la patience du maître affineur : immersion dans la légende du Comté.',
    content: `
### Le roi incontesté des fromages de terroir

Issu exclusivement du lait cru des vaches de race Montbéliarde et Simmental nourries à l'herbe fraîche et au foin, le **Comté AOP** est un monument de la gastronomie française. Chaque meule de 40 kg nécessite près de 400 litres de lait et des mois d'attentions quotidiennes en cave d'affinage.

> "Avec le temps, la pâte s'enrichit de cristaux de tyrosine et développe une complexité aromatique allant de la noisette grillée au beurre noisette, jusqu'aux notes d'agrumes confits."

#### L'expérience gustative ECE Terroir
Lors de notre dernière dégustation au foyer de l'école, la comparaison entre un Comté d'été de 12 mois et un Comté d'alpage affiné 24 mois a conquis tous les étudiants. La richesse de texture et l'intensité aromatique témoignent du savoir-faire séculaire de nos artisans partenaires.

Retrouvez nos sélections de fromages d'alpage lors de tous les événements de l'association !
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1000&auto=format&fit=crop',
    category: 'Dégustation',
    author: {
      name: 'Jules H.',
      role: 'Président ECE Terroir',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    publishedAt: '2026-08-20T10:00:00Z',
    readTimeMinutes: 4,
    tags: ['Comté AOP', 'Fromage', 'Affinage', 'Jura', 'Gastronomie'],
  },
  {
    id: 'post-2',
    title: 'Retour sur notre voyage d\'immersion dans les salaisons et alpages d\'Auvergne',
    slug: 'retour-voyage-salaisons-alpages-auvergne-2026',
    excerpt: '35 étudiants de l\'ECE Paris ont arpenté les volcans et plateaux d\'Auvergne pour un week-end 100% gourmand et authentique.',
    content: `
### Deux jours au rythme des fermes d'altitude et des bons gueuletons

Le week-end dernier, la promo ECE Terroir a posé ses valises dans le Cantal et le Puy-de-Dôme. Entre visites d'ateliers de salaisons traditionnelles et fabrication artisanale de Saint-Nectaire fermier au lait cru, les étudiants ont découvert toute la générosité de la table auvergnate.

#### Les temps forts du séjour :
- **Atelier Aligot traditionnel** : Filage de la tome fraîche à la force du poignet sous les conseils avisés d'un maître fromager.
- **Grand Banquet du Terroir** : Truffade croustillante, jambon de coche affiné 24 mois et tartes aux myrtilles sauvages.
- **Dégustation comparative** : Salers de tradition, Cantal entre-deux et Fourme d'Ambert fermière.

Un immense merci à tous les participants pour leur appétit légendaire et leur bonne humeur communicative !
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    category: 'Voyage',
    author: {
      name: 'Thomas P.',
      role: 'Secrétaire Général',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    },
    publishedAt: '2026-08-14T14:30:00Z',
    readTimeMinutes: 3,
    tags: ['Auvergne', 'Voyage', 'Salaisons', 'Saint-Nectaire', 'Vie de l\'Asso'],
  },
  {
    id: 'post-3',
    title: 'Nouveau partenariat avec les Maîtres Fromagers & Salaisonniers Réunis',
    slug: 'nouveau-partenariat-maitres-fromagers-salaisonniers',
    excerpt: 'ECE Terroir s\'associe avec des artisans affineurs pour vous proposer des tarifs préférentiels sur des produits d\'exception.',
    content: `
### Des trésors gastronomiques directement accessibles aux étudiants

Nous sommes très fiers d'annoncer notre nouvelle convention de partenariat pour l'année universitaire 2026-2027. Grâce à cet accord, tous les membres adhérents d'ECE Terroir bénéficieront :
1. De **-20% sur les plateaux de fromages et charcuteries** de saison pour vos soirées et gueuletons.
2. D'un accès privilégié à des meules d'alpage rares médaillées au Concours Général Agricole.
3. D'ateliers dégustation exclusifs animés par des Meilleurs Ouvriers de France (MOF).
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
    category: 'Partenariat',
    author: {
      name: 'Léonard B.',
      role: 'Trésorier',
    },
    publishedAt: '2026-08-05T09:15:00Z',
    readTimeMinutes: 2,
    tags: ['Partenariat', 'Fromages', 'Charcuterie', 'Avantages Membres'],
  },
  {
    id: 'post-4',
    title: 'Élection du Nouveau Bureau 2026-2027 & Feuille de Route de la Confrérie',
    slug: 'election-bureau-2026-2027-feuille-route',
    excerpt: 'L\'Assemblée Générale d\'ECE Terroir a validé l\'élection de la nouvelle équipe dirigeante et un calendrier record de dégustations.',
    content: `
### Une nouvelle saison placée sous le signe de l'abondance et du partage

L'Assemblée Générale annuelle d'ECE Terroir s'est tenue avec un enthousiasme exceptionnel au campus Eiffel 1. Les adhérents ont approuvé à l'unanimité le bilan moral et financier de l'exercice précédent et élu le nouveau Bureau :
- **Président** : Jules Houry
- **Secrétaire Général** : Thomas Petit
- **Trésorier** : Léonard Brault
- **Responsable Événements** : Jerry Wang

Au programme de cette année : 12 grandes dégustations au Foyer, 2 voyages immersifs dans les alpages et l'Auvergne, et le lancement de la grande commande groupée d'artisans pour Noël !
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
    category: 'Vie de l\'asso',
    author: {
      name: 'Jules H.',
      role: 'Président ECE Terroir',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    publishedAt: '2026-08-01T11:00:00Z',
    readTimeMinutes: 3,
    tags: ['Vie de l\'asso', 'Bureau', 'Assemblée Générale', 'ECE Paris'],
  }
];

export const MOCK_PRODUCTS: MerchProduct[] = [
  {
    id: 'prod-1',
    name: 'Hoodie Officiel ECE Terroir — Édition Prestige "Gueuleton & Tradition"',
    slug: 'hoodie-officiel-ece-terroir-bordeaux',
    description: 'Sweat à capuche premium en coton biologique lourd (380g/m²). Logo brodé cœur au fil doré et dos sérigraphié "L\'Art de Bien Manger à la Française". Coupe unisexe confortable et molleton ultra-doux brossé.',
    priceCents: 3500, // 35.00 €
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Textile',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    featured: true,
    origin: 'Atelier Textile Éco-responsable (Broderie Île-de-France)',
    craftsmanship: 'Broderie artisanale haute densité au fil or satiné & sérigraphie végétale durable',
    materials: '85% Coton biologique certifié GOTS (380g/m²), 15% Polyester recyclé',
    careInstructions: 'Lavage en machine à 30°C sur l\'envers. Ne pas repasser directement sur les broderies.',
    dimensionsOrWeight: 'Grammage lourd 380g/m² — Coupe droite mixte',
  },
  {
    id: 'prod-2',
    name: 'Planche de Dégustation en Chêne Massif Gravée ECE Terroir',
    slug: 'planche-degustation-chene-massif-gravee',
    description: 'Planche de service et découpe artisanale taillée dans un chêne massif français avec rigole à jus et poignée ergonomique biseautée. Gravure laser haute précision "ECE Terroir — Maîtres du Gueuleton".',
    priceCents: 1900, // 19.00 €
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    secondaryImages: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Accessoires',
    stock: 35,
    featured: true,
    origin: 'Menuiserie Artisanale Jurassienne (France)',
    craftsmanship: 'Découpe numérique, ponçage fin à la main & gravure laser inaltérable',
    materials: '100% Chêne massif français certifié PEFC, nourri à l\'huile de lin biologique',
    careInstructions: 'Nettoyage à l\'éponge tiède sans immersion. Ne pas passer au lave-vaisselle. Huiler 1 à 2 fois par an.',
    dimensionsOrWeight: '42 x 22 x 2.2 cm — Poids : 1.35 kg',
  },
  {
    id: 'prod-3',
    name: 'Couteau de Terroir Pliant avec Manche en Bois de Noyer & Lame Inox',
    slug: 'couteau-terroir-pliant-noyer',
    description: 'Couteau traditionnel de poche pour découper fromages affinés, tomes de Savoie et saucissons secs en pique-nique ou en soirée. Lame en acier inoxydable Sandvik trempé avec système de virole de sécurité.',
    priceCents: 1600, // 16.00 €
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    category: 'Accessoires',
    stock: 28,
    featured: true,
    origin: 'Coutellerie d\'Art de Thiers (Puy-de-Dôme, Auvergne)',
    craftsmanship: 'Montage traditionnel à rivets bombés & émouture fine pour une coupe nette du saucisson',
    materials: 'Lame Acier Inox Sandvik 12C27 (Dureté 57 HRC) & Manche en noyer français noble',
    careInstructions: 'Essuyer la lame après chaque utilisation avec un chiffon sec. Éviter le contact prolongé avec l\'eau.',
    dimensionsOrWeight: 'Lame 8.5 cm — Longueur ouvert : 19.5 cm — 65 g',
  },
  {
    id: 'prod-4',
    name: 'Coffret Gourmand "Tour de France des Bons Terroirs"',
    slug: 'coffret-gourmand-tour-de-france-terroirs',
    description: 'Un coffret garni composé d\'une terrine de canard du Sud-Ouest aux cèpes (180g), de véritables rillettes artisanales du Mans, d\'un sachet de biscuits salés au Comté 18 mois et d\'un confit d\'oignons doux des Cévennes.',
    priceCents: 2400, // 24.00 €
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
    category: 'Coffrets Gourmands',
    stock: 15,
    featured: false,
    origin: 'Producteurs et conserveries artisanales sélectionnées (France)',
    craftsmanship: 'Recettes sans conservateurs ni additifs chimiques, mijotées selon les traditions régionales',
    materials: 'Coffret en carton kraft recyclé orné d\'un ruban bordeaux et sceau ECE Terroir',
    careInstructions: 'À conserver au sec et à l\'abri de la lumière. Réfrigérer après ouverture.',
    dimensionsOrWeight: 'Poids net total : 720g de délices du terroir',
  },
  {
    id: 'prod-5',
    name: 'Tablier de Chef Brodé "Maître du Terroir & Bon Vivant"',
    slug: 'tablier-chef-brode-maitre-terroir',
    description: 'Tablier de cuisine robuste 100% toile de lin et coton vert forêt avec attaches croisées réglables en cuir végétal, anneau porte-torchon et double poche ventrale renforcée.',
    priceCents: 2200, // 22.00 €
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    category: 'Textile',
    stock: 18,
    featured: false,
    origin: 'Confection Atelier Lyonnais (France)',
    craftsmanship: 'Coutures triples renforcées et œillets en laiton vieilli antique',
    materials: '60% Toile de lin naturelle, 40% Coton peigné lourd (320g/m²), lanières en cuir végétal',
    careInstructions: 'Détacher les lanières en cuir avant lavage en machine à 40°C.',
    dimensionsOrWeight: 'Taille réglable universelle (85 x 70 cm) — 380 g',
  },
  {
    id: 'prod-6',
    name: 'Duo de Verres à Dégustation INAO Gravés "ECE Terroir"',
    slug: 'duo-verres-degustation-inao-graves',
    description: 'Coffret de deux verres officiels de dégustation en cristal sans plomb, gravés au blason doré d\'ECE Terroir. Forme tulipe idéale pour révéler les arômes des cépages et vins de nos régions.',
    priceCents: 1500, // 15.00 €
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    category: 'Verre & Sommelerie',
    stock: 20,
    featured: true,
    origin: 'Verrerie d\'Art Française (Alsace)',
    craftsmanship: 'Cristallin haute transparence, paraison équilibrée & gravure inaltérable',
    materials: 'Cristal sans plomb renforcé au titane (brillance durable)',
    careInstructions: 'Lavable au lave-vaisselle cycle délicat / verre.',
    dimensionsOrWeight: 'Contenance 21 cl — Hauteur 15.5 cm',
  },
  {
    id: 'prod-7',
    name: 'Couteau Sommelier & Tire-Bouchon Professionnel en Bois d\'Olivier',
    slug: 'couteau-sommelier-professionnel-bois-olivier',
    description: 'Limonadier de maître avec manche en bois d\'olivier massif, mèche téflonnée 5 spires pour ne jamais casser les bouchons en liège, décapsuleur et coupe-capsule cranté.',
    priceCents: 1800, // 18.00 €
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    category: 'Verre & Sommelerie',
    stock: 25,
    featured: false,
    origin: 'Forge de Thiers (Auvergne)',
    craftsmanship: 'Double levier breveté pour une extraction fluide sans effort',
    materials: 'Acier inoxydable brossé & Manche en olivier méditerranéen veiné',
    careInstructions: 'Nettoyage au chiffon doux. Ne pas immerger le bois.',
    dimensionsOrWeight: 'Longueur fermé : 12 cm — 110 g',
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'soc-1',
    platform: 'instagram',
    author: 'ECE Terroir',
    handle: '@eceterroir',
    content: 'Grand festin de la rentrée au campus Eiffel 1 🧀✨ Plus de 70 étudiants réunis autour de nos meules de Comté 24 mois, Morbier fermier et salaisons d\'alpage. Merci à tous pour cette ambiance royale !',
    mediaUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop',
    likesCount: 342,
    commentsCount: 28,
    postUrl: 'https://www.instagram.com/eceterroir/',
    publishedAt: '2026-08-22T21:00:00Z',
  },
  {
    id: 'soc-2',
    platform: 'tiktok',
    author: 'ECE Terroir',
    handle: '@ece.terroir',
    content: 'POV : Quand la meule de raclette au lait cru arrive au foyer des élèves 🧀🤤 Les ingénieurs savent ce qui est bon ! #terroir #fromage #bonvivant #eceparis #gastronomie',
    mediaUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
    likesCount: 1890,
    commentsCount: 112,
    postUrl: 'https://www.tiktok.com/@ece.terroir',
    publishedAt: '2026-08-19T18:30:00Z',
  },
  {
    id: 'soc-3',
    platform: 'instagram',
    author: 'ECE Terroir',
    handle: '@eceterroir',
    content: 'Les nouvelles planches de dégustation en chêne massif gravées "ECE Terroir — Maîtres du Gueuleton" et les hoodies brodés sont arrivés ! Retrait Click & Collect dès lundi 🪵🔪',
    mediaUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
    likesCount: 420,
    commentsCount: 35,
    postUrl: 'https://www.instagram.com/eceterroir/',
    publishedAt: '2026-08-15T12:00:00Z',
  },
  {
    id: 'soc-4',
    platform: 'tiktok',
    author: 'ECE Terroir',
    handle: '@ece.terroir',
    content: 'Test du découpage parfait de saucisson sec avec notre couteau de poche traditionnel en bois de noyer 🔪🇫🇷 #eceterroir #couteau #saucisson #apero #paris',
    mediaUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop',
    likesCount: 2430,
    commentsCount: 96,
    postUrl: 'https://www.tiktok.com/@ece.terroir',
    publishedAt: '2026-08-10T17:45:00Z',
  }
];

export const MOCK_BUREAU = [
  {
    name: 'Jules Houry',
    role: 'Président',
    promo: 'ECE Promo 2028 (Majeure data & IA)',
    quote: 'Transmettre la passion des terroirs et faire de chaque gueuleton un moment inoubliable.',
    imageUrl: '',
  },
  {
    name: 'Thomas Petit',
    role: 'Secrétaire Général',
    promo: 'ECE Promo 2028 (Majeure Data & IA)',
    quote: 'La Lorraine dans le cœur, le bon pâté et les mirabelles sur la table !',
    imageUrl: '',
  },
  {
    name: 'Léonard Brault',
    role: 'Trésorier',
    promo: 'ECE Promo 2028 (Majeure Finance)',
    quote: 'Des comptes aussi savoureux et équilibrés qu\'une meule de Comté 24 mois.',
    imageUrl: '',
  },
  {
    name: 'Jerry Wang',
    role: 'Responsable Événements & Billetterie',
    promo: 'ECE Promo 2028 (Majeure Data & IA)',
    quote: 'Organiser les plus beaux festins pour régaler tous les étudiants du campus.',
    imageUrl: '',
  }
];

export const MOCK_USERS = [
  {
    id: 'usr-1',
    email: 'jules.houry@edu.ece.fr',
    fullName: 'Jules Houry',
    promo: 'Ingé 4 (Promo 2028)',
    role: 'admin' as const,
    status: 'active' as const,
    bio: 'Président passionné de gastronomie régionale, fromages d\'alpage et cuisine de terroir.',
    favoriteTerroirs: ['Auvergne', 'Jura', 'Savoie'],
    createdAt: '2026-01-10T10:00:00Z',
    lastLogin: '2026-08-25T19:40:00Z',
  },
  {
    id: 'usr-2',
    email: 'thomas.petit@edu.ece.fr',
    fullName: 'Thomas Petit',
    promo: 'Ingé 4 (Promo 2028)',
    role: 'admin' as const,
    status: 'active' as const,
    bio: 'Secrétaire Général passionné des spécialités lorraines, charcuteries et fromages à pâte persillée.',
    favoriteTerroirs: ['Lorraine', 'Auvergne', 'Périgord'],
    createdAt: '2026-01-12T11:30:00Z',
    lastLogin: '2026-08-25T18:15:00Z',
  },
  {
    id: 'usr-3',
    email: 'leonard.brault@edu.ece.fr',
    fullName: 'Léonard Brault',
    promo: 'Ingé 4 (Promo 2028)',
    role: 'member' as const,
    status: 'active' as const,
    bio: 'Trésorier et grand amateur de charcuteries fines de montagne et de fondues savoyardes.',
    favoriteTerroirs: ['Savoie', 'Pays Basque'],
    createdAt: '2026-02-01T14:00:00Z',
    lastLogin: '2026-08-24T12:00:00Z',
  },
  {
    id: 'usr-4',
    email: 'jerry.wang@edu.ece.fr',
    fullName: 'Jerry Wang',
    promo: 'Ingé 4 (Promo 2028)',
    role: 'admin' as const,
    status: 'active' as const,
    bio: 'Responsable Événements, toujours prêt à organiser le prochain grand gueuleton.',
    favoriteTerroirs: ['Jura', 'Bretagne', 'Normandie'],
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-08-25T17:00:00Z',
  },
  {
    id: 'usr-5',
    email: 'emma.roy@edu.ece.fr',
    fullName: 'Emma Roy',
    promo: 'Ingé 1 (Promo 2029)',
    role: 'member' as const,
    status: 'active' as const,
    bio: 'Nouvelle adhérente impatiente de découvrir les ateliers culinaires et dégustations.',
    favoriteTerroirs: ['Périgord', 'Savoie'],
    createdAt: '2026-08-15T16:20:00Z',
    lastLogin: '2026-08-23T20:10:00Z',
  },
  {
    id: 'usr-6',
    email: 'antoine.dubois@edu.ece.fr',
    fullName: 'Antoine Dubois',
    promo: 'Mastère (Promo 2026)',
    role: 'member' as const,
    status: 'active' as const,
    membershipStatus: 'active' as const,
    bio: 'Adhérent passionné de salaisons traditionnelles et fromages de chèvre.',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'usr-7',
    email: 'maxime.lefebvre@edu.ece.fr',
    fullName: 'Maxime Lefebvre',
    promo: 'Ingé 2 (Promo 2028)',
    role: 'visitor' as const,
    status: 'active' as const,
    membershipStatus: 'pending' as const,
    membershipPaymentMethod: 'helloasso' as const,
    membershipRequestedAt: '2026-08-25T14:30:00Z',
    bio: 'Étudiant en Ingé 2 souhaitant rejoindre l\'association et participer aux dégustations.',
    createdAt: '2026-08-25T14:25:00Z',
  },
  {
    id: 'usr-8',
    email: 'chloe.moreau@edu.ece.fr',
    fullName: 'Chloé Moreau',
    promo: 'Ingé 1 (Promo 2029)',
    role: 'visitor' as const,
    status: 'active' as const,
    membershipStatus: 'none' as const,
    bio: 'Nouvelle arrivante à l\'ECE Paris curieuse de découvrir le terroir.',
    createdAt: '2026-08-25T16:00:00Z',
  }
];

export const MOCK_MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  {
    id: 'req-1',
    userId: 'usr-7',
    userName: 'Maxime Lefebvre',
    userEmail: 'maxime.lefebvre@edu.ece.fr',
    userPromo: 'Ingé 2 (Promo 2028)',
    amountCents: 1000, // 10.00 €
    paymentMethod: 'helloasso',
    status: 'pending',
    requestedAt: '2026-08-25T14:30:00Z',
    notes: 'Paiement effectué via HelloAsso (Réf: HA-2026-94812). En attente de validation.',
  },
  {
    id: 'req-2',
    userId: 'usr-8',
    userName: 'Chloé Moreau',
    userEmail: 'chloe.moreau@edu.ece.fr',
    userPromo: 'Ingé 1 (Promo 2029)',
    amountCents: 1000,
    paymentMethod: 'cash_foyer',
    status: 'pending',
    requestedAt: '2026-08-25T16:15:00Z',
    notes: 'Règlement en espèces de 10 € prévu lors de la permanence au Foyer des élèves.',
  }
];

export const MOCK_ADMIN_LOGS = [
  {
    id: 'log-101',
    timestamp: '2026-08-25T19:40:12Z',
    userEmail: 'jules.houry@edu.ece.fr',
    userName: 'Jules Houry (Président)',
    action: 'Connexion Admin',
    category: 'auth' as const,
    details: 'Connexion réussie au Dashboard d\'administration depuis le campus ECE.',
  },
  {
    id: 'log-102',
    timestamp: '2026-08-25T18:22:45Z',
    userEmail: 'thomas.petit@edu.ece.fr',
    userName: 'Thomas Petit',
    action: 'Modification Événement',
    category: 'event' as const,
    details: 'Mise à jour des quotas pour la Dégustation Fromages & Charcuteries d\'Automne (60 places).',
  },
  {
    id: 'log-103',
    timestamp: '2026-08-25T17:15:30Z',
    userEmail: 'jules.houry@edu.ece.fr',
    userName: 'Jules Houry (Président)',
    action: 'Mise à jour Stock',
    category: 'product' as const,
    details: 'Ajustement du stock de Planches en Chêne Massif Gravées (+15 unités).',
  },
  {
    id: 'log-104',
    timestamp: '2026-08-24T14:10:00Z',
    userEmail: 'thomas.petit@edu.ece.fr',
    userName: 'Thomas Petit',
    action: 'Publication Article',
    category: 'post' as const,
    details: 'Publication de l\'article « Les Secrets du Comté AOP : De la prairie jurassienne aux 36 mois d\'affinage ».',
  },
  {
    id: 'log-105',
    timestamp: '2026-08-24T11:05:18Z',
    userEmail: 'jules.houry@edu.ece.fr',
    userName: 'Jules Houry',
    action: 'Attribution Rôle Membre',
    category: 'user' as const,
    details: 'Validation de l\'adhésion pour Emma Roy (emma.roy@edu.ece.fr).',
  },
];

export const MOCK_CHECK_INS: import('./types').CheckInRecord[] = [
  {
    id: 'chk-1',
    eventId: 'evt-1',
    eventTitle: 'Grande Dégustation : Fromages Fermiers & Charcuteries d\'Exception',
    userId: 'usr-1',
    userMatricule: 'ECE-TERR-2026-4580',
    userName: 'Thomas Petit',
    userEmail: 'thomas.petit@edu.ece.fr',
    userPromo: 'Ingé 3 (Promo 2027)',
    isMember: true,
    checkedInAt: '2026-09-18T19:34:12Z',
    checkedInBy: 'Jules Houry (Président)',
    entryStatus: 'valid',
    notes: 'Pass Épicurien VIP',
  },
  {
    id: 'chk-2',
    eventId: 'evt-1',
    eventTitle: 'Grande Dégustation : Fromages Fermiers & Charcuteries d\'Exception',
    userId: 'usr-4',
    userMatricule: 'ECE-TERR-2026-1042',
    userName: 'Camille Leroy',
    userEmail: 'camille.leroy@edu.ece.fr',
    userPromo: 'Ingé 2 (Promo 2028)',
    isMember: true,
    checkedInAt: '2026-09-18T19:40:05Z',
    checkedInBy: 'Léonard Brault (Trésorier)',
    entryStatus: 'valid',
  },
  {
    id: 'chk-3',
    eventId: 'evt-1',
    eventTitle: 'Grande Dégustation : Fromages Fermiers & Charcuteries d\'Exception',
    userId: 'usr-5',
    userMatricule: 'ECE-TERR-2026-3891',
    userName: 'Alexandre Moreau',
    userEmail: 'alexandre.moreau@edu.ece.fr',
    userPromo: 'Ingé 1 (Promo 2029)',
    isMember: false,
    checkedInAt: '2026-09-18T19:45:22Z',
    checkedInBy: 'Jules Houry (Président)',
    entryStatus: 'warning_non_member',
    notes: 'Entrée plein tarif 15€ payée sur place',
  },
];

export const MOCK_ORDERS: import('./types').MerchOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'CMD-2026-8941',
    voucherCode: 'CMD-2026-8941',
    userId: 'usr-3',
    userEmail: 'leonard.brault@edu.ece.fr',
    userName: 'Léonard Brault',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1, selectedSize: 'L' },
      { product: MOCK_PRODUCTS[1], quantity: 1 },
    ],
    totalCents: 5400,
    paymentMethod: 'cash_on_pickup',
    status: 'ready_for_pickup',
    pickupLocation: 'Foyer des Élèves ECE Paris (Bâtiment Eiffel 1)',
    pickupNotes: 'Commande préparée dans un sac en kraft recyclable avec le livret de bienvenue.',
    createdAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'CMD-2026-5210',
    voucherCode: 'CMD-2026-5210',
    userId: 'usr-1',
    userEmail: 'jules.houry@edu.ece.fr',
    userName: 'Jules Houry',
    items: [
      { product: MOCK_PRODUCTS[2], quantity: 1 },
      { product: MOCK_PRODUCTS[3], quantity: 1 },
    ],
    totalCents: 4000,
    paymentMethod: 'online',
    status: 'completed',
    pickupLocation: 'Foyer des Élèves ECE Paris (Bâtiment Eiffel 1)',
    pickupNotes: 'Retiré par le titulaire le 24/08 au foyer.',
    createdAt: '2026-08-20T11:15:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'CMD-2026-3194',
    voucherCode: 'CMD-2026-3194',
    userId: 'usr-2',
    userEmail: 'thomas.petit@edu.ece.fr',
    userName: 'Thomas Petit',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1, selectedSize: 'M' },
    ],
    totalCents: 3500,
    paymentMethod: 'cash_on_pickup',
    status: 'ready_for_pickup',
    pickupLocation: 'Foyer des Élèves ECE Paris (Bâtiment Eiffel 1)',
    pickupNotes: 'En attente de retrait lors de la prochaine permanence.',
    createdAt: '2026-08-25T17:40:00Z',
  },
];


