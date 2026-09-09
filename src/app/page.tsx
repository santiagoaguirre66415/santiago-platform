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
    year: '2026 — Actual',
    title: 'Desarrollo Full Stack & proyectos personales',
    subtitle: 'Aprendizaje práctico',
    description:
      'Desarrollo proyectos utilizando tecnologías modernas para frontend, backend, bases de datos y servicios en la nube. Trabajo con TypeScript, JavaScript, React, Next.js, Node.js, Appwrite, SQL, Tailwind CSS, Python y Git.',
  },
  {
    year: '2025 — 2026',
    title: 'Proyecto de asistencia mediante QR',
    subtitle: 'Proyecto académico',
    description:
      'Sistema de asistencia mediante códigos QR con validación de horario y distancia. Incluye código QR, rango de horario, validación de distancia, registro de asistencia, control de datos e interfaz web.',
  },
  {
    year: '2024 — Actual',
    title: 'Proyecto Calma',
    subtitle: 'Aplicación de apoyo',
    description:
      'Propuesta de aplicación enfocada en brindar apoyo y orientación al usuario mediante herramientas digitales. Incluye un chatbot en proceso de pruebas, diseñado para interactuar con los usuarios de forma responsable.',
  },
];

const PROJECTS = [
  {
    title: '🧠 Calma',
    description:
      'Aplicación enfocada en crear una experiencia digital de apoyo y orientación para los usuarios. Incluye chatbot en proceso de pruebas.',
    tech: ['TypeScript', 'Next.js', 'React', 'Appwrite'],
    repo: null,
    demo: null,
  },
  {
    title: '📱 Sistema de asistencia QR',
    description:
      'Proyecto académico para gestionar asistencia mediante códigos QR con validación de horario y distancia.',
    tech: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    repo: null,
    demo: null,
  },
  {
    title: '🎮 Portafolio Gamificado',
    description:
      'Mi propio portafolio interactivo. Incluye sistema de progreso, XP, logros y una presentación diferente a la de un CV tradicional.',
    tech: ['TypeScript', 'React', 'Next.js', 'Appwrite', 'Tailwind CSS', 'Git'],
    repo: 'https://github.com/santiagoaguirre66415/santiago-platform',
    demo: 'https://sanas07a.dev',
  },
  {
    title: '💻 Proyectos Full Stack',
    description:
      'Ejercicios y proyectos enfocados en programación, interfaces web, lógica, bases de datos y desarrollo de aplicaciones.',
    tech: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'HTML5', 'CSS3'],
    repo: null,
    demo: null,
  },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: '🚀',
    title: 'Primer contacto',
    description: 'Exploraste el inicio de mi historia.',
    xp: 10,
  },
  {
    id: 2,
    icon: '📚',
    title: 'Estudiante curioso',
    description: 'Descubriste mi formación y el camino que estoy construyendo.',
    xp: 20,
  },
  {
    id: 3,
    icon: '💻',
    title: 'Code Explorer',
    description: 'Conociste las tecnologías con las que desarrollo mis proyectos.',
    xp: 30,
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Full Stack Mode',
    description: 'Exploraste mi experiencia desarrollando frontend, backend y bases de datos.',
    xp: 30,
  },
  {
    id: 5,
    icon: '🧠',
    title: 'Project Builder',
    description: 'Descubriste algunos de los proyectos que he construido durante mi formación.',
    xp: 30,
  },
  {
    id: 6,
    icon: '🏆',
    title: 'Boss Cleared',
    description: 'Llegaste hasta el final de mi portafolio.',
    xp: 50,
  },
];

