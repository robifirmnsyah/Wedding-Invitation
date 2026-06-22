"use client";

/**
 * Site-wide static scenery.
 *
 * - A full-screen mountain painting that is `fixed` to the viewport, so it stays
 *   perfectly still while the invitation content scrolls over it (portrait image
 *   on mobile, landscape on larger screens).
 * - A foreground meadow strip (grass, wildflowers, bunny) pinned to the bottom
 *   edge of the viewport, sitting in front of the scrolling content like the
 *   reference design.
 *
 * Rendered once at the top of the invitation so it persists across every section.
 */
export function StaticBackdrop() {
  return (
    <>
      {/* Static mountain background — sits behind everything */}
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

        {/* Soft veil to keep overlaid text legible against the painting */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,248,243,0.25) 0%, rgba(250,248,243,0.05) 30%, rgba(250,248,243,0.12) 100%)",
          }}
        />
      </div>

      {/* Foreground meadow — pinned to the bottom, floats over the content */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[15] h-[clamp(120px,24vh,300px)]">
        <img
          src="/assets/backgrounds/foreground.png"
          alt=""
          aria-hidden
          className="h-full w-full select-none object-cover object-bottom"
        />
      </div>
    </>
  );
}
