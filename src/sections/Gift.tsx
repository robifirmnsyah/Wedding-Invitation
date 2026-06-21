"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineClipboard, HiCheck } from "react-icons/hi2";
import { GiBirdHouse } from "react-icons/gi";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/Decor";
import { copyToClipboard } from "@/lib/utils";
import config from "@/lib/config";

function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <button
      onClick={onCopy}
      className="flex items-center gap-2 rounded-lg bg-sage/40 px-3 py-1.5 text-xs text-olive-dark transition-colors hover:bg-sage/70"
    >
      {copied ? <HiCheck /> : <HiOutlineClipboard />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

/** Digital gift — bank accounts + QRIS with copy buttons and a mascot accent. */
export function Gift() {
  const { gift } = config;

  return (
    <section className="section-pad relative overflow-hidden bg-ivory">
      <div className="relative">
        <div className="flex items-center justify-center gap-3 text-olive">
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GiBirdHouse className="text-2xl" />
          </motion.span>
        </div>
        <SectionTitle eyebrow="With Love" title="Wedding Gift" />

        <Reveal className="mx-auto max-w-xl text-center">
          <p className="font-body text-sm leading-relaxed text-ink/70">
            {gift.note}
          </p>

          <div className="mt-8 space-y-4">
            {gift.banks.map((b) => (
              <div
                key={b.number}
                className="flex items-center justify-between gap-4 rounded-2xl paper-card p-5 text-left shadow-sm ring-1 ring-olive/10"
              >
                <div>
                  <p className="font-heading text-lg font-600 text-olive-dark">
                    {b.bank}
                  </p>
                  <p className="font-body text-base tracking-wider text-ink">
                    {b.number}
                  </p>
                  <p className="font-body text-xs text-ink/60">a.n. {b.holder}</p>
                </div>
                <CopyRow value={b.number} />
              </div>
            ))}
          </div>

          {gift.qris && (
            <div className="mx-auto mt-6 w-fit rounded-2xl paper-card p-5 shadow-sm ring-1 ring-olive/10">
              <p className="mb-3 font-body text-xs uppercase tracking-widest text-ink/60">
                Scan QRIS
              </p>
              <div className="relative mx-auto h-44 w-44">
                <Image
                  src={gift.qris}
                  alt="QRIS pembayaran"
                  fill
                  sizes="11rem"
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
