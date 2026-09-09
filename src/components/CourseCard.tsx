import Link from 'next/link';
import type { Course } from '@/lib/types';

/**
 * Tarjeta de curso — paleta roja/carmesí.
 */
interface CourseCardProps {
  course: Course;
  lessonsCount?: number;
}

export default function CourseCard({ course, lessonsCount }: CourseCardProps) {
  const levelColors: Record<string, string> = {
    Principiante: 'bg-emerald-500/20 text-emerald-300',
    Intermedio: 'bg-red-500/20 text-red-300',
    Avanzado: 'bg-rose-500/20 text-rose-300',
  };

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-red-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/10"
    >
      <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/30 to-rose-500/20">
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt=""
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-red-300/60">
            {course.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            levelColors[course.level] ?? 'bg-white/10 text-gray-300'
          }`}
        >
          {course.level}
        </span>
        {typeof lessonsCount === 'number' && (
          <span className="text-xs text-gray-400">{lessonsCount} lecciones</span>
        )}
      </div>

      <h3 className="text-lg font-semibold transition group-hover:text-red-300">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-400">
        {course.description}
      </p>
    </Link>
  );
}