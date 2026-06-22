"use client";

/**
 * Site-wide static scenery.
 *
 * - A full-screen mountain painting that is `fixed` to the viewport, so it stays
 *   perfectly still while the invitation content scrolls over it (portrait image
 *   on mobile, landscape on larger screens).
 * Rendered once at the top of the invitation so it persists across every section.
 * The foreground meadow (grass + bunny) is NOT here — it belongs to the bottom of
 * the Quote section only, scrolling along with that section's content.
 */
export function StaticBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/assets/backgrounds/background-landscape.png"
        />
        <img
          src="/assets/backgrounds/background-potrait.png"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* Very light veil — just enough to soften, without hiding the painting */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,248,243,0.12) 0%, rgba(250,248,243,0) 35%, rgba(250,248,243,0.08) 100%)",
        }}
      />
    </div>
  );
}
