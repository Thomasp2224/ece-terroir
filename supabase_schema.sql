-- ========================================================
-- ECE TERROIR — SCHÉMA POSTGRESQL OFFICIEL SUPABASE
-- Tables : Profils Utilisateurs, Demandes d'Adhésion, Commandes, Événements
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

CREATE POLICY "Lecture publique des profils" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Mise à jour de son propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

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
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "L'utilisateur peut créer une demande" ON public.membership_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "L'utilisateur voit ses commandes" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Trigger automatique pour insérer un profil à chaque création dans auth.users
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

-- Insertion des 2 comptes fondateurs par défaut (si nécessaire)
-- Jules Houry (Président) & Thomas Petit (Bureau)
