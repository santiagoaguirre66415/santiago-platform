import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-red-600" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-red-500">
            ERROR
          </span>
          <div className="h-px w-10 bg-red-600" />
        </div>

        <h1 className="text-[clamp(6rem,15vw,12rem)] font-black leading-[0.8] tracking-[-0.07em] text-white/10">
          404
        </h1>

        <div className="mt-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500">
            PÁGINA NO ENCONTRADA
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35">
            Esta ruta no existe o el contenido aún está bloqueado.
            Vuelve al inicio y sigue explorando.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group flex items-center gap-3 border border-red-600 bg-red-600 px-7 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500"
          >
            IR AL INICIO
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            href="/dashboard"
            className="border border-white/10 px-7 py-3 text-xs font-bold tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:text-white"
          >
            MI PROGRESO
          </Link>
        </div>
      </div>
    </main>
  );
}