# Claude Code Task — UI UX Pro Max Stage 2 & Stage 3

I approve the audit results and the recommended redesign direction.

Use the UI UX Pro Max skill and proceed with Stage 2 and Stage 3 only.
Do not implement any source-code changes yet.

Final design decisions:

- Theme: Vintage Garden Editorial.
- Character: romantic botanical, elegant, personal, and cinematic.
- Primary experience: mobile-first, while remaining responsive on desktop.
- Keep the olive, sage, ivory, and beige color palette.
- Muted gold may be used sparingly for hairlines, borders, and ornamental highlights.
- Use the couple’s photography as the primary visual narrative.
- Use botanical engraving/etched illustrations as supporting decoration.
- Reduce playful watercolor elements, glassmorphism, repetitive rounded cards, fullscreen blur, and excessive petal animations.
- Animations should use a chapter-reveal approach: one primary motion gesture per viewport.
- Do not change business logic, APIs, Supabase, RSVP, wishes, gifts, QRIS, maps, guest personalization, or the admin dashboard.
- Keep the couple’s names as “Robi & Tiara”.
- Photos from `~/Downloads/PREWED EDIT` may be used for this project.
- Do not delete existing assets until you have confirmed that they are unused.
- Do not place full-resolution source photos in `public` without optimization.
- Watermarks on photos do not need to be removed or manipulated. If watermark-free versions are unavailable, use the existing files temporarily and document them as assets that need to be replaced.

## Stage 2 — Create the design system

Create the following folder:

```text
design-system/
```

Create these files:

1. `design-system/MASTER.md`
2. `design-system/README.md`

`MASTER.md` must serve as the project’s visual source of truth and include:

1. Design principles
2. Visual keywords
3. Color tokens
4. Typography system
5. Font roles
6. Font sizes and responsive type scale
7. Line height and letter spacing
8. Spacing scale
9. Layout and content width
10. Mobile and desktop breakpoints
11. Border, radius, and shadow rules
12. Botanical ornament rules
13. Image treatment
14. Button and link variants
15. Form component rules
16. Card and surface rules
17. Section transition system
18. Motion principles
19. Reduced-motion behavior
20. Accessibility requirements
21. Performance budget
22. Anti-patterns to avoid
23. Pre-delivery checklist

Use realistic CSS tokens or Tailwind tokens that can be applied to the project.

### Typography

- Replace Fredoka as the primary display-heading font.
- Choose an editorial serif that fits the Vintage Garden direction.
- Ensure the font works well with Next.js performance practices.
- Use an Arabic font that properly supports Arabic shaping for the Quranic verse.
- Poppins may be retained for body or UI text if appropriate.
- Caveat may only be used as a limited accent if it remains consistent with the direction.
- The ideal minimum body-text size on mobile is 16px.
- Secondary information should not be smaller than 14px unless it is non-critical metadata.

### Color

- Preserve olive, sage, ivory, and beige.
- Add deep olive for primary text.
- Use muted gold only as a small accent.
- All text/background combinations should target WCAG AA contrast.
- Avoid low opacity for important information.

### Motion

- Use one primary motion gesture per section.
- Use transform and opacity as the default animation properties.
- Use masks/clip-path sparingly.
- Avoid continuous animation on many elements at once.
- Define duration, easing, stagger, and distance values.
- Create a clear reduced-motion fallback.
- Lenis, GSAP, and Framer Motion must opt out when reduced motion is enabled.

### Performance budget

Define targets for:

- hero media
- image sizes
- initial JavaScript
- animation concurrency
- blur/filter usage
- lazy loading
- audio and video preload
- Largest Contentful Paint
- Cumulative Layout Shift

`README.md` must explain:

- how to use `MASTER.md`;
- how tokens map to Tailwind/global CSS;
- rules for adding new sections;
- rules for selecting photos;
- rules for adding animations;
- the review checklist before merging.

## Stage 3 — Create the implementation plan

Create this file:

```text
design-system/IMPLEMENTATION_PLAN.md
```

Group the work into:

### P0

- loading experience
- hero/cover
- opening interaction
- typography foundation
- global tokens
- accessibility foundation
- mobile scroll behavior

### P1

- quote
- bride and groom
- love story
- save the date
- event details
- gallery

### P2

- RSVP
- wishes
- gift
- modal accessibility
- closing
- final performance polish

For every task, document:

- current problem;
- desired outcome;
- files that will be changed;
- required assets;
- technical approach;
- animation behavior;
- mobile behavior;
- desktop behavior;
- accessibility criteria;
- performance considerations;
- regression risks;
- acceptance criteria;
- verification method.

Add an asset-mapping table containing:

- section;
- recommended photo filename;
- orientation;
- crop recommendation;
- target dimensions;
- output format;
- loading strategy;
- fallback.

For the groom portrait, inspect the entire contents of `~/Downloads/PREWED EDIT` and select the best individual portrait. Do not keep the existing photo simply because it has not yet been reviewed.

Also include a migration strategy so the redesign can be implemented incrementally without breaking the existing website.

## Constraints and completion

After completion:

1. Show a summary of the design system.
2. Show the list of files created.
3. Show the recommended implementation order.
4. Show any decisions that still require my approval.
5. Stop before modifying the application source code.

Before finishing, verify that no files under `src/`, `app/`, `components/`, `config/`, `public/`, `tailwind.config.*`, or package manifests were modified. Only documentation/prompt files may be created or modified.
