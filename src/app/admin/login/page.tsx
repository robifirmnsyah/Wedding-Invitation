"use client";
import { useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const password = new FormData(event.currentTarget).get("password");
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ||
            (res.status === 401
              ? "Password salah."
              : "Akses admin belum tersedia."),
        );
      }
      window.location.assign("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk.");
      setBusy(false);
    }
  }
  return (
    <main className="mahogany min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <span className="m-eyebrow">SAUFYNNA & PIPIN</span>
        <h1 className="text-3xl mt-3">Admin Undangan</h1>
        <form onSubmit={login} className="m-form">
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="m-button" disabled={busy}>
            {busy ? "Memeriksa…" : "Masuk"}
          </button>
          <p role="alert">{error}</p>
        </form>
        <Link href="/" className="m-text-link">
          Kembali ke undangan
        </Link>
      </div>
    </main>
  );
}
