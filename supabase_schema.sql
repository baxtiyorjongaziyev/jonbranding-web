-- Tez Natija 6 Biznes Navigator - Supabase Schema

-- 1. admin_users table (extends auth.users if needed, or standalone for simple role check)
CREATE TABLE IF NOT EXISTS public.navigator_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. navigator_leads (Diagnostic sessions)
CREATE TABLE IF NOT EXISTS public.navigator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  contact TEXT NOT NULL,
  consent BOOLEAN DEFAULT false,
  
  -- Selected items (JSON or Text arrays)
  selected_pains JSONB DEFAULT '[]'::jsonb,
  desired_results JSONB DEFAULT '[]'::jsonb,
  
  -- Diagnostic Answers (JSON)
  diagnostic_answers JSONB DEFAULT '{}'::jsonb,
  
  -- Calculated Score & Gaps
  total_score INTEGER DEFAULT 0,
  gaps JSONB DEFAULT '[]'::jsonb,
  
  -- Lead Management (Admin)
  status TEXT DEFAULT 'Yangi', -- Yangi, Bog'lanish kerak, Uchrashuv belgilandi, Taklif yuborildi, Mijoz bo'ldi, Hozir tayyor emas, Mos emas
  notes TEXT DEFAULT '',
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Meta
  source TEXT DEFAULT 'navigator_landing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. navigator_analytics (Event tracking)
CREATE TABLE IF NOT EXISTS public.navigator_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- diagnostic_started, tool_used, etc.
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup
ALTER TABLE public.navigator_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigator_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigator_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for navigator_leads
-- Allow anonymous inserts (for the public form)
CREATE POLICY "Allow public insert to navigator_leads" 
ON public.navigator_leads FOR INSERT 
TO public 
WITH CHECK (true);

-- Only authenticated users (admins) can view or update
CREATE POLICY "Allow authenticated read navigator_leads" 
ON public.navigator_leads FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update navigator_leads" 
ON public.navigator_leads FOR UPDATE 
TO authenticated 
USING (true);

-- Analytics policies
CREATE POLICY "Allow public insert to navigator_analytics" 
ON public.navigator_analytics FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read navigator_analytics" 
ON public.navigator_analytics FOR SELECT 
TO authenticated 
USING (true);
