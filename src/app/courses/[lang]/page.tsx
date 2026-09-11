'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { account } from '@/lib/appwrite';
import {
  getCurso,
  DIFICULTAD_COLORES,
  DIFICULTAD_LABELS,
  type Dificultad,
  type Nivel,
} from '@/lib/courses-data';
import { loadProgress, saveProgress, addXp } from '@/lib/progress';

type FiltroDificultad = 'todas' | Dificultad;

interface ProgresoGuardado {
  completados: string[];
}

function cargarProgreso(): ProgresoGuardado {
  const data = loadProgress();
  return { completados: data.misionesCompletadas };
}

function guardarProgreso(data: ProgresoGuardado) {
  const existing = loadProgress();
  saveProgress({ ...existing, misionesCompletadas: data.completados });
}

export default function CursoMapaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const curso = getCurso(lang);

  const [completados, setCompletados] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<FiltroDificultad>('todas');
  const [nivelSeleccionado, setNivelSeleccionado] = useState<Nivel | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  // Verificar sesión — redirige a login si no hay
  useEffect(() => {
    account
      .get()
      .then(() => setAutenticado(true))
      .catch(() => {
        setAutenticado(false);
        const redirect = `/courses/${lang}`;
        router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      });
  }, [router, lang]);

  useEffect(() => {
    const saved = cargarProgreso();
    setCompletados(saved.completados);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    guardarProgreso({ completados });
  }, [completados, hydrated]);

  const nivelesFiltrados = useMemo(() => {
    if (!curso) return [];
    if (filtro === 'todas') return curso.niveles;
    return curso.niveles.filter((n) => n.dificultad === filtro);
  }, [curso, filtro]);

  const estaDesbloqueado = (nivel: Nivel): boolean => {
    if (!nivel.requiere || nivel.requiere.length === 0) return true;
    return nivel.requiere.every((req) => completados.includes(req));
  };

  const estaCompletado = (nivel: Nivel): boolean =>
    completados.includes(nivel.id);

  const completarNivel = (id: string) => {
    setCompletados((prev) => {
      if (prev.includes(id)) return prev;
      const nivel = curso?.niveles.find((n) => n.id === id);
      if (nivel) addXp(nivel.xp);
      return [...prev, id];
    });
    setNivelSeleccionado(null);
  };

  if (!curso) return notFound();

  // Mientras verifica sesión, mostrar pantalla de carga
  if (autenticado === null) {
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

  // Si no está autenticado, no renderizar nada (el useEffect ya redirige)
  if (autenticado === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-white/40">
            REDIRIGIENDO AL LOGIN...
          </p>
        </div>
      </main>
    );
  }

  const totalNiveles = curso.niveles.length;
  const totalCompletados = curso.niveles.filter((n) =>
    completados.includes(n.id)
  ).length;
  const porcentaje =
    totalNiveles > 0 ? Math.round((totalCompletados / totalNiveles) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="gamer-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-10 blur-[120px]"
          style={{ backgroundColor: curso.color }}
        />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 md:px-12">
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-white/40 transition hover:text-white"
        >
          ← VOLVER A CURSOS
        </Link>

        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center border text-3xl"
              style={{
                borderColor: `${curso.color}40`,
                backgroundColor: `${curso.color}15`,
              }}
            >
              {curso.icono}
            </div>
            <div>
              <span
                className="font-mono text-[9px] tracking-[0.35em]"
                style={{ color: curso.color }}
              >
                MUNDO
              </span>
              <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                {curso.nombre.toUpperCase()}
              </h1>
              <p className="mt-1 text-sm text-white/40">{curso.descripcion}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/40">
                PROGRESO
              </span>
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: curso.color }}
              >
                {porcentaje}%
              </div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-right">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/40">
                MISIONES
              </span>
              <div className="font-mono text-2xl font-bold">
                {totalCompletados}/{totalNiveles}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {(['todas', 'basico', 'intermedio', 'avanzado', 'boss'] as const).map(
            (f) => {
              const activo = filtro === f;
              return (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  aria-pressed={activo}
                  style={
                    activo
                      ? {
                          borderColor: curso.color,
                          backgroundColor: `${curso.color}20`,
                          color: curso.color,
                        }
                      : undefined
                  }
                  className={`border px-4 py-2 font-mono text-[9px] tracking-[0.2em] transition ${
                    activo
                      ? ''
                      : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {f === 'todas' ? 'TODAS' : DIFICULTAD_LABELS[f]}
                </button>
              );
            }
          )}
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0b0d10]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="absolute left-3 top-3 border border-white/10 bg-[#08090b]/80 px-3 py-2 font-mono text-[8px] tracking-[0.2em] text-white/40 backdrop-blur">
            MAPA / {curso.nombre.toUpperCase()}
          </div>

          {nivelesFiltrados.map((nivel) => {
            const desbloqueado = estaDesbloqueado(nivel);
            const completado = estaCompletado(nivel);
            const color = DIFICULTAD_COLORES[nivel.dificultad];

            return (
              <button
                key={nivel.id}
                onClick={() => desbloqueado && setNivelSeleccionado(nivel)}
                disabled={!desbloqueado}
                aria-label={`Nivel ${nivel.titulo}`}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                  desbloqueado
                    ? 'cursor-pointer hover:scale-125'
                    : 'cursor-not-allowed'
                }`}
                style={{
                  left: `${nivel.mapPosition.x}%`,
                  top: `${nivel.mapPosition.y}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center border-2 text-lg transition-all sm:h-12 sm:w-12 sm:text-xl ${
                      completado
                        ? 'border-emerald-400 bg-emerald-500/30'
                        : desbloqueado
                          ? 'bg-[#0b0d10]/90'
                          : 'border-white/15 bg-black/60 opacity-50'
                    }`}
                    style={
                      !completado && desbloqueado
                        ? { borderColor: color }
                        : undefined
                    }
                  >
                    {completado ? '✓' : desbloqueado ? '🚩' : '🔒'}
                  </div>
                  <div className="mt-1 whitespace-nowrap border border-white/10 bg-[#08090b]/90 px-2 py-1 font-mono text-[8px] tracking-wider text-white/70 backdrop-blur sm:text-[9px]">
                    {nivel.titulo}
                  </div>
                </div>
              </button>
            );
          })}

          {nivelesFiltrados.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-white/30">
                No hay misiones con este filtro.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border border-white/10 bg-white/[0.02] p-4">
          <span className="font-mono text-[9px] tracking-[0.25em] text-white/40">
            LEYENDA:
          </span>
          {(['basico', 'intermedio', 'avanzado', 'boss'] as Dificultad[]).map(
            (d) => (
              <div key={d} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 border"
                  style={{
                    borderColor: DIFICULTAD_COLORES[d],
                    backgroundColor: `${DIFICULTAD_COLORES[d]}40`,
                  }}
                />
                <span className="font-mono text-[9px] tracking-wider text-white/50">
                  {DIFICULTAD_LABELS[d]}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* MODAL DE NIVEL */}
      {nivelSeleccionado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setNivelSeleccionado(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/15 bg-[#0b0d10] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute left-0 top-0 h-1 w-full"
              style={{
                backgroundColor:
                  DIFICULTAD_COLORES[nivelSeleccionado.dificultad],
              }}
            />

            <div className="mb-4 flex items-center justify-between">
              <span
                className="border px-3 py-1 font-mono text-[9px] tracking-[0.2em]"
                style={{
                  borderColor: `${DIFICULTAD_COLORES[nivelSeleccionado.dificultad]}60`,
                  color: DIFICULTAD_COLORES[nivelSeleccionado.dificultad],
                }}
              >
                {DIFICULTAD_LABELS[nivelSeleccionado.dificultad]}
              </span>
              <button
                onClick={() => setNivelSeleccionado(null)}
                className="text-white/40 transition hover:text-white"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <h3 className="text-2xl font-bold tracking-tight">
              {nivelSeleccionado.titulo}
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/50">
              {nivelSeleccionado.descripcion}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="border border-white/10 bg-white/[0.02] p-3">
                <span className="block font-mono text-[8px] tracking-[0.2em] text-white/40">
                  DURACIÓN
                </span>
                <span className="mt-1 block text-lg font-bold">
                  {nivelSeleccionado.duracion}
                </span>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-3">
                <span className="block font-mono text-[8px] tracking-[0.2em] text-white/40">
                  RECOMPENSA
                </span>
                <span className="mt-1 block text-lg font-bold text-red-500">
                  +{nivelSeleccionado.xp} XP
                </span>
              </div>
            </div>

            {nivelSeleccionado.contenido ? (
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-mono text-[10px] tracking-[0.3em] text-red-500">
                    📖 TEORÍA
                  </h4>
                  <div className="mt-3 space-y-3 border-l-2 border-red-600/30 pl-4">
                    {nivelSeleccionado.contenido.teoria.map((t, i) => (
                      <p key={i} className="text-sm leading-7 text-white/60">
                        {t}
                      </p>
                    ))}
                  </div>
                </div>

                {nivelSeleccionado.contenido.ejemplo && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[0.3em] text-red-500">
                      💻 EJEMPLO
                    </h4>
                    <pre className="mt-3 overflow-x-auto border border-white/10 bg-[#08090b] p-4 font-mono text-xs leading-6 text-emerald-300">
                      {nivelSeleccionado.contenido.ejemplo}
                    </pre>
                  </div>
                )}

                {nivelSeleccionado.contenido.quiz && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[0.3em] text-red-500">
                      🎯 QUIZ
                    </h4>
                    <div className="mt-3 space-y-4">
                      {nivelSeleccionado.contenido.quiz.map((q, qi) => (
                        <QuizPreguntaItem
                          key={qi}
                          numero={qi + 1}
                          pregunta={q.pregunta}
                          opciones={q.opciones}
                          correcta={q.correcta}
                          explicacion={q.explicacion}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
                <p className="text-sm text-yellow-300">
                  🚧 Contenido próximamente
                </p>
              </div>
            )}

                        <div className="mt-6 flex gap-3">
              {nivelSeleccionado.contenido ? (
                <button
                  onClick={() => completarNivel(nivelSeleccionado.id)}
                  disabled={estaCompletado(nivelSeleccionado)}
                  className="flex-1 border border-red-600 bg-red-600 px-6 py-3 font-mono text-[10px] tracking-[0.2em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {estaCompletado(nivelSeleccionado)
                    ? '✓ COMPLETADA'
                    : 'COMPLETAR MISIÓN →'}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 cursor-not-allowed border border-white/10 bg-white/[0.02] px-6 py-3 font-mono text-[10px] tracking-[0.2em] text-white/30"
                >
                  🚧 MISIÓN PRÓXIMAMENTE
                </button>
              )}
              <button
                onClick={() => setNivelSeleccionado(null)}
                className="border border-white/10 px-6 py-3 font-mono text-[10px] tracking-[0.2em] text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function QuizPreguntaItem({
  numero,
  pregunta,
  opciones,
  correcta,
  explicacion,
}: {
  numero: number;
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}) {
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  const respondida = seleccionada !== null;
  const esCorrecta = seleccionada === correcta;

  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <p className="text-sm font-medium text-white">
        {numero}. {pregunta}
      </p>

      <div className="mt-3 space-y-2">
        {opciones.map((opt, oi) => {
          const esEsta = seleccionada === oi;
          const esLaCorrecta = oi === correcta;

          let clases =
            'border-white/10 bg-white/[0.02] text-white/70 hover:border-red-600/40 hover:bg-red-600/10 hover:text-white';

          if (respondida) {
            if (esEsta && esLaCorrecta) {
              clases = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
            } else if (esEsta && !esLaCorrecta) {
              clases = 'border-red-500 bg-red-500/20 text-red-200';
            } else if (esLaCorrecta) {
              clases =
                'border-emerald-500/50 bg-emerald-500/10 text-emerald-300/80';
            } else {
              clases = 'border-white/5 bg-white/[0.01] text-white/30';
            }
          }

          return (
            <button
              key={oi}
              onClick={() => !respondida && setSeleccionada(oi)}
              disabled={respondida}
              className={`block w-full border px-4 py-2 text-left text-sm transition disabled:cursor-not-allowed ${clases}`}
            >
              <span className="flex items-center gap-2">
                {respondida && esLaCorrecta && <span>✓</span>}
                {respondida && esEsta && !esLaCorrecta && <span>✕</span>}
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </div>

      {respondida && (
        <div
          className={`mt-3 border p-3 text-sm ${
            esCorrecta
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-200'
          }`}
        >
          <div className="font-semibold">
            {esCorrecta ? '✅ ¡Correcto!' : '❌ Respuesta incorrecta'}
          </div>
          <p className="mt-1 text-xs leading-6 opacity-90">{explicacion}</p>
        </div>
      )}
    </div>
  );
}