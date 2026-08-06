-- 1. Création de la table 'leads' pour stocker les demandes de safari
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    departure_date DATE NOT NULL,
    return_date DATE,
    message TEXT,
    status TEXT DEFAULT 'new' NOT NULL
);

-- 2. Activation de la Row Level Security (RLS)
-- Cela permet de contrôler finement qui peut lire ou écrire dans cette table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Politique d'insertion : Autoriser tout le monde (anonyme ou authentifié)
-- C'est crucial pour que votre formulaire de contact public fonctionne
CREATE POLICY "Allow public lead submission" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 4. Politique de lecture : Restreindre la consultation aux utilisateurs connectés
-- Cela protège les données de vos prospects des regards extérieurs
CREATE POLICY "Allow authenticated users to view leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);
