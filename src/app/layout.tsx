import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { brand } from "@/data/site";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — Café de origen colombiano | Líbano, Tolima`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "café de origen",
    "café colombiano",
    "Líbano Tolima",
    "café premium",
    "café de especialidad",
    "Bahía Café",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: brand.name,
    title: `${brand.name} — Café de origen colombiano`,
    description: brand.description,
    images: [
      {
        url: "/images/libano-tolima-generada.png",
        width: 1200,
        height: 630,
        alt: "Paisaje cafetero en Líbano, Tolima",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Café de origen colombiano`,
    description: brand.description,
    images: ["/images/libano-tolima-generada.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0B08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-cream">
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
