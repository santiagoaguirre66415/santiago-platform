'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import LevelBadge from '@/components/LevelBadge';
import RevealSection from '@/components/RevealSection';
import TimelineSection from '@/components/TimelineSection';
import AchievementCard from '@/components/AchievementCard';

const STORAGE_KEY = 'santiago-portfolio-progress-v5';

const LEVELS = [
  {
    level: 1,
    title: 'ORIGIN',
    subtitle: 'El comienzo',
    xpReward: 20,
    reward: 'FIRST STEP',
  },
  {
    level: 2,
    title: 'EDUCATION',
    subtitle: 'La formación',
    xpReward: 20,
    reward: 'KNOWLEDGE SEEKER',
  },
  {
    level: 3,
    title: 'EXPERIENCE',
    subtitle: 'Experiencia práctica',
    xpReward: 20,
    reward: 'PROBLEM SOLVER',
  },
  {
    level: 4,
    title: 'STACK',
    subtitle: 'Tecnologías',
    xpReward: 20,
    reward: 'FULL STACK MODE',
  },
  {
    level: 5,
    title: 'PROJECTS',
    subtitle: 'Proyectos',
    xpReward: 20,
    reward: 'PROJECT BUILDER',
  },
] as const;

const EXPERIENCE = [
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
      'Desarrollo de aplicaciones y fortalecimiento de conocimientos en programación, bases de datos, desarrollo web y metodologías de software.',
  },
  {
    year: '2025 — 2026',
    title: 'Calma',
    company: 'Proyecto personal — Finalizado',
    description:
      'Aplicación enfocada en acompañamiento y bienestar, desarrollada como proyecto tecnológico con una experiencia de interacción basada en chatbot.',
  },
  {
    year: '2025 — ACTUAL',
    title: 'Sistema de Asistencia QR',
    company: 'Proyecto académico — En desarrollo',
    description:
      'Sistema de asistencia mediante códigos QR con validación por horario y distancia, registro de asistencias y control de información.',
  },
];

const TECHNOLOGIES = [
  {
    category: 'FRONTEND',
    items: [
      { name: 'HTML5', code: 'HTML' },
      { name: 'CSS3', code: 'CSS' },
      { name: 'JavaScript', code: 'JS' },
      { name: 'TypeScript', code: 'TS' },
      { name: 'React', code: 'RE' },
      { name: 'Next.js', code: 'NX' },
      { name: 'Tailwind CSS', code: 'TW' },
    ],
  },
  {
    category: 'BACKEND',
    items: [
      { name: 'Java', code: 'JV' },
      { name: 'Python', code: 'PY' },
      { name: 'Node.js', code: 'ND' },
      { name: 'PHP', code: 'PHP' },
    ],
  },
  {
    category: 'MOBILE',
    items: [
      { name: 'Flutter', code: 'FL' },
      { name: 'Dart', code: 'DT' },
    ],
  },
  {
    category: 'DATABASE',
    items: [
      { name: 'MySQL', code: 'MY' },
      { name: 'PostgreSQL', code: 'PG' },
      { name: 'MongoDB', code: 'MG' },
      { name: 'SQL', code: 'SQL' },
    ],
  },
  {
    category: 'SERVICES & TOOLS',
    items: [
      { name: 'Appwrite', code: 'AW' },
      { name: 'Firebase', code: 'FB' },
      { name: 'Docker', code: 'DK' },
      { name: 'Git', code: 'GT' },
    ],
  },
];

