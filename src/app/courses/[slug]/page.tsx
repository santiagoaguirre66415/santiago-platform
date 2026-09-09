'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Query, ID } from 'appwrite';
import { account, databases } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { Course, Module, Lesson, Enrollment } from '@/lib/types';

/**
 * Página de detalle de un curso: módulos, lecciones e inscripción.
 */
export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Curso por slug
      const courseRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID!,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (courseRes.documents.length === 0) {
        setError('Curso no encontrado');
        setLoading(false);
        return;
      }

      const courseDoc = courseRes.documents[0] as unknown as Course;
      setCourse(courseDoc);

      // Módulos
      const modulesRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MODULES_COLLECTION_ID!,
        [Query.equal('course_id', courseDoc.$id), Query.orderAsc('order')]
      );

      const modulesWithLessons = await Promise.all(
        modulesRes.documents.map(async (mod) => {
          const lessonsRes = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_LESSONS_COLLECTION_ID!,
            [Query.equal('module_id', mod.$id), Query.orderAsc('order')]
          );
          return {
            ...(mod as unknown as Module),
            lessons: lessonsRes.documents as unknown as Lesson[],
          };
        })
      );

      setModules(modulesWithLessons);

      // Usuario + inscripción
      try {
        const user = await account.get();
        setUserId(user.$id);

        const enrollRes = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_ENROLLMENTS_COLLECTION_ID!,
          [
            Query.equal('user_id', user.$id),
            Query.equal('course_id', courseDoc.$id),
            Query.limit(1),
          ]
        );

        if (enrollRes.documents.length > 0) {
          setEnrollment(enrollRes.documents[0] as unknown as Enrollment);
        }
      } catch {
        // No autenticado
        setUserId(null);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el curso';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleEnroll = async () => {
    if (!userId || !course) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const doc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ENROLLMENTS_COLLECTION_ID!,
        ID.unique(),
        {
          user_id: userId,
          course_id: course.$id,
          status: 'active',
          enrolled_at: new Date().toISOString(),
          completed_at: null,
        }
      );
      setEnrollment(doc as unknown as Enrollment);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo inscribir';
      setError(message);
    } finally {
      setEnrolling(false);
    }
  };

  const firstLesson =
    modules[0]?.lessons?.[0] ?? null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Cargando curso..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pt-28">
        <Navbar />
        <div className="mx-auto max-w-lg">
          <ErrorMessage message={error ?? 'Curso no encontrado'} onRetry={fetchData} />
          <Link href="/courses" className="mt-6 block text-center text-purple-400 hover:text-purple-300">
            ← Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {/* Header del curso */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
            {course.level}
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.title}</h1>
          <p className="mt-4 text-gray-300 leading-relaxed">{course.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {enrollment ? (
              firstLesson ? (
                <Link
                  href={`/courses/${course.slug}/${firstLesson.$id}`}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-500 hover:to-rose-400"
                >
                  Continuar curso
                </Link>
              ) : (
                <span className="rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-medium text-emerald-300">
                  Ya estás inscrito
                </span>
              )
            ) : (
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-500 hover:to-rose-400 disabled:opacity-50"
              >
                {enrolling ? 'Inscribiendo...' : 'Inscribirse gratis'}
              </button>
            )}
            <Link
              href="/courses"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10"
            >
              ← Todos los cursos
            </Link>
          </div>
        </div>

        {/* Módulos y lecciones */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold">Contenido del curso</h2>

          {modules.length === 0 ? (
            <p className="text-gray-400">Aún no hay módulos publicados.</p>
          ) : (
            modules.map((mod, idx) => (
              <div
                key={mod.$id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
              >
                <div className="border-b border-white/10 px-6 py-4">
                  <h3 className="font-semibold">
                    Módulo {idx + 1}: {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="mt-1 text-sm text-gray-400">{mod.description}</p>
                  )}
                </div>
                <ul className="divide-y divide-white/5">
                  {mod.lessons.map((lesson, lIdx) => (
                    <li key={lesson.$id}>
                      {enrollment ? (
                        <Link
                          href={`/courses/${course.slug}/${lesson.$id}`}
                          className="flex items-center justify-between px-6 py-3.5 text-sm transition hover:bg-white/5"
                        >
                          <span>
                            <span className="mr-3 text-gray-500">{lIdx + 1}.</span>
                            {lesson.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {lesson.duration_minutes} min
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between px-6 py-3.5 text-sm text-gray-500">
                          <span>
                            <span className="mr-3">{lIdx + 1}.</span>
                            {lesson.title}
                          </span>
                          <span className="text-xs">{lesson.duration_minutes} min</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}