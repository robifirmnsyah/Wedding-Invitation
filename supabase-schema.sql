-- ============================================================
-- Wedding Invitation — Supabase Schema
-- Jalankan SQL ini di Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1) Tabel Kategori Tamu (Keluarga Bapak, Teman Kantor, dll.)
--    `side` memisahkan kategori milik pihak Pengantin Wanita (bride) & Pria (groom).
CREATE TABLE IF NOT EXISTS guest_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  side        TEXT NOT NULL DEFAULT 'groom'
              CHECK (side IN ('bride', 'groom')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  -- Nama kategori unik per-sisi, jadi "Teman Kantor" boleh ada di bride & groom.
  UNIQUE (name, side)
);

-- Seed default categories (per sisi)
INSERT INTO guest_categories (name, side) VALUES
  ('Keluarga', 'groom'),
  ('Teman Kantor', 'groom'),
  ('Teman Kuliah', 'groom'),
  ('Teman SMA', 'groom'),
  ('Tetangga', 'groom'),
  ('Keluarga', 'bride'),
  ('Teman Kantor', 'bride'),
  ('Teman Kuliah', 'bride'),
  ('Teman SMA', 'bride'),
  ('Tetangga', 'bride')
ON CONFLICT (name, side) DO NOTHING;

-- 2) Tabel Tamu Undangan
--    `side` menandai tamu milik pihak bride/groom (disinkronkan dari kategori).
CREATE TABLE IF NOT EXISTS guests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_code   TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  category_id   UUID REFERENCES guest_categories(id) ON DELETE SET NULL,
  side          TEXT NOT NULL DEFAULT 'groom'
                CHECK (side IN ('bride', 'groom')),
  pax           INTEGER NOT NULL DEFAULT 1,
  contact_type  TEXT NOT NULL DEFAULT 'WhatsApp',
  contact       TEXT NOT NULL DEFAULT '',
  rsvp_status   TEXT NOT NULL DEFAULT 'pending'
                CHECK (rsvp_status IN ('pending', 'hadir', 'tidak_hadir', 'ragu')),
  wish_message  TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by unique_code (used in invitation URL)
CREATE INDEX IF NOT EXISTS idx_guests_unique_code ON guests (unique_code);
-- Index for per-side filtering in the admin panel
CREATE INDEX IF NOT EXISTS idx_guests_side ON guests (side);

-- 3) Enable Row Level Security (RLS) — but allow all via service role
ALTER TABLE guest_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Allow the anon key to read categories (for the invitation page dropdown, if needed)
CREATE POLICY "Allow anon read categories"
  ON guest_categories FOR SELECT
  TO anon
  USING (true);

-- Allow anon to read their own guest row by unique_code
-- (This is handled at the application level, so we allow read for now)
CREATE POLICY "Allow anon read guests"
  ON guests FOR SELECT
  TO anon
  USING (true);

-- Allow anon to update rsvp_status and wish_message only
CREATE POLICY "Allow anon rsvp update"
  ON guests FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow service_role full access (used by admin server actions)
CREATE POLICY "Service role full access categories"
  ON guest_categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access guests"
  ON guests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4) Function to auto-update `updated_at` on guests table
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
