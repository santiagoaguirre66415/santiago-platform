import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Santiago Aguirre | Full Stack & Educador',
    template: '%s | Santiago Aguirre',
  },
  description:
    'Portafolio gamificado de Santiago Aguirre. Desarrollador Full Stack & Educador. Aprendo construyendo y enseño compartiendo.',
  openGraph: {
    title: 'Santiago Aguirre | Full Stack & Educador',
    description:
      'Portafolio gamificado. Desarrollador Full Stack & Educador.',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="google-site-verification" content="wgEL8aLbIn7x8bv2NgJxmu9Zt5vkXDJnPTf3tt6gLoM" />
      </head>
      <body className="min-h-full flex flex-col bg-[#08090b] text-white">
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido principal
        </a>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}