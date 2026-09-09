import Link from 'next/link';

/**
 * 404 con estilo de la plataforma.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 px-4 text-white">
      <p className="text-sm font-medium uppercase tracking-widest text-red-400">
        Error 404
      </p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-center text-gray-400">
        Esta ruta no existe o el contenido aún está bloqueado. Vuelve al inicio y
        sigue explorando.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400"
        >
          Ir al inicio
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Mi Progreso
        </Link>
      </div>
    </main>
  );
}