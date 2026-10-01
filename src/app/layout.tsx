import type { Metadata } from "next";
import "./globals.css";
import "@/styles/base.css";
import "@/styles/sections/header.css";
import "@/styles/sections/hero.css";
import "@/styles/sections/clients.css";
import "@/styles/sections/studio.css";
import "@/styles/sections/services.css";
import "@/styles/sections/work.css";
import "@/styles/sections/process.css";
import "@/styles/sections/impact.css";
import "@/styles/sections/stack.css";
import "@/styles/sections/team.css";
import "@/styles/sections/reviews.css";
import "@/styles/sections/pricing.css";
import "@/styles/sections/faq.css";
import "@/styles/sections/insights.css";
import "@/styles/sections/cta.css";
import "@/styles/sections/footer.css";
import "@/styles/sections/loader.css";
import "@/styles/sections/transition.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BOOT_SCRIPT } from "@/lib/boot";

const TITLE = "Codeforge — Tech Developers for AI Startups, Software & Apps";
const DESCRIPTION =
  "Codeforge is a software development studio for startups: tech developers who design, build and ship web apps, mobile apps, software and AI features in two-week sprints.";

// absolute base for the OG / Twitter image URLs; Vercel provides the production domain
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;500;600&display=swap";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // the boot script adds loader / transition classes to <html> before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Archivo needs its variable width axis (62–125) */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <SmoothScroll />
        <Loader />
        <PageTransition />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
