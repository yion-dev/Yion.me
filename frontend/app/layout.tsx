import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inconsolata } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { navLinks } from "@/data/data";
import { getVisitors } from "@/lib/api";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-inconsolata',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yiondev.me"),

  title: {
    default: "YionDev(Thuta Naing) | Backend-Focused Full-Stack Developer",
    template: "%s | Yion Dev",
  },

  description:
    "Backend developer portfolio showcasing projects, blogs, and software engineering work.",

  keywords: [
    // Name Variations
    "Yion",
    "YionDev",
    "Thuta Naing",
    "Thuta naing",
    "thuta Naing",
    "thuta naing",
    "Thu Ta Naing",
    "Thu ta Naing",
    "Thu ta naing",
    "Thu Ta naing",
    "thu ta naing",

    // Core Specialties & Niche
    "Developer",
    "Software Engineer",
    "Software Engineering",
    "Web Developer",
    "Backend Developer",
    "Frontend Developer",
    "IoT Developer",
    "Low-Level Developer",
    "Embedded Systems",
    "Next.js",
    "Portfolio",

    // Location & Education Context
    "Mae Fah Luang University",
    "MFU",
    "MFU Developer",
    "Myanmar",
    "Myanmar Developer",
    "Myanmar Software Engineer",
    "Thailand Developer",
    "Thailand Software Engineer",
  ],

  authors: [{ name: "Yion" }],

  creator: "Yion",

  openGraph: {
    title: "Yion Dev",
    description:
      "Backend developer portfolio showcasing projects and blogs.",
    url: "https://www.yiondev.me",
    siteName: "Yion Dev",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yion Dev Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Yion Dev",
    description: "Backend developer portfolio",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfToken = process.env.NEXT_PUBLIC_CLOUDFLARE_TOKEN;
  const visitors = await getVisitors();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inconsolata.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RXE4Q3KGTJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RXE4Q3KGTJ');
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col items-center justify-center lg:py-10">
        <Navbar links={navLinks} websiteVisitorCount={visitors.length} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>

      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        strategy="lazyOnload"
        data-cf-beacon={`{"token": "${cfToken}"}`}
      />

    </html>
  );
}
