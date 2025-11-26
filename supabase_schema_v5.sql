-- Migration v5: Add activities table for trip itinerary
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  type TEXT NOT NULL DEFAULT 'activity', -- 'food', 'activity', 'travel', 'hotel'
  status TEXT DEFAULT 'planned', -- 'planned', 'done'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON activities FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON activities FOR DELETE USING (true);

-- Comment
COMMENT ON TABLE activities IS 'Stores itinerary activities for trips.';