const PROJECTS = [
  {
    number: '01',
    title: 'CALMA',
    type: 'PROYECTO FINALIZADO',
    description:
      'Aplicación enfocada en acompañamiento y bienestar con una experiencia de interacción mediante chatbot.',
    stack: ['TypeScript', 'React', 'Next.js', 'Appwrite'],
    visual: 'calma',
  },
  {
    number: '02',
    title: 'QR ATTENDANCE',
    type: 'PROYECTO EN DESARROLLO',
    description:
      'Sistema de asistencia mediante QR con validación de horario y distancia para controlar registros de forma más precisa.',
    stack: ['JavaScript', 'React', 'Node.js', 'SQL'],
    visual: 'qr',
  },
  {
    number: '03',
    title: 'SANTIAGO.DEV',
    type: 'PORTFOLIO PERSONAL',
    description:
      'Portafolio web gamificado diseñado para mostrar mi evolución, tecnologías y proyectos.',
    stack: ['TypeScript', 'Next.js', 'Tailwind', 'Appwrite'],
    visual: 'portfolio',
  },
  {
    number: '04',
    title: 'CODE LAB',
    type: 'FORMACIÓN',
    description:
      'Conjunto de ejercicios y proyectos desarrollados durante mi proceso de formación en programación.',
    stack: ['Python', 'Java', 'Flutter', 'SQL'],
    visual: 'code',
  },
];

const ACHIEVEMENTS = [
  {
    id: '01',
    title: 'FIRST STEP',
    description: 'Completaste el primer nivel de tu recorrido.',
    xp: 10,
  },
  {
    id: '02',
    title: 'KNOWLEDGE SEEKER',
    description: 'Tu formación comenzó a tomar forma.',
    xp: 20,
  },
  {
    id: '03',
    title: 'CODE EXPLORER',
    description: 'Exploraste diferentes lenguajes y tecnologías.',
    xp: 30,
  },
  {
    id: '04',
    title: 'PROBLEM SOLVER',
    description: 'Convertiste problemas académicos en soluciones funcionales.',
    xp: 30,
  },
  {
    id: '05',
    title: 'FULL STACK MODE',
    description: 'Comenzaste a trabajar en diferentes capas del desarrollo.',
    xp: 40,
  },
  {
    id: '06',
    title: 'PROJECT BUILDER',
    description: 'Construiste proyectos reales durante tu formación.',
    xp: 40,
  },
  {
    id: '07',
    title: 'BOSS CLEARED',
    description: 'Completaste el recorrido principal del portfolio.',
    xp: 50,
  },
];

