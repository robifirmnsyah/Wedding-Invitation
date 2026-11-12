# Design System — Vintage Garden Editorial

Documentation for the Robi & Tiara wedding invitation redesign.

| File | Purpose |
|---|---|
| [`MASTER.md`](./MASTER.md) | **Visual source of truth.** Tokens, typography, motion, accessibility, performance budget, anti-patterns, checklist. |
| [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) | Phased plan (P0/P1/P2), per-task specs, asset mapping, migration strategy. |
| `pages/` (optional, future) | Page/section-specific overrides. If `pages/<section>.md` exists, its rules override MASTER for that section only. |

---

## How to use MASTER.md

1. **Before building or changing any section**, read the relevant MASTER sections: tokens (§3–8), the component rules for what you're building (§11–13), motion (§15–16), and the anti-pattern list (§19).
2. When prompting Claude/AI for implementation work, include:
   > "Read `design-system/MASTER.md`. Check if `design-system/pages/<section>.md` exists; if so its rules override MASTER. Implement <task> from `design-system/IMPLEMENTATION_PLAN.md` without changing business logic."
3. MASTER wins over the current codebase. Where they disagree (e.g. mauve `#A94468` stored under the `olive` token name, `glass-soft`, Petals), the codebase is legacy and is being migrated.
4. Never edit MASTER casually. Token changes ripple everywhere — propose them, get approval, then update MASTER *first*, code second.
5. Business logic (APIs, Supabase, RSVP/wishes flow, admin) is explicitly out of MASTER's jurisdiction. If a visual change requires a logic change, stop and escalate.

## How tokens map to Tailwind / global CSS

The project uses **Tailwind v3** + CSS custom properties in `src/app/globals.css`.

- **Colors** — defined once as CSS variables in `:root` (`--olive-900`, `--sage-100`, …), then referenced in `tailwind.config.ts` `theme.extend.colors` (exact block provided in MASTER §3.4). Components use Tailwind utilities (`text-olive-900`, `bg-sage-100`); raw hex in components is banned.
  - `ink` remains an alias of `olive-900` so existing `text-ink` classes migrate for free.
- **Typography** — fonts load in `src/app/layout.tsx` via `next/font/google`, exposing `--font-display`, `--font-body`, `--font-arabic`, `--font-accent`. Tailwind maps them to `font-display`, `font-body`, `font-arabic`, `font-accent`. The legacy aliases `font-heading`/`font-sub`/`font-script` are re-pointed during migration, then removed.
- **Type scale** — fluid `clamp()` sizes live as CSS variables (`--text-display` …) in `globals.css`; use via utilities like `text-[length:var(--text-h1)]` or the small set of component classes (`.chapter-title`, `.eyebrow`) defined in `@layer components`.
- **Spacing / radius / shadows / motion** — CSS variables in `:root` (MASTER §5, §8, §15); Tailwind's default 4px spacing scale already matches, so use standard utilities (`py-16 md:py-24`) and the named shadows via `theme.extend.boxShadow` (`shadow-paper`, `shadow-lifted`).
- **Motion tokens** — durations/easings as CSS variables and as a small `src/animations/tokens.ts` export so Framer Motion/GSAP consume the *same* values as CSS.

## Rules for adding a new section

1. A section = a **chapter**: opaque mat background (alternating, never same as neighbor), eyebrow → Cormorant title → hairline rule, content inside `--width-content`/`--width-wide`.
2. Pick exactly **one** primary reveal gesture (MASTER §15). Children may stagger inside it (≤5 items, 80ms).
3. Max 2 etched ornaments per viewport, single ink color, `aria-hidden`.
4. Section landmark: `<section aria-labelledby={titleId}>`, heading level follows document outline.
5. All media through `next/image` with dimensions + `sizes`; below-fold → lazy.
6. No new fonts, no new colors, no new radii — extend MASTER first if genuinely needed.
7. Run the MASTER §20 checklist on the section before PR.

## Rules for selecting photos

1. Photos come from the approved source set (`~/Downloads/PREWED EDIT` — see IMPLEMENTATION_PLAN asset map). **Never copy full-resolution sources into `public/`** — export to the target dimensions/format in the asset map (AVIF/WebP, quality ~70–80).
2. Match orientation to the slot: cover = portrait (arch crop, faces upper third), story = 4:3 landscape, gallery mixes per the collage map.
3. Prefer images where the couple is the clear subject and the background is garden/outdoor/neutral — consistent with the botanical narrative.
4. Watermarked images may be used temporarily; log them in the asset map "Fallback" column. Never edit watermarks out.
5. Existing assets in `public/assets/` are not deleted until the asset map confirms nothing references them (grep `src/` + `config/wedding.json`).
6. Keep `*.orig.jpg` source-crops out of production references.

## Rules for adding animations

1. Ask first: *does this chapter already have its one gesture?* If yes — no new animation.
2. Only `transform` + `opacity`. Durations/easings from MASTER §15 tokens — no ad-hoc values.
3. Scroll reveals: `once: true`, ~25% threshold, enter-from-below.
4. Infinite loops are banned (exceptions in MASTER §15.4).
5. Every animation must have its reduced-motion story (MASTER §16): Framer via `MotionConfig reducedMotion="user"`, GSAP behind `usePrefersReducedMotion()` (set, don't tween), Lenis not instantiated.
6. `clip-path`/mask budget: 2 chapters site-wide. Check before spending it.
7. New GSAP timelines: max 1 scrub-linked timeline per chapter; register/cleanup in `useEffect` return.

## Review checklist before merging

Short form — the full list is MASTER §20:

- [ ] Tokens only (no raw hex/arbitrary tiny text/banned utilities)
- [ ] One gesture per chapter; nothing loops at idle
- [ ] Reduced-motion verified in the browser (emulate in devtools)
- [ ] Keyboard + screen-reader walkthrough of anything touched
- [ ] Contrast AA on every text/background pair introduced
- [ ] Lighthouse mobile on `/`: LCP ≤2.5s, CLS ≤0.1, a11y ≥95
- [ ] Images within budget; no full-res sources in `public/`
- [ ] RSVP / wishes / gift / maps / personalization / admin regression pass
- [ ] Diff touches only files listed for that task in IMPLEMENTATION_PLAN
