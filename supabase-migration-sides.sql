-- ============================================================
-- Migration: tambah pemisahan sisi Bride / Groom
-- Jalankan SQL ini di Supabase SQL Editor jika database SUDAH
-- pernah dibuat dengan skema lama (tanpa kolom `side`).
-- Aman dijalankan berulang (idempotent).
-- ============================================================

-- 1) Kolom `side` pada kategori
ALTER TABLE guest_categories
  ADD COLUMN IF NOT EXISTS side TEXT NOT NULL DEFAULT 'groom';

ALTER TABLE guest_categories
  DROP CONSTRAINT IF EXISTS guest_categories_side_check;
ALTER TABLE guest_categories
  ADD CONSTRAINT guest_categories_side_check CHECK (side IN ('bride', 'groom'));

-- Ganti unik (name) menjadi unik (name, side) supaya nama kategori
-- yang sama boleh dipakai di kedua sisi.
ALTER TABLE guest_categories
  DROP CONSTRAINT IF EXISTS guest_categories_name_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'guest_categories_name_side_key'
  ) THEN
    ALTER TABLE guest_categories
      ADD CONSTRAINT guest_categories_name_side_key UNIQUE (name, side);
  END IF;
END $$;

-- 2) Kolom `side` pada tamu
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS side TEXT NOT NULL DEFAULT 'groom';

ALTER TABLE guests
  DROP CONSTRAINT IF EXISTS guests_side_check;
ALTER TABLE guests
  ADD CONSTRAINT guests_side_check CHECK (side IN ('bride', 'groom'));

CREATE INDEX IF NOT EXISTS idx_guests_side ON guests (side);

-- 3) Sinkronkan side tamu lama dari kategorinya (jika ada)
UPDATE guests g
SET side = c.side
FROM guest_categories c
WHERE g.category_id = c.id AND g.side IS DISTINCT FROM c.side;
