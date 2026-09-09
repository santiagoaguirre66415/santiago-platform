'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(() => {
        window.location.href = '/dashboard';
      })
      .catch(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await account.createEmailPasswordSession(email, password);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
        <p className="text-gray-400">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 px-4 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-lg shadow-xl shadow-red-500/5">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight transition hover:text-red-300"
            >
              Santiago<span className="text-red-400">.dev</span>
            </Link>
            <h1 className="mt-4 text-3xl font-bold">Iniciar sesión</h1>
            <p className="mt-2 text-sm text-gray-400">
              Accede a tu progreso y cursos
            </p>
          </div>

          {error && (
            <div
              className="mb-4 rounded-lg border border-red-400/30 bg-red-500/20 p-3 text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-500 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-gray-400 hover:text-red-300">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-300">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-red-400 transition hover:text-red-300"
            >
              Regístrate gratis
            </Link>
          </p>

          <p className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-gray-300"
            >
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}