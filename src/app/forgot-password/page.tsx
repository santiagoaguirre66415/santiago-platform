'use client';

import { useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';

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
      const redirectUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, redirectUrl);
      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo enviar el email';
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
            RECUPERAR
            <br />
            <span className="text-white/20">CONTRASEÑA</span>
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Te enviaremos un enlace a tu email
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="border border-white/10 bg-[#0b0d10]/90 backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
                RECUPERACIÓN
              </span>
            </div>
          </div>

          <div className="p-6">
            {sent ? (
              <div className="border border-emerald-500/30 bg-emerald-600/10 p-6 text-center">
                <p className="text-sm text-emerald-300">
                  Si existe una cuenta con ese email, recibirás un enlace.
                  Revisa también spam.
                </p>
              </div>
            ) : (
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 border border-red-600 bg-red-600 px-6 py-3 text-xs font-bold tracking-[0.2em] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </form>
              </>
            )}
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