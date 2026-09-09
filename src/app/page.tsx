'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import RevealSection from '@/components/RevealSection';
import TimelineSection from '@/components/TimelineSection';
import AchievementCard from '@/components/AchievementCard';

const STORAGE_KEY = 'santiago-portfolio-progress-v6';

const NIVELES = [
  {
    nivel: 1,
    titulo: 'ORIGEN',
    subtitulo: 'El comienzo',
    xp: 20,
    recompensa: 'PRIMER PASO',
  },
  {
    nivel: 2,
    titulo: 'FORMACIÓN',
    subtitulo: 'Mis estudios',
    xp: 20,
    recompensa: 'BUSCADOR DE CONOCIMIENTO',
  },
  {
    nivel: 3,
    titulo: 'EXPERIENCIA',
    subtitulo: 'Experiencia práctica',
    xp: 20,
    recompensa: 'RESOLUTOR DE PROBLEMAS',
  },
  {
    nivel: 4,
    titulo: 'TECNOLOGÍAS',
    subtitulo: 'Mi conjunto de herramientas',
    xp: 20,
    recompensa: 'DESARROLLADOR FULL STACK',
  },
  {
    nivel: 5,
    titulo: 'PROYECTOS',
    subtitulo: 'Lo que he construido',
    xp: 20,
    recompensa: 'CONSTRUCTOR DE PROYECTOS',
  },
] as const;

const EXPERIENCIA = [
  {
    year: '2025 — ACTUAL',
    title: 'Ingeniería Informática',
    company: 'Formación universitaria',
    description:
      'Formación enfocada en programación, desarrollo de software, estructuras de datos y creación de soluciones tecnológicas.',
  },
  {
    year: '2025 — ACTUAL',
    title: 'Análisis y Desarrollo de Software',
    company: 'Formación tecnológica',
    description:
      'Formación orientada al desarrollo de aplicaciones, programación, bases de datos, desarrollo web y construcción de soluciones de software.',
  },
  {
    year: '2025 — 2026',
    title: 'Calma',
    company: 'Proyecto personal — Finalizado',
    description:
      'Aplicación enfocada en acompañamiento y bienestar, desarrollada como proyecto tecnológico con una experiencia de interacción mediante chatbot.',
  },
  {
    year: '2025 — ACTUAL',
    title: 'Sistema de Asistencia QR',
    company: 'Proyecto académico — En desarrollo',
    description:
      'Sistema de asistencia mediante códigos QR con validación por horario y distancia, registro de asistencias y control de información.',
  },
];

const TECNOLOGIAS = [
  {
    categoria: 'DESARROLLO WEB',
    elementos: [
      { nombre: 'HTML5', codigo: 'HTML' },
      { nombre: 'CSS3', codigo: 'CSS' },
      { nombre: 'JavaScript', codigo: 'JS' },
      { nombre: 'TypeScript', codigo: 'TS' },
      { nombre: 'React', codigo: 'RE' },
      { nombre: 'Next.js', codigo: 'NX' },
      { nombre: 'Tailwind CSS', codigo: 'TW' },
    ],
  },
  {
    categoria: 'PROGRAMACIÓN Y SERVIDOR',
    elementos: [
      { nombre: 'Java', codigo: 'JV' },
      { nombre: 'Python', codigo: 'PY' },
      { nombre: 'Node.js', codigo: 'ND' },
      { nombre: 'PHP', codigo: 'PHP' },
    ],
  },
  {
    categoria: 'DESARROLLO MÓVIL',
    elementos: [
      { nombre: 'Flutter', codigo: 'FL' },
      { nombre: 'Dart', codigo: 'DT' },
    ],
  },
  {
    categoria: 'BASES DE DATOS',
    elementos: [
      { nombre: 'MySQL', codigo: 'MY' },
      { nombre: 'PostgreSQL', codigo: 'PG' },
      { nombre: 'MongoDB', codigo: 'MG' },
      { nombre: 'SQL', codigo: 'SQL' },
    ],
  },
  {
    categoria: 'SERVICIOS Y HERRAMIENTAS',
    elementos: [
      { nombre: 'Appwrite', codigo: 'AW' },
      { nombre: 'Firebase', codigo: 'FB' },
      { nombre: 'Docker', codigo: 'DK' },
      { nombre: 'Git', codigo: 'GT' },
    ],
  },
];

