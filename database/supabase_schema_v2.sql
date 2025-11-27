-- Create hotels table
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  check_in DATE,
  check_out DATE,
  price NUMERIC DEFAULT 0,
  booking_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  is_tried BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE hotels;
ALTER PUBLICATION supabase_realtime ADD TABLE restaurants;

-- RLS Policies (Public for now, matching existing pattern)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON hotels FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON hotels FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON hotels FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON hotels FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON restaurants FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON restaurants FOR DELETE USING (true);
