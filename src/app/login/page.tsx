'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await account.createEmailPasswordSession(email, password);
      window.location.href = redirect;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-md">
        {/* LOGO */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="inline-block font-mono text-[10px] tracking-[0.35em] text-red-500"
          >
            SANAS07A.DEV
          </Link>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em]">
            INICIAR
            <br />
            <span className="text-white/20">SESIÓN</span>
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Accede a tu progreso y cursos
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="border border-white/10 bg-[#0b0d10]/90 backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
                ACCESO
              </span>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div
                className="mb-5 border border-red-500/30 bg-red-600/10 p-4 text-sm text-red-300"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40"
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-red-600/50 focus:bg-white/[0.05]"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40"
                >
                  CONTRASEÑA
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-red-600/50 focus:bg-white/[0.05]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <Link
                href="/forgot-password"
                className="block font-mono text-[9px] tracking-[0.2em] text-white/30 transition hover:text-red-500"
              >
                ¿OLVIDASTE TU CONTRASEÑA?
              </Link>

              <p className="text-sm text-white/35">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-red-500 transition hover:text-red-400"
                >
                  REGÍSTRATE GRATIS
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* VOLVER */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-mono text-[9px] tracking-[0.25em] text-white/25 transition hover:text-white/50"
          >
            ← VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(() => {
        window.location.href = '/dashboard';
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
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

  return (
    <Suspense fallback={<div className="text-white">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}