const PROYECTOS = [
  {
    numero: '01',
    titulo: 'CALMA',
    estado: 'PROYECTO FINALIZADO',
    descripcion:
      'Aplicación enfocada en acompañamiento y bienestar con una experiencia de interacción mediante chatbot.',
    tecnologias: ['TypeScript', 'React', 'Next.js', 'Appwrite'],
    visual: 'calma',
  },
  {
    numero: '02',
    titulo: 'SISTEMA DE ASISTENCIA QR',
    estado: 'PROYECTO EN DESARROLLO',
    descripcion:
      'Sistema de asistencia mediante códigos QR con validación de horario y distancia para realizar registros de forma más precisa.',
    tecnologias: ['JavaScript', 'React', 'Node.js', 'SQL'],
    visual: 'qr',
  },
  {
    numero: '03',
    titulo: 'PORTAFOLIO PERSONAL',
    estado: 'PROYECTO PERSONAL',
    descripcion:
      'Portafolio web con una experiencia interactiva que muestra mi formación, tecnologías, proyectos y evolución como desarrollador.',
    tecnologias: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Appwrite'],
    visual: 'portfolio',
  },
  {
    numero: '04',
    titulo: 'PROYECTOS DE FORMACIÓN',
    estado: 'PROCESO DE APRENDIZAJE',
    descripcion:
      'Conjunto de ejercicios y proyectos desarrollados durante mi proceso de formación en programación y desarrollo de software.',
    tecnologias: ['Python', 'Java', 'Flutter', 'SQL'],
    visual: 'codigo',
  },
];

const LOGROS = [
  {
    id: '01',
    titulo: 'PRIMER PASO',
    descripcion: 'Completaste el primer nivel de tu recorrido.',
    xp: 10,
  },
  {
    id: '02',
    titulo: 'BUSCADOR DE CONOCIMIENTO',
    descripcion: 'Tu proceso de formación comenzó a tomar forma.',
    xp: 20,
  },
  {
    id: '03',
    titulo: 'EXPLORADOR DEL CÓDIGO',
    descripcion: 'Exploraste diferentes lenguajes y tecnologías.',
    xp: 30,
  },
  {
    id: '04',
    titulo: 'RESOLUTOR DE PROBLEMAS',
    descripcion:
      'Convertiste problemas académicos en soluciones funcionales.',
    xp: 30,
  },
  {
    id: '05',
    titulo: 'DESARROLLADOR FULL STACK',
    descripcion:
      'Comenzaste a trabajar en diferentes áreas del desarrollo de software.',
    xp: 40,
  },
  {
    id: '06',
    titulo: 'CONSTRUCTOR DE PROYECTOS',
    descripcion:
      'Construiste proyectos reales durante tu proceso de formación.',
    xp: 40,
  },
  {
    id: '07',
    titulo: 'RECORRIDO COMPLETADO',
    descripcion:
      'Completaste todos los niveles principales del portafolio.',
    xp: 50,
  },
];

