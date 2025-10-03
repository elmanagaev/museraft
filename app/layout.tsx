import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/navigation/header";

export const metadata: Metadata = {
  title: "MuseRaft - Marketing Screenshot Showcase",
  description: "Curated gallery of marketing website screenshots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
