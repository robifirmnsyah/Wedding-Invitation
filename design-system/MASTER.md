# MASTER.md — Vintage Garden Editorial

**Project:** Robi & Tiara — Wedding Invitation
**Theme:** Vintage Garden Editorial
**Character:** romantic botanical · elegant · personal · cinematic
**Primary experience:** mobile-first (375px baseline), fully responsive on desktop
**Status:** Visual source of truth. Every UI change must comply with this document.
**Scope guard:** This document governs *presentation only*. Business logic, APIs, Supabase, RSVP flow, wishes, gifts, QRIS, maps, guest personalization, and the admin dashboard are out of scope and must not change.

---

## 1. Design Principles

1. **Photography is the narrative.** The couple's photos carry the story; UI recedes. Decoration frames photos, never competes with them.
2. **Editorial restraint.** Generous whitespace, a strict serif type hierarchy, hairline rules. The page reads like a keepsake magazine spread, not an app.
3. **One gesture per chapter.** Each viewport-height "chapter" gets exactly one primary motion reveal. Nothing loops indefinitely in the background.
4. **Botanical, engraved, quiet.** Ornament is etched/engraving-style line art in a single ink color — not watercolor washes, not floating confetti.
5. **Ink on paper.** Surfaces are opaque paper tones (ivory/beige). No glassmorphism, no fullscreen blur veils. Depth comes from paper layering and hairline borders.
6. **Personal and warm.** Guest name, handwritten-feel signature accents, and Indonesian-language copy stay front and center.
7. **Accessible by default.** WCAG AA contrast, ≥16px body text, visible focus, reduced-motion parity. Elegance never costs legibility.
8. **Cheap to render.** Transform/opacity animation only, optimized media, no continuous compositing work when idle.

## 2. Visual Keywords

`vintage garden` · `editorial serif` · `botanical engraving` · `etched line art` · `olive & sage` · `ivory paper` · `hairline gold` · `cinematic chapter reveals` · `keepsake` · `quiet luxury` · `letterpress` · `herbarium`

**Not this:** playful watercolor, glassmorphism, bubbly rounded cards, pastel confetti, floating petals everywhere, neon, glossy gradients.

## 3. Color Tokens

> Restores the true botanical palette. The current codebase has olive/sage token *names* holding mauve/pink *values* (`#A94468` etc.) — those values are replaced wholesale.

### 3.1 Primitives

| Token | Hex | Description |
|---|---|---|
| `--olive-950` | `#252A1F` | Near-black olive (deepest ink) |
| `--olive-900` | `#333B2B` | **Deep olive — primary text** |
| `--olive-700` | `#4A5438` | Headings, strong UI |
| `--olive-600` | `#5A6642` | Primary interactive (buttons, links) |
| `--olive-500` | `#6E7A52` | Hover/active tints, icons |
| `--sage-500` | `#8A9474` | Muted icons, decorative strokes |
| `--sage-300` | `#B4BCA2` | Borders, dividers on ivory |
| `--sage-100` | `#DDE2D1` | Tinted surface (section alt background) |
| `--ivory-50` | `#FBF9F3` | Page background (paper) |
| `--ivory-100` | `#F6F2E8` | Raised paper surface |
| `--beige-200` | `#EAE0CE` | Warm section background, image mats |
| `--beige-300` | `#DCCFB6` | Deeper mat, pressed states |
| `--gold-600` | `#8C7443` | **Muted gold — hairlines, ornament** (3.1:1 on ivory — decorative/large use) |
| `--gold-700` | `#756034` | Gold as *text* (4.6:1 on ivory — AA) |

### 3.2 Semantic roles

