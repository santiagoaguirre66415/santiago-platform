'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import RevealSection from '@/components/RevealSection';
import TimelineSection from '@/components/TimelineSection';
import AchievementCard from '@/components/AchievementCard';

const STORAGE_KEY = 'santiago-portfolio-progress-v6';

const NIVELES = [
  { nivel: 1, titulo: 'ORIGEN', subtitulo: 'El comienzo', xp: 20, recompensa: 'PRIMER PASO' },
  { nivel: 2, titulo: 'FORMACIÓN', subtitulo: 'Mis estudios', xp: 20, recompensa: 'BUSCADOR DE CONOCIMIENTO' },
  { nivel: 3, titulo: 'EXPERIENCIA', subtitulo: 'Experiencia práctica', xp: 20, recompensa: 'RESOLUTOR DE PROBLEMAS' },
  { nivel: 4, titulo: 'TECNOLOGÍAS', subtitulo: 'Mi conjunto de herramientas', xp: 20, recompensa: 'DESARROLLADOR FULL STACK' },
  { nivel: 5, titulo: 'PROYECTOS', subtitulo: 'Lo que he construido', xp: 20, recompensa: 'CONSTRUCTOR DE PROYECTOS' },
] as const;

const EXPERIENCIA = [
  {
    year: '2025 — ACTUAL',
    title: 'Ingeniería Informática',
    company: 'Formación universitaria',
    description: 'Formación enfocada en programación, desarrollo de software, estructuras de datos y creación de soluciones tecnológicas.',
  },
  {
    year: '2025 — ACTUAL',
    title: 'Análisis y Desarrollo de Software',
    company: 'Formación tecnológica',
    description: 'Formación orientada al desarrollo de aplicaciones, programación, bases de datos, desarrollo web y construcción de soluciones de software.',
  },
  {
    year: '2025 — 2026',
    title: 'Calma',
    company: 'Proyecto personal — Finalizado',
    description: 'Aplicación enfocada en acompañamiento y bienestar, desarrollada como proyecto tecnológico con una experiencia de interacción mediante chatbot.',
  },
  {
    year: '2025 — ACTUAL',
    title: 'Sistema de Asistencia QR',
    company: 'Proyecto académico — En desarrollo',
    description: 'Sistema de asistencia mediante códigos QR con validación por horario y distancia, registro de asistencias y control de información.',
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
    estado: '✅ PROYECTO FINALIZADO',
    colorEstado: 'text-emerald-400',
    descripcion: 'Aplicación enfocada en acompañamiento y bienestar con una experiencia de interacción mediante chatbot.',
    tecnologias: ['TypeScript', 'React', 'Next.js', 'Appwrite'],
    visual: 'calma',
    repo: null as string | null,
    demo: null as string | null,
  },
  {
    numero: '02',
    titulo: 'PORTAFOLIO PERSONAL',
    estado: '✅ PROYECTO ACTIVO',
    colorEstado: 'text-emerald-400',
    descripcion: 'Portafolio web con una experiencia interactiva que muestra mi formación, tecnologías, proyectos y evolución como desarrollador.',
    tecnologias: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Appwrite'],
    visual: 'portfolio',
    repo: 'https://github.com/santiagoaguirre66415/santiago-platform',
    demo: 'https://sanas07a.dev',
  },
  {
    numero: '03',
    titulo: 'SISTEMA DE ASISTENCIA QR',
    estado: '🚧 PROYECTO EN DESARROLLO',
    colorEstado: 'text-amber-400',
    descripcion: 'Sistema de asistencia mediante códigos QR con validación de horario y distancia para realizar registros de forma más precisa.',
    tecnologias: ['JavaScript', 'React', 'Node.js', 'SQL'],
    visual: 'qr',
    repo: null as string | null,
    demo: null as string | null,
  },
  {
    numero: '04',
    titulo: 'PROYECTOS DE FORMACIÓN',
    estado: '📚 PROCESO DE APRENDIZAJE',
    colorEstado: 'text-sky-400',
    descripcion: 'Conjunto de ejercicios y proyectos desarrollados durante mi proceso de formación en programación y desarrollo de software.',
    tecnologias: ['Python', 'Java', 'Flutter', 'SQL'],
    visual: 'codigo',
    repo: null as string | null,
    demo: null as string | null,
  },
];

