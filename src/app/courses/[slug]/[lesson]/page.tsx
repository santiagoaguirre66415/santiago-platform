'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Query, ID } from 'appwrite';
import { account, databases } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ProgressBar from '@/components/ProgressBar';
import type { Course, Lesson, Progress } from '@/lib/types';

/**
 * Vista de una lección individual + marcar como completada.
 */
export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lessonId = params.lesson as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Auth requerida
      const user = await account.get();
      setUserId(user.$id);

      // Curso
      const courseRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID!,
        [Query.equal('slug', slug), Query.limit(1)]
      );
      if (courseRes.documents.length === 0) {
        setError('Curso no encontrado');
        return;
      }
      const courseDoc = courseRes.documents[0] as unknown as Course;
      setCourse(courseDoc);

      // Verificar inscripción
      const enrollRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ENROLLMENTS_COLLECTION_ID!,
        [
          Query.equal('user_id', user.$id),
          Query.equal('course_id', courseDoc.$id),
          Query.limit(1),
        ]
      );
      if (enrollRes.documents.length === 0) {
        setError('Debes inscribirte al curso para ver esta lección');
        return;
      }

      // Lección
      const lessonDoc = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_LESSONS_COLLECTION_ID!,
        lessonId
      );
      setLesson(lessonDoc as unknown as Lesson);

      // Progreso existente
      const progressRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID!,
        [
          Query.equal('user_id', user.$id),
          Query.equal('lesson_id', lessonId),
          Query.limit(1),
        ]
      );
      if (progressRes.documents.length > 0) {
        setProgress(progressRes.documents[0] as unknown as Progress);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 401) {
        router.push('/login');
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Error al cargar la lección';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && lessonId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lessonId]);

  const handleComplete = async () => {
    if (!userId || !lesson || progress?.completed) return;

    setCompleting(true);
    try {
      if (progress) {
        // Actualizar
        const updated = await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID!,
          progress.$id,
          {
            completed: true,
            completed_at: new Date().toISOString(),
          }
        );
        setProgress(updated as unknown as Progress);
      } else {
        // Crear
        const created = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID!,
          ID.unique(),
          {
            user_id: userId,
            lesson_id: lesson.$id,
            completed: true,
            completed_at: new Date().toISOString(),
            time_spent_minutes: lesson.duration_minutes ?? 0,
          }
        );
        setProgress(created as unknown as Progress);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo marcar como completada';
      setError(message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Cargando lección..." />
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pt-28">
        <Navbar />
        <div className="mx-auto max-w-lg">
          <ErrorMessage message={error ?? 'Lección no encontrada'} onRetry={fetchData} />
          <Link
            href={`/courses/${slug}`}
            className="mt-6 block text-center text-purple-400 hover:text-purple-300"
          >
            ← Volver al curso
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.completed === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/courses" className="hover:text-purple-300">
            Cursos
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-purple-300">
            {course.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{lesson.title}</span>
        </nav>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
            {isCompleted && (
              <span className="shrink-0 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                Completada
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{lesson.duration_minutes} minutos</p>

          {/* Video (si hay) */}
          {lesson.video_url && (
            <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-black/40">
              <iframe
                src={lesson.video_url}
                title={lesson.title}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Contenido */}
          <div className="prose prose-invert mt-8 max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
              {lesson.content}
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
            <button
              type="button"
              onClick={handleComplete}
              disabled={completing || isCompleted}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-rose-400'
              }`}
            >
              {isCompleted
                ? '✓ Completada'
                : completing
                  ? 'Guardando...'
                  : 'Marcar como completada'}
            </button>
            <Link
              href={`/courses/${course.slug}`}
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10"
            >
              Volver al curso
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}