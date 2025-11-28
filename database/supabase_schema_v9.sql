-- Migration v9: Add packing list support
CREATE TABLE packing_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Essentials', -- 'Essentials', 'Clothing', 'Toiletries', 'Tech', 'Documents', 'Misc'
  is_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE packing_items;

-- RLS Policies
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON packing_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON packing_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON packing_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON packing_items FOR DELETE USING (true);

-- Comment
COMMENT ON TABLE packing_items IS 'Stores packing list items for trips.';
