'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { account } from '@/lib/appwrite';

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
    { href: '/', label: 'INICIO' },
    { href: '/courses', label: 'CURSOS' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <div className="mt-4 flex items-center justify-between border border-white/10 bg-[#0b0d10]/90 px-4 py-3 backdrop-blur-xl">
          {/* LOGO */}
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-[0.2em] text-white transition hover:text-red-500"
          >
            SANAS07A<span className="text-red-500">.DEV</span>
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 font-mono text-[10px] tracking-[0.2em] transition ${
                  isActive(link.href)
                    ? 'border border-red-600/40 bg-red-600/10 text-red-500'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* AUTH DESKTOP */}
          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-white/10" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white/40 transition hover:bg-white/5 hover:text-white"
                >
                  MI PROGRESO
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-red-500/30 bg-red-600/10 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-red-300 transition hover:bg-red-600/20"
                >
                  SALIR
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white/40 transition hover:bg-white/5 hover:text-white"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="border border-red-600 bg-red-600 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white transition hover:bg-red-500"
                >
                  REGISTRO
                </Link>
              </>
            )}
          </div>

          {/* BOTÓN MOBILE */}
          <button
            type="button"
            className="inline-flex items-center justify-center border border-white/10 p-2 text-white/60 transition hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Abrir menú"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* MENÚ MOBILE */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="mt-2 border border-white/10 bg-[#0b0d10]/95 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 font-mono text-[10px] tracking-[0.25em] transition ${
                    isActive(link.href)
                      ? 'border border-red-600/40 bg-red-600/10 text-red-500'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
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
                    className="px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-white/40 hover:bg-white/5 hover:text-white"
                  >
                    MI PROGRESO
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="border border-red-500/30 bg-red-600/10 px-4 py-3 text-left font-mono text-[10px] tracking-[0.25em] text-red-300 transition hover:bg-red-600/20"
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-white/40 hover:bg-white/5 hover:text-white"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="border border-red-600 bg-red-600 px-4 py-3 text-center font-mono text-[10px] tracking-[0.25em] text-white transition hover:bg-red-500"
                  >
                    REGISTRO
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