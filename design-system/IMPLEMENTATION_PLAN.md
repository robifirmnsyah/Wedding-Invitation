# Implementation Plan — Vintage Garden Editorial

> Scope: planning only. This document deliberately does not modify application source code. Implementation must preserve business logic, APIs, Supabase, RSVP, wishes, gifts, QRIS, maps, guest personalization, and admin dashboard.

## Design-system dependencies

- Source of truth: `design-system/MASTER.md`.
- Usage and review rules: `design-system/README.md`.
- Existing stack: Next.js, Tailwind CSS, Framer Motion/GSAP/Lenis where already present.
- Couple identity: **Robi & Tiara**.
- Palette: olive, sage, ivory, beige, with restrained muted gold.

## Work sequencing

Implement one vertical slice at a time: global foundation → opening/hero → content chapters → interactive forms/modals → performance polish. After every slice, run type-check, build, and responsive browser checks at 375px, 768px, 1024px, and 1440px. Keep each slice independently reversible.

## P0 — Foundation and opening experience

### P0.1 Loading experience

- **Current problem:** Loading and asset readiness are not yet governed by a documented editorial experience; heavy media can create uncertainty or layout shift.
- **Desired outcome:** A calm, minimal loading state that establishes the garden/editorial tone and exits once critical hero content is ready.
- **Files to change:** Existing loading component/route discovered during implementation; `src/app/globals.css`; relevant asset manifest only if needed.
- **Required assets:** Optimized hero image, small botanical mark, optional muted-gold hairline.
- **Technical approach:** Reserve hero dimensions; use Next/Image; preload only the LCP image; lazy-load below-fold media.
- **Animation:** One opacity/scale reveal, 200–400ms; no continuous petals or spinner-heavy motion.
- **Mobile:** Keep loading content within the first viewport and avoid blocking scroll longer than necessary.
- **Desktop:** Preserve the same short sequence with a wider editorial frame.
- **Accessibility:** Announce meaningful loading only when necessary; never trap keyboard focus; provide readable fallback text.
- **Performance:** Target LCP under 2.5s on a simulated mobile connection; no full-resolution source image.
- **Regression risks:** Hydration mismatch, flash of incorrect font, delayed interaction.
- **Acceptance criteria:** No visible layout jump; opening becomes usable after critical hero assets load; reduced-motion skips decorative transitions.
- **Verification:** Playwright/browser check with cache disabled and reduced-motion enabled.

### P0.2 Hero / cover

- **Current problem:** Hero is visually playful and does not yet establish the intended Vintage Garden Editorial hierarchy.
- **Desired outcome:** Photography-led cover with Robi & Tiara, editorial serif typography, botanical engraving support, and a clear opening CTA.
- **Files to change:** Existing hero section/component, global tokens, image configuration only after implementation approval.
- **Required assets:** Best couple hero image; botanical etched ornament; optimized responsive image variants.
- **Technical approach:** Full-bleed or framed image with reserved aspect ratio; deep-olive text and ivory surface; avoid fullscreen blur.
- **Animation:** Single chapter reveal: image crop settles, then title and CTA fade/translate in.
- **Mobile:** 16px minimum body text, CTA at least 44px high, no horizontal overflow, safe-area padding.
- **Desktop:** Editorial max-width frame, restrained negative space, image remains the primary narrative.
- **Accessibility:** One h1; descriptive alt text; labelled CTA; visible focus state; contrast WCAG AA.
- **Performance:** LCP image in WebP/AVIF where supported; responsive `sizes`; no eager loading for non-hero media.
- **Regression risks:** Cover interaction may affect guest personalization/open state.
- **Acceptance criteria:** Opening interaction still unlocks the invitation and preserves all existing state/business logic.
- **Verification:** Test open flow on iOS-sized and desktop viewports; inspect network and LCP.

### P0.3 Opening interaction

