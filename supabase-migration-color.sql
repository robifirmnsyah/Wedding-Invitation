-- ============================================================
-- Migration: tambah kolom warna pada kategori
-- Jalankan SQL ini di Supabase SQL Editor jika database SUDAH
-- pernah dibuat dengan skema lama.
-- Aman dijalankan berulang (idempotent).
-- ============================================================

ALTER TABLE guest_categories
  ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT 'slate';
