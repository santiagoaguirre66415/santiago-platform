'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') ?? '';
  const secret = searchParams.get('secret') ?? '';

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
    if (!userId || !secret) {
      setError('Enlace inválido o expirado. Solicita uno nuevo.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await account.updateRecovery(userId, secret, password);
      setDone(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo actualizar la contraseña';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-600/10 p-6 text-center">
        <p className="text-sm text-emerald-300">
          Contraseña actualizada correctamente.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block font-mono text-[9px] tracking-[0.25em] text-red-500 transition hover:text-red-400"
        >
          INICIAR SESIÓN →
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          className="mb-5 border border-red-500/30 bg-red-600/10 p-4 text-sm text-red-300"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40"
          >
            NUEVA CONTRASEÑA
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-red-600/50 focus:bg-white/[0.05]"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40"
          >
            CONFIRMAR CONTRASEÑA
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-red-600/50 focus:bg-white/[0.05]"
            placeholder="Repite la contraseña"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-3 border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'GUARDANDO...' : 'GUARDAR CONTRASEÑA'}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 text-white">
      {/* FONDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

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
            NUEVA
            <br />
            <span className="text-white/20">CONTRASEÑA</span>
          </h1>
        </div>

        {/* FORMULARIO */}
        <div className="border border-white/10 bg-[#0b0d10]/90 backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
                RESTABLECER
              </span>
            </div>
          </div>

          <div className="p-6">
            <Suspense
              fallback={
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-red-600/30 border-t-red-600" />
                  <p className="font-mono text-xs tracking-[0.3em] text-white/40">
                    CARGANDO...
                  </p>
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>

        {/* VOLVER */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="font-mono text-[9px] tracking-[0.25em] text-white/25 transition hover:text-white/50"
          >
            ← VOLVER A INICIAR SESIÓN
          </Link>
        </div>
      </div>
    </main>
  );
}