- **Current problem:** Opening interaction can feel like a decorative transition instead of an intentional invitation moment.
- **Desired outcome:** One clear, reversible open gesture with an obvious CTA and no hidden content dependency.
- **Files to change:** Existing invitation shell/open-state component and styles.
- **Required assets:** None beyond hero/ornament assets.
- **Technical approach:** Preserve current open state and event handlers; change only presentation and motion sequencing.
- **Animation:** 300–600ms transform/opacity chapter reveal; no continuous animation.
- **Mobile:** CTA reachable with one thumb; prevent accidental double activation; preserve scroll position.
- **Desktop:** Same semantic interaction with slightly slower editorial pacing.
- **Accessibility:** Button semantics, aria-label, keyboard activation, focus return, reduced-motion fallback.
- **Performance:** Avoid animating width/height; animate transform and opacity only.
- **Regression risks:** Breaking audio/autoplay policy or guest-specific route state.
- **Acceptance criteria:** Existing open behavior and personalization are unchanged.
- **Verification:** Keyboard, touch, refresh-before-open, deep-link, and reduced-motion tests.

### P0.4 Typography foundation

- **Current problem:** Fredoka is not aligned with the editorial direction; Arabic shaping and role separation need explicit rules.
- **Desired outcome:** Editorial serif display system, Poppins or equivalent UI/body system, and a verified Arabic font for Quranic verse.
- **Files to change:** `src/app/layout.tsx`, global CSS/Tailwind tokens, Quranic verse component only if font wiring is required.
- **Required assets:** Next.js-compatible font imports or self-hosted subsets; Arabic font with shaping support.
- **Technical approach:** Use `next/font`; define font roles and CSS variables; avoid layout shifts from late font loading.
- **Animation:** None in typography foundation.
- **Mobile:** Body 16px minimum; metadata 14px minimum; readable line-height.
- **Desktop:** Fluid display scale capped at editorial max size.
- **Accessibility:** Preserve text zoom; do not use text as image; verify Arabic direction and shaping.
- **Performance:** Subset latin/arabic ranges; preload only display/body fonts that are above fold.
- **Regression risks:** Font metrics alter wrapping and hero height.
- **Acceptance criteria:** No clipped names or Quranic glyphs at 200% zoom.
- **Verification:** Visual diff at four breakpoints, Arabic shaping check, Lighthouse font audit.

### P0.5 Global tokens

- **Current problem:** Visual rules are distributed across raw classes and need one implementation mapping.
- **Desired outcome:** Tokens from `MASTER.md` become the only source for color, spacing, type, radius, shadow, and motion.
- **Files to change:** `src/app/globals.css`, Tailwind config, design-token helper if present.
- **Required assets:** None.
- **Technical approach:** Map semantic tokens to CSS variables and Tailwind theme aliases; avoid scattered raw hex values.
- **Animation:** Centralize duration/easing/distance tokens.
- **Mobile:** Use fluid spacing and typography where possible.
- **Desktop:** Apply content-width and section spacing tokens consistently.
- **Accessibility:** Contrast tokens must pass WCAG AA.
- **Performance:** Avoid broad expensive filters in base styles.
- **Regression risks:** Existing olive utility names may visually change many sections.
- **Acceptance criteria:** New sections can use tokens without inventing values.
- **Verification:** Token grep, contrast audit, build/type-check.

### P0.6 Accessibility foundation

- **Current problem:** Accessibility requirements need to be enforced consistently across chapters and controls.
- **Desired outcome:** Keyboard order, focus states, semantic headings, labels, alt text, and reduced motion are baseline behavior.
- **Files to change:** App shell, global CSS, shared controls, modal primitives.
- **Required assets:** None.
- **Technical approach:** Add skip/link focus patterns, semantic landmarks, `:focus-visible`, reduced-motion hook, and aria labels.
- **Animation:** Disable or shorten nonessential motion for `prefers-reduced-motion`.
- **Mobile:** Touch targets ≥44×44px with 8px spacing.
- **Desktop:** Keyboard navigation matches visual order.
- **Accessibility:** WCAG AA contrast, screen-reader labels, no color-only meaning.
- **Performance:** No polling or animation loop solely for decoration.
- **Regression risks:** Focus trap changes can affect RSVP/gift modals.
- **Acceptance criteria:** Keyboard-only pass from cover through closing section.
- **Verification:** axe/Lighthouse plus manual keyboard and screen-reader smoke tests.

