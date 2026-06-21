"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/Decor";
import { scaleIn } from "@/animations/variants";
import config from "@/lib/config";
import type { Person } from "@/lib/types";

function PersonCard({ person }: { person: Person }) {
  return (
    <Reveal
      variants={scaleIn}
      className="flex flex-col items-center text-center"
    >
      <div className="rope-frame h-48 w-48 sm:h-56 sm:w-56">
        <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-ivory">
          <Image
            src={person.photo}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 12rem, 14rem"
            className="object-cover"
          />
        </div>
      </div>

      <h3 className="mt-5 font-heading text-2xl font-600 text-olive-dark">
        {person.fullName}
      </h3>
      <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink/70">
        {person.parents}
      </p>
      <a
        href={`https://instagram.com/${person.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-4"
      >
        <FaInstagram />@{person.instagram}
      </a>
    </Reveal>
  );
}

/** Bride & Groom with rope-bordered circular photo frames. */
export function BrideGroom() {
  const { groom, bride } = config.couple;

  return (
    <section className="section-pad relative overflow-hidden bg-sage/40">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(112,130,56,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <SectionTitle eyebrow="Bismillah" title="The Bride & Groom" />

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-2">
          <PersonCard person={groom} />
          <PersonCard person={bride} />
        </div>
      </div>
    </section>
  );
}