export default function HomePage() {
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(
    () => new Set([1])
  );
  const [xp, setXp] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<number>>(
    () => new Set([1])
  );

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

  const currentLevel = Math.max(...Array.from(unlockedLevels), 1);

  const unlockLevel = useCallback((level: number) => {
    setUnlockedLevels((prev) => {
      if (prev.has(level)) return prev;
      const next = new Set(prev);
      next.add(level);
      return next;
    });

    setXp((prev) => prev + (LEVELS[level - 1]?.xpReward ?? 20));

    setUnlockedAchievements((a) => {
      const next = new Set(a);
      if (level >= 1) next.add(1);
      if (level >= 2) next.add(2);
      if (level >= 3) next.add(3);
      if (level >= 4) next.add(4);
      if (level >= 5) next.add(5);
      if (level >= 6) next.add(6);
      return next;
    });
  }, []);

  const isUnlocked = (level: number) => unlockedLevels.has(level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Navbar />

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
        {/* HERO */}
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
              Desarrollador Full Stack en formación
            </p>
            <p className="mt-2 text-sm text-gray-500">Manizales, Colombia 🇨🇴</p>
            <blockquote className="mx-auto mt-6 max-w-lg text-base italic text-rose-200/90">
              &ldquo;Aprendo construyendo, mejoro practicando y comparto lo que aprendo&rdquo;
            </blockquote>

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

        {/* MAPA DE NIVELES */}
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

        {/* NIVEL 1 */}
        <RevealSection id="nivel-1" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(1)}>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">Nivel 1 — El Inicio</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">¿Quién soy?</h2>
            <p className="mt-4 leading-relaxed text-gray-300">
              Soy Santiago Aguirre, estudiante de Ingeniería Informática y Análisis
              y Desarrollo de Software, apasionado por la programación, el desarrollo
              web y la creación de soluciones digitales.
            </p>
            <p className="mt-4 leading-relaxed text-gray-300">
              Me gusta aprender principalmente mediante la práctica: transformar una
              idea en un proyecto funcional, enfrentar los problemas que aparecen
              durante el desarrollo y buscar la mejor manera de resolverlos.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-400">
              <li><span className="text-red-300">Nombre:</span> Santiago Aguirre</li>
              <li><span className="text-red-300">Ubicación:</span> Manizales, Colombia</li>
              <li><span className="text-red-300">Perfil:</span> Desarrollador Full Stack en formación</li>
              <li><span className="text-red-300">Formación:</span> Ingeniería Informática + Análisis y Desarrollo de Software</li>
              <li><span className="text-red-300">Enfoque:</span> Desarrollo web, aplicaciones Full Stack y soluciones digitales</li>
            </ul>
          </div>
        </RevealSection>

        {/* NIVEL 2 */}
        <RevealSection id="nivel-2" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(2)}>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">Nivel 2 — La Formación</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Educación & aprendizaje</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Ingeniería Informática</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Formación universitaria orientada al desarrollo de software,
                  programación, resolución de problemas y fundamentos tecnológicos.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Análisis y Desarrollo de Software</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Formación enfocada en el ciclo de desarrollo de software: análisis
                  de requerimientos, diseño, programación, bases de datos, desarrollo
                  web y construcción de soluciones tecnológicas.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Aprendizaje práctico</h3>
                <p className="mt-2 text-sm text-gray-400">
                  He trabajado con tecnologías como JavaScript, TypeScript, React,
                  Next.js, Node.js, Python, SQL, Appwrite y Tailwind CSS, fortaleciendo
                  progresivamente mis conocimientos a través de la práctica.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Aprender construyendo</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Cada proyecto representa una oportunidad para aprender una tecnología
                  nueva, solucionar problemas y entender cómo diferentes herramientas
                  pueden trabajar juntas dentro de una aplicación.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* NIVEL 3 */}
        <RevealSection id="nivel-3" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(3)}>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-red-400">Nivel 3 — La Experiencia</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Proyectos & trayectoria</h2>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <TimelineSection items={EXPERIENCE} />
            </div>
          </div>
        </RevealSection>

        {/* NIVEL 4 */}
        <RevealSection id="nivel-4" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(4)}>
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-red-400">Nivel 4 — Las Habilidades</p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">Stack & skills</h2>
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

        {/* NIVEL 5 */}
        <RevealSection id="nivel-5" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(5)}>
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-red-400">Nivel 5 — Los Jefes Finales</p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">Proyectos destacados</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-red-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/10"
                >
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{project.description}</p>
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

        {/* LOGROS */}
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

        {/* CTA FINAL */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-600/20 to-rose-500/10 p-10 text-center backdrop-blur-xl sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">¿Construimos algo juntos?</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Estoy en constante aprendizaje y me interesa participar en nuevos
              proyectos, colaborar con otros desarrolladores y seguir construyendo
              soluciones reales.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 text-left">
              <a
                href="mailto:santiago.aguirre66415@ucaldas.edu.co"
                className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
              >
                📧 santiago.aguirre66415@ucaldas.edu.co
              </a>
              <a
                href="https://github.com/santiagoaguirre66415"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
              >
                💻 github.com/santiagoaguirre66415
              </a>
              <a
                href="https://sanas07a.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-medium text-gray-200 transition hover:bg-white/10"
              >
                🌐 sanas07a.dev
              </a>
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Si tienes una idea, un proyecto o simplemente quieres conectar para
              hablar sobre tecnología y desarrollo de software, escríbeme.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 pb-28 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Santiago Aguirre · Portafolio Gamificado</p>
        <p className="mt-2 text-xs text-gray-600">
          Manizales, Colombia 🇨🇴 · Desarrollador Full Stack en formación
        </p>
      </footer>
    </div>
  );
}