| Role | Token | Maps to |
|---|---|---|
| `--color-bg` | `--ivory-50` | Page background |
| `--color-surface` | `--ivory-100` | Cards, panels |
| `--color-surface-alt` | `--sage-100` / `--beige-200` | Alternating chapter backgrounds |
| `--color-text` | `--olive-900` | Primary text (12.0:1 on ivory) |
| `--color-text-muted` | `--olive-700` | Secondary text (8.2:1 on ivory) |
| `--color-text-subtle` | `--sage-500` | Non-critical metadata ONLY (≥14px, never body copy) |
| `--color-primary` | `--olive-600` | Buttons, links, focus ring |
| `--color-on-primary` | `--ivory-50` | Text on primary (7.2:1 on olive-600 ✓) |
| `--color-border` | `--sage-300` | Default hairline |
| `--color-border-accent` | `--gold-600` | Ornamental hairline (sparing) |
| `--color-error` | `#8C3A2E` | Form errors (6.4:1 on ivory) |
| `--color-success` | `--olive-600` | Success confirmation |

### 3.3 Contrast matrix (WCAG AA targets)

| Foreground / Background | Ratio | Verdict |
|---|---|---|
| olive-900 on ivory-50 | ≈12.0:1 | AAA ✓ |
| olive-700 on ivory-50 | ≈8.2:1 | AAA ✓ |
| olive-600 on ivory-50 | ≈6.1:1 | AA ✓ (body & UI) |
| olive-900 on sage-100 | ≈9.6:1 | AAA ✓ |
| olive-900 on beige-200 | ≈9.4:1 | AAA ✓ |
| ivory-50 on olive-600 | ≈6.1:1 | AA ✓ (buttons) |
| gold-700 on ivory-50 | ≈4.6:1 | AA ✓ (gold text) |
| gold-600 on ivory-50 | ≈3.1:1 | Large text / decorative only |

**Rules:**
- Never set important text below `--olive-700`.
- **No opacity-based dimming for information text** (`text-ink/40`, `/50`, `/60` are banned). Use the token ramp instead.
- `--gold-600` is never used for body/label text — hairlines, rules, and ornament strokes only. Gold *text* (e.g., an eyebrow label) uses `--gold-700` at ≥14px.
- Gold coverage budget: ≤5% of any viewport (hairlines, one ornament, one initial cap — not fills).

### 3.4 Tailwind mapping (`tailwind.config.ts` — reference, apply in Stage 4)

```ts
colors: {
  olive: { 950:"#252A1F", 900:"#333B2B", 700:"#4A5438", 600:"#5A6642", 500:"#6E7A52", DEFAULT:"#5A6642" },
  sage:  { 500:"#8A9474", 300:"#B4BCA2", 100:"#DDE2D1", DEFAULT:"#B4BCA2" },
  ivory: { 50:"#FBF9F3", 100:"#F6F2E8", DEFAULT:"#FBF9F3" },
  beige: { 200:"#EAE0CE", 300:"#DCCFB6", DEFAULT:"#EAE0CE" },
  gold:  { 600:"#8C7443", 700:"#756034", DEFAULT:"#8C7443" },
  ink:   "#333B2B", // alias of olive-900 so existing `text-ink` keeps working
  error: "#8C3A2E",
},
```

## 4. Typography System

### 4.1 Families (all via `next/font/google`, `display: "swap"`, subset per script)

