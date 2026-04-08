-- PRANA HEALTH INTELLIGENCE PVT. LTD.
-- Database Schema: Sovereign Life-Map (hOS)

-- 1. PROFILES Table (The Life-Map Core)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    sex TEXT CHECK (sex IN ('male', 'female', 'other')),
    age INTEGER,
    location TEXT,
    health_goals TEXT[],
    chronic_conditions TEXT[],
    daily_meds TEXT[],
    allergies TEXT[],
    
    -- Biological Branching Data (JSONB for flexibility)
    biological_data JSONB DEFAULT '{
        "cycle_tracking": null,
        "metabolic_score": null,
        "iron_levels": null,
        "cardio_risk": null
    }',
    
    onboarding_complete BOOLEAN DEFAULT FALSE,
    consults_this_month INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CONSULTATIONS Table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT,
    response JSONB, -- Stores the "4-Pillar" logic output
    urgency_level TEXT CHECK (urgency_level IN ('green', 'yellow', 'red')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. VITALITY_RECORDS Table (OCR Results)
CREATE TABLE IF NOT EXISTS public.vitality_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_url TEXT,
    marker_name TEXT,
    marker_value TEXT,
    optimal_range TEXT,
    vitality_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitality_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
