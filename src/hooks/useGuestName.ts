"use client";

import { useEffect, useState } from "react";

/**
 * Reads the personalised guest name from the URL: /?to=Nama%20Tamu
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
