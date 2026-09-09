'use client';

import { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { Course, CourseLevel } from '@/lib/types';

const LEVELS: Array<CourseLevel | 'Todos'> = [
  'Todos',
  'Principiante',
  'Intermedio',
  'Avanzado',
];

/**
 * Listado de cursos — paleta roja/carmesí.
 */
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CourseLevel | 'Todos'>('Todos');

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const queries = [
        Query.equal('is_published', true),
        Query.orderAsc('order'),
      ];

      if (filter !== 'Todos') {
        queries.push(Query.equal('level', filter));
      }

      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID!,
        queries
      );

      setCourses(response.documents as unknown as Course[]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudieron cargar los cursos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Cursos</h1>
          <p className="mt-2 text-gray-400">
            Elige un curso y empieza a aprender a tu ritmo.
          </p>
        </div>

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por nivel"
        >
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilter(level)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === level
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/25'
                  : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              aria-pressed={filter === level}
            >
              {level}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner label="Cargando cursos..." />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchCourses} />
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
            <p className="text-gray-400">
              No hay cursos {filter !== 'Todos' ? `de nivel ${filter}` : ''} por
              ahora.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.$id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}