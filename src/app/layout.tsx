import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Great_Vibes,
  Lora,
  Playfair_Display,
  Poppins,
} from "next/font/google";
import config, { isTasyakur } from "@/lib/config";
import "./globals.css";
import "./mahogany.css";
import "./mahogany-reference.css";

const display = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const serifNum = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif-num",
  display: "swap",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const accent = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
  display: "swap",
});

const groom = config.couple.groom.shortName;
const bride = config.couple.bride.shortName;
const person1 = isTasyakur ? groom : bride;
const person2 = isTasyakur ? bride : groom;
const fullName1 = isTasyakur
  ? config.couple.groom.name
  : config.couple.bride.name;
const fullName2 = isTasyakur
  ? config.couple.bride.name
  : config.couple.groom.name;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: isTasyakur
    ? `${person1} & ${person2} — Tasyakur Menjelang Pernikahan`
    : `${person1} & ${person2} — Wedding Invitation`,
  description: isTasyakur
    ? `Tasyakur Menjelang Pernikahan ${fullName1} & ${fullName2}`
    : `Undangan pernikahan ${fullName1} & ${fullName2}`,
  icons: {
    icon: "/monogram.svg",
    apple: "/monogram.svg",
  },
  openGraph: {
    title: isTasyakur
      ? `${person1} & ${person2} — Tasyakur Menjelang Pernikahan`
      : `${person1} & ${person2} — Wedding Invitation`,
    description: isTasyakur
      ? `Tasyakur Menjelang Pernikahan ${fullName1} & ${fullName2}`
      : `Undangan pernikahan ${fullName1} & ${fullName2}`,
    type: "website",
    images: [
      {
        url: "/assets/couple/photo-5.webp",
        width: 1200,
        height: 1600,
        alt: "Saufynna & Pipin",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#4A2420",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable} ${arabic.variable} ${accent.variable} ${serifNum.variable}`}
    >
      <body className="bg-ivory-50 font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