| Variable | Family | Weights | Purpose |
|---|---|---|---|
| `--font-display` | **Cormorant Garamond** | 500, 600, 700 + italic 500 | Display & section headings — the editorial serif that replaces the playful display font (brief: "Fredoka"; the codebase's actual playful display is Great Vibes — both are retired from heading duty) |
| `--font-body` | **Poppins** | 400, 500, 600 | Body copy, UI, forms, buttons (retained) |
| `--font-arabic` | **Amiri** | 400, 700 | Quranic verse — full Arabic shaping, designed for Quranic typesetting. `subsets: ["arabic"]` |
| `--font-accent` | **Great Vibes** | 400 | Script accent, **strictly limited** (see Font Roles). Loaded with `subsets: ["latin"]`; consider `text` subsetting to the couple's names only |

Next.js practices: self-hosted via `next/font` (zero layout-shift `size-adjust` fallbacks generated automatically), no `@import` of Google Fonts in CSS, no `<link>` preloads by hand, max 4 families, Arabic subset only loaded for Amiri.

### 4.2 Font roles

| Role | Family / style | Usage |
|---|---|---|
| Display | Cormorant Garamond 600 | Couple names on cover, section chapter titles |
| Heading | Cormorant Garamond 600 | H2/H3 in sections |
| Editorial accent | Cormorant Garamond italic 500 | Pull quotes, taglines, translation of the verse |
| Eyebrow / label | Poppins 500, uppercase, `tracking-[0.2em]`, ≥12px, `--gold-700` or `--olive-700` | Small caps chapter labels ("BAB SATU", "SAVE THE DATE") |
| Body | Poppins 400 | Paragraphs, form text — **16px minimum on mobile** |
| UI / buttons | Poppins 500 | Buttons, nav, inputs |
| Arabic verse | Amiri 400, `lang="ar" dir="rtl"` | QS. Ar-Rum: 21 only |
| Script signature | Great Vibes 400 | **Max 2 appearances total:** couple-name signature on cover, couple-name signature in closing. Never for headings, dates, captions, or numbers |

### 4.3 Responsive type scale (fluid, `clamp()`)

| Token | CSS | Mobile → Desktop | Use |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 8vw + 1rem, 4.5rem)` | 40 → 72px | Couple names (cover) |
| `--text-h1` | `clamp(2rem, 5vw + 0.75rem, 3.25rem)` | 32 → 52px | Chapter titles |
| `--text-h2` | `clamp(1.5rem, 3vw + 0.75rem, 2.25rem)` | 24 → 36px | Section headings |
| `--text-h3` | `clamp(1.25rem, 2vw + 0.75rem, 1.5rem)` | 20 → 24px | Card titles, names |
| `--text-lead` | `clamp(1.125rem, 1vw + 0.9rem, 1.25rem)` | 18 → 20px | Pull quotes, intro lines |
| `--text-body` | `1rem` | 16px fixed | Body copy (mobile minimum honored) |
| `--text-small` | `0.875rem` | 14px | Secondary info floor |
| `--text-micro` | `0.75rem` | 12px | Non-critical metadata only (timestamps, badge text) — never for instructions or data the guest needs |
| `--text-arabic` | `clamp(1.5rem, 4vw + 0.5rem, 2.25rem)` | 24 → 36px | Quranic verse (Amiri needs larger size for comfortable reading) |

Banned: `text-[10px]`, `text-[11px]` (both exist in the current Wishes section — remove).

### 4.4 Line height & letter spacing

| Context | line-height | letter-spacing |
|---|---|---|
| Display / H1 (Cormorant) | 1.1 | `-0.01em` |
| H2 / H3 | 1.2 | `0` |
| Eyebrow labels | 1.2 | `0.2em` (uppercase) |
| Body (Poppins) | 1.7 | `0` (never negative on body) |
| Small / metadata | 1.5 | `0.01em` |
| Arabic (Amiri) | 2.0 | `0` (never letter-space Arabic — it breaks shaping) |
| Buttons | 1 | `0.05em` |

Measure: body text max `65ch`; on mobile the content column (§9) keeps lines at 38–55 chars naturally.

## 5. Spacing Scale

4px-base scale; spacious density (this is a keepsake, not a dashboard).

```css
--space-1: 0.25rem;  /*  4px  inline gaps            */
--space-2: 0.5rem;   /*  8px  icon–label             */
--space-3: 0.75rem;  /* 12px  intra-component        */
--space-4: 1rem;     /* 16px  component padding      */
--space-6: 1.5rem;   /* 24px  card padding (mobile)  */
--space-8: 2rem;     /* 32px  card padding (desktop) */
--space-12: 3rem;    /* 48px  block separation       */
--space-16: 4rem;    /* 64px  section padding mobile */
--space-24: 6rem;    /* 96px  section padding desktop*/
--space-32: 8rem;    /* 128px chapter breathing room */
```

Section rhythm: `py-16 md:py-24` minimum; hero/closing chapters may use `min-h-svh` with centered content.

## 6. Layout & Content Width

```css
--width-content: 42rem;   /* 672px — text columns (prose)         */
--width-wide:    56rem;   /* 896px — galleries, two-up layouts    */
--width-max:     72rem;   /* 1152px — outer frame on desktop      */
--gutter-mobile: 1.25rem; /* 20px */
--gutter-desktop: 2.5rem; /* 40px */
```

- Mobile: single column, full-bleed photos allowed, text inside gutters.
- Desktop: page sits inside `--width-max` centered; an optional hairline "paper edge" frame (1px `--sage-300`) may bound the invitation so it reads as a document, not a stretched website.
- No horizontal scroll at any width ≥320px.

## 7. Breakpoints

| Name | Width | Intent |
|---|---|---|
| base | 0–639 | Phones — the primary design target (design at 375px, verify at 320px) |
| `sm` | 640 | Large phones / small tablets |
| `md` | 768 | Tablets — two-column layouts unlock |
| `lg` | 1024 | Desktop — max widths, side-by-side chapters |
| `xl` | 1280 | Wide desktop — frame + margin ornaments only; no new layout |

Use `min-h-svh` / `h-svh` (never `100vh`) for full-viewport chapters. `viewport-fit=cover` with safe-area padding on fixed elements.

## 8. Border, Radius & Shadow Rules

| Token | Value | Use |
|---|---|---|
| `--radius-none` | `0` | Photos, editorial blocks (default!) |
| `--radius-sm` | `4px` | Inputs, small buttons |
| `--radius-md` | `8px` | Cards that must be soft (RSVP form) |
| `--radius-arch` | `999px 999px 0 0` (top only) | The single signature shape: arched photo frames |
| `--border-hairline` | `1px solid var(--sage-300)` | Default rule/divider |
| `--border-gold` | `1px solid var(--gold-600)` | Ornamental frame (≤1 per viewport) |
| `--border-double` | `1px double` + `outline offset 4px` | Keepsake frame around key cards |
| `--shadow-paper` | `0 1px 2px rgb(37 42 31 / 0.06), 0 8px 24px rgb(37 42 31 / 0.08)` | Raised paper card |
| `--shadow-lifted` | `0 2px 4px rgb(37 42 31 / 0.08), 0 16px 40px rgb(37 42 31 / 0.12)` | Modal, lightbox |

**Rules:** No `rounded-2xl`/`rounded-3xl` card soup — squared or arched edges define the editorial look. Shadows are olive-tinted, never pure black, never glowing. `backdrop-filter: blur()` is allowed **only** on the two modal scrims (QRIS, Lightbox) at ≤8px — nowhere else.

## 9. Botanical Ornament Rules

1. **Style:** engraved/etched line art (single-weight strokes, 1–1.5px at rendered size), like vintage botanical plates. Sources: hand-drawn SVG, or engraving-style illustrations exported as optimized SVG.
2. **Color:** ornaments render in exactly one ink per instance — `--sage-500`, `--olive-700`, or `--gold-600`. Never multicolor, never watercolor fills.
3. **Placement:** corners, dividers between chapters, frames around portraits, one margin sprig per chapter maximum.
4. **Density:** ≤2 ornament elements visible per viewport. Ornaments are `aria-hidden="true"` and never carry content.
5. **Motion:** ornaments may draw in once (stroke-dashoffset or fade) as part of the chapter reveal; they never loop, sway, or float. This retires `Petals`, `Birds`, and the animated `WatercolorValley` layers.
6. **The divider:** one standard chapter divider — a centered horizontal hairline interrupted by a small etched sprig (replaces `LeafDivider` and `SceneDivider`).

## 10. Image Treatment

1. **Tone:** photos are the color; UI stays neutral. No heavy filters. A single optional treatment: subtle warm matte (`filter: saturate(0.95) sepia(0.06)`) applied consistently or not at all.
2. **Frames:** photos sit on a `--beige-200` mat with a hairline border, or full-bleed with no frame. The arch (`--radius-arch`) is reserved for portraits and the cover.
3. **Formats:** AVIF/WebP via `next/image` exclusively (retire raw `<img>` in `StaticBackdrop`). JPEG fallback automatic.
4. **Sizing:** every image declares `width`/`height` or `fill` + `sizes`. No CLS from media.
5. **Watermarks:** watermarked photos may ship temporarily; each one is listed in the asset map (IMPLEMENTATION_PLAN §Asset Mapping) as *needs replacement* — never crop/clone them out.
6. **Source photos** are never copied full-resolution into `public/` — export pipeline resizes to the target dimensions in the asset map first.

## 11. Button & Link Variants

| Variant | Recipe | Use |
|---|---|---|
| **Primary** | `bg-olive-600 text-ivory-50`, `--radius-sm`, `px-8 py-3.5` (≥48px tall), Poppins 500 14–16px `tracking-[0.05em]` uppercase; hover `bg-olive-700`; pressed scale 0.98 | "Buka Undangan", RSVP submit |
| **Secondary** | transparent, `border-hairline` in `--olive-600`, text `--olive-700`; hover fills `--sage-100` | Maps, calendar, copy account |
| **Tertiary / link** | text `--olive-600` + 1px underline `text-underline-offset: 4px`; hover `--gold-700` underline | Inline links, Instagram |
| **Icon button** | 44×44px min, hairline circle border, icon `--olive-700` | Music toggle, close, lightbox arrows |
| **Disabled** | `opacity-45` + `cursor-not-allowed` + `disabled` attr | Any variant |

All variants: `cursor-pointer`, visible focus (§17.3), `touch-action: manipulation`, loading state = spinner + disabled (never a dead click).

## 12. Form Component Rules (RSVP & wishes UI shell only — logic untouched)

1. Visible `<label>` above every field, Poppins 500 14px `--olive-700`, associated via `htmlFor`/`id` — no placeholder-only labels, no uppercase-micro labels.
2. Inputs: 16px text (prevents iOS zoom), min-height 48px, `bg-ivory-100`, `border-hairline`, `--radius-sm`; focus swaps border to `--olive-600` + focus ring.
3. Attendance choice renders as a segmented radio group: `role="radiogroup"`, each option `aria-checked`, selected = `bg-olive-600 text-ivory-50`, unselected = secondary-button style.
4. Errors: below the field, `--color-error` text + icon, `role="alert"`/`aria-live="polite"`; auto-focus first invalid field on submit.
5. Helper text (e.g. wish max length) persistent below field at 14px `--olive-700`.
6. Submit: loading spinner in-button, success confirmation with icon + text (not color alone).
7. Semantic input types/autocomplete preserved as currently implemented.

## 13. Card & Surface Rules

1. **Default surface is the page itself.** Not everything needs a card — editorial layouts place text directly on ivory.
2. **Paper card** (the only general card): `bg-ivory-100`, `--shadow-paper`, hairline border, `--radius-md` max, padding `--space-6`/`--space-8`. Replaces `paper-card` watercolor gradients and all `glass-soft` surfaces.
3. **Keepsake frame** (special, ≤2 per page): paper card + `--border-double` gold hairline — for the event details "invitation card" and QRIS.
4. **Mat block:** `bg-beige-200` or `bg-sage-100` full-width band used to alternate chapter backgrounds — opaque, never translucent over a fixed backdrop.
5. Banned: `backdrop-blur` surfaces, stacked rounded cards of the same size in sequence, cards inside cards more than 1 level.

## 14. Section Transition System (chapters)

1. The page is a sequence of **chapters**; each chapter owns its background color from the mat palette (ivory → sage-100 → ivory → beige-200 …). Adjacent chapters never share the same background.
2. Transitions between chapters are hard edges softened by one of: (a) the standard sprig divider, (b) an arch-shaped mask on the leading image, or (c) a 1px gold hairline. No SVG grass ledges, no gradient fades, no fixed parallax backdrop showing through translucent sections (retires `StaticBackdrop` + `bg-*/55 backdrop-blur` pattern).
3. Each chapter begins with the eyebrow → title → rule pattern (Poppins eyebrow, Cormorant title, hairline).
4. Scroll continuity: content enters from below (translate-y), consistent direction site-wide.

## 15. Motion Principles

**System: "chapter reveal" — one primary gesture per viewport.**

| Token | Value |
|---|---|
| `--motion-duration-fast` | `200ms` (micro-interactions: hover, press) |
| `--motion-duration-base` | `600ms` (chapter reveal) |
| `--motion-duration-slow` | `900ms` (cover open, hero only) |
| `--motion-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (enter) |
| `--motion-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` (exit — exits run ~65% of enter duration) |
| `--motion-distance` | `24px` mobile / `40px` desktop (translate-y reveal distance) |
| `--motion-stagger` | `80ms` between siblings, max 5 staggered items, total stagger ≤400ms |

