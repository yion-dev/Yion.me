import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inconsolata } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

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
    "Yion",
    "Backend Developer",
    "Next.js",
    "Software Engineer",
    "Portfolio",
    "Thailand Developer",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inconsolata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
