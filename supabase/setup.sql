-- Lead schema matching the public B2B form payload.
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    locality TEXT NOT NULL,
    pro_type TEXT,
    travel_profile TEXT,
    pax INTEGER,
    travel_dates TEXT,
    budget_per_person TEXT,
    budget_currency TEXT,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'tat.co.za',
    type TEXT NOT NULL DEFAULT 'Partenaire',
    status TEXT NOT NULL DEFAULT 'new'
);

-- Add the form fields when upgrading an existing leads table.
ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS contact TEXT,
    ADD COLUMN IF NOT EXISTS locality TEXT,
    ADD COLUMN IF NOT EXISTS pro_type TEXT,
    ADD COLUMN IF NOT EXISTS travel_profile TEXT,
    ADD COLUMN IF NOT EXISTS pax INTEGER,
    ADD COLUMN IF NOT EXISTS travel_dates TEXT,
    ADD COLUMN IF NOT EXISTS budget_per_person TEXT,
    ADD COLUMN IF NOT EXISTS budget_currency TEXT,
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'tat.co.za',
    ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Partenaire';

-- Older schemas required a departure date that this form does not collect.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'leads'
          AND column_name = 'departure_date'
    ) THEN
        ALTER TABLE public.leads ALTER COLUMN departure_date DROP NOT NULL;
    END IF;
END;
$$;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public lead submission" ON public.leads;
CREATE POLICY "Allow public lead submission" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Do not expose prospect data to every authenticated user.
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON public.leads;