**Rules:**
1. One primary reveal per chapter (title block, or the photo, or the card — not all three independently). Children of the primary element may stagger.
2. Animate `transform` and `opacity` only. Never width/height/top/left; no layout-shifting animation.
3. `clip-path`/mask reveals: allowed on ≤2 chapters total (hero arch reveal + one other), simple shapes only.
4. No continuous/infinite animation except: the music button's playing indicator and a subtle scroll cue on the cover — both pause when off-screen and under reduced motion.
5. Scroll-triggered reveals fire once (`once: true`), threshold ~25% visibility.
6. Interruptible: user input is never blocked by animation; the "open invitation" transition must not gate scrolling for more than `--motion-duration-slow`.
7. Concurrency budget: ≤6 simultaneously animating elements, ≤1 scrub-linked (GSAP ScrollTrigger) timeline per chapter.

## 16. Reduced-Motion Behavior

When `prefers-reduced-motion: reduce`:

1. **CSS:** global media query zeroes animation/transition durations (already present — keep).
2. **Framer Motion:** wrap the app in `<MotionConfig reducedMotion="user">`; reveal variants collapse to opacity-only 150ms fades.
3. **GSAP:** gate every ScrollTrigger/timeline behind a `usePrefersReducedMotion()` hook; when reduced, set final state immediately (`gsap.set`) instead of tweening.
4. **Lenis:** do not instantiate; fall back to native scrolling (also removes smooth-scroll vestibular risk).
5. Cover "open" becomes a simple crossfade; countdown numbers update without flip/scale effects; music still requires explicit user tap (no autoplay change — see §17.7).
6. All content must be fully readable with animations disabled — no reveal leaves opacity at 0.

