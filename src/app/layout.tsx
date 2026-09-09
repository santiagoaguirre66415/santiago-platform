import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
  {children}
	</body>
    </html>
  );
}