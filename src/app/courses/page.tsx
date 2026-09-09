'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-red-600/30 border-t-red-600" />
          <p className="font-mono text-xs tracking-[0.3em] text-white/40">
            CARGANDO...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-6">
        <div className="mb-12">
          <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
            CURSOS
          </span>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">
            PRÓXIMAMENTE
          </h1>
          <p className="mt-3 text-sm text-white/35">
            Estoy preparando contenido para compartir.
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/35">
            Los cursos llegarán pronto. Mientras tanto, explora el portafolio gamificado.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500"
          >
            VER PORTAFOLIO
          </Link>
        </div>
      </div>
    </main>
  );
}