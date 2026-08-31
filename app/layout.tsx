import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { DataProvider } from "@/lib/context/DataContext";
import { Analytics } from "@vercel/analytics/react";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ECE Terroir — Confrérie Gastronomique de l'ECE Paris",
  description: "Plateforme officielle de l'association ECE Terroir : Dégustations AOP, Pass Épicurien 3D, Échoppe Click & Collect et Banquets étudiants.",
  keywords: ["ECE Terroir", "ECE Paris", "Association Terroir", "Vin et Fromage", "Gastronomie étudiante", "Boutique ECE Terroir", "HelloAsso"],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#FAF7F2] text-[#1D1917] antialiased">
        <DataProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell>
                {children}
              </AppShell>
              <Analytics />
            </CartProvider>
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
