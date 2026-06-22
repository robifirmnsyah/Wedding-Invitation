"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle } from "@/components/Decor";
import { Petals } from "@/components/Petals";
import config from "@/lib/config";

/** Vertical love-story timeline with GSAP ScrollTrigger stagger reveal. */
export function Story() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".story-item");
      items.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.from(".story-line-fill", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".story-line",
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="section-pad relative overflow-hidden bg-ivory/85 backdrop-blur-sm">
      <Petals count={8} />
      <SectionTitle eyebrow="Our Journey" title="Our Love Story" />

      <div className="story-line relative mx-auto mt-12 max-w-3xl">
        {/* center line */}
        <div className="absolute left-4 top-0 h-full w-px bg-sage sm:left-1/2 sm:-translate-x-1/2">
          <div className="story-line-fill h-full w-full bg-olive/60" />
        </div>

        <ul className="space-y-12">
          {config.loveStory.map((m, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={m.title}
                className={`story-item relative flex flex-col gap-4 pl-12 sm:flex-row sm:items-center sm:gap-8 sm:pl-0 ${
                  flip ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* node */}
                <span className="absolute left-4 top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ivory bg-olive shadow sm:left-1/2" />

                {/* photo */}
                <div className="sm:w-1/2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl paper-card p-1.5">
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      <Image
                        src={m.photo}
                        alt={m.title}
                        fill
                        sizes="(max-width: 640px) 90vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* text */}
                <div className={`sm:w-1/2 ${flip ? "sm:text-right" : ""}`}>
                  <span className="font-script text-2xl text-olive">{m.date}</span>
                  <h3 className="mt-1 font-heading text-2xl font-600 text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">
                    {m.story}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