function VisualProyecto({ tipo }: { tipo: string }) {
  if (tipo === 'calma') {
    return (
      <div className="pantalla-proyecto">
        <div className="barra-navegador">
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="direccion-navegador">calma</span>
        </div>

        <div className="contenido-calma">
          <div className="menu-calma">
            <div className="logo-calma">C</div>

            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="principal-calma">
            <div className="etiqueta-mockup">BIENVENIDO</div>

            <div className="titulo-mockup">Calma</div>

            <div className="linea-mockup grande" />

            <div className="linea-mockup mediana" />

            <div className="tarjetas-mockup">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tipo === 'qr') {
    return (
      <div className="pantalla-proyecto">
        <div className="barra-navegador">
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="direccion-navegador">
            sistema-asistencia
          </span>
        </div>

        <div className="contenido-qr">
          <div className="contenedor-qr">
            <div className="codigo-qr">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <small>ESCANEAR CÓDIGO</small>
          </div>

          <div className="informacion-qr">
            <div className="etiqueta-mockup">ASISTENCIA</div>

            <div className="titulo-mockup">
              Control de asistencia
            </div>

            <div className="fila-asistencia">
              <span>Horario</span>
              <b>08:00 — 10:00</b>
            </div>

            <div className="fila-asistencia">
              <span>Distancia</span>
              <b>VALIDADA</b>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tipo === 'portfolio') {
    return (
      <div className="pantalla-proyecto">
        <div className="barra-navegador">
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="punto-navegador" />
          <span className="direccion-navegador">
            sanas07a.dev
          </span>
        </div>

        <div className="visual-portafolio">
          <div className="numero-portafolio">05</div>

          <div className="titulo-portafolio">
            SANTIAGO
            <br />
            AGUIRRE
          </div>

          <div className="linea-portafolio" />

          <div className="datos-portafolio">
            <span>DESARROLLO FULL STACK</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pantalla-proyecto">
      <div className="barra-navegador">
        <span className="punto-navegador" />
        <span className="punto-navegador" />
        <span className="punto-navegador" />
        <span className="direccion-navegador">
          proyectos-formacion
        </span>
      </div>

      <div className="visual-codigo">
        <div>
          <span>01</span>
          <b>clase</b> Desarrollador
        </div>

        <div>
          <span>02</span>
          &nbsp;&nbsp;tecnologias = [
        </div>

        <div>
          <span>03</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&quot;Java&quot;,
        </div>

        <div>
          <span>04</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&quot;Python&quot;,
        </div>

        <div>
          <span>05</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&quot;React&quot;,
        </div>

        <div>
          <span>06</span>
          &nbsp;&nbsp;]
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [xp, setXp] = useState(0);
  const [nivelesDesbloqueados, setNivelesDesbloqueados] =
    useState<number[]>([1]);

  const [logrosDesbloqueados, setLogrosDesbloqueados] =
    useState<number[]>([]);

  const [notificacion, setNotificacion] = useState<string | null>(
    null
  );

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);

      if (!guardado) return;

      const datos = JSON.parse(guardado);

      if (typeof datos.xp === 'number') {
        setXp(datos.xp);
      }

      if (Array.isArray(datos.nivelesDesbloqueados)) {
        setNivelesDesbloqueados(datos.nivelesDesbloqueados);
      }

      if (Array.isArray(datos.logrosDesbloqueados)) {
        setLogrosDesbloqueados(datos.logrosDesbloqueados);
      }
    } catch {
      console.warn('No se pudo recuperar el progreso.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        xp,
        nivelesDesbloqueados,
        logrosDesbloqueados,
      })
    );
  }, [xp, nivelesDesbloqueados, logrosDesbloqueados]);

  const nivelActual = useMemo(() => {
    return Math.min(
      Math.max(Math.max(...nivelesDesbloqueados, 1), 1),
      NIVELES.length
    );
  }, [nivelesDesbloqueados]);

  const desbloquearNivel = useCallback((nivel: number) => {
    setNivelesDesbloqueados((anteriores) => {
      if (anteriores.includes(nivel)) {
        return anteriores;
      }

      const nivelAnterior = nivel - 1;

      if (
        nivelAnterior > 0 &&
        !anteriores.includes(nivelAnterior)
      ) {
        return anteriores;
      }

      return [...anteriores, nivel];
    });

    setXp((actual) => actual + NIVELES[nivel - 1].xp);

    setNotificacion(`NIVEL ${String(nivel).padStart(2, '0')} DESBLOQUEADO`);

    setTimeout(() => {
      setNotificacion(null);
    }, 2500);
  }, []);

  const desbloquearLogro = useCallback((logro: number) => {
    setLogrosDesbloqueados((anteriores) => {
      if (anteriores.includes(logro)) {
        return anteriores;
      }

      const recompensa = LOGROS[logro - 1]?.xp ?? 0;

      setXp((actual) => actual + recompensa);

      setNotificacion(
        `LOGRO ${String(logro).padStart(2, '0')} DESBLOQUEADO`
      );

      setTimeout(() => {
        setNotificacion(null);
      }, 2500);

      return [...anteriores, logro];
    });
  }, []);

  const reiniciarProgreso = () => {
    setXp(0);
    setNivelesDesbloqueados([1]);
    setLogrosDesbloqueados([]);

    localStorage.removeItem(STORAGE_KEY);

    setNotificacion('PROGRESO REINICIADO');

    setTimeout(() => {
      setNotificacion(null);
    }, 2500);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

        <div className="absolute bottom-[15%] right-[-250px] h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[130px]" />
      </div>

      <Navbar />

      {/* PANEL DE PROGRESO */}
      <div className="fixed bottom-6 left-6 z-50 hidden w-[250px] md:block">
        <div className="border border-white/10 bg-[#0b0d10]/90 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-white/40">
              PROGRESO
            </span>

            <span className="font-mono text-xs text-red-500">
              NIVEL {String(nivelActual).padStart(2, '0')}
            </span>
          </div>

          <XPBar
            value={xp}
            level={nivelActual}
            label={`${xp} XP`}
          />
        </div>
      </div>

      {/* NOTIFICACIÓN */}
      {notificacion && (
        <div className="fixed right-6 top-24 z-[100] border border-red-500/30 bg-[#0d0f12]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-1 text-[9px] tracking-[0.3em] text-red-500">
            SISTEMA
          </div>

          <div className="text-sm font-semibold tracking-wider">
            {notificacion}
          </div>
        </div>
      )}

      {/* PORTADA */}
      <section className="relative z-10 flex min-h-screen items-center px-6 pb-20 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-10 bg-red-600" />

              <span className="font-mono text-[10px] font-semibold tracking-[0.35em] text-red-500">
                PORTAFOLIO / 2026
              </span>
            </div>

            <h1 className="max-w-5xl text-[clamp(4rem,11vw,9.5rem)] font-black leading-[0.8] tracking-[-0.07em]">
              SANTIAGO
              <br />
              <span className="text-white/20">AGUIRRE</span>
            </h1>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="border-l border-red-600 pl-4">
                <p className="text-sm font-semibold tracking-[0.18em] text-white">
                  DESARROLLADOR FULL STACK
                </p>

                <p className="mt-1 text-xs tracking-[0.2em] text-white/35">
                  EN FORMACIÓN
                </p>
              </div>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <p className="max-w-md text-sm leading-6 text-white/45">
                Construyo interfaces, exploro nuevas tecnologías
                y convierto ideas en proyectos funcionales.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href="#nivel-5"
                className="group flex items-center gap-3 border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.18em] transition-all hover:bg-red-500"
              >
                VER PROYECTOS

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="mailto:santiago.aguirre66415@ucaldas.edu.co"
                className="border border-white/10 px-6 py-3 text-xs font-bold tracking-[0.18em] text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                CONTACTO
              </a>
            </div>
          </div>

          {/* ELEMENTO VISUAL */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square border border-white/10 bg-[#0c0e11]/70 p-8">
              <div className="absolute left-0 top-0 h-16 w-px bg-red-600" />
              <div className="absolute left-0 top-0 h-px w-16 bg-red-600" />

              <div className="absolute bottom-0 right-0 h-16 w-px bg-red-600" />
              <div className="absolute bottom-0 right-0 h-px w-16 bg-red-600" />

              <div className="absolute inset-12 border border-white/[0.06]" />

              <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/10">
                <div className="absolute inset-3 border border-red-600/30" />

                <span className="text-7xl font-black tracking-[-0.08em] text-white/90">
                  SA
                </span>
              </div>

              <div className="absolute left-8 top-8 font-mono text-[9px] tracking-[0.25em] text-white/25">
                MANIZALES / COLOMBIA
              </div>

              <div className="absolute bottom-8 right-8 font-mono text-[9px] tracking-[0.25em] text-white/25">
                05 / 05
              </div>

              <div className="absolute left-1/2 top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,.8)]" />
            </div>

            <div className="absolute -bottom-5 -left-5 border border-white/10 bg-[#0b0d10] px-5 py-4">
              <span className="block text-[9px] tracking-[0.25em] text-white/30">
                ESTADO ACTUAL
              </span>

              <span className="mt-1 block text-xs font-semibold tracking-widest text-red-500">
                CONSTRUYENDO
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="font-mono text-[8px] tracking-[0.4em] text-white/25">
            DESPLÁZATE PARA EXPLORAR
          </span>

          <div className="h-12 w-px bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </section>

      {/* MAPA DE NIVELES */}
      <section className="relative z-10 border-y border-white/10 bg-[#0a0c0f]/80 px-6 py-10 backdrop-blur-xl md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                NAVEGACIÓN
              </span>

              <h2 className="mt-2 text-xl font-bold tracking-tight">
                MI RECORRIDO
              </h2>
            </div>

            <span className="font-mono text-[10px] text-white/25">
              {String(nivelActual).padStart(2, '0')} / 05
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {NIVELES.map((nivel) => {
              const desbloqueado = nivelesDesbloqueados.includes(
                nivel.nivel
              );

              const activo = nivelActual === nivel.nivel;

              return (
                <div
                  key={nivel.nivel}
                  className={`group relative border p-4 transition-all ${
                    desbloqueado
                      ? 'border-white/10 bg-white/[0.025]'
                      : 'border-white/[0.05] bg-black/20 opacity-40'
                  } ${activo ? 'border-red-600/60' : ''}`}
                >
                  {activo && (
                    <div className="absolute left-0 top-0 h-px w-full bg-red-600" />
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-lg font-bold ${
                        activo ? 'text-red-500' : 'text-white/40'
                      }`}
                    >
                      0{nivel.nivel}
                    </span>

                    <span className="text-[9px] tracking-widest text-white/20">
                      {desbloqueado ? 'ABIERTO' : 'BLOQUEADO'}
                    </span>
                  </div>

                  <div className="mt-5 text-[10px] font-bold tracking-[0.15em] text-white/70">
                    {nivel.titulo}
                  </div>

                  <div className="mt-1 text-[9px] text-white/25">
                    {nivel.subtitulo}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NIVEL 01 */}
      <RevealSection
        id="nivel-1"
        className="relative z-10"
        onUnlock={() => desbloquearNivel(1)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                01
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                ORIGEN
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                El comienzo
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-2xl font-medium leading-relaxed text-white/85 md:text-4xl md:leading-tight">
                Soy Santiago Aguirre, desarrollador Full Stack en
                formación desde Manizales, Colombia.
              </p>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/40">
                Actualmente estoy construyendo mi camino en el
                desarrollo de software mediante formación académica,
                proyectos personales y experimentación constante con
                nuevas tecnologías.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
                {[
                  ['2025', 'INICIO'],
                  ['CO', 'UBICACIÓN'],
                  ['01', 'PERFIL'],
                  ['∞', 'APRENDIZAJE'],
                ].map(([valor, etiqueta]) => (
                  <div
                    key={etiqueta}
                    className="bg-[#0b0d10] p-5"
                  >
                    <div className="text-xl font-bold">{valor}</div>

                    <div className="mt-1 text-[8px] tracking-[0.25em] text-white/25">
                      {etiqueta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 02 */}
      <RevealSection
        id="nivel-2"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => desbloquearNivel(2)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                02
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                FORMACIÓN
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Mis estudios
              </h2>
            </div>

            <div>
              <TimelineSection items={EXPERIENCIA.slice(0, 2)} />

              <div className="mt-16 grid gap-4 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.02] p-7">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                    UNIVERSIDAD
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    Ingeniería Informática
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    Formación universitaria iniciada en 2025.
                  </p>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-7">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                    DESARROLLO
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    Análisis y Desarrollo de Software
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    Formación orientada al desarrollo de software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 03 */}
      <RevealSection
        id="nivel-3"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => desbloquearNivel(3)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                03
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                EXPERIENCIA
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Experiencia práctica
              </h2>
            </div>

            <div>
              <div className="mb-10 border border-red-600/20 bg-red-600/[0.03] p-6">
                <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                  ETAPA ACTUAL
                </span>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  Actualmente no cuento con experiencia laboral
                  profesional. Mi experiencia se ha desarrollado
                  principalmente mediante formación académica,
                  proyectos personales y proyectos de desarrollo.
                </p>
              </div>

              <TimelineSection items={EXPERIENCIA.slice(2)} />
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 04 */}
      <RevealSection
        id="nivel-4"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => desbloquearNivel(4)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                04
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                TECNOLOGÍAS
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Mi conjunto de herramientas
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/30">
                Tecnologías que forman parte de mi proceso de
                aprendizaje y desarrollo.
              </p>
            </div>

            <div className="space-y-12">
              {TECNOLOGIAS.map((grupo) => (
                <div key={grupo.categoria}>
                  <div className="mb-5 flex items-center gap-4">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-white/25">
                      {grupo.categoria}
                    </span>

                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {grupo.elementos.map((tecnologia) => (
                      <div
                        key={tecnologia.nombre}
                        className="group flex items-center gap-4 border border-white/10 bg-white/[0.02] p-4 transition-all hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#101216] font-mono text-[9px] font-bold text-white/60 transition-colors group-hover:border-red-600/40 group-hover:text-red-500">
                          {tecnologia.codigo}
                        </div>

                        <span className="text-xs font-medium text-white/65">
                          {tecnologia.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 05 */}
      <RevealSection
        id="nivel-5"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => desbloquearNivel(5)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="mb-16">
            <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
              05
            </div>

            <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
              PROYECTOS DESTACADOS
            </div>

            <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="text-4xl font-bold tracking-tight">
                Lo que he construido
              </h2>

              <p className="max-w-md text-sm leading-6 text-white/30">
                Una selección de proyectos desarrollados durante mi
                proceso de formación.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PROYECTOS.map((proyecto) => (
              <article
                key={proyecto.numero}
                className="group overflow-hidden border border-white/10 bg-[#0b0d10] transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative overflow-hidden border-b border-white/10">
                  <VisualProyecto tipo={proyecto.visual} />

                  <div className="absolute left-5 top-5 border border-white/10 bg-[#08090b]/80 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-white/40 backdrop-blur">
                    {proyecto.numero}
                  </div>
                </div>

                <div className="p-7">
                  <div className="font-mono text-[8px] tracking-[0.3em] text-red-500">
                    {proyecto.estado}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-5">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {proyecto.titulo}
                    </h3>

                    <span className="text-xl text-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-500">
                      ↗
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/35">
                    {proyecto.descripcion}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {proyecto.tecnologias.map((tecnologia) => (
                      <span
                        key={tecnologia}
                        className="border border-white/10 px-3 py-1.5 font-mono text-[8px] tracking-wider text-white/30"
                      >
                        {tecnologia}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* LOGROS */}
      <section className="relative z-10 border-t border-white/10 bg-[#090a0c]">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                LOGROS
              </span>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Progreso conseguido
              </h2>
            </div>

            <button
              onClick={reiniciarProgreso}
              className="self-start border border-white/10 px-4 py-2 font-mono text-[8px] tracking-[0.2em] text-white/25 transition-colors hover:border-red-600/40 hover:text-red-500"
            >
              REINICIAR PROGRESO
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {LOGROS.map((logro, indice) => (
              <div
                key={logro.id}
                onMouseEnter={() =>
                  desbloquearLogro(indice + 1)
                }
                className="cursor-default"
              >
                <AchievementCard
                  icon={logro.id}
                  title={logro.titulo}
                  description={logro.descripcion}
                  unlocked={logrosDesbloqueados.includes(
                    indice + 1
                  )}
                  xp={logro.xp}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRÓXIMOS OBJETIVOS */}
      <section className="relative z-10 border-t border-white/10 px-6 py-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                PRÓXIMOS OBJETIVOS
              </span>

              <h2 className="mt-5 max-w-xl text-5xl font-black tracking-[-0.05em] md:text-7xl">
                SIEMPRE
                <br />
                <span className="text-white/20">
                  CONSTRUYENDO.
                </span>
              </h2>
            </div>

            <div className="grid gap-px border border-white/10 bg-white/10">
              {[
                'Profundizar en desarrollo Full Stack',
                'Construir proyectos más completos',
                'Mejorar arquitectura y bases de datos',
                'Continuar explorando nuevas tecnologías',
              ].map((objetivo, indice) => (
                <div
                  key={objetivo}
                  className="flex items-center gap-5 bg-[#0b0d10] p-5"
                >
                  <span className="font-mono text-[9px] text-red-500">
                    0{indice + 1}
                  </span>

                  <span className="text-sm text-white/55">
                    {objetivo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0b0d10]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,.12),transparent_50%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-32 text-center">
          <span className="font-mono text-[9px] tracking-[0.4em] text-red-500">
            FIN DEL RECORRIDO ACTUAL
          </span>

          <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-black tracking-[-0.06em] md:text-8xl">
            CONSTRUYAMOS
            <br />
            <span className="text-white/20">
              ALGO JUNTOS.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/35">
            ¿Tienes una idea, proyecto o simplemente quieres hablar
            de tecnología? Estoy abierto a nuevas oportunidades para
            aprender y construir.
          </p>

          <div className="mt-10 flex justify-center gap-3">
            <a
              href="mailto:santiago.aguirre66415@ucaldas.edu.co"
              className="border border-red-600 bg-red-600 px-7 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500"
            >
              ESCRIBIRME
            </a>

            <a
              href="https://github.com/santiagoaguirre66415"
              target="_blank"
              rel="noreferrer"
              className="border border-white/10 px-7 py-3 text-xs font-bold tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white"
            >
              GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[9px] tracking-[0.2em] text-white/20 md:flex-row">
          <span>SANTIAGO AGUIRRE</span>

          <span>DESARROLLADOR FULL STACK EN FORMACIÓN</span>

          <span>MANIZALES / COLOMBIA</span>
        </div>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #08090b;
        }

        ::selection {
          background: #dc2626;
          color: white;
        }

        .pantalla-proyecto {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #101216;
        }

        .barra-navegador {
          height: 34px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: #0b0d10;
        }

        .punto-navegador {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .direccion-navegador {
          margin-left: 8px;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.18);
        }

        .contenido-calma {
          height: calc(100% - 34px);
          display: flex;
        }

        .menu-calma {
          width: 18%;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 15px 10px;
        }

        .logo-calma {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(220, 38, 38, 0.5);
          color: #dc2626;
          font-size: 8px;
          font-weight: bold;
        }

        .menu-calma span {
          display: block;
          height: 3px;
          margin-top: 15px;
          background: rgba(255, 255, 255, 0.08);
        }

        .principal-calma {
          flex: 1;
          padding: 30px;
        }

        .etiqueta-mockup {
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.25em;
          color: rgba(220, 38, 38, 0.7);
        }

        .titulo-mockup {
          margin-top: 8px;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: rgba(255, 255, 255, 0.8);
        }

        .linea-mockup {
          height: 4px;
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.07);
        }

        .linea-mockup.grande {
          width: 80%;
        }

        .linea-mockup.mediana {
          width: 55%;
        }

        .tarjetas-mockup {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 25px;
        }

        .tarjetas-mockup div {
          height: 55px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.025);
        }

        .contenido-qr {
          height: calc(100% - 34px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8%;
          padding: 30px;
        }

        .contenedor-qr {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .codigo-qr {
          width: 115px;
          height: 115px;
          padding: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: white;
        }

        .codigo-qr i {
          display: block;
          background: #08090b;
        }

        .codigo-qr i:nth-child(2),
        .codigo-qr i:nth-child(4),
        .codigo-qr i:nth-child(8) {
          background: white;
        }

        .contenedor-qr small {
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.25);
        }

        .informacion-qr {
          max-width: 240px;
        }

        .fila-asistencia {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          font-family: monospace;
          font-size: 7px;
          color: rgba(255, 255, 255, 0.25);
        }

        .fila-asistencia b {
          color: rgba(220, 38, 38, 0.8);
        }

        .visual-portafolio {
          position: relative;
          height: calc(100% - 34px);
          padding: 35px;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(220, 38, 38, 0.18),
              transparent 35%
            ),
            #0b0d10;
        }

        .numero-portafolio {
          font-family: monospace;
          font-size: 9px;
          color: rgba(220, 38, 38, 0.8);
          letter-spacing: 0.2em;
        }

        .titulo-portafolio {
          margin-top: 18px;
          font-size: clamp(30px, 4vw, 55px);
          font-weight: 900;
          line-height: 0.82;
          letter-spacing: -0.07em;
        }

        .linea-portafolio {
          position: absolute;
          left: 35px;
          right: 35px;
          bottom: 50px;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .datos-portafolio {
          position: absolute;
          bottom: 25px;
          left: 35px;
          right: 35px;
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.25);
        }

        .visual-codigo {
          height: calc(100% - 34px);
          padding: 30px;
          font-family: monospace;
          font-size: 9px;
          line-height: 2;
          color: rgba(255, 255, 255, 0.35);
        }

        .visual-codigo span {
          display: inline-block;
          width: 28px;
          color: rgba(255, 255, 255, 0.12);
        }

        .visual-codigo b {
          color: rgba(220, 38, 38, 0.8);
        }

        @media (max-width: 640px) {
          .contenido-qr {
            gap: 15px;
            padding: 15px;
          }

          .codigo-qr {
            width: 80px;
            height: 80px;
            padding: 8px;
          }

          .titulo-mockup {
            font-size: 20px;
          }

          .principal-calma {
            padding: 20px;
          }

          .visual-codigo {
            font-size: 7px;
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}