### P0.7 Mobile scroll behavior

- **Current problem:** Fullscreen effects, blur, and multiple simultaneous motions can make mobile scrolling heavy or disorienting.
- **Desired outcome:** Predictable chapter-based scroll with one motion gesture per viewport.
- **Files to change:** Invitation shell, scroll/motion utilities, section wrappers.
- **Required assets:** None.
- **Technical approach:** Preserve Lenis/GSAP/Framer Motion behavior only where useful; gate all with reduced-motion and mobile performance checks.
- **Animation:** Transform/opacity only; no continuous multi-element loops.
- **Mobile:** No horizontal scroll; no scroll hijacking; passive touch behavior.
- **Desktop:** Gentle section reveal and editorial pacing.
- **Accessibility:** Native scroll remains usable; reduced-motion disables smooth scrolling where appropriate.
- **Performance:** Keep animation concurrency to one primary gesture per viewport; limit blur/filter usage.
- **Regression risks:** Scroll locking can break opening, RSVP, or modal close behavior.
- **Acceptance criteria:** Native back/forward and anchor/deep-link behavior remain predictable.
- **Verification:** 375px device emulation, touch scroll, reduced-motion, low-end CPU throttle.

## P1 — Content chapters

For each P1 chapter, preserve current data/config and implement a shared editorial section wrapper: deep-olive heading, ivory/sage surface, thin muted-gold hairline, botanical ornament, and one reveal gesture. Avoid repetitive rounded cards.

### P1.1 Quote

- **Current problem:** Quote presentation competes with decorative effects.
- **Desired outcome:** Quiet typographic pause with clear Quranic Arabic shaping and translation hierarchy.
- **Files to change:** Quote section and typography tokens.
- **Required assets:** Optional etched divider.
- **Technical approach:** Semantic blockquote, Arabic direction, editorial measure.
- **Animation:** Single fade/reveal on entering viewport.
- **Mobile/Desktop:** 16px+ translation, comfortable measure; desktop max-width 680px.
- **Accessibility:** Correct language/direction metadata and contrast.
- **Performance:** No background video or blur.
- **Regression risks:** Arabic font fallback.
- **Acceptance criteria:** Arabic glyphs shape correctly and text remains readable at zoom.
- **Verification:** Arabic font test and responsive screenshot.

### P1.2 Bride and groom

- **Current problem:** Portraits need a more deliberate editorial composition.
- **Desired outcome:** Couple photography remains primary, supported by restrained botanical framing.
- **Files to change:** Couple section and image wrappers.
- **Required assets:** Groom portrait selected from PREWED EDIT; bride portrait; optimized variants.
- **Technical approach:** Use `next/image`, explicit dimensions, focal-point crop metadata.
- **Animation:** One image reveal per chapter; no looping petals.
- **Mobile/Desktop:** Stacked mobile portraits; balanced editorial grid desktop.
- **Accessibility:** Descriptive alt text and preserved names.
- **Performance:** Lazy-load below-fold images; AVIF/WebP outputs.
- **Regression risks:** Wrong portrait or broken config mapping.
- **Acceptance criteria:** Selected portrait documented; no source files copied into public unoptimized.
- **Verification:** Asset audit and visual crop review.

### P1.3 Love story

