import Link from 'next/link';

/**
 * Footer con contacto y redes.
 * Ajusta email / LinkedIn / GitHub a los tuyos.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-sm text-gray-500">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p>© {new Date().getFullYear()} Santiago Aguirre</p>

        <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Enlaces de contacto">
          <a
            href="mailto:santiago.aguirre66415@ucaldas.edu.co"
            className="transition hover:text-red-300"
          >
            Email
          </a>
          <a
            href="https://github.com/santiagoaguirre66415"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-red-300"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-red-300"
          >
            LinkedIn
          </a>
          <Link href="/login" className="transition hover:text-red-300">
            Acceder
          </Link>
        </nav>
      </div>
    </footer>
  );
}