import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habitacio.ad — Habitaciones en alquiler en Andorra",
  description:
    "Encuentra habitación en alquiler en Andorra para todo el año o temporada. Plataforma pensada para residentes y temporeros.",
  keywords: ["habitacion", "alquiler", "andorra", "temporero", "piso compartido"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
