import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { HeaderPage, FooterPage } from "../components";
import { NovedadesModal } from "../components/novedades/NovedadesModal";

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.centrocristianojordan.com";
const SITE_NAME = "Centro Cristiano Jordán";
const SITE_DESCRIPTION = "Bienvenido, esta es tú casa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: "/logo-08-web.png", width: 5465, height: 1901, alt: SITE_NAME }],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo-08-web.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-08-web.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Anillo Vial III Ote.",
    addressLocality: "Santiago de Querétaro",
    addressRegion: "Querétaro",
    postalCode: "76246",
    addressCountry: "MX",
  },
  sameAs: [
    "https://www.facebook.com/ccristianojordan",
    "https://www.instagram.com/ccristianojordan/",
    "https://www.tiktok.com/@ccristianojordan",
  ],
};

export const viewport: Viewport = {
  themeColor: "#003241",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <AuthProvider>
            <HeaderPage />
            <div className="flex flex-col">{children}</div>
            <FooterPage />
            <NovedadesModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
