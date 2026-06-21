import type { Metadata, Viewport } from "next";
import { Fredoka, Cormorant_Garamond, Poppins, Caveat } from "next/font/google";
import config from "@/lib/config";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const groom = config.couple.groom.shortName;
const bride = config.couple.bride.shortName;

export const metadata: Metadata = {
  title: `${groom} & ${bride} — Wedding Invitation`,
  description: `Undangan pernikahan ${config.couple.groom.name} & ${config.couple.bride.name}`,
  openGraph: {
    title: `${groom} & ${bride} — Wedding Invitation`,
    description: `Undangan pernikahan ${config.couple.groom.name} & ${config.couple.bride.name}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#708238",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${cormorant.variable} ${poppins.variable} ${caveat.variable}`}
    >
      <body className="bg-ivory font-body text-ink antialiased">{children}</body>
    </html>
  );
}