const LOGROS = [
  { id: '01', titulo: 'PRIMER PASO', descripcion: 'Completaste el primer nivel de tu recorrido.', xp: 10 },
  { id: '02', titulo: 'BUSCADOR DE CONOCIMIENTO', descripcion: 'Tu proceso de formación comenzó a tomar forma.', xp: 20 },
  { id: '03', titulo: 'EXPLORADOR DEL CÓDIGO', descripcion: 'Exploraste diferentes lenguajes y tecnologías.', xp: 30 },
  { id: '04', titulo: 'RESOLUTOR DE PROBLEMAS', descripcion: 'Convertiste problemas académicos en soluciones funcionales.', xp: 30 },
  { id: '05', titulo: 'DESARROLLADOR FULL STACK', descripcion: 'Comenzaste a trabajar en diferentes áreas del desarrollo de software.', xp: 40 },
  { id: '06', titulo: 'CONSTRUCTOR DE PROYECTOS', descripcion: 'Construiste proyectos reales durante tu proceso de formación.', xp: 40 },
  { id: '07', titulo: 'RECORRIDO COMPLETADO', descripcion: 'Completaste todos los niveles principales del portafolio.', xp: 50 },
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
          <span className="direccion-navegador">sistema-asistencia</span>
        </div>
        <div className="contenido-qr">
          <div className="contenedor-qr">
            <div className="codigo-qr">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <small>ESCANEAR CÓDIGO</small>
          </div>
          <div className="informacion-qr">
            <div className="etiqueta-mockup">ASISTENCIA</div>
            <div className="titulo-mockup">Control de asistencia</div>
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
          <span className="direccion-navegador">sanas07a.dev</span>
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
        <span className="direccion-navegador">proyectos-formacion</span>
      </div>
      <div className="visual-codigo">
        <div><span>01</span><b>clase</b> Desarrollador</div>
        <div><span>02</span>&nbsp;&nbsp;tecnologias = [</div>
        <div><span>03</span>&nbsp;&nbsp;&nbsp;&nbsp;&quot;Java&quot;,</div>
        <div><span>04</span>&nbsp;&nbsp;&nbsp;&nbsp;&quot;Python&quot;,</div>
        <div><span>05</span>&nbsp;&nbsp;&nbsp;&nbsp;&quot;React&quot;,</div>
        <div><span>06</span>&nbsp;&nbsp;]</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [xp, setXp] = useState(0);
  const [nivelesDesbloqueados, setNivelesDesbloqueados] = useState<number[]>([1]);
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<number[]>([1, 2]);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (!guardado) return;
      const datos = JSON.parse(guardado);
      if (typeof datos.xp === 'number') setXp(datos.xp);
      if (Array.isArray(datos.nivelesDesbloqueados)) setNivelesDesbloqueados(datos.nivelesDesbloqueados);
      if (Array.isArray(datos.logrosDesbloqueados)) setLogrosDesbloqueados(datos.logrosDesbloqueados);
    } catch {
      console.warn('No se pudo recuperar el progreso.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ xp, nivelesDesbloqueados, logrosDesbloqueados })
    );
  }, [xp, nivelesDesbloqueados, logrosDesbloqueados]);

  const nivelActual = useMemo(() => {
    return Math.min(Math.max(Math.max(...nivelesDesbloqueados, 1), 1), NIVELES.length);
  }, [nivelesDesbloqueados]);

  const desbloquearNivel = useCallback((nivel: number) => {
    setNivelesDesbloqueados((anteriores) => {
      if (anteriores.includes(nivel)) return anteriores;
      const nivelAnterior = nivel - 1;
      if (nivelAnterior > 0 && !anteriores.includes(nivelAnterior)) return anteriores;
      return [...anteriores, nivel];
    });
    setXp((actual) => actual + NIVELES[nivel - 1].xp);
    setNotificacion(`NIVEL ${String(nivel).padStart(2, '0')} DESBLOQUEADO`);
    setTimeout(() => setNotificacion(null), 2500);
  }, []);

  const desbloquearLogro = useCallback((logro: number) => {
    setLogrosDesbloqueados((anteriores) => {
      if (anteriores.includes(logro)) return anteriores;
      const recompensa = LOGROS[logro - 1]?.xp ?? 0;
      setXp((actual) => actual + recompensa);
      setNotificacion(`LOGRO ${String(logro).padStart(2, '0')} DESBLOQUEADO`);
      setTimeout(() => setNotificacion(null), 2500);
      return [...anteriores, logro];
    });
  }, []);

  const reiniciarProgreso = () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres reiniciar tu progreso? Esta acción no se puede deshacer.'
    );

    if (!confirmar) return;

    setXp(0);
    setNivelesDesbloqueados([1]);
    setLogrosDesbloqueados([1, 2]);
    localStorage.removeItem(STORAGE_KEY);
    setNotificacion('PROGRESO REINICIADO');
    setTimeout(() => setNotificacion(null), 2500);
  };

  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="gamer-grid absolute inset-0" />
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute bottom-[15%] right-[-250px] h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[130px]" />
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
          <XPBar value={xp} level={nivelActual} label={`${xp} XP`} />
        </div>
      </div>

      {/* NOTIFICACIÓN */}
      {notificacion && (
        <div className="fixed right-6 top-24 z-[100] border border-red-500/30 bg-[#0d0f12]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-1 text-[9px] tracking-[0.3em] text-red-500">SISTEMA</div>
          <div className="text-sm font-semibold tracking-wider">{notificacion}</div>
        </div>
      )}

      {/* PORTADA */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pb-20 pt-24 sm:px-6 sm:pt-32 md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 sm:gap-16 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
              <div className="h-px w-8 bg-red-600 sm:w-10" />
              <span className="font-mono text-[8px] font-semibold tracking-[0.3em] text-red-500 sm:text-[10px] sm:tracking-[0.35em]">
                PORTAFOLIO / 2025 — ACTUAL
              </span>
            </div>

            <h1 className="max-w-5xl text-[clamp(2.5rem,14vw,9.5rem)] font-black leading-[0.85] tracking-[-0.05em] sm:leading-[0.8] sm:tracking-[-0.07em]">
              SANTIAGO
              <br />
              <span className="text-white/20">AGUIRRE</span>
            </h1>

            <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-5">
              <div className="border-l border-red-600 pl-3 sm:pl-4">
                <p className="text-xs font-semibold tracking-[0.15em] text-white sm:text-sm sm:tracking-[0.18em]">
                  DESARROLLADOR FULL STACK
                </p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-white/35 sm:text-xs sm:tracking-[0.2em]">
                  EN FORMACIÓN
                </p>
              </div>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <p className="max-w-md text-xs leading-6 text-white/45 sm:text-sm">
                Construyo interfaces, exploro nuevas tecnologías
                y convierto ideas en proyectos funcionales.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap">
              <a
                href="#nivel-5"
                className="group flex items-center justify-center gap-3 border border-red-600 bg-red-600 px-5 py-3 text-[10px] font-bold tracking-[0.15em] transition-all hover:bg-red-500 sm:px-6 sm:text-xs sm:tracking-[0.18em]"
              >
                VER PROYECTOS
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="https://www.linkedin.com/in/tu-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 px-5 py-3 text-center text-[10px] font-bold tracking-[0.15em] text-white/70 transition-all hover:border-white/30 hover:text-white sm:px-6 sm:text-xs sm:tracking-[0.18em]"
              >
                LINKEDIN
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 px-5 py-3 text-center text-[10px] font-bold tracking-[0.15em] text-white/70 transition-all hover:border-white/30 hover:text-white sm:px-6 sm:text-xs sm:tracking-[0.18em]"
              >
                CV
              </a>
              <a
                href="mailto:santiago.aguirre66415@ucaldas.edu.co"
                className="border border-white/10 px-5 py-3 text-center text-[10px] font-bold tracking-[0.15em] text-white/70 transition-all hover:border-white/30 hover:text-white sm:px-6 sm:text-xs sm:tracking-[0.18em]"
              >
                CONTACTO
              </a>
            </div>
          </div>

          {/* ELEMENTO VISUAL DESKTOP */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square border border-white/10 bg-[#0c0e11]/70 p-8">
              <div className="absolute left-0 top-0 h-16 w-px bg-red-600" />
              <div className="absolute left-0 top-0 h-px w-16 bg-red-600" />
              <div className="absolute bottom-0 right-0 h-16 w-px bg-red-600" />
              <div className="absolute bottom-0 right-0 h-px w-16 bg-red-600" />
              <div className="absolute inset-12 border border-white/[0.06]" />
              <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/10">
                <div className="absolute inset-3 border border-red-600/30" />
                <span className="text-7xl font-black tracking-[-0.08em] text-white/90">SA</span>
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
              <span className="block text-[9px] tracking-[0.25em] text-white/30">ESTADO ACTUAL</span>
              <span className="mt-1 block text-xs font-semibold tracking-widest text-red-500">CONSTRUYENDO</span>
            </div>
          </div>

          {/* VISTA MOBILE */}
          <div className="flex justify-center lg:hidden">
            <div className="relative aspect-square w-40 border border-white/10 bg-[#0c0e11]/70 p-4 sm:w-56 sm:p-6">
              <div className="absolute left-0 top-0 h-8 w-px bg-red-600" />
              <div className="absolute left-0 top-0 h-px w-8 bg-red-600" />
              <div className="absolute bottom-0 right-0 h-8 w-px bg-red-600" />
              <div className="absolute bottom-0 right-0 h-px w-8 bg-red-600" />
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-black tracking-[-0.08em] text-white/90 sm:text-6xl">SA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="font-mono text-[8px] tracking-[0.4em] text-white/25">DESPLÁZATE PARA EXPLORAR</span>
          <div className="h-12 w-px bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </section>

      {/* MAPA DE NIVELES */}
      <section className="relative z-10 border-y border-white/10 bg-[#0a0c0f]/80 px-4 py-10 backdrop-blur-xl sm:px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">NAVEGACIÓN</span>
              <h2 className="mt-2 text-xl font-bold tracking-tight">MI RECORRIDO</h2>
            </div>
            <span className="font-mono text-[10px] text-white/25">
              {String(nivelActual).padStart(2, '0')} / 05
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {NIVELES.map((nivel) => {
              const desbloqueado = nivelesDesbloqueados.includes(nivel.nivel);
              const activo = nivelActual === nivel.nivel;
              return (
                <div
                  key={nivel.nivel}
                  className={`group relative border p-3 transition-all sm:p-4 ${
                    activo
                      ? 'border-red-600/60 bg-white/[0.025]'
                      : desbloqueado
                      ? 'border-white/10 bg-white/[0.025]'
                      : 'border-white/[0.05] bg-black/20 opacity-40'
                  }`}
                >
                  {activo && <div className="absolute left-0 top-0 h-px w-full bg-red-600" />}
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-base font-bold sm:text-lg ${activo ? 'text-red-500' : 'text-white/40'}`}>
                      0{nivel.nivel}
                    </span>
                    <span className="text-[8px] tracking-widest text-white/20 sm:text-[9px]">
                      {desbloqueado ? 'ABIERTO' : 'BLOQ.'}
                    </span>
                  </div>
                  <div className="mt-4 text-[9px] font-bold tracking-[0.15em] text-white/70 sm:mt-5 sm:text-[10px]">
                    {nivel.titulo}
                  </div>
                  <div className="mt-1 text-[8px] text-white/25 sm:text-[9px]">
                    {nivel.subtitulo}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NIVEL 01 */}
      <RevealSection id="nivel-1" className="relative z-10" onUnlock={() => desbloquearNivel(1)}>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="font-mono text-5xl font-black tracking-[-0.08em] text-white/20 sm:text-6xl md:text-7xl">01</div>
              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">ORIGEN</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">El comienzo</h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-xl font-medium leading-relaxed text-white/85 sm:text-2xl md:text-4xl md:leading-tight">
                Soy Santiago Aguirre, desarrollador Full Stack en formación desde Manizales, Colombia.
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:mt-8 sm:text-base sm:leading-8">
                Actualmente estoy construyendo mi camino en el desarrollo de software mediante formación académica, proyectos personales y experimentación constante con nuevas tecnologías.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:mt-12 sm:grid-cols-4">
                {[
                  ['2025', 'INICIO'],
                  ['CO', 'UBICACIÓN'],
                  ['01', 'PERFIL'],
                  ['∞', 'APRENDIZAJE'],
                ].map(([valor, etiqueta]) => (
                  <div key={etiqueta} className="bg-[#0b0d10] p-4 sm:p-5">
                    <div className="text-lg font-bold sm:text-xl">{valor}</div>
                    <div className="mt-1 text-[8px] tracking-[0.25em] text-white/25">{etiqueta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 02 */}
      <RevealSection id="nivel-2" className="relative z-10 border-t border-white/10" onUnlock={() => desbloquearNivel(2)}>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="font-mono text-5xl font-black tracking-[-0.08em] text-white/20 sm:text-6xl md:text-7xl">02</div>
              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">FORMACIÓN</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Mis estudios</h2>
            </div>
            <div>
              <TimelineSection items={EXPERIENCIA.slice(0, 2)} />
              <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-7">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">UNIVERSIDAD</span>
                  <h3 className="mt-4 text-lg font-bold sm:mt-5 sm:text-xl">Ingeniería Informática</h3>
                  <p className="mt-3 text-sm leading-6 text-white/35">Formación universitaria iniciada en 2025.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-7">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">DESARROLLO</span>
                  <h3 className="mt-4 text-lg font-bold sm:mt-5 sm:text-xl">Análisis y Desarrollo de Software</h3>
                  <p className="mt-3 text-sm leading-6 text-white/35">Formación orientada al desarrollo de software.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 03 */}
      <RevealSection id="nivel-3" className="relative z-10 border-t border-white/10" onUnlock={() => desbloquearNivel(3)}>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="font-mono text-5xl font-black tracking-[-0.08em] text-white/20 sm:text-6xl md:text-7xl">03</div>
              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">EXPERIENCIA</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Experiencia práctica</h2>
            </div>
            <div>
              <div className="mb-8 border border-red-600/20 bg-red-600/[0.03] p-5 sm:mb-10 sm:p-6">
                <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">ETAPA ACTUAL</span>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  Actualmente no cuento con experiencia laboral profesional. Mi experiencia se ha desarrollado principalmente mediante formación académica, proyectos personales y proyectos de desarrollo.
                </p>
              </div>
              <TimelineSection items={EXPERIENCIA.slice(2)} />
            </div>
          </div>
        </section>
      </RevealSection>

      {/* NIVEL 04 */}
      <RevealSection id="nivel-4" className="relative z-10 border-t border-white/10" onUnlock={() => desbloquearNivel(4)}>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="font-mono text-5xl font-black tracking-[-0.08em] text-white/20 sm:text-6xl md:text-7xl">04</div>
              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">TECNOLOGÍAS</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Mi conjunto de herramientas</h2>
              <p className="mt-4 text-sm leading-7 text-white/30 sm:mt-6">
                Tecnologías que forman parte de mi proceso de aprendizaje y desarrollo.
              </p>
            </div>
            <div className="space-y-8 sm:space-y-12">
              {TECNOLOGIAS.map((grupo) => (
                <div key={grupo.categoria}>
                  <div className="mb-4 flex items-center gap-4 sm:mb-5">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-red-500 sm:text-[10px]">{grupo.categoria}</span>
                    <div className="h-px flex-1 bg-red-600/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {grupo.elementos.map((tecnologia) => (
                      <div
                        key={tecnologia.nombre}
                        className="group flex items-center gap-3 border border-white/10 bg-white/[0.02] p-3 transition-all hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.04] sm:gap-4 sm:p-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-[#101216] font-mono text-[8px] font-bold text-white/60 transition-colors group-hover:border-red-600/40 group-hover:text-red-500 sm:h-10 sm:w-10 sm:text-[9px]">
                          {tecnologia.codigo}
                        </div>
                        <span className="truncate text-[11px] font-medium text-white/65 sm:text-xs">{tecnologia.nombre}</span>
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
      <RevealSection id="nivel-5" className="relative z-10 border-t border-white/10" onUnlock={() => desbloquearNivel(5)}>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mb-12 sm:mb-16">
            <div className="font-mono text-5xl font-black tracking-[-0.08em] text-white/20 sm:text-6xl md:text-7xl">05</div>
            <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">PROYECTOS DESTACADOS</div>
            <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end md:gap-5">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Lo que he construido</h2>
              <p className="max-w-md text-sm leading-6 text-white/30">
                Una selección de proyectos desarrollados durante mi proceso de formación.
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
                  <div className="absolute left-4 top-4 border border-white/10 bg-[#08090b]/80 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-white/40 backdrop-blur sm:left-5 sm:top-5">
                    {proyecto.numero}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className={`font-mono text-[8px] tracking-[0.3em] ${proyecto.colorEstado}`}>{proyecto.estado}</div>
                  <div className="mt-3 flex items-start justify-between gap-5">
                    <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{proyecto.titulo}</h3>
                    <span className="text-xl text-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-500">↗</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/35">{proyecto.descripcion}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {proyecto.tecnologias.map((tecnologia) => (
                      <span key={tecnologia} className="border border-white/10 px-3 py-1.5 font-mono text-[8px] tracking-wider text-white/30">
                        {tecnologia}
                      </span>
                    ))}
                  </div>

                  {/* LINKS DEL PROYECTO */}
                  {(proyecto.repo || proyecto.demo) && (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                      {proyecto.demo && (
                        <a
                          href={proyecto.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-2 border border-red-600/40 bg-red-600/10 px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-red-300 transition hover:bg-red-600/20"
                        >
                          DEMO
                          <span className="transition-transform group-hover/link:translate-x-1">→</span>
                        </a>
                      )}
                      {proyecto.repo && (
                        <a
                          href={proyecto.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-2 border border-white/15 bg-white/[0.02] px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          CÓDIGO
                          <span className="transition-transform group-hover/link:translate-x-1">→</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* LOGROS */}
      <section className="relative z-10 border-t border-white/10 bg-[#090a0c]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">LOGROS</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Progreso conseguido</h2>
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
              <div key={logro.id} onMouseEnter={() => desbloquearLogro(indice + 1)} className="cursor-default">
                <AchievementCard
                  icon={logro.id}
                  title={logro.titulo}
                  description={logro.descripcion}
                  unlocked={logrosDesbloqueados.includes(indice + 1)}
                  xp={logro.xp}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRÓXIMOS OBJETIVOS */}
      <section className="relative z-10 border-t border-white/10 px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">PRÓXIMOS OBJETIVOS</span>
              <h2 className="mt-5 max-w-xl text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-7xl">
                SIEMPRE
                <br />
                <span className="text-white/20">CONSTRUYENDO.</span>
              </h2>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10">
              {[
                'Profundizar en desarrollo Full Stack',
                'Construir proyectos más completos',
                'Mejorar arquitectura y bases de datos',
                'Continuar explorando nuevas tecnologías',
              ].map((objetivo, indice) => (
                <div key={objetivo} className="flex items-center gap-5 bg-[#0b0d10] p-4 sm:p-5">
                  <span className="font-mono text-[9px] text-red-500">0{indice + 1}</span>
                  <span className="text-sm text-white/55">{objetivo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0b0d10]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 md:py-32">
          <span className="font-mono text-[9px] tracking-[0.4em] text-red-500">FIN DEL RECORRIDO ACTUAL</span>
          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-[-0.06em] sm:mt-7 sm:text-5xl md:text-8xl">
            CONSTRUYAMOS
            <br />
            <span className="text-white/20">ALGO JUNTOS.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/35 sm:mt-8">
            ¿Tienes una idea, proyecto o simplemente quieres hablar de tecnología? Estoy abierto a nuevas oportunidades para aprender y construir.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:santiago.aguirre66415@ucaldas.edu.co"
              className="w-full border border-red-600 bg-red-600 px-7 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500 sm:w-auto"
            >
              ESCRIBIRME
            </a>
            <a
              href="https://github.com/santiagoaguirre66415"
              target="_blank"
              rel="noreferrer"
              className="w-full border border-white/10 px-7 py-3 text-xs font-bold tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white sm:w-auto"
            >
              GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/tu-linkedin"
              target="_blank"
              rel="noreferrer"
              className="w-full border border-white/10 px-7 py-3 text-xs font-bold tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white sm:w-auto"
            >
              LINKEDIN
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full border border-white/10 px-7 py-3 text-xs font-bold tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white sm:w-auto"
            >
              CV
            </a>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-8 sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-[9px] tracking-[0.2em] text-white/20 md:flex-row md:gap-4">
          <span>SANTIAGO AGUIRRE</span>
          <span>DESARROLLADOR FULL STACK EN FORMACIÓN</span>
          <span>MANIZALES / COLOMBIA</span>
        </div>
      </footer>
    </main>
  );
}