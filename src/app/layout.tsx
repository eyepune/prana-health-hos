/// <reference path="../types/globals.d.ts" />
import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Outfit } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/FloatingNav";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const notoHindi = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"], 
  variable: "--font-noto-hindi",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Prana Health Intelligence | Sovereign Health OS",
  description: "Privacy-first clinical-grade health intelligence. Built in India for the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${notoHindi.variable} font-sans antialiased bg-cream`}>
        <LanguageProvider>
          <UserProvider>
            <main className="min-h-screen overflow-x-hidden">
              {children}
            </main>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
