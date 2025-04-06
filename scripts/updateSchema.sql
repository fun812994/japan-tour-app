-- Update stations table
ALTER TABLE stations
ADD COLUMN IF NOT EXISTS google_places_id TEXT,
ADD COLUMN IF NOT EXISTS name_ja TEXT,
ADD COLUMN IF NOT EXISTS name_ko TEXT,
ADD COLUMN IF NOT EXISTS prefecture TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS lines TEXT[];

-- Update station_culture table
ALTER TABLE station_culture
ADD COLUMN IF NOT EXISTS cultural_tips TEXT,
ADD COLUMN IF NOT EXISTS recommended_spots TEXT[];

-- Enable Row Level Security (RLS)
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_culture ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous read access and authenticated insert/update/delete
CREATE POLICY IF NOT EXISTS "Allow anonymous read access on stations" ON stations
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated insert on stations" ON stations
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated update on stations" ON stations
    FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated delete on stations" ON stations
    FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Allow anonymous read access on station_culture" ON station_culture
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated insert on station_culture" ON station_culture
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated update on station_culture" ON station_culture
    FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated delete on station_culture" ON station_culture
    FOR DELETE USING (true); 