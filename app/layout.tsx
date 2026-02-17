import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoloDad Cooking",
  description: "Cuisine de saison pour parents pressés",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${outfit.variable} min-h-screen pb-24`}>
        <main className="max-w-lg mx-auto px-5 py-8">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