function ProjectVisual({ type }: { type: string }) {
  if (type === 'calma') {
    return (
      <div className="project-screen">
        <div className="mock-top">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-url">calma.app</span>
        </div>

        <div className="mock-content calma-visual">
          <div className="mock-sidebar">
            <div className="mock-logo">C</div>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="mock-main">
            <div className="mock-label">WELCOME BACK</div>
            <div className="mock-title">Calma</div>
            <div className="mock-line long" />
            <div className="mock-line medium" />

            <div className="mock-cards">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'qr') {
    return (
      <div className="project-screen">
        <div className="mock-top">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-url">attendance.system</span>
        </div>

        <div className="mock-content qr-visual">
          <div className="qr-box">
            <div className="qr-pattern">
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
            <small>SCAN QR</small>
          </div>

          <div className="qr-info">
            <div className="mock-label">ATTENDANCE</div>
            <div className="mock-title">Control de asistencia</div>

            <div className="attendance-row">
              <span>Horario</span>
              <b>08:00 — 10:00</b>
            </div>

            <div className="attendance-row">
              <span>Distancia</span>
              <b>VALIDATED</b>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'portfolio') {
    return (
      <div className="project-screen">
        <div className="mock-top">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-url">sanas07a.dev</span>
        </div>

        <div className="portfolio-visual">
          <div className="portfolio-number">05</div>
          <div className="portfolio-title">
            SANTIAGO
            <br />
            AGUIRRE
          </div>

          <div className="portfolio-line" />

          <div className="portfolio-stats">
            <span>FULL STACK</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-screen">
      <div className="mock-top">
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-url">code.lab</span>
      </div>

      <div className="code-visual">
        <div className="code-line">
          <span>01</span>
          <b>class</b> Developer
        </div>
        <div className="code-line">
          <span>02</span>
          &nbsp;&nbsp;skills = [
        </div>
        <div className="code-line">
          <span>03</span>
          &nbsp;&nbsp;&nbsp;&nbsp;"Java",
        </div>
        <div className="code-line">
          <span>04</span>
          &nbsp;&nbsp;&nbsp;&nbsp;"Python",
        </div>
        <div className="code-line">
          <span>05</span>
          &nbsp;&nbsp;&nbsp;&nbsp;"React",
        </div>
        <div className="code-line">
          <span>06</span>
          &nbsp;&nbsp;]
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [xp, setXp] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      const data = JSON.parse(saved);

      if (typeof data.xp === 'number') {
        setXp(data.xp);
      }

      if (Array.isArray(data.unlockedLevels)) {
        setUnlockedLevels(data.unlockedLevels);
      }

      if (Array.isArray(data.unlockedAchievements)) {
        setUnlockedAchievements(data.unlockedAchievements);
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
        unlockedLevels,
        unlockedAchievements,
      })
    );
  }, [xp, unlockedLevels, unlockedAchievements]);

  const currentLevel = useMemo(() => {
    return Math.min(
      Math.max(Math.max(...unlockedLevels, 1), 1),
      LEVELS.length
    );
  }, [unlockedLevels]);

  const unlockLevel = useCallback((level: number) => {
    setUnlockedLevels((previous) => {
      if (previous.includes(level)) return previous;

      const previousLevel = level - 1;

      if (previousLevel > 0 && !previous.includes(previousLevel)) {
        return previous;
      }

      return [...previous, level];
    });

    setXp((previous) => previous + LEVELS[level - 1].xpReward);

    setToast(`LEVEL ${level} UNLOCKED`);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const unlockAchievement = useCallback((achievement: number) => {
    setUnlockedAchievements((previous) => {
      if (previous.includes(achievement)) return previous;

      const reward = ACHIEVEMENTS[achievement - 1]?.xp ?? 0;

      setXp((current) => current + reward);

      setToast(`ACHIEVEMENT ${String(achievement).padStart(2, '0')}`);

      setTimeout(() => {
        setToast(null);
      }, 2500);

      return [...previous, achievement];
    });
  }, []);

  const resetProgress = () => {
    setXp(0);
    setUnlockedLevels([1]);
    setUnlockedAchievements([]);
    localStorage.removeItem(STORAGE_KEY);
    setToast('PROGRESS RESET');
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      {/* GLOBAL BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

        <div className="absolute bottom-[15%] right-[-250px] h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[130px]" />
      </div>

      <Navbar />

      {/* HUD */}
      <div className="fixed bottom-6 left-6 z-50 hidden w-[250px] md:block">
        <div className="border border-white/10 bg-[#0b0d10]/90 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-white/40">
              SYSTEM PROGRESS
            </span>

            <span className="font-mono text-xs text-red-500">
              LVL {String(currentLevel).padStart(2, '0')}
            </span>
          </div>

          <XPBar
            value={xp}
            level={currentLevel}
            label={`${xp} XP`}
          />
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed right-6 top-24 z-[100] border border-red-500/30 bg-[#0d0f12]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-1 text-[9px] tracking-[0.3em] text-red-500">
            SYSTEM
          </div>

          <div className="text-sm font-semibold tracking-wider">
            {toast}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen items-center px-6 pb-20 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-10 bg-red-600" />

              <span className="font-mono text-[10px] font-semibold tracking-[0.35em] text-red-500">
                PORTFOLIO / 2026
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
                  FULL STACK DEVELOPER
                </p>

                <p className="mt-1 text-xs tracking-[0.2em] text-white/35">
                  IN TRAINING
                </p>
              </div>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <p className="max-w-md text-sm leading-6 text-white/45">
                Construyo interfaces, exploro nuevas tecnologías y convierto
                ideas en proyectos funcionales.
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

          {/* HERO VISUAL */}
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
                MANIZALES / CO
              </div>

              <div className="absolute bottom-8 right-8 font-mono text-[9px] tracking-[0.25em] text-white/25">
                05 / 05
              </div>

              <div className="absolute left-1/2 top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,.8)]" />
            </div>

            <div className="absolute -bottom-5 -left-5 border border-white/10 bg-[#0b0d10] px-5 py-4">
              <span className="block text-[9px] tracking-[0.25em] text-white/30">
                CURRENT STATUS
              </span>

              <span className="mt-1 block text-xs font-semibold tracking-widest text-red-500">
                BUILDING
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="font-mono text-[8px] tracking-[0.4em] text-white/25">
            SCROLL TO EXPLORE
          </span>

          <div className="h-12 w-px bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </section>

      {/* LEVEL MAP */}
      <section className="relative z-10 border-y border-white/10 bg-[#0a0c0f]/80 px-6 py-10 backdrop-blur-xl md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                NAVIGATION
              </span>

              <h2 className="mt-2 text-xl font-bold tracking-tight">
                THE JOURNEY
              </h2>
            </div>

            <span className="font-mono text-[10px] text-white/25">
              {String(currentLevel).padStart(2, '0')} / 05
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {LEVELS.map((level) => {
              const unlocked = unlockedLevels.includes(level.level);
              const active = currentLevel === level.level;

              return (
                <div
                  key={level.level}
                  className={`group relative border p-4 transition-all ${
                    unlocked
                      ? 'border-white/10 bg-white/[0.025]'
                      : 'border-white/[0.05] bg-black/20 opacity-40'
                  } ${active ? 'border-red-600/60' : ''}`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 h-px w-full bg-red-600" />
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-lg font-bold ${
                        active ? 'text-red-500' : 'text-white/40'
                      }`}
                    >
                      0{level.level}
                    </span>

                    <span className="text-[9px] tracking-widest text-white/20">
                      {unlocked ? 'OPEN' : 'LOCKED'}
                    </span>
                  </div>

                  <div className="mt-5 text-[10px] font-bold tracking-[0.15em] text-white/70">
                    {level.title}
                  </div>

                  <div className="mt-1 text-[9px] text-white/25">
                    {level.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEVEL 01 */}
      <RevealSection
        id="nivel-1"
        className="relative z-10"
        onUnlock={() => unlockLevel(1)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                01
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                ORIGIN
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                El comienzo
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-2xl font-medium leading-relaxed text-white/85 md:text-4xl md:leading-tight">
                Soy Santiago Aguirre, desarrollador Full Stack en formación
                desde Manizales, Colombia.
              </p>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/40">
                Actualmente estoy construyendo mi camino en el desarrollo de
                software mediante formación académica, proyectos personales y
                experimentación constante con nuevas tecnologías.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
                {[
                  ['2025', 'START'],
                  ['CO', 'LOCATION'],
                  ['01', 'PROFILE'],
                  ['∞', 'LEARNING'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="bg-[#0b0d10] p-5"
                  >
                    <div className="text-xl font-bold">{value}</div>
                    <div className="mt-1 text-[8px] tracking-[0.25em] text-white/25">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* LEVEL 02 */}
      <RevealSection
        id="nivel-2"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => unlockLevel(2)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                02
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                EDUCATION
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                La formación
              </h2>
            </div>

            <div>
              <TimelineSection items={EXPERIENCE.slice(0, 2)} />

              <div className="mt-16 grid gap-4 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.02] p-7">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                    UNIVERSITY
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
                    SOFTWARE
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    Análisis y Desarrollo
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

      {/* LEVEL 03 */}
      <RevealSection
        id="nivel-3"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => unlockLevel(3)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                03
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                EXPERIENCE
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Experiencia práctica
              </h2>
            </div>

            <div>
              <div className="mb-10 border border-red-600/20 bg-red-600/[0.03] p-6">
                <span className="font-mono text-[9px] tracking-[0.3em] text-red-500">
                  CURRENT STAGE
                </span>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  Actualmente no cuento con experiencia laboral profesional.
                  Mi experiencia se ha desarrollado principalmente mediante
                  formación académica, proyectos personales y proyectos de
                  desarrollo.
                </p>
              </div>

              <TimelineSection items={EXPERIENCE.slice(2)} />
            </div>
          </div>
        </section>
      </RevealSection>

      {/* LEVEL 04 */}
      <RevealSection
        id="nivel-4"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => unlockLevel(4)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
            <div>
              <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
                04
              </div>

              <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
                STACK
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Tecnologías
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/30">
                Tecnologías que forman parte de mi proceso de aprendizaje y
                desarrollo.
              </p>
            </div>

            <div className="space-y-12">
              {TECHNOLOGIES.map((group) => (
                <div key={group.category}>
                  <div className="mb-5 flex items-center gap-4">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-white/25">
                      {group.category}
                    </span>

                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {group.items.map((technology) => (
                      <div
                        key={technology.name}
                        className="group flex items-center gap-4 border border-white/10 bg-white/[0.02] p-4 transition-all hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#101216] font-mono text-[9px] font-bold text-white/60 transition-colors group-hover:border-red-600/40 group-hover:text-red-500">
                          {technology.code}
                        </div>

                        <span className="text-xs font-medium text-white/65">
                          {technology.name}
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

      {/* LEVEL 05 */}
      <RevealSection
        id="nivel-5"
        className="relative z-10 border-t border-white/10"
        onUnlock={() => unlockLevel(5)}
      >
        <section className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="mb-16">
            <div className="font-mono text-7xl font-black tracking-[-0.08em] text-white/[0.06]">
              05
            </div>

            <div className="mt-4 font-mono text-[9px] tracking-[0.35em] text-red-500">
              SELECTED WORK
            </div>

            <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="text-4xl font-bold tracking-tight">
                Proyectos
              </h2>

              <p className="max-w-md text-sm leading-6 text-white/30">
                Una selección de proyectos desarrollados durante mi proceso
                de formación.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PROJECTS.map((project) => (
              <article
                key={project.number}
                className="group overflow-hidden border border-white/10 bg-[#0b0d10] transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative overflow-hidden border-b border-white/10">
                  <ProjectVisual type={project.visual} />

                  <div className="absolute left-5 top-5 border border-white/10 bg-[#08090b]/80 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-white/40 backdrop-blur">
                    {project.number}
                  </div>
                </div>

                <div className="p-7">
                  <div className="font-mono text-[8px] tracking-[0.3em] text-red-500">
                    {project.type}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-5">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {project.title}
                    </h3>

                    <span className="text-xl text-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-500">
                      ↗
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/35">
                    {project.description}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="border border-white/10 px-3 py-1.5 font-mono text-[8px] tracking-wider text-white/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ACHIEVEMENTS */}
      <section className="relative z-10 border-t border-white/10 bg-[#090a0c]">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                ACHIEVEMENTS
              </span>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Milestones
              </h2>
            </div>

            <button
              onClick={resetProgress}
              className="self-start border border-white/10 px-4 py-2 font-mono text-[8px] tracking-[0.2em] text-white/25 transition-colors hover:border-red-600/40 hover:text-red-500"
            >
              RESET PROGRESS
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((achievement, index) => (
              <div
                key={achievement.id}
                onMouseEnter={() => unlockAchievement(index + 1)}
                className="cursor-default"
              >
                <AchievementCard
                  icon={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  unlocked={unlockedAchievements.includes(index + 1)}
                  xp={achievement.xp}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT */}
      <section className="relative z-10 border-t border-white/10 px-6 py-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                NEXT OBJECTIVES
              </span>

              <h2 className="mt-5 max-w-xl text-5xl font-black tracking-[-0.05em] md:text-7xl">
                ALWAYS
                <br />
                <span className="text-white/20">BUILDING.</span>
              </h2>
            </div>

            <div className="grid gap-px border border-white/10 bg-white/10">
              {[
                'Profundizar en desarrollo Full Stack',
                'Construir proyectos más completos',
                'Mejorar arquitectura y bases de datos',
                'Continuar explorando nuevas tecnologías',
              ].map((goal, index) => (
                <div
                  key={goal}
                  className="flex items-center gap-5 bg-[#0b0d10] p-5"
                >
                  <span className="font-mono text-[9px] text-red-500">
                    0{index + 1}
                  </span>

                  <span className="text-sm text-white/55">
                    {goal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0b0d10]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,.12),transparent_50%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-32 text-center">
          <span className="font-mono text-[9px] tracking-[0.4em] text-red-500">
            END OF CURRENT RUN
          </span>

          <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-black tracking-[-0.06em] md:text-8xl">
            LET&apos;S BUILD
            <br />
            <span className="text-white/20">SOMETHING.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/35">
            ¿Tienes una idea, proyecto o simplemente quieres hablar de
            tecnología? Estoy abierto a nuevas oportunidades para aprender y
            construir.
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

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[9px] tracking-[0.2em] text-white/20 md:flex-row">
          <span>SANTIAGO AGUIRRE</span>

          <span>FULL STACK DEVELOPER IN TRAINING</span>

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

        .project-screen {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #101216;
        }

        .mock-top {
          height: 34px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: #0b0d10;
        }

        .mock-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .mock-url {
          margin-left: 8px;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.18);
        }

        .mock-content {
          height: calc(100% - 34px);
          display: flex;
        }

        .mock-sidebar {
          width: 18%;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 15px 10px;
        }

        .mock-logo {
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

        .mock-sidebar span {
          display: block;
          height: 3px;
          margin-top: 15px;
          background: rgba(255, 255, 255, 0.08);
        }

        .mock-main {
          flex: 1;
          padding: 30px;
        }

        .mock-label {
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.25em;
          color: rgba(220, 38, 38, 0.7);
        }

        .mock-title {
          margin-top: 8px;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: rgba(255, 255, 255, 0.8);
        }

        .mock-line {
          height: 4px;
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.07);
        }

        .mock-line.long {
          width: 80%;
        }

        .mock-line.medium {
          width: 55%;
        }

        .mock-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 25px;
        }

        .mock-cards div {
          height: 55px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.025);
        }

        .qr-visual {
          align-items: center;
          justify-content: center;
          gap: 8%;
          padding: 30px;
        }

        .qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .qr-pattern {
          width: 115px;
          height: 115px;
          padding: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: white;
        }

        .qr-pattern i {
          display: block;
          background: #08090b;
        }

        .qr-pattern i:nth-child(2),
        .qr-pattern i:nth-child(4),
        .qr-pattern i:nth-child(8) {
          background: white;
        }

        .qr-box small {
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.25);
        }

        .qr-info {
          max-width: 240px;
        }

        .attendance-row {
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

        .attendance-row b {
          color: rgba(220, 38, 38, 0.8);
        }

        .portfolio-visual {
          position: relative;
          height: 100%;
          padding: 35px;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(220, 38, 38, 0.18),
              transparent 35%
            ),
            #0b0d10;
        }

        .portfolio-number {
          font-family: monospace;
          font-size: 9px;
          color: rgba(220, 38, 38, 0.8);
          letter-spacing: 0.2em;
        }

        .portfolio-title {
          margin-top: 18px;
          font-size: clamp(30px, 4vw, 55px);
          font-weight: 900;
          line-height: 0.82;
          letter-spacing: -0.07em;
        }

        .portfolio-line {
          position: absolute;
          left: 35px;
          right: 35px;
          bottom: 50px;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .portfolio-stats {
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

        .code-visual {
          padding: 30px;
          font-family: monospace;
          font-size: 9px;
          line-height: 2;
          color: rgba(255, 255, 255, 0.35);
        }

        .code-line span {
          display: inline-block;
          width: 28px;
          color: rgba(255, 255, 255, 0.12);
        }

        .code-line b {
          color: rgba(220, 38, 38, 0.8);
        }
      `}</style>
    </main>
  );
}