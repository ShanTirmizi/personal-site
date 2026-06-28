import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/site/grain-overlay";

// Display — headlines & big numbers. Body — UI/paragraphs. Mono — kickers, tags, chrome.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shan-tirmizi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shan Tirmizi — AI & Full-Stack Engineer",
    template: "%s — Shan Tirmizi",
  },
  description:
    "Shan Tirmizi is a London-based AI & full-stack engineer who ships production streaming-Claude apps, agentic workflows and low-latency backends. Don't read his CV — talk to it.",
  keywords: [
    "Shan Tirmizi",
    "AI Engineer",
    "Full-Stack Engineer",
    "London",
    "Anthropic Claude",
    "Next.js",
    "FastAPI",
    "React",
    "LLM",
    "RAG",
    "agentic workflows",
  ],
  authors: [{ name: "Shan Tirmizi" }],
  creator: "Shan Tirmizi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Shan Tirmizi",
    title: "Shan Tirmizi — AI & Full-Stack Engineer",
    description:
      "Don't read my CV — talk to it. A London-based AI engineer who ships streaming Claude apps, agentic workflows and low-latency backends in production.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shan Tirmizi — AI & Full-Stack Engineer",
    description:
      "Don't read my CV — talk to it. A London-based AI engineer shipping production LLM products.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f2eee5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${hanken.variable} ${plexMono.variable} antialiased`}
      >
        {children}
        <GrainOverlay />
        <noscript>
          <style>{`.reveal-on-scroll{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
