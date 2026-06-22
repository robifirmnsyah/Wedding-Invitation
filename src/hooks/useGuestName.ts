"use client";

import { useEffect, useState } from "react";

interface GuestInfo {
  name: string;
  code: string | null;
}

/**
 * Reads the personalised guest name and unique code from the URL:
 *   /?to=Nama%20Tamu&id=A1B2C
 * Falls back to a warm generic greeting.
 */
export function useGuestName(fallback = "Tamu Undangan"): string {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") ?? params.get("kepada");
    if (to && to.trim()) {
      setName(decodeURIComponent(to.trim().replace(/\+/g, " ")));
    }
  }, [fallback]);

  return name;
}

/**
 * Returns both guest name and unique invitation code from the URL.
 * Used by the Wishes/RSVP section to validate the guest.
 */
export function useGuestInfo(fallback = "Tamu Undangan"): GuestInfo {
  const [info, setInfo] = useState<GuestInfo>({ name: fallback, code: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") ?? params.get("kepada");
    const code = params.get("id") ?? params.get("code");

    setInfo({
      name: to && to.trim()
        ? decodeURIComponent(to.trim().replace(/\+/g, " "))
        : fallback,
      code: code && code.trim() ? code.trim().toUpperCase() : null,
    });
  }, [fallback]);

  return info;
}