## 17. Accessibility Requirements

1. Text contrast per §3.3 matrix (AA minimum), verified per background token.
2. Body ≥16px mobile; secondary ≥14px; 12px only for non-critical metadata.
3. Focus visible: 2px `--olive-600` outline, `outline-offset: 3px`, on every interactive element; never `outline: none` without replacement.
4. Touch targets ≥44×44px, ≥8px gaps.
5. Semantic structure: single `h1` (couple names), sequential headings, `<main>`/`<section aria-labelledby>` landmarks, skip link to main content after opening.
6. Arabic verse: `lang="ar" dir="rtl"` + Amiri (real shaping); translation `lang="id"`.
7. Audio: never autoplay without interaction; the "Buka Undangan" tap counts as interaction but music button state must be announced (`aria-pressed`, labeled "Putar musik"/"Jeda musik").
8. Modals (QRIS, Lightbox): focus trap, `aria-modal="true"`, labeled, Escape + visible close, focus returns to trigger, body scroll locked.
9. Wishes list updates announce via `aria-live="polite"`; pagination buttons labeled.
10. Decorative SVG/ornaments `aria-hidden="true"`; meaningful photos get descriptive `alt` (names, moment), decorative background media `alt=""`.
11. Countdown announces as text, not only as separated digit tiles (`aria-label="32 hari 4 jam …"`).
12. Keyboard: entire flow operable — open invitation, browse, lightbox arrows, RSVP submit — without a pointer.

