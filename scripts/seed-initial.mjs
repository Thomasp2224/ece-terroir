import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoiplveaodszznofacty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaXBsdmVhb2Rzenpub2ZhY3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMTMxNTksImV4cCI6MjEwMzY4OTE1OX0.m1dytZGQeh7qwdzPTWMKcip0o43ivVzKJpGYIf9vg6Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Initialisation Supabase Cloud pour ECE Terroir ---');

  // 1. Événements
  const events = [
    {
      id: 'evt-1',
      title: "Grande Dégustation : Fromages Fermiers & Charcuteries d'Exception",
      slug: 'degustation-fromages-charcuteries-automne-2026',
      description: "Une soirée gourmande réunissant le meilleur de nos terroirs : Saint-Nectaire fermier, Comté 24 mois, Morbier au lait cru et salaisons d'Auvergne.",
      long_description: "Rejoignez-nous pour la soirée incontournable de la rentrée ! Accompagnés par des maîtres affineurs et artisans charcutiers partenaires, découvrez la richesse des traditions fromagères et charcutières françaises.",
      event_type: 'Dégustation',
      start_date: '2026-09-18T19:30:00Z',
      end_date: '2026-09-18T23:00:00Z',
      location: 'Campus ECE Eiffel 1 — Foyer des Élèves',
      cover_image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop',
      price_cents: 1200,
      capacity: 60,
      remaining_seats: 14,
      requires_booking: true,
      featured: true
    },
    {
      id: 'evt-2',
      title: 'Week-End Immersion Gastronomique : Alpages & Terroirs de Savoie',
      slug: 'weekend-alpages-terroirs-savoie-2026',
      description: "Immersion de 2 jours au cœur des alpages : visite de fruitières de Beaufort, ateliers d'affinage et banquets traditionnels.",
      long_description: 'Partez à la découverte des traditions culinaires de montagne. Au programme : visite privée de caves d\'affinage séculaires de Beaufort et de Tomme de Savoie fermière.',
      event_type: 'Voyage',
      start_date: '2026-10-10T07:00:00Z',
      end_date: '2026-10-11T20:00:00Z',
      location: 'Départ Campus ECE Paris — Direction Beaufort & Tarentaise',
      cover_image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200&auto=format&fit=crop',
      price_cents: 8500,
      capacity: 25,
      remaining_seats: 6,
      requires_booking: true,
      featured: true
    },
    {
      id: 'evt-3',
      title: 'Atelier Maître Artisan : Confection de Foie Gras & Terrines de Campagne',
      slug: 'atelier-foie-gras-terrines-2026',
      description: "Apprenez les secrets d'assaisonnement et de cuisson au torchon aux côtés d'un chef charcutier médaillé.",
      long_description: 'Préparez les fêtes de fin d\'année avec style ! Chaque participant réalisera son propre bocal de terrine ou foie gras artisanal.',
      event_type: 'Atelier',
      start_date: '2026-11-05T18:00:00Z',
      end_date: '2026-11-05T21:00:00Z',
      location: 'Cuisine Pédagogique Partenaire — Paris 15e',
      cover_image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      price_cents: 2000,
      capacity: 20,
      remaining_seats: 8,
      requires_booking: true,
      featured: false
    },
    {
      id: 'evt-4',
      title: 'La Nuit du Terroir : Raclette Suisse à la Meule & Salaisons de Montagne',
      slug: 'nuit-terroir-raclette-meule-2026',
      description: 'Célébration festive annuelle autour de véritables meules de raclette au lait cru raclées au couteau.',
      long_description: 'Le rendez-vous convivial le plus attendu de l\'hiver ! Venez déguster des meules entières de raclette fermière.',
      event_type: 'Soirée',
      start_date: '2026-11-19T19:30:00Z',
      end_date: '2026-11-19T23:30:00Z',
      location: 'Campus ECE Eiffel 1 — Cour Centrale & Foyer',
      cover_image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
      price_cents: 1500,
      capacity: 80,
      remaining_seats: 32,
      requires_booking: true,
      featured: true
    },
    {
      id: 'evt-5',
      title: 'Gueuleton & Planches du Vendredi Midi',
      slug: 'gueuleton-planches-vendredi-midi',
      description: 'Rassemblement libre au foyer : venez avec vos spécialités régionales ou profitez des planches partagées.',
      long_description: 'Chaque dernier vendredi du mois, ECE Terroir organise un grand rassemblement convivial et ouvert à tous au Foyer des Élèves.',
      event_type: 'Rassemblement',
      start_date: '2026-09-25T12:15:00Z',
      end_date: '2026-09-25T14:00:00Z',
      location: 'Campus ECE Eiffel 1 — Foyer des Élèves',
      cover_image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
      price_cents: 0,
      capacity: 100,
      remaining_seats: 100,
      requires_booking: false,
      featured: false
    }
  ];

  for (const e of events) {
    const { error } = await supabase.from('events').upsert(e, { onConflict: 'slug' });
    if (error) console.error('Erreur event:', e.title, error.message);
    else console.log('✓ Événement :', e.title);
  }

  // 2. Produits Boutique
  const products = [
    {
      id: 'prod-1',
      name: "Sweat à Capuche Brodé 'ECE Terroir' — Édition Millésime 2026",
      slug: 'sweat-capuche-brode-ece-terroir-millesime-2026',
      description: "Hoodie ultra-confortable en coton biologique lourd (380g/m²) vert forêt avec blason d'artisan gastronomique brodé fil d'or sur le cœur et devise au dos.",
      price_cents: 3500,
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      category: 'Textile',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 24,
      featured: true,
      origin: "Atelier de broderie d'art (Région Auvergne-Rhône-Alpes, France)",
      craftsmanship: 'Broderie dense 15 000 points avec fil métallisé doré résistant aux lavages fréquents',
      materials: '100% Coton biologique peigné certifié GOTS & OEKO-TEX (380g/m²)'
    },
    {
      id: 'prod-2',
      name: 'Grande Planche à Découper & Dégustation en Chêne Massif Français',
      slug: 'grande-planche-decouper-chene-massif-francais',
      description: "Planche de service et découpe artisanale en chêne massif de forêt des Vosges, gravée au laser avec le blason ECE Terroir et pourvue d'une rigole à jus.",
      price_cents: 2800,
      image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop',
      category: 'Accessoires',
      stock: 12,
      featured: true,
      origin: 'Menuiserie d\'Artisanat Vosgien (Grand-Est, France)',
      craftsmanship: 'Façonnage traditionnel en bois de fil & gravure laser haute définition inaltérable',
      materials: 'Chêne massif certifié PEFC issu de forêts durables, finition huile de lin biologique'
    },
    {
      id: 'prod-3',
      name: 'Couteau de Poche Artisanal Pliant en Noyer Noble de Thiers',
      slug: 'couteau-poche-artisanal-pliant-noyer-thiers',
      description: "Couteau pliant de maître coutelier façonné dans la capitale française de la coutellerie. Lame en acier inoxydable Sandvik 12C27 ultra-tranchante.",
      price_cents: 3200,
      image_url: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=800&auto=format&fit=crop',
      category: 'Accessoires',
      stock: 8,
      featured: true,
      origin: 'Coutellerie d\'Art de Thiers (Puy-de-Dôme, Auvergne)',
      craftsmanship: 'Montage traditionnel à rivets bombés & émouture fine pour une coupe nette du saucisson',
      materials: 'Lame Acier Inox Sandvik 12C27 (Dureté 57 HRC) & Manche en noyer français noble'
    },
    {
      id: 'prod-4',
      name: 'Duo de Verres à Dégustation INAO Gravés \'ECE Terroir\'',
      slug: 'duo-verres-degustation-inao-graves',
      description: 'Coffret de deux verres officiels de dégustation en cristal sans plomb, gravés au blason doré d\'ECE Terroir.',
      price_cents: 1500,
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      category: 'Verre & Sommelerie',
      stock: 20,
      featured: true,
      origin: 'Verrerie d\'Art Française (Alsace)',
      craftsmanship: 'Cristallin haute transparence, paraison équilibrée & gravure inaltérable',
      materials: 'Cristal sans plomb renforcé au titane'
    }
  ];

  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'slug' });
    if (error) console.error('Erreur produit:', p.name, error.message);
    else console.log('✓ Produit :', p.name);
  }

  // 3. Articles de la Gazette
  const posts = [
    {
      id: 'post-1',
      title: "Les Secrets de l'Affinage des Comtés de Garde : 18, 24 et 36 Mois",
      slug: 'secrets-affinage-comtes-garde-jura',
      excerpt: 'Plongez dans les caves séculaires du Fort Saint-Antoine dans le Jura et découvrez la métamorphose de la pâte pressée cuite au fil des saisons.',
      content: "Dans les entrailles de pierre du Haut-Doubs, à plus de 1100 mètres d'altitude, se cache l'un des trésors les plus précieux de la gastronomie française : les caves d'affinage du Fort Saint-Antoine. Érigé au XIXe siècle pour défendre les frontières, cet ouvrage militaire abrite aujourd'hui plus de 100 000 meules de Comté AOP sous ses voûtes de pierre taillée.",
      cover_image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop',
      category: 'Dégustation',
      author_name: 'Jules Houry',
      author_role: "Président d'ECE Terroir",
      read_time_minutes: 5,
      tags: ['Comté', 'Jura', 'Affinage', 'Fromages AOP']
    },
    {
      id: 'post-2',
      title: "Le Saucisson Sec d'Auvergne : De la Sélection des Viandes au Séchage en Altitude",
      slug: 'saucisson-sec-auvergne-artisanat-sechage-altitude',
      excerpt: 'Rencontre avec les maîtres salaisonniers des monts du Cantal pour comprendre les gestes ancestraux du véritable saucisson de terroir.',
      content: "Loin des productions industrielles aseptisées, le véritable saucisson sec fermier d'Auvergne est le fruit d'une alchimie subtile entre la qualité des viandes de porcs fermiers élevés au grand air, un assaisonnement millimétré et un séchage lent à la merci des vents d'altitude.",
      cover_image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      category: "Vie de l'asso",
      author_name: 'Thomas Petit',
      author_role: 'Secrétaire Général & Trésorier Tech',
      read_time_minutes: 6,
      tags: ['Auvergne', 'Charcuterie', 'Saucisson', 'Savoir-Faire']
    }
  ];

  for (const pst of posts) {
    const { error } = await supabase.from('posts').upsert(pst, { onConflict: 'slug' });
    if (error) console.error('Erreur post:', pst.title, error.message);
    else console.log('✓ Article Gazette :', pst.title);
  }

  console.log('\n--- Toutes les données ont été synchronisées sur Supabase Cloud ! ---');
}

seed();
