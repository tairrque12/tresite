-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  position TEXT,
  school_name TEXT,
  grade TEXT,
  city TEXT,
  state TEXT,
  tshirt_size TEXT,
  parent_first_name TEXT,
  parent_last_name TEXT,
  relationship TEXT,
  phone_number TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  sms_consent BOOLEAN DEFAULT FALSE,
  waiver_accepted BOOLEAN DEFAULT FALSE,
  waiver_signature TEXT,
  waiver_signed_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_name TEXT NOT NULL,
  contact_email TEXT,
  tier TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  logo_url TEXT,
  stripe_payment_id TEXT
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  booking_type TEXT,
  age_range TEXT,
  skill_level TEXT,
  positions TEXT[] DEFAULT '{}',
  session_format TEXT,
  preferred_date DATE,
  backup_date DATE,
  session_goals TEXT,
  how_heard TEXT,
  sms_consent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new'
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON sponsors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (admin dashboard)
CREATE POLICY "Service role can do everything on registrations" ON registrations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on sponsors" ON sponsors
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous inserts (for public form submissions)
CREATE POLICY "Anyone can insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert sponsors" ON sponsors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);