## 18. Performance Budget

| Item | Budget |
|---|---|
| Hero media | Poster image (AVIF ≤120KB) loads first as LCP; video optional enhancement ≤1.5MB WebM / ≤2.0MB MP4, `preload="none"`, starts only after open + `requestIdleCallback`; no video on `prefers-reduced-data` or reduced motion |
| Above-fold images | LCP image `priority` + AVIF/WebP, ≤150KB; everything else lazy |
| Content images | Portraits ≤120KB, gallery tiles ≤180KB, story photos ≤100KB (at 2x DPR target dims per asset map) |
| Decorative backgrounds | Retire the 2.3MB/1.9MB/2.4MB PNGs; replacement SVG ornaments ≤30KB total |
| Initial JS | First-load JS ≤220KB gzip for the invitation route; GSAP + Lightbox + QRIS modal dynamically imported; admin bundle stays separate |
| Fonts | ≤4 families via `next/font`, WOFF2 subset, total ≤280KB (Amiri Arabic subset is the big one) |
| Animation concurrency | ≤6 elements animating at once; 0 infinite loops at idle (§15.4 exceptions) |
| Blur/filter | `backdrop-filter` only on 2 modal scrims ≤8px; no full-viewport filters ever |
| Lazy loading | Everything below the cover: `loading="lazy"` images, `next/dynamic` for Gallery/Lightbox/QRIS/Wishes list; map iframe loads on interaction or `IntersectionObserver` |
| Audio | `preload="none"`, load on first play tap/open, ≤2MB MP3 mono 128kbps |
| LCP | ≤2.5s on emulated 4G / mid-tier Android (Moto G class) |
| CLS | ≤0.1 (target ≈0: fonts via next/font, media with dimensions, no late-injected banners) |
| INP | ≤200ms — no long tasks from animation setup on open |

