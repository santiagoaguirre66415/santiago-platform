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
  { name: 'Flutter', level: 60 },
  { name: 'MongoDB', level: 65 },
];

const EXPERIENCE = [
  {
    year: '2025 — Actual',
    title: 'Ingeniería Informática',
    subtitle: 'Formación universitaria',
    description:
      'Formación universitaria enfocada en informática, programación, desarrollo de software, bases de datos, lógica y resolución de problemas.',
  },
  {
    year: '2025 — Actual',
    title: 'Análisis y Desarrollo de Software',
    subtitle: 'Formación tecnológica',
    description:
      'Formación orientada al diseño, desarrollo y construcción de soluciones de software. Trabajo con diferentes lenguajes, frameworks, bases de datos y herramientas de desarrollo.',
  },
  {
    year: '2025 — Actual',
    title: 'Proyecto Calma',
    subtitle: 'Proyecto personal — Finalizado',
    description:
      'Aplicación enfocada en brindar acompañamiento y apoyo al usuario mediante herramientas digitales. Incluye un chatbot diseñado para interactuar con el usuario y proporcionar orientación.',
  },
  {
    year: '2025 — Actual',
    title: 'Sistema de Asistencia QR',
    subtitle: 'Proyecto académico — En desarrollo',
    description:
      'Sistema diseñado para gestionar asistencia mediante códigos QR con validación de horario y distancia. Incluye generación de QR, registro de asistencia, validación de horarios y control de datos.',
  },
];

const PROJECTS = [
  {
    title: '🧠 Calma',
    description:
      'Aplicación de acompañamiento digital con chatbot. Incluye interfaces web, integración de servicios y manejo de información.',
    tech: ['TypeScript', 'React', 'Next.js', 'Appwrite'],
    status: 'Finalizado',
    repo: null,
    demo: null,
  },
  {
    title: '📱 Sistema de Asistencia QR',
    description:
      'Sistema de asistencia con códigos QR, validación de horario y distancia. Incluye registro de asistencia, control de datos e interfaz web.',
    tech: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    status: 'En desarrollo',
    repo: null,
    demo: null,
  },
  {
    title: '🎮 Portafolio Gamificado',
    description:
      'Portafolio interactivo con sistema de niveles, XP y logros. Presenta mi información académica y proyectos de forma diferente.',
    tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Appwrite', 'Git'],
    status: 'Evolución continua',
    repo: 'https://github.com/santiagoaguirre66415/santiago-platform',
    demo: 'https://sanas07a.dev',
  },
  {
    title: '💻 Otros Proyectos',
    description:
      'Ejercicios y proyectos usando Python, Java, JavaScript, TypeScript, Flutter, Dart, SQL, HTML5 y CSS3.',
    tech: ['Python', 'Java', 'Flutter', 'Dart', 'SQL', 'HTML5', 'CSS3'],
    status: 'Formación',
    repo: null,
    demo: null,
  },
];

