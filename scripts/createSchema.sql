-- Drop existing tables if they exist
DROP TABLE IF EXISTS station_culture CASCADE;
DROP TABLE IF EXISTS stations CASCADE;

-- Create stations table with all columns
CREATE TABLE stations (
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

-- Create station_culture table with all columns
CREATE TABLE station_culture (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    station_id TEXT REFERENCES stations(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    history TEXT NOT NULL,
    cultural_tips TEXT,
    recommended_spots TEXT[],
    UNIQUE(station_id, language)
);

-- Enable Row Level Security (RLS)
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_culture ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous read access and authenticated insert/update/delete
CREATE POLICY "Allow anonymous read access on stations" ON stations
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on stations" ON stations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on stations" ON stations
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on stations" ON stations
    FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access on station_culture" ON station_culture
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on station_culture" ON station_culture
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on station_culture" ON station_culture
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on station_culture" ON station_culture
    FOR DELETE USING (true); 