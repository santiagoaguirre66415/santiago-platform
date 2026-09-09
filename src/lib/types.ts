/**
 * Tipos de la plataforma (coinciden con las colecciones de Appwrite)
 */

export type UserRole = 'student' | 'admin' | 'instructor';

export interface UserProfile {
  $id: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: UserRole;
  xp: number;
  level: number;
}

export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Course {
  $id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail_url: string | null;
  level: CourseLevel;
  is_published: boolean;
  order: number;
}

export interface Module {
  $id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  $id: string;
  module_id: string;
  title: string;
  content: string;
  video_url: string | null;
  order: number;
  duration_minutes: number;
}

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface Enrollment {
  $id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
}

export interface Progress {
  $id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
}

export interface Achievement {
  $id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

export interface Certificate {
  $id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at: string;
}

/** Curso con módulos y lecciones anidados (para detalle) */
export interface CourseWithModules extends Course {
  modules: (Module & { lessons: Lesson[] })[];
}