import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kalbininmevsimi.com"),
  title: {
    default: "Kalbimin Mevsimi - Kuran Okumaları ve Denemeler",
    template: "%s | Kalbimin Mevsimi",
  },
  description: "Kuran Okumaları, Denemeler ve daha fazlası.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Kalbimin Mevsimi",
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
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${notoSerif.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
