-- ========================================================
-- ECE TERROIR — SCHÉMA POSTGRESQL OFFICIEL SUPABASE HARDENED
-- Tables : Profils Utilisateurs, Demandes d'Adhésion, Commandes, Événements, Émargements, Logs
-- ========================================================

-- 1. Table des Profils Utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  promo TEXT DEFAULT 'Visiteur ECE',
  role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'member', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  membership_status TEXT DEFAULT 'none' CHECK (membership_status IN ('none', 'pending', 'active', 'rejected', 'suspended')),
  membership_requested_at TIMESTAMPTZ,
  membership_approved_at TIMESTAMPTZ,
  membership_payment_method TEXT,
  avatar_url TEXT,
  bio TEXT,
  favorite_terroirs TEXT[] DEFAULT ARRAY['Savoie', 'Bourgogne', 'Jura'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper fonction pour vérifier si l'utilisateur courant est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Lecture authentifiée des profils" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Mise à jour de son propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger de protection : empêche les utilisateurs normaux de modifier leur propre rôle ou statut
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'utilisateur tente de s'auto-attribuer le rôle admin ou changer son statut sans être admin
  IF (NEW.role != OLD.role OR NEW.status != OLD.status OR NEW.membership_status != OLD.membership_status) THEN
    IF NOT public.is_admin() AND auth.role() != 'service_role' THEN
      RAISE EXCEPTION 'Action non autorisée : Seuls les membres du Bureau peuvent modifier les privilèges ou la cotisation.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

-- 2. Table des Demandes d'Adhésion (Cotisations 10€)
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_promo TEXT,
  amount_cents INTEGER DEFAULT 1000,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  notes TEXT
);

ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "L'utilisateur voit ses demandes" ON public.membership_requests
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "L'utilisateur peut créer une demande" ON public.membership_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les admins peuvent modifier les demandes" ON public.membership_requests
  FOR UPDATE USING (public.is_admin());

-- 3. Table des Commandes Boutique (Click & Collect)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  voucher_code TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_cents INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'online',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ready_for_pickup', 'completed', 'cancelled')),
  pickup_location TEXT DEFAULT 'Foyer des Élèves — Campus Eiffel 1',
  pickup_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "L'utilisateur et admin voient les commandes" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Création de commande" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Modification commande par admin" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- 4. Table des Émargements & Check-ins Soirées
CREATE TABLE IF NOT EXISTS public.event_checkins (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_title TEXT NOT NULL,
  user_id TEXT,
  user_matricule TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_promo TEXT,
  is_member BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_in_by TEXT NOT NULL,
  entry_status TEXT DEFAULT 'valid',
  notes TEXT
);

ALTER TABLE public.event_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture checkins par admin" ON public.event_checkins
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Insertion checkin par admin" ON public.event_checkins
  FOR INSERT WITH CHECK (public.is_admin());

-- 5. Table des Logs d'Audit Sécurité
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture des logs réservée aux admins" ON public.admin_logs
  FOR SELECT USING (public.is_admin());

-- 6. Trigger automatique pour insérer un profil à chaque création dans auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status, membership_status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Étudiant ECE'),
    'visitor',
    'active',
    'none'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
