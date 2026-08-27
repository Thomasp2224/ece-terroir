import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobilePreviewSimulator from "@/components/simulator/MobilePreviewSimulator";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { DataProvider } from "@/lib/context/DataContext";

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
  title: "ECE Terroir — L'Association Gastronomique & Terroirs de l'ECE Paris",
  description: "Découvrez les dégustations vin & fromage, voyages œnologiques, actualités et boutique merchandising officielle de l'association ECE Terroir.",
  keywords: ["ECE Terroir", "ECE Paris", "Association Terroir", "Vin et Fromage", "Gastronomie étudiante", "Boutique ECE Terroir", "HelloAsso"],
  icons: {
    icon: "/logo_eceterroir.png",
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
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1D1917] selection:bg-[#58111A] selection:text-[#FDFBF7]">
        <DataProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <MobilePreviewSimulator />
            </CartProvider>
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
