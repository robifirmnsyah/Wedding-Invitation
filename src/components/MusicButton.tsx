"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";

interface Props {
  src: string;
  /** play is triggered once the invitation cover is opened */
  active: boolean;
}

/** Vinyl record disc — spins continuously while `playing`. */
function VinylIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`h-7 w-7 ${playing ? "vinyl-spinning" : ""}`}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" fill="#1c1c1c" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="24" cy="24" r="9.5" fill="none" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="24" cy="24" r="6.5" fill="#8C7443" />
      <circle cx="24" cy="24" r="1.5" fill="#1c1c1c" />
    </svg>
  );
}

/** Floating bottom-corner music toggle. Autoplays after `active` becomes true. */
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

  if (!active) return <audio ref={audioRef} src={src} preload="none" />;

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        aria-pressed={playing}
        className="btn-icon fixed bottom-4 left-4 z-50 border-none bg-transparent shadow-paper"
        style={{
          bottom: "max(1rem, env(safe-area-inset-bottom))",
          left: "max(1rem, env(safe-area-inset-left))",
        }}
      >
        <VinylIcon playing={playing} />
        {!playing && (
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ivory-50 text-olive-700 shadow-paper"
          >
            <HiOutlineSpeakerXMark className="text-[10px]" />
          </span>
        )}
      </button>
    </>
  );
}
