'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 8) {
      setError('Mínimo 8 caracteres');
      return;
    }
    if (!token || !email) {
      setError('Enlace inválido. Solicita uno nuevo.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || 'No se pudo actualizar');
        return;
      }
      setDone(true);
    } catch {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <p className="text-emerald-300">Contraseña actualizada correctamente.</p>
        <Link
          href="/login"
          className="mt-4 inline-block font-medium text-red-400 hover:text-red-300"
        >
          Iniciar sesión →
        </Link>
      </div>
    );
  }

  return (
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
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-2 block text-sm font-medium">
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-500 py-3 font-semibold text-white shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-rose-400 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Nueva contraseña</h1>
        <Suspense fallback={<p className="text-center text-gray-400">Cargando...</p>}>
          <ResetForm />
        </Suspense>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-red-400 hover:text-red-300">
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}