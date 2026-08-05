import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Auditor | Generative Engine Optimization Platform",
  description: "Enterprise-grade website visibility auditor for AI search engines like ChatGPT, Perplexity, Claude, and Google AI Overviews.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#060811] text-gray-100 antialiased selection:bg-cyan-500 selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
