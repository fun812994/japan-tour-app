-- Create stations table
CREATE TABLE IF NOT EXISTS public.stations (
    id TEXT PRIMARY KEY,
    google_places_id TEXT,
    name TEXT NOT NULL,
    name_ja TEXT,
    name_ko TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    prefecture TEXT,
    city TEXT,
    lines TEXT[]
);

-- Create station_culture table
CREATE TABLE IF NOT EXISTS public.station_culture (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id TEXT REFERENCES public.stations(id),
    language TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    history TEXT,
    cultural_tips TEXT,
    recommended_spots TEXT[],
    UNIQUE(station_id, language)
);

-- Add RLS policies
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_culture ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access on stations" ON public.stations
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on station_culture" ON public.station_culture
    FOR SELECT USING (true); 