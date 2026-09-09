'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { account, databases } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import type { Course, Enrollment, UserProfile } from '@/lib/types';

interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course;
  progressPercent: number;
}

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('santiago-portfolio-progress-v6');
      if (raw) {
        const parsed = JSON.parse(raw) as {
          xp?: number;
          nivelesDesbloqueados?: number[];
        };
        setPortfolioXp(parsed.xp ?? 0);
        setPortfolioLevels(parsed.nivelesDesbloqueados?.length ?? 1);
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
      <main className="flex min-h-screen items-center justify-center bg-[#08090b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-red-600/30 border-t-red-600" />
          <p className="font-mono text-xs tracking-[0.3em] text-white/40">
            CARGANDO...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white">
        <Navbar />
        <div className="mx-auto max-w-lg px-4 pt-32">
          <div className="border border-red-500/30 bg-red-600/10 p-6 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-6">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
              MI PROGRESO
            </span>

            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">
              {authUser?.name ?? 'ESTUDIANTE'}
            </h1>

            <p className="mt-2 text-sm text-white/35">
              {authUser?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start border border-red-500/30 bg-red-600/10 px-5 py-3 font-mono text-[9px] tracking-[0.25em] text-red-300 transition hover:bg-red-600/20"
          >
            CERRAR SESIÓN
          </button>
        </div>

        {/* STATS */}
        <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              NIVEL
            </span>
            <span className="mt-2 block text-3xl font-black text-red-500">
              {level}
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              XP TOTAL
            </span>
            <span className="mt-2 block text-3xl font-black text-white">
              {xp}
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              PORTAFOLIO
            </span>
            <span className="mt-2 block text-3xl font-black text-white">
              {portfolioLevels}/5
            </span>
            <span className="mt-1 block text-[10px] text-white/25">
              {portfolioXp} XP
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6">
            <span className="block font-mono text-[8px] tracking-[0.25em] text-white/25">
              CURSOS
            </span>
            <span className="mt-2 block text-3xl font-black text-white">
              {enrolled.length}
            </span>
          </div>
        </div>

        {/* CURSOS */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-[0.35em] text-red-500">
                MIS CURSOS
              </span>
              <h2 className="mt-1 text-2xl font-bold">
                Progreso de aprendizaje
              </h2>
            </div>

            <Link
              href="/courses"
              className="font-mono text-[9px] tracking-[0.2em] text-red-500 transition hover:text-red-400"
            >
              EXPLORAR →
            </Link>
          </div>

          {enrolled.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-white/35">
                Los cursos llegarán pronto. Mientras tanto, explora el portafolio gamificado.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500"
              >
                VER PORTAFOLIO
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolled.map(({ enrollment, course, progressPercent }) => (
                <Link
                  key={enrollment.$id}
                  href={course.slug ? `/courses/${course.slug}` : '/courses'}
                  className="block border border-white/10 bg-white/[0.02] p-6 transition hover:border-red-600/40 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="mt-1 text-sm text-white/35">
                        {enrollment.status === 'completed' ? 'COMPLETADO' : 'ACTIVO'}
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="h-2 overflow-hidden bg-white/10">
                        <div
                          className="h-full bg-red-600 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="mt-1 block text-right text-xs text-white/25">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}