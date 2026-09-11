import Link from 'next/link';

export default function CursoNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090b] px-4 text-white">
      <div className="text-center">
        <div className="font-mono text-[9px] tracking-[0.4em] text-red-500">
          MUNDO NO ENCONTRADO
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight">
          Este mundo aún no existe
        </h1>
        <p className="mt-4 text-sm text-white/40">
          Puede que estemos trabajando en él.
        </p>
        <Link
          href="/courses"
          className="mt-8 inline-block border border-red-600 bg-red-600 px-6 py-3 font-mono text-[10px] tracking-[0.2em] transition hover:bg-red-500"
        >
          ← VOLVER A CURSOS
        </Link>
      </div>
    </main>
  );
}