- **Current problem:** Repeated cards can make the story feel like a dashboard.
- **Desired outcome:** A vertical editorial timeline with breathing room and a single chapter transition.
- **Files to change:** Love story section and shared timeline styles.
- **Required assets:** Optional small botanical line art.
- **Technical approach:** Semantic ordered list, alternating desktop layout only if it preserves reading order.
- **Animation:** Stagger text blocks once on reveal.
- **Mobile/Desktop:** Linear mobile flow; editorial two-column desktop.
- **Accessibility:** Ordered list semantics and heading hierarchy.
- **Performance:** CSS transforms only.
- **Regression risks:** Timeline order changes.
- **Acceptance criteria:** Story order identical to existing config.
- **Verification:** DOM reading order and mobile screenshot.

### P1.4 Save the date

- **Current problem:** Date information can be visually secondary or too small.
- **Desired outcome:** Clearly scannable date, venue, and action without decorative noise.
- **Files to change:** Save-the-date section and calendar action only if present.
- **Required assets:** None.
- **Technical approach:** Semantic time/date elements and tokenized typography.
- **Animation:** One gentle reveal.
- **Mobile/Desktop:** Date remains ≥16px; action target ≥44px.
- **Accessibility:** Text conveys all information without color alone.
- **Performance:** No extra media.
- **Regression risks:** Calendar link behavior.
- **Acceptance criteria:** Existing calendar action continues to work.
- **Verification:** Link and timezone/date snapshot tests.

### P1.5 Event details

- **Current problem:** Venue and time details risk becoming repetitive rounded cards.
- **Desired outcome:** Editorial event panel with clear hierarchy and map action.
- **Files to change:** Event section and map link wrapper.
- **Required assets:** Optional venue photo only after asset review.
- **Technical approach:** Preserve map URL/data; use semantic address/time elements.
- **Animation:** Reveal panel once; no continuous floating effect.
- **Mobile/Desktop:** Stacked details mobile; two-column information desktop.
- **Accessibility:** Link names include destination; sufficient contrast.
- **Performance:** External map opens lazily/on demand.
- **Regression risks:** Map URL or event data mutation.
- **Acceptance criteria:** Map action and event values unchanged.
- **Verification:** Link test and keyboard traversal.

### P1.6 Gallery

- **Current problem:** Gallery needs a photography-led rhythm rather than ornamental repetition.
- **Desired outcome:** Curated image sequence with deliberate crops and no layout shift.
- **Files to change:** Gallery component and image data mapping only after approval.
- **Required assets:** Selected couple photos, optimized derivatives.
- **Technical approach:** CSS grid/masonry-like editorial layout with reserved aspect ratios; no full-res public sources.
- **Animation:** One viewport-level reveal; avoid every-image parallax.
- **Mobile/Desktop:** Single/paired column mobile; controlled editorial grid desktop.
- **Accessibility:** Alt text, keyboard focus, no lightbox trap until modal rules are implemented.
- **Performance:** Lazy-load gallery; target reasonable per-image byte budget.
- **Regression risks:** Removing or reordering user-approved photos.
- **Acceptance criteria:** Existing gallery content remains available unless explicitly approved for curation.
- **Verification:** Network size check and visual crop review.

## P2 — Interactive and final polish

### P2.1 RSVP

- **Current problem:** Form styling must align with the editorial system without changing submission logic.
- **Desired outcome:** Clear labels, states, validation, and calm surfaces.
- **Files to change:** RSVP presentation and shared form tokens only.
- **Required assets:** None.
- **Technical approach:** Preserve handlers/API/schema; improve labels, errors, disabled/loading states.
- **Animation:** 150–250ms state transitions; no decorative looping.
- **Mobile/Desktop:** Full-width mobile controls; constrained readable desktop form.
- **Accessibility:** Labels, errors near fields, keyboard order, focus return.
- **Performance:** No new client dependency.
- **Regression risks:** Accidental API or validation changes.
- **Acceptance criteria:** Existing RSVP submission behavior passes unchanged.
- **Verification:** Mocked/API integration test and keyboard form test.

### P2.2 Wishes

