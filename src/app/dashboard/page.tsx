'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { account, databases } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ProgressBar from '@/components/ProgressBar';
import type { Course, Enrollment, UserProfile } from '@/lib/types';

interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course;
  progressPercent: number;
}

/**
 * Dashboard / Mi Progreso — paleta roja/carmesí.
 */
export default function DashboardPage() {
  const [authUser, setAuthUser] = useState<{
    $id: string;
    name: string;
    email: string;
  } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrolled, setEnrolled] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioXp, setPortfolioXp] = useState(0);
  const [portfolioLevels, setPortfolioLevels] = useState(1);

  // Leer progreso del portafolio desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('santiago-portfolio-progress');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          xp?: number;
          unlockedLevels?: number[];
        };
        setPortfolioXp(parsed.xp ?? 0);
        setPortfolioLevels(parsed.unlockedLevels?.length ?? 1);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await account.get();
      setAuthUser({ $id: user.$id, name: user.name, email: user.email });

      try {
        const profileRes = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
          [Query.equal('$id', user.$id), Query.limit(1)]
        );
        if (profileRes.documents.length > 0) {
          setProfile(profileRes.documents[0] as unknown as UserProfile);
        }
      } catch {
        // Perfil opcional
      }

      const enrollRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ENROLLMENTS_COLLECTION_ID!,
        [Query.equal('user_id', user.$id)]
      );

      const enrolledCourses: EnrolledCourse[] = await Promise.all(
        enrollRes.documents.map(async (enrollDoc) => {
          const enrollment = enrollDoc as unknown as Enrollment;
          let course: Course | null = null;
          let progressPercent = 0;

          try {
            const courseDoc = await databases.getDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID!,
              enrollment.course_id
            );
            course = courseDoc as unknown as Course;

            const modulesRes = await databases.listDocuments(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_MODULES_COLLECTION_ID!,
              [Query.equal('course_id', course.$id)]
            );

            let totalLessons = 0;
            const lessonIds: string[] = [];

            for (const mod of modulesRes.documents) {
              const lessonsRes = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_LESSONS_COLLECTION_ID!,
                [Query.equal('module_id', mod.$id)]
              );
              totalLessons += lessonsRes.total;
              lessonIds.push(...lessonsRes.documents.map((l) => l.$id));
            }

            if (totalLessons > 0 && lessonIds.length > 0) {
              const progressRes = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID!,
                [
                  Query.equal('user_id', user.$id),
                  Query.equal('completed', true),
                  Query.equal('lesson_id', lessonIds),
                ]
              );
              progressPercent = Math.round(
                (progressRes.total / totalLessons) * 100
              );
            }
          } catch {
            // Curso no disponible
          }

          return {
            enrollment,
            course: course ?? {
              $id: enrollment.course_id,
              title: 'Curso no disponible',
              description: '',
              slug: '',
              thumbnail_url: null,
              level: 'Principiante' as const,
              is_published: false,
              order: 0,
            },
            progressPercent,
          };
        })
      );

      setEnrolled(enrolledCourses);
    } catch {
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await account.deleteSession('current');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Cargando..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pt-28">
        <Navbar />
        <div className="mx-auto max-w-lg">
          <ErrorMessage message={error} onRetry={fetchDashboard} />
        </div>
      </div>
    );
  }

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const xpInLevel = xp % 100;
  const xpToNext = 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mi Progreso</h1>
            <p className="mt-1 text-gray-400">
              Hola, {authUser?.name ?? 'estudiante'} 👋
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">Nivel</p>
            <p className="mt-1 text-3xl font-bold text-red-300">{level}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">XP total</p>
            <p className="mt-1 text-3xl font-bold text-rose-300">{xp}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">Portafolio</p>
            <p className="mt-1 text-3xl font-bold text-red-300">
              {portfolioLevels}/5
            </p>
            <p className="mt-1 text-xs text-gray-500">{portfolioXp} XP explorados</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">Cursos activos</p>
            <p className="mt-1 text-3xl font-bold">{enrolled.length}</p>
          </div>
        </div>

        {/* Barra de XP */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <ProgressBar
            value={(xpInLevel / xpToNext) * 100}
            label={`Progreso al nivel ${level + 1}`}
          />
          <p className="mt-2 text-xs text-gray-500">
            {xpInLevel} / {xpToNext} XP
          </p>
        </div>

        {/* Cursos inscritos */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mis cursos</h2>
            <Link
              href="/courses"
              className="text-sm font-medium text-red-400 hover:text-red-300"
            >
              Explorar más →
            </Link>
          </div>

          {enrolled.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
              <p className="text-gray-400">
                Los cursos llegarán pronto. Mientras tanto, explora el portafolio gamificado.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25"
              >
                Ver portafolio
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolled.map(({ enrollment, course, progressPercent }) => (
                <Link
                  key={enrollment.$id}
                  href={course.slug ? `/courses/${course.slug}` : '/courses'}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-red-400/30 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        Estado:{' '}
                        {enrollment.status === 'completed'
                          ? 'Completado'
                          : 'Activo'}
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <ProgressBar value={progressPercent} showPercentage />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}