## 19. Anti-Patterns to Avoid

1. Watercolor washes, painted valleys, gradient "scenes" (`WatercolorValley` retired from all chapters).
2. Floating petals/birds/continuous ambient animation (`Petals`, `Birds` retired).
3. Glassmorphism / `glass-soft` / translucent section backgrounds over a fixed backdrop.
4. Fullscreen `backdrop-blur` on section wrappers (`bg-cream/55 backdrop-blur-sm` pattern).
5. Rounded-card grids where every block is the same pill-shaped card.
6. Script font (Great Vibes) for headings, dates, numbers, captions — signature use only (§4.2).
7. Serif/latin font on Arabic text.
8. Information text via opacity (`text-ink/50`) or below 14px.
9. Invalid utilities `font-500`/`font-600` (use `font-medium`/`font-semibold`).
10. Raw `<img>` for content imagery; unoptimized multi-MB PNG backdrops.
11. Emoji as icons; mixed icon families (standardize on one line-icon set, consistent stroke).
12. Autoplaying media before user interaction; scroll hijacking under reduced motion.
13. New business-logic changes smuggled in with visual refactors.

## 20. Pre-Delivery Checklist

**Visual**
- [ ] Chapter uses tokens only — no raw hex, no banned utilities (`grep` for `#`, `font-600`, `text-[10px]`, `backdrop-blur` outside modals)
- [ ] One ornament style (etched line), ≤2 ornaments per viewport, single ink color each
- [ ] Great Vibes appears only in the 2 signature slots; Arabic renders in Amiri (test on device — look for real ligatures/shaping)
- [ ] Alternating chapter backgrounds; no translucent sections

**Motion**
- [ ] One primary gesture per chapter; reveals fire once; nothing loops at idle
- [ ] `prefers-reduced-motion` verified: Lenis off, GSAP set-not-tween, Framer fades only, page fully readable
- [ ] Only transform/opacity in devtools animation inspector

**Accessibility**
- [ ] Axe/Lighthouse a11y pass ≥95 on invitation route
- [ ] Keyboard-only walkthrough: open → RSVP submit → lightbox → QRIS modal → close
- [ ] Contrast spot-check per §3.3 on every background token
- [ ] Screen reader pass: landmarks, verse language switching, countdown label, form errors announced

**Performance**
- [ ] Lighthouse mobile: LCP ≤2.5s, CLS ≤0.1 (throttled)
- [ ] Network tab: no image >200KB, no font >120KB single file, hero video not fetched before open
- [ ] Bundle: `next build` first-load JS ≤220KB for `/`
- [ ] Test at 320px, 375px, 768px, 1024px, 1440px + landscape phone

**Regression**
- [ ] RSVP, wishes (post/reply/paginate), gift copy/QRIS download, maps, calendar link, guest-name personalization, music toggle, admin — all behave identically
- [ ] `git diff` touches only presentation files agreed in the plan
