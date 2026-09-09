'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ID } from 'appwrite';
import { account, databases } from '@/lib/appwrite';

export default function RegisterPage() {
  const [name, setName] = useState('');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await account.create(ID.unique(), email, password, name);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id,
        {
          name,
          bio: '',
          avatar_url: null,
          role: 'student',
          xp: 0,
          level: 1,
        }
      );

      await account.createEmailPasswordSession(email, password);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la cuenta';
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
            <h1 className="mt-4 text-3xl font-bold">Crear cuenta</h1>
            <p className="mt-2 text-sm text-gray-400">
              Únete y empieza a aprender
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
                placeholder="Tu nombre"
              />
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-500 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400 disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-red-400 transition hover:text-red-300"
            >
              Inicia sesión
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