"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle } from "@/components/Decor";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionTokens } from "@/animations/tokens";
import config from "@/lib/config";

/**
 * Vertical love-story timeline — semantic ordered list with one GSAP
 * ScrollTrigger reveal per milestone and a single scrub-linked line fill.
 *
 * Under reduced motion nothing runs and the final state is what renders.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".story-item");

      items.forEach((item) => {
        const fromSide = 0;

        gsap.from(item, {
          opacity: 0,
          y: motionTokens.distanceMobile,
          x: fromSide,
          duration: motionTokens.durationSlow,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });

        const node = item.querySelector(".story-node");
        if (node) {
          gsap.from(node, {
            scale: 0,
            opacity: 0,
            duration: motionTokens.durationBase,
            delay: 0.18,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          });
        }
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
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      aria-labelledby="story-title"
      className="section-pad relative overflow-hidden bg-ivory-50"
    >
      <SectionTitle id="story-title" eyebrow="Our Journey" title="Our Love Story" />

      <div className="story-line relative mx-auto mt-12 max-w-3xl">
        {/* center hairline */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-0 h-full w-px bg-sage-300"
        >
          <div className="story-line-fill h-full w-full bg-gold-600" />
        </div>

        <ol className="list-none space-y-10">
          {config.loveStory.map((m, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={m.title}
                className="story-item relative flex flex-col pl-10"
              >
                {/* node */}
                <span
                  aria-hidden="true"
                  className="story-node absolute left-4 top-6 z-10 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border border-gold-600 bg-ivory-50"
                />

                {/* text card */}
                <div
                  className="paper-card p-6 w-full"
                >
                  <span className="eyebrow !text-gold-700">{m.date}</span>
                  <h3
                    className="mt-1 font-display font-semibold text-olive-900"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-2 font-body text-base leading-relaxed text-olive-700 whitespace-pre-line">
                    {m.story}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
