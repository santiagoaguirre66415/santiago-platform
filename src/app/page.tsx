'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import LevelBadge from '@/components/LevelBadge';
import RevealSection from '@/components/RevealSection';
import TimelineSection from '@/components/TimelineSection';
import AchievementCard from '@/components/AchievementCard';

const STORAGE_KEY = 'santiago-portfolio-progress-v4';

const LEVELS = [
  {
    level: 1,
    title: 'El Inicio',
    xpReward: 20,
    reward: 'First Step',
  },
  {
    level: 2,
    title: 'La Formación',
    xpReward: 20,
    reward: 'Knowledge Seeker',
  },
  {
    level: 3,
    title: 'Experiencia Práctica',
    xpReward: 20,
    reward: 'Problem Solver',
  },
  {
    level: 4,
    title: 'Las Habilidades',
    xpReward: 20,
    reward: 'Full Stack Mode',
  },
  {
    level: 5,
    title: 'Los Jefes Finales',
    xpReward: 20,
    reward: 'Boss Cleared',
  },
] as const;

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
      'Formación orientada al diseño, desarrollo y construcción de soluciones de software.',
  },
  {
    year: '2025 — 2026',
    title: 'Proyecto Calma',
    subtitle: 'Proyecto personal — Finalizado',
    description:
      'Aplicación de acompañamiento digital con chatbot. Incluye interfaces web, integración de servicios y manejo de información.',
  },
  {
    year: '2025 — Actual',
    title: 'Sistema de Asistencia QR',
    subtitle: 'Proyecto académico — En desarrollo',
    description:
      'Sistema de asistencia mediante códigos QR con validación de horario y distancia.',
  },
];

const PROJECTS = [
  {
    title: '🧠 Calma',
    description:
      'Aplicación de acompañamiento digital con chatbot. Incluye interfaces web, integración de servicios y manejo de información.',
    tech: ['TypeScript', 'React', 'Next.js', 'Appwrite'],
    status: '✅ Finalizado',
    repo: null as string | null,
    demo: null as string | null,
  },
  {
    title: '📱 Sistema de Asistencia QR',
    description:
      'Sistema de asistencia con códigos QR, validación de horario y distancia.',
    tech: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    status: '🚧 En desarrollo',
    repo: null as string | null,
    demo: null as string | null,
  },
  {
    title: '🎮 Portafolio Gamificado',
    description:
      'Portafolio interactivo con sistema de niveles, XP y logros.',
    tech: [
      'TypeScript',
      'React',
      'Next.js',
      'Tailwind CSS',
      'Appwrite',
      'Git',
    ],
    status: '🚧 Evolución continua',
    repo: 'https://github.com/santiagoaguirre66415/santiago-platform',
    demo: 'https://sanas07a.dev',
  },
  {
    title: '💻 Otros Proyectos',
    description:
      'Ejercicios y proyectos realizados durante mi formación utilizando diferentes lenguajes, frameworks y herramientas.',
    tech: [
      'Python',
      'Java',
      'Flutter',
      'SQL',
      'HTML5',
      'CSS3',
    ],
    status: '📚 Formación',
    repo: null as string | null,
    demo: null as string | null,
  },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: '🥉',
    title: 'First Step',
    description: 'Comenzar mi camino en el desarrollo de software.',
    xp: 10,
  },
  {
    id: 2,
    icon: '📚',
    title: 'Knowledge Seeker',
    description: 'Aprender nuevas tecnologías y conceptos.',
    xp: 20,
  },
  {
    id: 3,
    icon: '💻',
    title: 'Code Explorer',
    description: 'Explorar y experimentar con diferentes tecnologías.',
    xp: 30,
  },
  {
    id: 4,
    icon: '🧩',
    title: 'Problem Solver',
    description:
      'Encontrar soluciones a problemas durante el desarrollo.',
    xp: 30,
  },
  {
    id: 5,
    icon: '⚡',
    title: 'Full Stack Mode',
    description:
      'Explorar tecnologías tanto de frontend como de backend.',
    xp: 40,
  },
  {
    id: 6,
    icon: '🛠️',
    title: 'Project Builder',
    description:
      'Convertir ideas en proyectos funcionales.',
    xp: 40,
  },
  {
    id: 7,
    icon: '👑',
    title: 'Boss Cleared',
    description:
      'Finalizar proyectos y superar nuevos desafíos.',
    xp: 50,
  },
];

