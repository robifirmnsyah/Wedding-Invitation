"use client";

import { useEffect, useRef, useState } from "react";
import { HiMiniMusicalNote, HiOutlineSpeakerXMark } from "react-icons/hi2";

interface Props {
  src: string;
  /** play is triggered once the invitation cover is opened */
  active: boolean;
}

/** Floating top-corner music toggle. Autoplays after `active` becomes true. */
export function MusicButton({ src, active }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    audio.loop = true;

    if (active) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [active]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  if (!active) return <audio ref={audioRef} src={src} preload="auto" />;

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full glass-soft text-olive shadow-lg ring-1 ring-olive/20 transition-transform hover:scale-105"
      >
        <span
          className={`absolute inset-0 rounded-full ${
            playing ? "animate-ping" : ""
          } bg-olive/10`}
        />
        {playing ? (
          <HiMiniMusicalNote
            className="relative animate-spin text-xl"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <HiOutlineSpeakerXMark className="relative text-xl" />
        )}
      </button>
    </>
  );
}
