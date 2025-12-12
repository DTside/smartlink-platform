import type { Metadata } from "next";
import { Inter } from "next/font/google"; // или другой шрифт
import "./globals.css"; // <--- ВОТ ЭТА СТРОЧКА ОБЯЗАТЕЛЬНА!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OFF-GRID KYIV",
  description: "Deconstructed Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}