-- Update admin table to match TypeScript types
ALTER TABLE admin
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make user_id nullable for now to allow direct inserts
ALTER TABLE admin ALTER COLUMN user_id DROP NOT NULL;

-- Enable realtime for admin table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'admin'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE admin;
  END IF;
END $$;