"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/Decor";
import { Lightbox } from "@/components/Lightbox";
import { inViewOnce } from "@/animations/variants";
import config from "@/lib/config";

const spanClass: Record<string, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

/** Scrapbook collage grid with brush-script captions + lightbox. */
export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const items = config.gallery;

  return (
    <section className="section-pad relative overflow-hidden bg-beige/55 backdrop-blur-sm">
      <SectionTitle eyebrow="Captured Moments" title="Our Gallery" />

      <div className="mx-auto mt-10 grid max-w-4xl auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-4">
        {items.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative overflow-hidden rounded-xl ring-1 ring-olive/10 ${
              spanClass[item.span] ?? ""
            }`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inViewOnce}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
          >
            <Image
              src={item.src}
              alt={item.caption || `Foto ${i + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {item.caption && (
              <span className="absolute bottom-2 left-3 font-script text-xl text-ivory drop-shadow-md">
                {item.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </section>
  );
}
