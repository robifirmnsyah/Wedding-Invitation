"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import Image from "next/image";
import { useCountdown } from "@/hooks/useCountdown";
import { useGuestInfo } from "@/hooks/useGuestName";
import config from "@/lib/config";
import type { Wish } from "@/lib/types";

const art = "/assets/mahogany/";
function Floral({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <Image
      src={`${art}orchids.webp`}
      alt=""
      width={360}
      height={420}
      sizes="180px"
      className={`m-floral m-floral-${side}`}
      aria-hidden="true"
    />
  );
}
function Section({
  id,
  label,
  title,
  children,
  light = false,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <section id={id} className={`m-section ${light ? "m-paper" : ""}`}>
      <div className="m-section-heading">
        <span className="m-eyebrow">{label}</span>
        <h2>{title}</h2>
        <span className="m-divider" aria-hidden="true">
          ✦
        </span>
      </div>
      {children}
    </section>
  );
}
function Countdown() {
  const time = useCountdown(config.countdownTarget);
  return (
    <div className="m-countdown" aria-label="Hitung mundur menuju akad">
      {[
        [time.days, "Hari"],
        [time.hours, "Jam"],
        [time.minutes, "Menit"],
        [time.seconds, "Detik"],
      ].map(([value, label]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
function CopyButton({
  value,
  label = "Salin nomor rekening",
}: {
  value: string;
  label?: string;
}) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Berhasil disalin");
    } catch {
      setMessage(
        "Tidak dapat menyalin. Silakan salin teks di atas secara manual.",
      );
    }
  }
  return (
    <>
      <button className="m-button m-button-small" onClick={copy}>
        {label}
      </button>
      <span className="m-copy-status" role="status">
        {message}
      </span>
    </>
  );
}
function Wishes({ name, code }: { name: string; code: string | null }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [ready, setReady] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [rsvp, setRsvp] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/wishes", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        const data = await response.json();
        setWishes(data.wishes || []);
        setReady(true);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setReady(false);
      });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          message: data.get("message"),
          attendance: data.get("attendance"),
        }),
      });
      if (!response.ok)
        throw new Error("Ucapan belum tersimpan. Silakan coba lagi nanti.");
      const result = await response.json();
      setWishes((previous) => [result.wish, ...previous]);
      setStatus("Terima kasih, ucapan Anda sudah tersimpan.");
      form.reset();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Gagal menyimpan ucapan.",
      );
    } finally {
      setSending(false);
    }
  }
  async function confirmAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setRsvp("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, rsvp_status: data.get("rsvp_status") }),
      });
      if (!response.ok)
        throw new Error(
          "Konfirmasi belum tersimpan. Periksa tautan undangan atau coba lagi nanti.",
        );
      setRsvp("Terima kasih, konfirmasi kehadiran Anda sudah tersimpan.");
    } catch (error) {
      setRsvp(error instanceof Error ? error.message : "Konfirmasi gagal.");
    } finally {
      setSending(false);
    }
  }
  return (
    <Section
      id="ucapan"
      label="YOUR PRESENCE, OUR JOY"
      title="Doa & Kehadiran"
      light
    >
      <p>
        Kehadiran dan doa baik Anda menjadi bagian terindah dalam hari bahagia
        kami.
      </p>
      {ready === null ? (
        <p role="status">Memuat buku tamu…</p>
      ) : ready === false ? (
        <p className="m-notice">
          Buku tamu belum tersedia. Silakan sampaikan konfirmasi kehadiran
          langsung kepada pengundang.
        </p>
      ) : (
        <>
          {code && (
            <form onSubmit={confirmAttendance} className="m-form">
              <h3>Konfirmasi kehadiran</h3>
              <label>
                Kehadiran
                <select name="rsvp_status" required>
                  <option value="hadir">Dengan senang hati hadir</option>
                  <option value="tidak_hadir">Maaf, belum dapat hadir</option>
                  <option value="ragu">Masih menyesuaikan jadwal</option>
                </select>
              </label>
              <button className="m-button" disabled={sending}>
                Simpan konfirmasi
              </button>
              <p role="status">{rsvp}</p>
            </form>
          )}
          <form onSubmit={submit} className="m-form">
            <label>
              Nama Anda
              <input
                name="name"
                key={name}
                defaultValue={name === "Tamu Undangan" ? "" : name}
                required
                maxLength={60}
                autoComplete="name"
                placeholder="Nama lengkap"
              />
            </label>
            <label>
              Kehadiran
              <select name="attendance" required>
                <option value="hadir">Dengan senang hati hadir</option>
                <option value="tidak_hadir">Maaf, belum dapat hadir</option>
                <option value="ragu">Masih menyesuaikan jadwal</option>
              </select>
            </label>
            <label>
              Ucapan & doa
              <textarea
                name="message"
                rows={4}
                required
                maxLength={500}
                placeholder="Tuliskan doa terbaik untuk Saufynna & Pipin…"
              />
            </label>
            <button className="m-button" disabled={sending}>
              {sending ? "Menyimpan…" : "Kirim ucapan"}
            </button>
            <p role="status">{status}</p>
          </form>
          <div className="m-wishes">
            {wishes.length ? (
              wishes.map((wish) => (
                <article key={wish.id}>
                  <h3>{wish.name}</h3>
                  <p>{wish.message}</p>
                </article>
              ))
            ) : (
              <p>Jadilah yang pertama menitipkan doa untuk kami.</p>
            )}
          </div>
        </>
      )}
    </Section>
  );
}
function Music({
  opened,
  audioRef,
}: {
  opened: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
}) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  if (!config.music) return null;
  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setError("");
      } catch {
        setError("Musik belum dapat diputar.");
      }
    } else audio.pause();
  }
  return (
    <>
      <audio
        ref={audioRef}
        src={config.music}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError("Musik belum dapat diputar.");
        }}
      />
      {opened && (
        <div className="m-music">
          <button
            onClick={toggle}
            aria-label={playing ? "Jeda musik" : "Putar musik"}
            aria-pressed={playing}
          >
            {playing ? "Ⅱ" : "♫"}
          </button>
          {error && <span role="status">{error}</span>}
        </div>
      )}
    </>
  );
}
export function InvitationShell() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const guest = useGuestInfo();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const lightbox = useRef<HTMLDialogElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const opened = phase === "open";
  const stageRef = useRef<HTMLElement>(null);
  const [showNav, setShowNav] = useState(false);
  useEffect(() => {
    if (!opened || !stageRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(!entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [opened]);
  useEffect(() => {
    document.body.classList.toggle("locked", !opened);
    return () => document.body.classList.remove("locked");
  }, [opened]);
  useEffect(() => {
    if (phase !== "opening") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => setPhase("open"),
      reduced ? 100 : 2400,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (opened)
      document.getElementById("m-reveal-next")?.focus({ preventScroll: true });
  }, [opened]);
  useEffect(() => {
    if (selectedPhoto !== null) lightbox.current?.showModal();
    else lightbox.current?.close();
  }, [selectedPhoto]);
  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    if (config.music) void audioRef.current?.play().catch(() => {});
  }
  return (
    <div className="mahogany">
      <aside className="m-desktop" aria-label="Saufynna dan Pipin">
        <Image
          src={`${art}stage-v2.webp`}
          alt=""
          fill
          priority
          sizes="60vw"
          className="m-desktop-photo"
        />
        <div className="m-desktop-shade" />
        <div className="m-desktop-content">
          <span className="m-eyebrow">THE WEDDING CELEBRATION OF</span>
          <p className="m-desktop-names">
            Saufynna <i>&</i> Pipin
          </p>
          <span className="m-divider">✦</span>
          <p>05 JANUARI 2027 · YANG GARDEN</p>
          <span className="m-desktop-note">
            A love to cherish. A lifetime to share.
          </span>
        </div>
        <Floral side="left" />
      </aside>
      <main className="m-main">
        {opened && <div className="m-fabric" aria-hidden="true" />}
        <header className={`m-stage m-${phase}`} ref={stageRef}>
          <Image
            src={`${art}stage-v2.webp`}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="m-stage-bg"
          />
          <div className="m-stage-heading" aria-hidden={phase !== "closed"}>
            <p className="m-stage-script">We’re</p>
            <p className="m-stage-announcement">GETTING MARRIED</p>
            <h1>
              Saufynna <span>&</span> Pipin
            </h1>
            <p className="m-cover-date">05 · 01 · 2027</p>
          </div>
          <div className="m-stationery">
            <div className="m-envelope-lining" aria-hidden="true" />
            <div className="m-lace-letter" aria-hidden={!opened}>
              <Image
                src={`${art}lace-card.webp`}
                alt=""
                width={1024}
                height={1536}
                priority
                className="m-lace-art"
              />
              <div className="m-letter-copy">
                <span className="m-letter-mark">S & P</span>
                <p>
                  “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                  menciptakan pasangan-pasangan untukmu dari jenismu sendiri…”
                </p>
                <span>QS. Ar-Rum: 21</span>
              </div>
              <Floral side="left" />
            </div>
            <div className="m-envelope-pocket" aria-hidden="true" />
            <div className="m-envelope-fold" aria-hidden="true" />
            <button
              className="m-wax"
              onClick={open}
              disabled={phase !== "closed"}
              tabIndex={phase === "closed" ? 0 : -1}
              aria-label="Buka undangan Saufynna dan Pipin"
            >
              S&P
            </button>
            <div className="m-envelope-spray" aria-hidden="true">
              <Floral />
            </div>
          </div>
          <div className="m-stage-guest" aria-hidden={phase !== "closed"}>
            <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <strong>{guest.name}</strong>
            <button
              className="m-open-link"
              onClick={open}
              disabled={phase !== "closed"}
              tabIndex={phase === "closed" ? 0 : -1}
            >
              {phase === "opening" ? "Membuka undangan…" : "Buka Undangan"}
              <span aria-hidden="true"> ↗</span>
            </button>
          </div>
          {opened && (
            <a id="m-reveal-next" className="m-reveal-next" href="#mempelai">
              Dengan cinta, kami mengundang Anda
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </header>
        {opened && (
          <div className="m-content" ref={contentRef} tabIndex={-1}>
            <a className="m-skip" href="#acara">
              Langsung ke detail acara
            </a>
            <Section
              id="mempelai"
              label="TWO HEARTS, ONE JOURNEY"
              title="Mempelai"
            >
              <p className="m-bismillah" lang="ar" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p>
                Dengan memohon rahmat dan rida Allah SWT, kami mengundang Anda
                untuk merayakan pernikahan kami.
              </p>
              <div className="m-couple">
                <article className="m-person m-person-bride">
                  <div className="m-portrait m-portrait-bride">
                    <div className="m-portrait-window">
                      <Image
                        src={config.couple.bride.photo}
                        alt={config.couple.bride.fullName}
                        fill
                        sizes="250px"
                      />
                    </div>
                    <Image
                      src={`${art}portrait-frame.webp`}
                      alt=""
                      fill
                      sizes="300px"
                      className="m-frame"
                    />
                  </div>
                  <div className="m-person-copy">
                    <p className="m-eyebrow">THE BRIDE</p>
                    <h3>{config.couple.bride.fullName}</h3>
                    <p>{config.couple.bride.parents}</p>
                    <a
                      className="m-text-link"
                      href={`https://www.instagram.com/${config.couple.bride.instagram}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{config.couple.bride.instagram} ↗
                    </a>
                  </div>
                </article>

                <div className="m-couple-ampersand" aria-hidden="true">
                  <span>&</span>
                </div>

                <article className="m-person m-person-groom">
                  <div className="m-portrait m-portrait-groom">
                    <div className="m-portrait-window">
                      <Image
                        src={config.couple.groom.photo}
                        alt={config.couple.groom.fullName}
                        fill
                        sizes="250px"
                      />
                    </div>
                    <Image
                      src={`${art}portrait-frame.webp`}
                      alt=""
                      fill
                      sizes="300px"
                      className="m-frame"
                    />
                  </div>
                  <div className="m-person-copy">
                    <p className="m-eyebrow">THE GROOM</p>
                    <h3>{config.couple.groom.fullName}</h3>
                    <p>{config.couple.groom.parents}</p>
                    <a
                      className="m-text-link"
                      href={`https://www.instagram.com/${config.couple.groom.instagram}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{config.couple.groom.instagram} ↗
                    </a>
                  </div>
                </article>
              </div>
              <details className="m-full-verse">
                <summary>QS. Ar-Rum: 21</summary>
                <p lang="ar" dir="rtl" className="m-quote-arabic">
                  {config.quote.arabic}
                </p>
                <p>{config.quote.translation}</p>
              </details>
              <Floral side="left" />
            </Section>
            <Section
              id="tanggal"
              label="THE BEGINNING OF FOREVER"
              title="Save the Date"
            >
              <div className="m-date-display">
                <span>JANUARI</span>
                <strong>05</strong>
                <span>SELASA · 2027</span>
              </div>
              <Countdown />
              <a className="m-button" href="/fynna-pipin.ics" download>
                Simpan ke kalender <span aria-hidden="true">↗</span>
              </a>
            </Section>
            <Section
              id="acara"
              label="JOIN OUR CELEBRATION"
              title="Hari Bahagia"
              light
            >
              <div className="m-events">
                {[config.event.akad, config.event.resepsi].filter(Boolean).map(
                  (event) =>
                    event && (
                      <article key={event.title}>
                        <span className="m-event-icon" aria-hidden="true">
                          ✧
                        </span>
                        <h3>{event.title}</h3>
                        <p>{event.dateLabel}</p>
                        <strong>{event.time}</strong>
                        <h4>{event.venue}</h4>
                        <p>{event.address}</p>
                        <a
                          className="m-button"
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Petunjuk lokasi <span aria-hidden="true">↗</span>
                        </a>
                      </article>
                    ),
                )}
              </div>
            </Section>
            <Section id="hadiah" label="A TOKEN OF LOVE" title="Wedding Gift">
              <p>{config.gift.note}</p>
              <div className="m-bank-list">
                {config.gift.banks.map((bank) => (
                  <article className="m-bank" key={bank.number}>
                    <span className="m-bank-name">{bank.bank}</span>
                    <span className="m-bank-number">{bank.number}</span>
                    <p>a.n. {bank.holder}</p>
                    <CopyButton value={bank.number} />
                  </article>
                ))}
              </div>
              <div className="m-delivery">
                <h3>Kirim tanda kasih</h3>
                <p>{config.gift.address}</p>
                <CopyButton
                  value={config.gift.address || ""}
                  label="Salin alamat"
                />
              </div>
            </Section>
            <Section
              id="cerita"
              label="EVERY MOMENT LED US HERE"
              title="Our Love Story"
            >
              <div
                className="m-keepsakes"
                aria-label="Kenangan Saufynna dan Pipin"
              >
                <figure>
                  <Image
                    src="/assets/couple/photo-1.webp"
                    alt="Saufynna dan Pipin di tepi laut"
                    width={300}
                    height={400}
                  />
                  <figcaption>our beginning</figcaption>
                </figure>
                <figure>
                  <Image
                    src="/assets/couple/photo-3.webp"
                    alt="Momen bersama Saufynna dan Pipin"
                    width={300}
                    height={400}
                  />
                  <figcaption>our forever</figcaption>
                </figure>
                <span aria-hidden="true">S&P</span>
              </div>
              <div className="m-timeline">
                {config.loveStory.map((story) => (
                  <article key={story.title}>
                    <span className="m-story-number" aria-hidden="true">
                      ♥
                    </span>
                    <h3>{story.title}</h3>
                    {story.date && (
                      <span className="m-eyebrow">{story.date}</span>
                    )}
                    <p>{story.story}</p>
                  </article>
                ))}
              </div>
              <Floral />
            </Section>
            <Section
              id="galeri"
              label="LITTLE MOMENTS, ENDLESS LOVE"
              title="Our Memories"
              light
            >
              <p className="m-gallery-lead">
                Setiap momen adalah bagian dari cerita kita.
              </p>
              <div className="m-gallery">
                {config.gallery.map((photo, index) => (
                  <button
                    key={photo.src}
                    onClick={() => setSelectedPhoto(index)}
                    aria-label={`Lihat foto ${index + 1} lebih besar`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes="(min-width: 1024px) 250px, 50vw"
                    />
                    {photo.caption && (
                      <span className="m-gallery-caption">
                        {photo.caption}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Section>
            <Wishes name={guest.name} code={guest.code} />
            <section className="m-closing">
              <Floral side="left" />
              <span className="m-eyebrow">WITH LOVE & GRATITUDE</span>
              <div className="m-closing-card">
                <div className="m-closing-ornament" aria-hidden="true">
                  ❦
                </div>
                <span className="m-divider" aria-hidden="true">
                  ✦
                </span>
                <p>{config.closing.message}</p>
                <p>Terima kasih atas segala doa, cinta, dan kehadiran Anda.</p>
                <p className="m-closing-names">
                  Saufynna <span>&</span> Pipin
                </p>
                <span className="m-eyebrow">05 JANUARI 2027</span>
              </div>
              {!config.music && config.musicUrl && (
                <a
                  className="m-song"
                  href={config.musicUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  ♫ Our song · {config.musicTitle} ↗
                </a>
              )}
              <p className="m-footer">MADE WITH LOVE · S & P</p>
            </section>
            {showNav && (
              <nav className="m-nav" aria-label="Navigasi undangan">
                <a href="#mempelai">Mempelai</a>
                <a href="#acara">Acara</a>
                <a href="#galeri">Galeri</a>
                <a href="#ucapan">Ucapan</a>
              </nav>
            )}
          </div>
        )}
      </main>
      <Music opened={opened} audioRef={audioRef} />
      <dialog
        ref={lightbox}
        className="m-lightbox"
        aria-label="Galeri foto Saufynna dan Pipin"
        onCancel={() => setSelectedPhoto(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedPhoto(null);
        }}
      >
        <button
          className="m-lightbox-close"
          onClick={() => setSelectedPhoto(null)}
          aria-label="Tutup foto"
        >
          ×
        </button>
        {selectedPhoto !== null && (
          <>
            <Image
              src={config.gallery[selectedPhoto].src}
              alt={config.gallery[selectedPhoto].caption}
              width={1200}
              height={1600}
              sizes="90vw"
            />
            {config.gallery[selectedPhoto].caption && (
              <p className="m-lightbox-caption">
                {config.gallery[selectedPhoto].caption}
              </p>
            )}
            <div className="m-lightbox-controls">
              <button
                onClick={() =>
                  setSelectedPhoto(
                    (selectedPhoto + config.gallery.length - 1) %
                      config.gallery.length,
                  )
                }
                aria-label="Foto sebelumnya"
              >
                ←
              </button>
              <span>
                {selectedPhoto + 1} / {config.gallery.length}
              </span>
              <button
                onClick={() =>
                  setSelectedPhoto((selectedPhoto + 1) % config.gallery.length)
                }
                aria-label="Foto berikutnya"
              >
                →
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
