'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  CURSOS,
  getCurso,
  DIFICULTAD_COLORES,
  DIFICULTAD_LABELS,
  type Dificultad,
  type Nivel,
} from '@/lib/courses-data';

const STORAGE_KEY = 'santiago-courses-progress';

type FiltroDificultad = 'todas' | Dificultad;

interface ProgresoGuardado {
  completados: string[]; // ids de niveles
}

function cargarProgreso(): ProgresoGuardado {
  if (typeof window === 'undefined') return { completados: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completados: [] };
    const parsed = JSON.parse(raw);
    return {
      completados: Array.isArray(parsed.completados) ? parsed.completados : [],
    };
  } catch {
    return { completados: [] };
  }
}

function guardarProgreso(data: ProgresoGuardado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function CursoMapaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const curso = getCurso(lang);

  const [completados, setCompletados] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<FiltroDificultad>('todas');
  const [nivelSeleccionado, setNivelSeleccionado] = useState<Nivel | null>(null);
  const [hydrated, setHydrated] = useState(false);

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
    setCompletados((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    setNivelSeleccionado(null);
  };

  if (!curso) return notFound();

  const totalNiveles = curso.niveles.length;
  const totalCompletados = curso.niveles.filter((n) =>
    completados.includes(n.id)
  ).length;
  const porcentaje = Math.round((totalCompletados / totalNiveles) * 100);

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
        {/* BREADCRUMB */}
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-white/40 transition hover:text-red-500"
        >
          ← VOLVER A CURSOS
        </Link>

        {/* HEADER DEL CURSO */}
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
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
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
              <div className="font-mono text-2xl font-bold text-red-500">
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

        {/* FILTROS DE DIFICULTAD */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(['todas', 'basico', 'intermedio', 'avanzado', 'boss'] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                aria-pressed={filtro === f}
                className={`border px-4 py-2 font-mono text-[9px] tracking-[0.2em] transition ${
                  filtro === f
                    ? 'border-red-600 bg-red-600/10 text-red-400'
                    : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {f === 'todas' ? 'TODAS' : DIFICULTAD_LABELS[f]}
              </button>
            )
          )}
        </div>

        {/* =========================================================
            MAPA — Aquí pones tu imagen de fondo estilo Minecraft
            Las banderas se posicionan con `mapPosition` de cada nivel
        ========================================================= */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0b0d10]">
          {/* 👇 AQUÍ VA TU IMAGEN DE MAPA */}
          {/* Reemplaza esta línea por tu imagen: */}
          {/*
          <Image
            src="/maps/python-map.png"
            alt="Mapa de Python"
            fill
            className="object-cover opacity-60"
          />
          */}

          {/* Placeholder visual mientras pones tu mapa */}
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

          {/* Indicador de esquina */}
          <div className="absolute left-3 top-3 border border-white/10 bg-[#08090b]/80 px-3 py-2 font-mono text-[8px] tracking-[0.2em] text-white/40 backdrop-blur">
            MAPA / {curso.nombre.toUpperCase()}
          </div>

          {/* BANDERAS (niveles) */}
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
                {/* Bandera */}
                <div className="relative flex flex-col items-center">
                  {/* Icono de estado */}
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

                  {/* Etiqueta */}
                  <div className="mt-1 whitespace-nowrap border border-white/10 bg-[#08090b]/90 px-2 py-1 font-mono text-[8px] tracking-wider text-white/70 backdrop-blur sm:text-[9px]">
                    {nivel.titulo}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Estado vacío si el filtro no tiene niveles */}
          {nivelesFiltrados.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-white/30">
                No hay misiones con este filtro.
              </p>
            </div>
          )}
        </div>

        {/* LEYENDA */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border border-white/10 bg-white/[0.02] p-4">
          <span className="font-mono text-[9px] tracking-[0.25em] text-white/40">
            LEYENDA:
          </span>
          {(
            ['basico', 'intermedio', 'avanzado', 'boss'] as Dificultad[]
          ).map((d) => (
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
          ))}
        </div>
      </div>

      {/* MODAL DE NIVEL SELECCIONADO */}
      {nivelSeleccionado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setNivelSeleccionado(null)}
        >
          <div
            className="relative w-full max-w-md border border-white/15 bg-[#0b0d10] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Borde de color según dificultad */}
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

            <div className="mt-6 grid grid-cols-2 gap-3">
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

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  // Aquí después pondrás la navegación a la lección real
                  alert(
                    `Aquí se abriría la lección: ${nivelSeleccionado.titulo}`
                  );
                  completarNivel(nivelSeleccionado.id);
                }}
                className="flex-1 border border-red-600 bg-red-600 px-6 py-3 font-mono text-[10px] tracking-[0.2em] transition hover:bg-red-500"
              >
                INICIAR MISIÓN →
              </button>
              <button
                onClick={() => setNivelSeleccionado(null)}
                className="border border-white/10 px-6 py-3 font-mono text-[10px] tracking-[0.2em] text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                CERRAR
              </button>
            </div>

            {estaCompletado(nivelSeleccionado) && (
              <p className="mt-3 text-center font-mono text-[9px] tracking-wider text-emerald-400">
                ✓ YA COMPLETASTE ESTA MISIÓN
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}