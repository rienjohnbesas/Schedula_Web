-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  facilities TEXT,
  room_availability TEXT NOT NULL CHECK (room_availability IN ('Available', 'Occupied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security for both tables
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies for admin table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admin;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admin;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON admin;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON admin;
DROP POLICY IF EXISTS "Public access" ON admin;

-- Drop any existing policies for rooms table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Public access" ON rooms;

-- Enable realtime for both tables (with conditional check to avoid duplicate errors)
DO $$
BEGIN
  -- Add admin table to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'admin'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE admin;
  END IF;
  
  -- Add rooms table to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
  END IF;
END $$;