interface SavedProgress {
  unlockedLevels: number[];
  unlockedAchievements: number[];
}

const DEFAULT_PROGRESS: SavedProgress = {
  unlockedLevels: [1],
  unlockedAchievements: [1],
};

function loadProgress(): SavedProgress {
  if (typeof window === 'undefined') {
    return DEFAULT_PROGRESS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(raw) as Partial<SavedProgress>;

    const levels = Array.isArray(parsed.unlockedLevels)
      ? parsed.unlockedLevels.filter(
          (level): level is number =>
            typeof level === 'number' &&
            level >= 1 &&
            level <= LEVELS.length
        )
      : [];

    const achievements = Array.isArray(parsed.unlockedAchievements)
      ? parsed.unlockedAchievements.filter(
          (achievement): achievement is number =>
            typeof achievement === 'number' &&
            achievement >= 1 &&
            achievement <= ACHIEVEMENTS.length
        )
      : [];

    return {
      unlockedLevels: Array.from(
        new Set([1, ...levels])
      ).sort((a, b) => a - b),

      unlockedAchievements: Array.from(
        new Set([1, ...achievements])
      ).sort((a, b) => a - b),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(data: SavedProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignorar errores de almacenamiento local.
  }
}

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);

  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(
    () => new Set([1])
  );

  const [unlockedAchievements, setUnlockedAchievements] =
    useState<Set<number>>(() => new Set([1]));

  const [toast, setToast] = useState<string | null>(null);

  /*
   * Cargar progreso guardado.
   */
  useEffect(() => {
    const saved = loadProgress();

    setUnlockedLevels(new Set(saved.unlockedLevels));
    setUnlockedAchievements(
      new Set(saved.unlockedAchievements)
    );

    setHydrated(true);
  }, []);

  /*
   * Guardar progreso automáticamente.
   */
  useEffect(() => {
    if (!hydrated) return;

    saveProgress({
      unlockedLevels: Array.from(unlockedLevels).sort(
        (a, b) => a - b
      ),
      unlockedAchievements: Array.from(
        unlockedAchievements
      ).sort((a, b) => a - b),
    });
  }, [
    unlockedLevels,
    unlockedAchievements,
    hydrated,
  ]);

  /*
   * Nivel máximo alcanzado.
   */
  const currentLevel = useMemo(() => {
    return Math.max(
      ...Array.from(unlockedLevels),
      1
    );
  }, [unlockedLevels]);

  /*
   * XP de niveles.
   */
  const levelXP = useMemo(() => {
    return Array.from(unlockedLevels).reduce(
      (total, level) => {
        const levelInfo = LEVELS[level - 1];

        return total + (levelInfo?.xpReward ?? 0);
      },
      0
    );
  }, [unlockedLevels]);

  /*
   * XP de logros.
   */
  const achievementXP = useMemo(() => {
    return Array.from(unlockedAchievements).reduce(
      (total, achievementId) => {
        const achievement = ACHIEVEMENTS.find(
          (item) => item.id === achievementId
        );

        return total + (achievement?.xp ?? 0);
      },
      0
    );
  }, [unlockedAchievements]);

  /*
   * XP total.
   */
  const xp = levelXP + achievementXP;

  /*
   * El portafolio se considera completado
   * cuando los cinco niveles fueron desbloqueados.
   */
  const isCompleted =
    unlockedLevels.size >= LEVELS.length;

  /*
   * Verificar si un nivel está desbloqueado.
   */
  const isUnlocked = useCallback(
    (level: number) => {
      return unlockedLevels.has(level);
    },
    [unlockedLevels]
  );

  /*
   * Mostrar notificación.
   */
  const showToast = useCallback(
    (message: string) => {
      setToast(message);

      window.setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    []
  );

  /*
   * Desbloquear nivel.
   *
   * Los niveles se desbloquean de manera progresiva:
   *
   * Nivel 1 → Nivel 2 → Nivel 3 → Nivel 4 → Nivel 5
   */
  const unlockLevel = useCallback(
    (level: number) => {
      if (level < 1 || level > LEVELS.length) {
        return;
      }

      setUnlockedLevels((previous) => {
        /*
         * El nivel 1 siempre está disponible.
         */
        if (level === 1) {
          if (previous.has(1)) {
            return previous;
          }

          const next = new Set(previous);
          next.add(1);

          return next;
        }

        /*
         * No permitir desbloquear un nivel
         * si el anterior todavía no fue alcanzado.
         */
        if (!previous.has(level - 1)) {
          return previous;
        }

        /*
         * Evitar repetir la recompensa.
         */
        if (previous.has(level)) {
          return previous;
        }

        const next = new Set(previous);
        next.add(level);

        return next;
      });

      /*
       * Los logros se relacionan con el progreso.
       *
       * Nivel 1 → First Step
       * Nivel 2 → Knowledge Seeker + Code Explorer
       * Nivel 3 → Problem Solver
       * Nivel 4 → Full Stack Mode
       * Nivel 5 → Project Builder + Boss Cleared
       */
      setUnlockedAchievements((previous) => {
        const next = new Set(previous);

        if (level >= 1) {
          next.add(1);
        }

        if (level >= 2) {
          next.add(2);
          next.add(3);
        }

        if (level >= 3) {
          next.add(4);
        }

        if (level >= 4) {
          next.add(5);
        }

        if (level >= 5) {
          next.add(6);
          next.add(7);
        }

        return next;
      });

      const levelInfo = LEVELS[level - 1];

      /*
       * Solo mostrar la recompensa si el nivel
       * realmente estaba bloqueado.
       */
      if (
        levelInfo &&
        level > 1 &&
        !unlockedLevels.has(level)
      ) {
        showToast(
          `🏅 Nivel ${level} desbloqueado: ${levelInfo.reward} · +${levelInfo.xpReward} XP`
        );
      }
    },
    [showToast, unlockedLevels]
  );

  /*
   * Reiniciar completamente el progreso.
   */
  const resetProgress = useCallback(() => {
    setUnlockedLevels(new Set([1]));
    setUnlockedAchievements(new Set([1]));

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores.
    }

    showToast('🔄 Progreso reiniciado. ¡Volvamos a jugar!');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Navbar />

      {/* Toast de progreso */}
      {toast && (
        <div
          className="fixed left-1/2 top-24 z-[60] w-[min(90vw,24rem)] -translate-x-1/2 rounded-2xl border border-red-400/40 bg-slate-950/95 p-4 shadow-xl shadow-red-500/30 backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <p className="text-center text-sm font-medium text-white">
            {toast}
          </p>
        </div>
      )}

      {/* Barra de XP */}
      <XPBar
        value={xp}
        level={currentLevel}
        label={
          isCompleted
            ? '🏆 ¡Portafolio completado!'
            : `Nivel ${currentLevel}: ${
                LEVELS[currentLevel - 1]?.title ?? ''
              }`
        }
      />

      <main className="pb-24">

        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8">
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

            <p className="mt-2 text-sm text-gray-500">
              📍 Manizales, Colombia 🇨🇴
            </p>

            <blockquote className="mx-auto mt-6 max-w-lg text-base italic text-rose-200/90">
              &ldquo;Aprendo construyendo, mejoro practicando y sigo avanzando&rdquo;
            </blockquote>

            <div className="mx-auto mt-10 flex h-28 w-28 items-center justify-center rounded-full border-2 border-red-400/40 bg-gradient-to-br from-red-600/40 to-rose-500/30 text-3xl font-bold text-red-200 shadow-xl shadow-red-500/20">
              SA
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Desplázate hacia abajo para desbloquear cada nivel de mi historia
            </p>

            <div
              className="mt-4 animate-bounce text-red-400"
              aria-hidden="true"
            >
              ↓
            </div>
          </div>
        </section>

        {/* =========================================================
            MAPA DE NIVELES
        ========================================================= */}
        <section
          className="px-4 py-8 sm:px-6 lg:px-8"
          aria-label="Progreso de niveles"
        >
          <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {LEVELS.map((level) => (
              <LevelBadge
                key={level.level}
                level={level.level}
                title={level.title}
                unlocked={isUnlocked(level.level)}
                active={currentLevel === level.level}
              />
            ))}
          </div>
        </section>

        {/* =========================================================
            NIVEL 1
        ========================================================= */}
        <RevealSection
          id="nivel-1"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(1)}
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-green-400">
              Nivel 1 — El Inicio
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              👋 ¡Hola, soy Santiago!
            </h2>

            <p className="mt-4 leading-relaxed text-gray-300">
              Soy <strong>Santiago Aguirre</strong>, estudiante de{' '}
              <strong>Ingeniería Informática</strong> y{' '}
              <strong>Análisis y Desarrollo de Software</strong>,
              interesado en la programación, el desarrollo web y la
              creación de soluciones digitales.
            </p>

            <p className="mt-4 leading-relaxed text-gray-300">
              Comencé mi formación universitaria en{' '}
              <strong>2025</strong> y desde entonces he ido
              construyendo mi camino en el desarrollo de software
              mediante proyectos académicos, personales y
              experimentación con diferentes tecnologías.
            </p>

            <p className="mt-4 leading-relaxed text-gray-300">
              Me gusta aprender <strong>haciendo</strong>: convertir
              una idea en un proyecto funcional, encontrar soluciones
              a los problemas que aparecen durante el desarrollo y
              seguir mejorando el resultado.
            </p>

            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
              <h3 className="font-semibold text-red-300">
                🎯 Mi objetivo
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                Seguir fortaleciendo mis conocimientos en desarrollo
                de software, adquirir experiencia práctica mediante
                nuevos proyectos y crecer como desarrollador.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-red-300">
                🕹️ Mi filosofía
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                <strong>
                  Idea → Código → Prueba → Error → Mejora → Proyecto
                </strong>
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Cada proyecto representa una oportunidad para aprender
                algo nuevo.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* =========================================================
            NIVEL 2
        ========================================================= */}
        <RevealSection
          id="nivel-2"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(2)}
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
              Nivel 2 — La Formación
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              🎓 Mi camino académico
            </h2>

            <div className="mt-8 space-y-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">
                  Ingeniería Informática
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  2025 — Actualidad
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Formación universitaria enfocada en informática,
                  programación, desarrollo de software, bases de
                  datos, lógica y resolución de problemas.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">
                  Análisis y Desarrollo de Software
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Formación tecnológica
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Formación orientada al diseño, desarrollo y
                  construcción de soluciones de software.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-semibold text-white">
                  📚 Lo que he aprendido construyendo
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Mi formación no se limita solamente a la teoría.
                  He aplicado conocimientos en proyectos utilizando
                  diferentes tecnologías:
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    'HTML5',
                    'CSS3',
                    'JavaScript',
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Tailwind CSS',
                    'Node.js',
                    'Python',
                    'Java',
                    'PHP',
                    'Flutter',
                    'Dart',
                    'SQL',
                    'MySQL',
                    'PostgreSQL',
                    'MongoDB',
                    'Appwrite',
                    'Firebase',
                    'Docker',
                    'Git',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-gray-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* =========================================================
            NIVEL 3
        ========================================================= */}
        <RevealSection
          id="nivel-3"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(3)}
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-yellow-400">
              Nivel 3 — Experiencia Práctica
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              💻 Construyendo experiencia
            </h2>

            <p className="mt-4 text-gray-300">
              Actualmente{' '}
              <strong>
                no cuento con experiencia laboral profesional
              </strong>
              , pero he desarrollado diferentes proyectos académicos
              y personales que me han permitido adquirir experiencia
              práctica en programación y desarrollo de software.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <TimelineSection items={EXPERIENCE} />
            </div>
          </div>
        </RevealSection>

        {/* =========================================================
            NIVEL 4
        ========================================================= */}
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
              ⚔️ Stack & skills
            </h2>

            <p className="mt-4 text-center text-sm text-gray-400">
              Mi stack está en constante evolución. Cada proyecto me
              permite profundizar en diferentes tecnologías y ampliar
              mi experiencia práctica.
            </p>

            <div className="mt-10 space-y-6">

              {/* Frontend */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  💻 Frontend Web
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'HTML5',
                    'CSS3',
                    'JavaScript',
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Tailwind CSS',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  ⚙️ Backend & Programación
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'Java',
                    'Python',
                    'JavaScript',
                    'TypeScript',
                    'Node.js',
                    'PHP',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  📱 Desarrollo Mobile
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Flutter', 'Dart'].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bases de datos */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  🗄️ Bases de Datos
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'MySQL',
                    'PostgreSQL',
                    'SQL',
                    'MongoDB',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Servicios */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  ☁️ Backend & Servicios
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Appwrite', 'Firebase'].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* DevOps */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-red-300">
                  🐳 Herramientas & DevOps
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Git', 'Docker'].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-red-400/20 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                    >
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

        {/* =========================================================
            NIVEL 5
        ========================================================= */}
        <RevealSection
          id="nivel-5"
          className="px-4 py-16 sm:px-6 lg:px-8"
          onUnlock={() => unlockLevel(5)}
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-rose-400">
              Nivel 5 — Los Jefes Finales
            </p>

            <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">
              🏆 Proyectos destacados
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:bg-white/10 hover:shadow-xl hover:shadow-red-500/10"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500">
                      {project.status}
                    </span>

                    {(project.repo || project.demo) && (
                      <div className="flex gap-3 text-sm">
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
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* =========================================================
            LOGROS
        ========================================================= */}
        <section
          className="px-4 py-16 sm:px-6 lg:px-8"
          aria-label="Logros"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold">
              🏅 Logros desbloqueados
            </h2>

            <p className="mt-2 text-center text-sm text-gray-400">
              Se activan al explorar cada nivel
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACHIEVEMENTS.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  icon={achievement.icon}
                  title={achievement.title}
                  description={achievement.description}
                  unlocked={unlockedAchievements.has(
                    achievement.id
                  )}
                  xp={achievement.xp}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PRÓXIMOS NIVELES
        ========================================================= */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              🚀 Mis próximos niveles
            </h2>

            <p className="mt-4 text-center text-gray-300">
              El camino todavía continúa.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="font-semibold text-red-300">
                🎯 Próximos objetivos
              </h3>

              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>
                  • Seguir fortaleciendo mis conocimientos de
                  desarrollo Full Stack.
                </li>
                <li>
                  • Mejorar mis proyectos actuales.
                </li>
                <li>
                  • Aprender nuevas tecnologías.
                </li>
                <li>
                  • Profundizar en bases de datos.
                </li>
                <li>
                  • Mejorar mis conocimientos de arquitectura de
                  software.
                </li>
                <li>
                  • Crear proyectos cada vez más completos.
                </li>
                <li>
                  • Adquirir experiencia profesional.
                </li>
                <li>
                  • Seguir construyendo un perfil sólido como
                  desarrollador.
                </li>
              </ul>

              <blockquote className="mt-6 text-center italic text-rose-200/90">
                &ldquo;Todavía estoy construyendo mi camino, pero cada
                proyecto me acerca un nivel más a donde quiero llegar.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* =========================================================
            CTA FINAL
        ========================================================= */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-600/20 to-rose-500/10 p-10 text-center backdrop-blur-xl sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              🎮 GAME OVER... ¿O APENAS COMIENZA?
            </h2>

            <p className="mt-2 text-2xl font-bold text-red-300">
              ¿Construimos algo juntos?
            </p>

            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Si tienes una idea, un proyecto o simplemente quieres
              conocer más sobre mi trabajo, puedes encontrarme en:
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

              <button
                onClick={resetProgress}
                type="button"
                className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400"
              >
                VOLVER A JUGAR
              </button>

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

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 px-4 py-8 pb-28 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Santiago Aguirre ·
          Portafolio Gamificado
        </p>

        <p className="mt-2 text-xs text-gray-600">
          Cada proyecto es un nuevo nivel.
        </p>
      </footer>
    </div>
  );
}