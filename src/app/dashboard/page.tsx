'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import { loadProgress } from '@/lib/progress';
import { CURSOS } from '@/lib/courses-data';

interface CursoConProgreso {
  slug: string;
  nombre: string;
  icono: string;
  color: string;
  totales: number;
  completadas: number;
  porcentaje: number;
}

export default function DashboardPage() {
  const [authUser, setAuthUser] = useState<{
    $id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [nivelesHome, setNivelesHome] = useState<number[]>([1]);
  const [logrosHome, setLogrosHome] = useState<number[]>([1, 2]);
  const [misionesCompletadas, setMisionesCompletadas] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setAuthUser({ $id: user.$id, name: user.name, email: user.email });
      } catch {
        window.location.href = '/login?redirect=/dashboard';
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const data = loadProgress();
    setXp(data.xp);
    setNivelesHome(data.nivelesHome);
    setLogrosHome(data.logrosHome);
    setMisionesCompletadas(data.misionesCompletadas);
    setHydrated(true);
  }, []);

  const cursosConProgreso: CursoConProgreso[] = useMemo(() => {
    return CURSOS.map((curso) => {
      const totales = curso.niveles.length;
      const completadas = curso.niveles.filter((n) =>
        misionesCompletadas.includes(n.id)
      ).length;
      const porcentaje =
        totales > 0 ? Math.round((completadas / totales) * 100) : 0;
      return {
        slug: curso.slug,
        nombre: curso.nombre,
        icono: curso.icono,
        color: curso.color,
        totales,
        completadas,
        porcentaje,
      };
    });
  }, [misionesCompletadas]);

  const totalMisiones = cursosConProgreso.reduce(
    (acc, c) => acc + c.totales,
    0
  );
  const totalCompletadas = cursosConProgreso.reduce(
    (acc, c) => acc + c.completadas,
    0
  );
  const cursosIniciados = cursosConProgreso.filter(
    (c) => c.completadas > 0
  ).length;

  const handleLogout = async () => {
    await account.deleteSession('current');
    window.location.href = '/';
  };

  if (loading || !hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-red-600/30 border-t-red-600" />
          <p className="font-mono text-xs tracking-[0.3em] text-white/40">
            CARGANDO PROGRESO...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="gamer-grid absolute inset-0" />
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
              {authUser?.name?.toUpperCase() ?? 'ESTUDIANTE'}
            </h1>
            <p className="mt-2 text-sm text-white/35">{authUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start border border-red-500/30 bg-red-600/10 px-5 py-3 font-mono text-[9px] tracking-[0.25em] text-red-300 transition hover:bg-red-600/20"
          >
            CERRAR SESIÓN
          </button>
        </div>

        {/* STATS GENERALES */}
        <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              XP TOTAL
            </span>
            <span className="mt-2 block text-3xl font-black text-red-500">
              {xp}
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              PORTAFOLIO
            </span>
            <span className="mt-2 block text-3xl font-black">
              {nivelesHome.length}/5
            </span>
            <span className="mt-1 block text-[10px] text-white/25">
              {logrosHome.length} logros
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              MISIONES
            </span>
            <span className="mt-2 block text-3xl font-black">
              {totalCompletadas}/{totalMisiones}
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              CURSOS
            </span>
            <span className="mt-2 block text-3xl font-black">
              {cursosIniciados}/{cursosConProgreso.length}
            </span>
          </div>
        </div>

        {/* PORTAFOLIO GAMIFICADO */}
        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                PORTAFOLIO GAMIFICADO
              </span>
              <h2 className="mt-1 text-2xl font-bold">Tu recorrido personal</h2>
            </div>
            <Link
              href="/"
              className="font-mono text-[9px] tracking-[0.2em] text-red-500 transition hover:text-red-400"
            >
              EXPLORAR →
            </Link>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-5">
            {[
              { nivel: 1, titulo: 'ORIGEN' },
              { nivel: 2, titulo: 'FORMACIÓN' },
              { nivel: 3, titulo: 'EXPERIENCIA' },
              { nivel: 4, titulo: 'TECNOLOGÍAS' },
              { nivel: 5, titulo: 'PROYECTOS' },
            ].map(({ nivel, titulo }) => {
              const desbloqueado = nivelesHome.includes(nivel);
              return (
                <div
                  key={nivel}
                  className={`flex flex-col items-center gap-2 p-5 text-center ${
                    desbloqueado ? 'bg-[#0b0d10]' : 'bg-[#08090b] opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      desbloqueado
                        ? 'border-red-600 bg-red-600/20 text-red-400'
                        : 'border-white/15 text-white/30'
                    }`}
                  >
                    {desbloqueado ? `0${nivel}` : '🔒'}
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.15em] text-white/70">
                    {titulo}
                  </span>
                  <span className="text-[8px] text-white/30">
                    {desbloqueado ? 'ABIERTO' : 'BLOQUEADO'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* CURSOS */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                CURSOS
              </span>
              <h2 className="mt-1 text-2xl font-bold">Progreso en lenguajes</h2>
            </div>
            <Link
              href="/courses"
              className="font-mono text-[9px] tracking-[0.2em] text-red-500 transition hover:text-red-400"
            >
              EXPLORAR →
            </Link>
          </div>

          {totalCompletadas === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-white/35">
                Aún no has completado ninguna misión. Empieza con un lenguaje.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-block border border-red-600 bg-red-600 px-6 py-3 font-mono text-[10px] font-bold tracking-[0.2em] transition hover:bg-red-500"
              >
                VER CURSOS
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cursosConProgreso.map((curso) => (
                <Link
                  key={curso.slug}
                  href={`/courses/${curso.slug}`}
                  className="group block border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center border text-xl"
                        style={{
                          borderColor: `${curso.color}40`,
                          backgroundColor: `${curso.color}15`,
                        }}
                      >
                        {curso.icono}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight">
                          {curso.nombre}
                        </h3>
                        <p className="mt-0.5 text-xs text-white/40">
                          {curso.completadas}/{curso.totales} misiones
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden w-40 sm:block">
                        <div className="h-2 overflow-hidden bg-white/10">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${curso.porcentaje}%`,
                              backgroundColor: curso.color,
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="w-16 text-right font-mono text-lg font-bold"
                        style={{
                          color: curso.porcentaje > 0 ? curso.color : undefined,
                        }}
                      >
                        {curso.porcentaje}%
                      </div>
                      <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white/50">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}