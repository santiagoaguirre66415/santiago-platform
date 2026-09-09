'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const [authUser, setAuthUser] = useState<{
    $id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setAuthUser({ $id: user.$id, name: user.name, email: user.email });
        setLoading(false);
      } catch {
        window.location.href = '/login';
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await account.deleteSession('current');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-red-600/30 border-t-red-600" />
          <p className="font-mono text-xs tracking-[0.3em] text-white/40">
            VERIFICANDO SESIÓN...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-6">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
              MI PROGRESO
            </span>

            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">
              {authUser?.name ?? 'ESTUDIANTE'}
            </h1>

            <p className="mt-2 text-sm text-white/35">
              {authUser?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start border border-red-500/30 bg-red-600/10 px-5 py-3 font-mono text-[9px] tracking-[0.25em] text-red-300 transition hover:bg-red-600/20"
          >
            CERRAR SESIÓN
          </button>
        </div>

        {/* STATS SIMPLES */}
        <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              SESIÓN
            </span>
            <span className="mt-2 block text-3xl font-black text-emerald-500">
              ACTIVA
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              PORTAFOLIO
            </span>
            <span className="mt-2 block text-3xl font-black text-white">
              5/5
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              CURSOS
            </span>
            <span className="mt-2 block text-3xl font-black text-white">
              PRONTO
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              ESTADO
            </span>
            <span className="mt-2 block text-3xl font-black text-red-500">
              BUILDING
            </span>
          </div>
        </div>

        {/* CURSOS */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                MIS CURSOS
              </span>
              <h2 className="mt-1 text-2xl font-bold">
                Progreso de aprendizaje
              </h2>
            </div>

            <Link
              href="/courses"
              className="font-mono text-[9px] tracking-[0.2em] text-red-500 transition hover:text-red-400"
            >
              EXPLORAR →
            </Link>
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
      </div>
    </main>
  );
}