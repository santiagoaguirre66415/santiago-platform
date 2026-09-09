'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { account } from '@/lib/appwrite';

/**
 * Navbar glassmorphism — paleta roja/carmesí.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const current = await account.get();
        setUser({ name: current.name, email: current.email });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/courses', label: 'Cursos' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-lg shadow-red-500/5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white transition hover:text-red-300"
          >
            SANAS07A<span className="text-red-400">.DEV</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'bg-white/15 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
                >
                  Mi Progreso
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-rose-400"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive(link.href)
                      ? 'bg-white/15 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-white/10" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 hover:bg-white/10"
                  >
                    Mi Progreso
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-200 hover:bg-red-500/20"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/10"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}