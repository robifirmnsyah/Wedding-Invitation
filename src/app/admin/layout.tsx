import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Wedding Invitation",
  description: "Panel admin untuk mengelola tamu undangan pernikahan",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