const ACHIEVEMENTS = [
  { id: 1, icon: '🥉', title: 'First Step', description: 'Comenzar mi camino en el desarrollo de software.', xp: 10 },
  { id: 2, icon: '📚', title: 'Knowledge Seeker', description: 'Aprender nuevas tecnologías y conceptos.', xp: 20 },
  { id: 3, icon: '💻', title: 'Code Explorer', description: 'Experimentar con diferentes lenguajes y herramientas.', xp: 30 },
  { id: 4, icon: '🧩', title: 'Problem Solver', description: 'Encontrar soluciones a problemas durante el desarrollo.', xp: 30 },
  { id: 5, icon: '⚡', title: 'Full Stack Mode', description: 'Explorar tanto frontend como backend.', xp: 40 },
  { id: 6, icon: '🛠️', title: 'Project Builder', description: 'Convertir ideas en proyectos funcionales.', xp: 40 },
  { id: 7, icon: '👑', title: 'Boss Cleared', description: 'Finalizar proyectos y superar nuevos desafíos.', xp: 50 },
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
      if (level >= 7) next.add(7);
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
              🎮 Portafolio Gamificado
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
            <p className="mt-2 text-sm text-gray-500">📍 Manizales, Colombia 🇨🇴</p>
            <blockquote className="mx-auto mt-6 max-w-lg text-base italic text-rose-200/90">
              &ldquo;Aprendo construyendo, mejoro practicando y sigo avanzando&rdquo;
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
            <p className="text-xs font-medium uppercase tracking-widest text-green-400">Nivel 1 — El Inicio</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">👋 ¡Hola, soy Santiago!</h2>
            <p className="mt-4 leading-relaxed text-gray-300">
              Soy <strong>Santiago Aguirre</strong>, estudiante de <strong>Ingeniería Informática</strong> y{' '}
              <strong>Análisis y Desarrollo de Software</strong>, interesado en la programación, el desarrollo
              web y la creación de soluciones digitales.
            </p>
            <p className="mt-4 leading-relaxed text-gray-300">
              Comencé mi formación universitaria en <strong>2025</strong> y desde entonces he ido construyendo
              mi camino en el desarrollo de software mediante proyectos académicos, personales y experimentación
              con diferentes tecnologías.
            </p>
            <p className="mt-4 leading-relaxed text-gray-300">
              Me gusta aprender <strong>haciendo</strong>: convertir una idea en un proyecto funcional, encontrar
              soluciones a los problemas que aparecen durante el desarrollo y seguir mejorando el resultado.
            </p>
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
              <h3 className="font-semibold text-red-300">🎯 Mi objetivo</h3>
              <p className="mt-2 text-sm text-gray-300">
                Seguir fortaleciendo mis conocimientos en desarrollo de software, adquirir experiencia práctica
                mediante nuevos proyectos y crecer como desarrollador.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-red-300">🕹️ Mi filosofía</h3>
              <p className="mt-2 text-sm text-gray-300">
                <strong>Idea → Código → Prueba → Error → Mejora → Proyecto</strong>
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Cada proyecto representa una oportunidad para aprender algo nuevo.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* NIVEL 2 */}
        <RevealSection id="nivel-2" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(2)}>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-blue-400">Nivel 2 — La Formación</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">🎓 Mi camino académico</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Ingeniería Informática</h3>
                <p className="mt-1 text-sm text-gray-500">2025 — Actualidad</p>
                <p className="mt-2 text-sm text-gray-400">
                  Formación universitaria enfocada en informática, programación, desarrollo de software, bases
                  de datos, lógica y resolución de problemas.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">Análisis y Desarrollo de Software</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Formación orientada al diseño, desarrollo y construcción de soluciones de software.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">📚 Lo que he aprendido construyendo</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Mi formación no se limita solamente a la teoría. He aplicado conocimientos en proyectos
                  utilizando tecnologías como:
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python', 'Java', 'PHP', 'Flutter', 'Dart', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Appwrite', 'Firebase', 'Docker', 'Git'].map((tech) => (
                    <span key={tech} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* NIVEL 3 */}
        <RevealSection id="nivel-3" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(3)}>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-yellow-400">Nivel 3 — Proyectos & Experiencia práctica</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">💻 Construyendo experiencia</h2>
            <p className="mt-4 text-gray-300">
              Actualmente <strong>no cuento con experiencia laboral profesional</strong>, pero he desarrollado
              diferentes proyectos académicos y personales que me han permitido adquirir experiencia práctica
              en programación y desarrollo de software.
            </p>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <TimelineSection items={EXPERIENCE} />
            </div>
          </div>
        </RevealSection>

                {/* NIVEL 4 */}
        <RevealSection id="nivel-4" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(4)}>
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-red-400">Nivel 4 — Las Habilidades</p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">⚔️ Stack & skills</h2>
            <p className="mt-4 text-center text-sm text-gray-400">
              Mi stack está en constante evolución. Algunas tecnologías tienen mayor experiencia práctica.
            </p>

            <div className="mt-10 space-y-6">
              {/* Frontend */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">💻 Frontend Web</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">⚙️ Backend & Programación</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Java', 'Python', 'JavaScript', 'TypeScript', 'Node.js', 'PHP'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">📱 Desarrollo Mobile</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Flutter', 'Dart'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bases de Datos */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">🗄️ Bases de Datos</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['MySQL', 'PostgreSQL', 'SQL', 'MongoDB'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Servicios */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">☁️ Backend & Servicios</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Appwrite', 'Firebase'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* DevOps */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">🐳 Herramientas & DevOps</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Git', 'Docker'].map((tech) => (
                    <span key={tech} className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 border border-red-400/20 transition hover:bg-red-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Idiomas: Español (nativo) · Inglés (técnico / lectura)
            </p>
          </div>
        </RevealSection>

        {/* NIVEL 5 */}
        <RevealSection id="nivel-5" className="px-4 py-16 sm:px-6 lg:px-8" onUnlock={() => unlockLevel(5)}>
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-rose-400">Nivel 5 — Los Jefes Finales</p>
            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">🏆 Proyectos destacados</h2>
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
                      <span key={t} className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{project.status}</span>
                    {(project.repo || project.demo) && (
                      <div className="flex gap-3 text-sm">
                        {project.repo && (
                          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="font-medium text-red-400 hover:text-red-300">
                            Repo →
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="font-medium text-rose-400 hover:text-rose-300">
                            Demo →
                          </a>
                        )}
                      </div>
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
            <h2 className="text-center text-2xl font-bold">🏅 Logros desbloqueados</h2>
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

        {/* PRÓXIMOS NIVELES */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">🚀 Mis próximos niveles</h2>
            <p className="mt-4 text-center text-gray-300">
              El camino todavía continúa.
            </p>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="font-semibold text-red-300">🎯 Próximos objetivos</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>• Seguir fortaleciendo mis conocimientos de desarrollo Full Stack.</li>
                <li>• Mejorar mis proyectos actuales.</li>
                <li>• Aprender nuevas tecnologías.</li>
                <li>• Profundizar en bases de datos.</li>
                <li>• Mejorar mis conocimientos de arquitectura de software.</li>
                <li>• Crear proyectos cada vez más completos.</li>
                <li>• Adquirir experiencia profesional.</li>
                <li>• Seguir construyendo un perfil sólido como desarrollador.</li>
              </ul>
              <blockquote className="mt-6 text-center italic text-rose-200/90">
                &ldquo;Todavía estoy construyendo mi camino, pero cada proyecto me acerca un nivel más a donde quiero llegar.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-600/20 to-rose-500/10 p-10 text-center backdrop-blur-xl sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">🎮 GAME OVER... ¿O APENAS COMIENZA?</h2>
            <p className="mt-2 text-2xl font-bold text-red-300">¿Construimos algo juntos?</p>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Si tienes una idea, un proyecto o simplemente quieres conocer más sobre mi trabajo, puedes encontrarme en:
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

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#nivel-1"
                className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400"
              >
                VOLVER A JUGAR
              </a>
              <a
                href="#nivel-5"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                VER PROYECTOS
              </a>
              <a
                href="mailto:santiago.aguirre66415@ucaldas.edu.co"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                CONTACTAR
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 pb-28 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Santiago Aguirre · Portafolio Gamificado</p>
        <p className="mt-2 text-xs text-gray-600">
          Cada proyecto es un nuevo nivel.
        </p>
      </footer>
    </div>
  );
}