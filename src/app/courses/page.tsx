'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CURSOS } from '@/lib/courses-data';

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="gamer-grid absolute inset-0" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 md:px-12">
        {/* HEADER */}
        <div className="mb-12">
          <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
            CURSOS
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-6xl">
            ELIGE TU CAMINO
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            Cada lenguaje es un mundo por explorar. Avanza por las misiones,
            desbloquea niveles y llega al jefe final para obtener tu certificado.
          </p>
        </div>

        {/* GRID DE LENGUAJES */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CURSOS.map((curso) => (
            <Link
              key={curso.slug}
              href={`/courses/${curso.slug}`}
              className="group relative overflow-hidden border border-white/10 bg-[#0b0d10] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:bg-[#0d1014]"
            >
              {/* Glow de color */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: curso.color }}
              />

              <div className="relative">
                {/* Icono + nombre */}
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center border text-2xl"
                    style={{
                      borderColor: `${curso.color}40`,
                      backgroundColor: `${curso.color}15`,
                    }}
                  >
                    {curso.icono}
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">
                    {curso.niveles.length} MISIONES
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                  {curso.nombre}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {curso.descripcion}
                </p>

                {/* Barra de progreso (placeholder 0%) */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden bg-white/10">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: '0%',
                        backgroundColor: curso.color,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-white/30">
                    0%
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-red-500 transition group-hover:text-red-400">
                    EXPLORAR MUNDO
                  </span>
                  <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-red-500">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* INFO */}
        <div className="mt-12 border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h3 className="font-mono text-[10px] tracking-[0.3em] text-red-500">
            CÓMO FUNCIONA
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-2xl">🗺️</div>
              <p className="mt-2 text-sm text-white/60">
                Cada lenguaje es un <strong className="text-white">mundo</strong> con un mapa lleno de misiones.
              </p>
            </div>
            <div>
              <div className="text-2xl">🚩</div>
              <p className="mt-2 text-sm text-white/60">
                Las <strong className="text-white">banderas</strong> marcan los niveles. Complétalos para desbloquear el siguiente.
              </p>
            </div>
            <div>
              <div className="text-2xl">👑</div>
              <p className="mt-2 text-sm text-white/60">
                Al terminar todo, enfrentas al <strong className="text-white">jefe final</strong> y ganas tu certificado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}