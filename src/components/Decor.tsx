"use client";

import { GiVineLeaf } from "react-icons/gi";

/** Small olive-leaf divider used between sections. */
export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`divider-leaf ${className}`}>
      <span className="h-px w-12 bg-olive/30" />
      <GiVineLeaf className="text-xl" />
      <span className="h-px w-12 bg-olive/30" />
    </div>
  );
}

/** Section eyebrow + title block. */
export function SectionTitle({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      {eyebrow && (
        <p
          className={`font-script text-2xl ${
            light ? "text-ivory/90" : "text-olive"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`heading-script mt-1 text-3xl sm:text-4xl ${
          light ? "!text-ivory" : ""
        }`}
      >
        {title}
      </h2>
      <LeafDivider />
    </div>
  );
}