- **Current problem:** Wishes UI can become a dense list of rounded cards.
- **Desired outcome:** Readable guest messages with clear loading/empty/error states.
- **Files to change:** Wishes section/presentation only.
- **Required assets:** None.
- **Technical approach:** Preserve Supabase query and pagination; tokenized message surfaces.
- **Animation:** Reveal new content once; no animated list on every render.
- **Mobile/Desktop:** Comfortable message measure on both.
- **Accessibility:** Live-region status only for meaningful updates.
- **Performance:** Avoid rendering unnecessary offscreen messages.
- **Regression risks:** Query or auth changes.
- **Acceptance criteria:** Read/create wishes behavior unchanged.
- **Verification:** Network mock, empty/error states, screen reader status.

### P2.3 Gift

- **Current problem:** Gift/QRIS information must be trustworthy and legible.
- **Desired outcome:** Calm, high-contrast gift instructions with copy feedback.
- **Files to change:** Gift/QRIS presentation only.
- **Required assets:** Existing QRIS asset after confirming usage and resolution.
- **Technical approach:** Preserve payment details; use explicit copy buttons and success feedback.
- **Animation:** Brief copy confirmation only.
- **Mobile/Desktop:** QR code readable on mobile; no cropped code.
- **Accessibility:** Copy button label/state and text alternative for important details.
- **Performance:** Optimize QR image without changing its encoded data.
- **Regression risks:** Altered QR or account number.
- **Acceptance criteria:** Scanning and copying remain correct.
- **Verification:** QR scan and clipboard/keyboard tests.

### P2.4 Modal accessibility

- **Current problem:** Modals/lightboxes require consistent focus and escape behavior.
- **Desired outcome:** All dialogs have predictable open, close, focus, and scroll behavior.
- **Files to change:** Shared modal/lightbox component and styles.
- **Required assets:** None.
- **Technical approach:** Native dialog or tested focus-trap primitive; preserve existing data/actions.
- **Animation:** Opacity/transform only, 150–250ms; instant reduced-motion fallback.
- **Mobile/Desktop:** Safe-area padding; no offscreen close button.
- **Accessibility:** Role/name, Escape, focus return, inert background, labelled close.
- **Performance:** Avoid backdrop blur on low-end/mobile where unnecessary.
- **Regression risks:** Scroll lock and focus bugs.
- **Acceptance criteria:** Keyboard and screen-reader modal flow passes.
- **Verification:** Manual keyboard test and axe audit.

### P2.5 Closing

- **Current problem:** Closing section may lack a deliberate editorial conclusion.
- **Desired outcome:** A quiet final chapter that reinforces Robi & Tiara and provides expected final actions.
- **Files to change:** Closing section and final ornament.
- **Required assets:** Optional final couple image or botanical engraving.
- **Technical approach:** Reuse token system; no business logic changes.
- **Animation:** Single final reveal.
- **Mobile/Desktop:** Keep closing actions visible and tappable.
- **Accessibility:** Heading hierarchy and action labels.
- **Performance:** Do not preload closing media.
- **Regression risks:** Missing final action links.
- **Acceptance criteria:** All existing closing actions remain available.
- **Verification:** End-to-end scroll and keyboard test.

### P2.6 Final performance polish

- **Current problem:** Aggregate media, JS, blur, and animation cost is unknown.
- **Desired outcome:** Measurable mobile-first performance budget from `MASTER.md`.
- **Files to change:** Only after profiling: image components, motion utilities, CSS, package config if unavoidable.
- **Required assets:** Optimized derivatives and confirmed unused-asset report.
- **Technical approach:** Lighthouse/DevTools profiling, bundle analysis, lazy loading, animation concurrency reduction.
- **Animation:** One primary gesture per viewport; no continuous decorative concurrency.
- **Mobile/Desktop:** Test both network/device classes.
- **Accessibility:** No performance optimization may remove semantics or zoom.
- **Performance:** Validate LCP, CLS, JS, media bytes, blur/filter count, and preload policy.
- **Regression risks:** Visual degradation or interaction timing changes.
- **Acceptance criteria:** All documented budgets pass or have explicit approval for exceptions.
- **Verification:** Lighthouse, WebPageTest/DevTools, production build, browser smoke tests.

