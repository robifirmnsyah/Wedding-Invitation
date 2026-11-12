"use client";

interface Props {
  /** the colour the section above ends on */
  from: string;
  /** the colour the section below begins on */
  to: string;
  className?: string;
}

/**
 * The seam between two chapters: the upper mat smoothly bleeds into the lower one,
 * keeping the transition clean and cohesive.
 */
export function SoftDivider({ from, to, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-16 w-full overflow-hidden sm:h-24 ${className}`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    >
      {/* garden haze — a wash of light where the two mats meet */}
      <div
        className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgb(251 249 243 / 0.55), transparent 70%)",
        }}
      />
    </div>
  );
}
