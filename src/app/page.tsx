'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import LevelBadge from '@/components/LevelBadge';
import RevealSection from '@/components/RevealSection';
import TimelineSection from '@/components/TimelineSection';
import SkillMeter from '@/components/SkillMeter';
import AchievementCard from '@/components/AchievementCard';

/** Datos de los 5 niveles del portafolio */
const LEVELS = [
  { level: 1, title: 'El Inicio', xpReward: 20 },
  { level: 2, title: 'La Formación', xpReward: 20 },
  { level: 3, title: 'La Experiencia', xpReward: 20 },
  { level: 4, title: 'Las Habilidades', xpReward: 20 },
  { level: 5, title: 'Los Jefes Finales', xpReward: 20 },
] as const;

const SKILLS = [
  { name: 'TypeScript', level: 90 },
  { name: 'JavaScript', level: 92 },
  { name: 'React', level: 90 },
  { name: 'Next.js', level: 88 },
  { name: 'Python', level: 85 },
  { name: 'Node.js', level: 82 },
  { name: 'Appwrite', level: 80 },
  { name: 'Tailwind CSS', level: 95 },
  { name: 'SQL', level: 78 },
  { name: 'Git', level: 88 },
];

const EXPERIENCE = [
  {
    year: '2024 — Actual',
    title: 'Desarrollador Full Stack',
    subtitle: 'Proyectos independientes & educación',
    description:
      'Construcción de aplicaciones web con Next.js, Appwrite y TypeScript. Creación de contenido educativo y plataformas de aprendizaje.',
  },
  {
    year: '2023 — 2024',
    title: 'Proyectos full stack',
    subtitle: 'Freelance / personal',
    description:
      'APIs REST, autenticación, bases de datos y frontends modernos. Enfoque en código limpio y experiencias de usuario claras.',
  },
  {
    year: '2022 — 2023',
    title: 'Formación intensiva',
    subtitle: 'Autodidacta',
    description:
      'Aprendizaje profundo de JavaScript, TypeScript, React y el ecosistema web moderno construyendo proyectos reales.',
  },
];

const PROJECTS = [
  {
    title: 'Santiago Platform',
    description:
      'Plataforma de educación en programación con autenticación, cursos, progreso y un portafolio gamificado.',
    tech: ['Next.js', 'TypeScript', 'Appwrite', 'Tailwind'],
    repo: 'https://github.com/santiagoaguirre66415/santiago-platform',
    demo: null as string | null,
  },
  {
    title: 'Proyectos full stack',
    description:
      'Aplicaciones con auth, CRUD, APIs y UI responsive. Enfoque en arquitectura limpia y DX.',
    tech: ['React', 'Node.js', 'SQL', 'Git'],
    repo: null,
    demo: null,
  },
  {
    title: 'Contenido educativo',
    description:
      'Cursos y materiales para enseñar programación de forma práctica: aprender construyendo.',
    tech: ['TypeScript', 'Next.js', 'Pedagogía'],
    repo: null,
    demo: null,
  },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: '🚀',
    title: 'Primer contacto',
    description: 'Visitaste el portafolio',
    xp: 10,
  },
  {
    id: 2,
    icon: '📚',
    title: 'Estudiante curioso',
    description: 'Desbloqueaste La Formación',
    xp: 20,
  },
  {
    id: 3,
    icon: '💼',
    title: 'Reclutador mode',
    description: 'Revisaste la experiencia',
    xp: 20,
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Stack explorer',
    description: 'Viste las habilidades',
    xp: 20,
  },
  {
    id: 5,
    icon: '🏆',
    title: 'Boss cleared',
    description: 'Llegaste a los proyectos destacados',
    xp: 30,
  },
];

/**
 * Home — Portafolio gamificado tipo hoja de vida.
 * Los niveles se desbloquean al hacer scroll (Intersection Observer).
 */