## Asset mapping

| Section | Recommended photo filename | Orientation | Crop recommendation | Target dimensions | Output format | Loading strategy | Fallback |
|---|---|---|---|---|---|---|---|
| Hero/cover | Best approved couple portrait or hero from `~/Downloads/PREWED EDIT` | Landscape or portrait depending on source | Keep faces in safe center; preserve editorial negative space | Mobile 900px wide; desktop 1600px wide | AVIF/WebP + JPEG fallback | Preload only hero LCP | Existing configured hero image |
| Bride & groom — groom | Best individual groom portrait selected after complete asset review | Portrait | Head/shoulders with eyes in upper third | 900×1200 | AVIF/WebP | Lazy-load below fold | Existing groom asset, documented for replacement |
| Bride & groom — bride | Existing approved bride portrait after review | Portrait | Preserve face and dress detail | 900×1200 | AVIF/WebP | Lazy-load | Existing configured bride image |
| Love story | Only approved supporting couple image | Mixed | Crop to preserve subjects, avoid decorative faces being cut | 1200px long edge | WebP/AVIF | Lazy-load | Botanical divider/no image |
| Gallery | Curated existing/prewed images | Mixed | Explicit focal point per image; reserve aspect ratio | 900–1600px long edge | AVIF/WebP | Lazy-load, low-priority | Existing gallery item |
| Event details | Optional venue image only if approved | Landscape | Wide crop with clear venue context | 1200×800 | WebP/AVIF | Lazy-load | Text-only event panel |
| Closing | Optional final couple image | Portrait/landscape | Calm, low-detail crop | 1200px long edge | WebP/AVIF | Lazy-load | Botanical engraving |
| QRIS | Existing QRIS asset | Square | No crop; preserve quiet zone | Exact scan-safe dimensions | PNG/WebP only if scan-tested | Load when gift section is near viewport | Text gift details |

### Groom portrait review status

A complete file listing of `~/Downloads/PREWED EDIT` could not be safely completed during the planning run because `~/Downloads` is a self-referential symlink, so any traversal fails with `ELOOP`. As a result, no groom photo was selected; no asset was copied, deleted, or selected by assumption. Before P1 implementation, resolve that path and review every image; choose the best individual portrait based on sharpness, face visibility, neutral crop space, and consistency with the Vintage Garden direction. Keep the current configured portrait as a temporary fallback and document the replacement decision.

## Incremental migration strategy

1. Freeze a baseline commit and keep the existing backup branch.
2. Land only `design-system/` documentation first for approval.
3. Implement P0 global tokens and typography behind existing component boundaries; do not change data contracts.
4. Implement the cover/opening as the first vertical slice and verify guest personalization/audio/open state.
5. Migrate one P1 chapter at a time, retaining old markup until the replacement passes responsive and accessibility checks.
6. Migrate P2 interactive surfaces last; treat RSVP, wishes, gifts, QRIS, maps, and admin as protected behavior.
7. Optimize only after visual parity and functional regression checks; never delete an asset before usage search confirms it is unused.
8. Maintain a migration checklist and screenshot baseline for every breakpoint.
9. Require explicit approval before changing source photos, removing decorative assets, changing font families, or altering motion intensity.
10. Run type-check, production build, browser smoke tests, Lighthouse, and a final git diff review before merge.

## Required approval decisions before implementation

- Final editorial serif and Arabic font pairing.
- Exact hero and groom portrait assets after the symlink-loop path is resolved.
- Whether existing watercolor assets are reduced, retained as fallback, or removed after usage confirmation.
- Whether the opening interaction remains a full cover or becomes a shorter chapter reveal.
- Accepted mobile performance exceptions, if any.
