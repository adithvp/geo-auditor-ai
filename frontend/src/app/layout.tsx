import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Auditor | Generative Engine Optimization",
  description: "Evaluate and audit website visibility for AI search engines like ChatGPT, Perplexity, Claude, and Google AI Overviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070A11] text-gray-100 antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