export default function HomePage() {
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(
    () => new Set([1]) // Nivel 1 siempre visible
  );
  const [xp, setXp] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<number>>(
    () => new Set([1])
  );
  const [showLevelUp, setShowLevelUp] = useState(false);

  // XP visual = progreso de scroll (0-100)
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Nivel actual según cuántos se desbloquearon
  const currentLevel = Math.max(...Array.from(unlockedLevels), 1);

  const unlockLevel = useCallback((level: number) => {
    setUnlockedLevels((prev) => {
      if (prev.has(level)) return prev;
      const next = new Set(prev);
      next.add(level);
      return next;
    });

    setXp((prev) => prev + (LEVELS[level - 1]?.xpReward ?? 20));

    // Logros por nivel
    if (level >= 2) {
      setUnlockedAchievements((a) => new Set(a).add(2));
    }
    if (level >= 3) {
      setUnlockedAchievements((a) => new Set(a).add(3));
    }
    if (level >= 4) {
      setUnlockedAchievements((a) => new Set(a).add(4));
    }
    if (level >= 5) {
      setUnlockedAchievements((a) => new Set(a).add(5));
    }

    // Flash level-up
    setShowLevelUp(true);
    const t = setTimeout(() => setShowLevelUp(false), 800);
    return () => clearTimeout(t);
  }, []);

  const isUnlocked = (level: number) => unlockedLevels.has(level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Navbar />

      {/* XP bar fija abajo */}
      <XPBar
        value={scrollProgress}
        level={currentLevel}
        label={
          currentLevel >= 5
            ? '¡Portafolio completado!'
            : `Nivel ${currentLevel}: ${LEVELS[currentLevel - 1]?.title ?? ''}`
        }
      />

      <main className="pb-24">
        {/* ========== HERO — Nivel 1 siempre visible ========== */}
        <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8">
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-red-400">
              Portafolio gamificado
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Santiago{' '}
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                Aguirre
              </span>
            </h1>
            <p className="mt-3 text-lg text-gray-300 sm:text-xl">
              Desarrollador Full Stack & Educador
            </p>
            <p className="mt-2 text-sm text-gray-500">Colombia</p>
            <blockquote className="mx-auto mt-6 max-w-lg text-base italic text-rose-200/90">
              &ldquo;Aprendo construyendo y enseño compartiendo&rdquo;
            </blockquote>

            {/* Avatar */}
            <div className="mx-auto mt-10 flex h-28 w-28 items-center justify-center rounded-full border-2 border-red-400/40 bg-gradient-to-br from-red-600/40 to-rose-500/30 text-3xl font-bold text-red-200 shadow-xl shadow-red-500/20">
              SA
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Desplázate hacia abajo para desbloquear cada nivel de mi historia
            </p>
            <div className="mt-4 animate-bounce text-red-400" aria-hidden="true">
              ↓
            </div>
          </div>
        </section>

        {/* ========== MAPA DE NIVELES ========== */}
        <section className="px-4 py-8 sm:px-6 lg:px-8" aria-label="Progreso de niveles">
          <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {LEVELS.map((l) => (
              <LevelBadge
                key={l.level}
                level={l.level}
                title={l.title}
                unlocked={isUnlocked(l.level)}
                active={currentLevel === l.level}
              />
            ))}
          </div>
        </section>

        {/* ========== NIVEL 1 — El Inicio (detalle) ========== */}
        <RevealSection
          id="nivel-1"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(1)}
        >
          <div
            className={`mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10 ${
              showLevelUp && currentLevel === 1 ? 'level-up-flash' : ''
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">
              Nivel 1 — El Inicio
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">¿Quién soy?</h2>
            <p className="mt-4 leading-relaxed text-gray-300">
              Soy Santiago Aguirre, desarrollador full stack y educador. Me apasiona
              construir productos reales y compartir lo que aprendo de forma clara y
              práctica. Esta página es mi hoja de vida interactiva: cada sección es un
              nivel que desbloqueas al explorar.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-400">
              <li>
                <span className="text-red-300">Título:</span> Desarrollador Full Stack &
                Educador
              </li>
              <li>
                <span className="text-red-300">Ubicación:</span> Colombia
              </li>
              <li>
                <span className="text-red-300">Enfoque:</span> TypeScript, React, Next.js,
                backend y enseñanza
              </li>
            </ul>
          </div>
        </RevealSection>

        {/* ========== NIVEL 2 — La Formación ========== */}
        <RevealSection
          id="nivel-2"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(2)}
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">
              Nivel 2 — La Formación
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Educación & certificaciones</h2>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Formación autodidacta intensiva</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Ruta práctica en JavaScript, TypeScript, React, Next.js, Node.js y bases
                  de datos. Aprendizaje basado en proyectos reales, no solo tutoriales.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Cursos & práctica continua</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Cursos de desarrollo web, patrones de arquitectura y herramientas
                  modernas (Git, SQL, Appwrite, Tailwind). Constante actualización del
                  stack.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Enseñar para aprender</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Crear material educativo y plataformas de cursos refuerza lo que sé y
                  mejora cómo lo comunico.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ========== NIVEL 3 — La Experiencia ========== */}
        <RevealSection
          id="nivel-3"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(3)}
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">
              Nivel 3 — La Experiencia
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Trayectoria</h2>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <TimelineSection items={EXPERIENCE} />
            </div>
          </div>
        </RevealSection>

        {/* ========== NIVEL 4 — Las Habilidades ========== */}
        <RevealSection
          id="nivel-4"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(4)}
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-red-400">
              Nivel 4 — Las Habilidades
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">
              Stack & skills
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((skill) => (
                <SkillMeter key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-gray-500">
              Idiomas: Español (nativo) · Inglés (técnico / lectura)
            </p>
          </div>
        </RevealSection>

        {/* ========== NIVEL 5 — Los Jefes Finales ========== */}
        <RevealSection
          id="nivel-5"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(5)}
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-red-400">
              Nivel 5 — Los Jefes Finales
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">
              Proyectos destacados
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-red-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/10"
                >
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3 text-sm">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-red-400 transition hover:text-red-300"
                      >
                        Repo →
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-rose-400 transition hover:text-rose-300"
                      >
                        Demo →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ========== LOGROS ========== */}
        <section className="px-4 py-16 sm:px-6 lg:px-8" aria-label="Logros">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold">Logros desbloqueados</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Se activan al explorar cada nivel
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACHIEVEMENTS.map((a) => (
                <AchievementCard
                  key={a.id}
                  icon={a.icon}
                  title={a.title}
                  description={a.description}
                  unlocked={unlockedAchievements.has(a.id)}
                  xp={a.xp}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ========== CTA ========== */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-600/20 to-rose-500/10 p-10 text-center backdrop-blur-xl sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">¿Hablamos?</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Si buscas un desarrollador que construye y enseña con claridad, escríbeme.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:santiagoo.aguilar.dev@gmail.com"
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-500 hover:to-rose-400 sm:w-auto"
              >
                Contactar
              </a>
              <Link
                href="/courses"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-center text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
              >
                Ver cursos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 pb-28 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Santiago Aguirre · Portafolio gamificado
        </p>
      </footer>
    </div>
  );
}