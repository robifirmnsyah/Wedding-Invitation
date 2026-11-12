# Claude Code Task — Implement Approved Vintage Garden Editorial Redesign

The design audit and Stage 2/3 design-system documents have been approved. Use the installed UI UX Pro Max skill and implement the Vintage Garden Editorial redesign now.

## Implementation scope

Use these existing documents as the visual source of truth and implementation plan:

- `design-system/MASTER.md`
- `design-system/README.md`
- `design-system/IMPLEMENTATION_PLAN.md`

Implement the redesign incrementally, starting with P0, then P1, then P2 where practical. Do not stop at recommendations: modify the application source code and verify the result.

## Final design decisions

- Theme: Vintage Garden Editorial.
- Character: romantic botanical, elegant, personal, and cinematic.
- Primary experience: mobile-first, while remaining responsive on desktop.
- Keep the olive, sage, ivory, and beige color palette.
- Muted gold may be used sparingly for hairlines, borders, and ornamental highlights.
- Use the couple’s photography as the primary visual narrative.
- Use botanical engraving/etched illustrations as supporting decoration.
- Reduce playful watercolor elements, glassmorphism, repetitive rounded cards, fullscreen blur, and excessive petal animations.
- Animations should use a chapter-reveal approach: one primary motion gesture per viewport.
- Keep the couple’s names as “Robi & Tiara”.
- Replace Fredoka as the primary display-heading font with an editorial serif that fits Vintage Garden.
- Use an Arabic font with correct shaping for the Quranic verse.
- Keep body text at least 16px on mobile and secondary information at least 14px.
- Use WCAG AA contrast and visible keyboard focus states.
- Respect `prefers-reduced-motion`; Lenis, GSAP, and Framer Motion must opt out or reduce motion when enabled.

## Protected behavior and data

Do not change business logic, APIs, Supabase, RSVP, wishes, gifts, QRIS, maps, guest personalization, or the admin dashboard. Preserve existing data/config values and event handlers. Do not remove existing assets until confirmed unused. Do not place full-resolution source photos in `public` without optimization. Do not remove or manipulate watermarks. If watermark-free versions are unavailable, document the limitation and use existing files temporarily.

Photos from `~/Downloads/PREWED EDIT` may be used. Inspect the entire folder if accessible and select the best individual groom portrait; do not keep the current portrait merely because it has not been reviewed. The path may currently be broken by a self-referential symlink; if inaccessible, document the exact blocker and do not guess.

## Required implementation order

1. Read the design-system documents and inspect the existing app structure before editing.
2. Create a safe baseline/backup if needed.
3. Implement P0: global tokens, typography, accessibility foundation, loading/hero/cover/opening interaction, and mobile scroll behavior.
4. Implement P1 sections: quote, bride/groom, love story, save the date, event details, and gallery.
5. Implement P2 surfaces: RSVP, wishes, gift, modal accessibility, closing, and performance polish.
6. Preserve all protected behavior. Prefer shared components and tokens over scattered one-off values.
7. Use optimized responsive images and reserve image dimensions to prevent CLS.
8. Use transform/opacity animation properties and one primary motion gesture per section.

## Verification requirements

After implementation:

- Run type-check.
- Run production build.
- Run the dev server and browser smoke test the invitation opening flow.
- Verify responsive behavior at mobile and desktop widths.
- Verify keyboard focus and reduced-motion behavior.
- Verify no console errors.
- Verify RSVP/wishes/gift/map interactions were not removed or disconnected.
- Check `git diff` and summarize all modified files.
- Do not claim success without real command/browser output.
- Commit the implementation locally with a descriptive commit message.
- Do not push to GitHub without explicit approval.

At completion, report:

1. Implemented changes by section.
2. Files modified/created.
3. Verification commands and actual results.
4. Any known limitations or blocked assets.
5. Commit hash.
6. Confirmation that GitHub was not pushed.
