# 📁 Asset Replacement Guide

All images here are **labeled placeholders** (SVG). Replace them with your real,
candid couple photography. After replacing, update the matching paths in
`config/wedding.json` if your file extensions differ (e.g. `.svg` → `.jpg`).

Everything is config-driven: change `config/wedding.json` and the whole site updates —
no code edits needed.

## What to drop in

| Folder | Files | Recommended size | Used in |
|---|---|---|---|
| `bride-groom/` | `groom`, `bride` | 600×600 (square) | Bride & Groom circular frames |
| `story/` | `story-1` … `story-4` | 800×600 (4:3) | Our Love Story timeline |
| `gallery/` | `gallery-1` … `gallery-8` | 800×800 (square) | Gallery collage + lightbox |
| `gift/` | `qris` | 500×500 (square) | QRIS payment in Digital Gift |
| `music/` | `violin-wedding.mp3` | — | Background music (autoplays after "Open Invitation") |

> The included `violin-wedding.mp3` is a **silent placeholder**. Replace it with a
> real violin wedding instrumental.

## Tips
- Use real, warm, candid photos (grass fields, sky shots, heart-hand gestures) — not stiff studio poses.
- Keep gallery images roughly square; `span` in the config (`tall` / `wide` / `square`) controls the collage layout.
- Optimise large photos (e.g. with [squoosh.app](https://squoosh.app)) before adding them — they are lazy-loaded via `next/image`.

## Parallax layers (built in code, no assets needed)
The watercolor mountain valley, birds, sun glow and floating petals are rendered as
SVG + CSS in `src/components/WatercolorValley.tsx`, `Birds.tsx` and `Petals.tsx` —
so they scale crisply and need no image files.
