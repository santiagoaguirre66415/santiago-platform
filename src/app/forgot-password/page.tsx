'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Error al enviar');
        return;
      }
      setSent(true);
    } catch {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="mt-4 text-3xl font-bold">Recuperar contraseña</h1>
            <p className="mt-2 text-sm text-gray-400">
              Te enviaremos un enlace a tu email
            </p>
          </div>

          {sent ? (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-200">
              Si existe una cuenta con ese email, recibirás un enlace. Revisa
              también spam. El enlace caduca en 1 hora.
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="mb-4 rounded-lg border border-red-400/30 bg-red-500/20 p-3 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-500 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-gray-300">
            <Link href="/login" className="text-red-400 hover:text-red-300">
              ← Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}