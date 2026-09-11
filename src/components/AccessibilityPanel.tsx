'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const {
    theme,
    fontSize,
    zoom,
    highContrast,
    reduceMotion,
    highlightLinks,
    setTheme,
    setFontSize,
    setZoom,
    toggleHighContrast,
    toggleReduceMotion,
    toggleHighlightLinks,
    reset,
  } = useAccessibility();

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={open}
        className="a11y-btn fixed bottom-6 right-6 z-[999] flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-600 bg-red-600 text-white shadow-lg shadow-red-500/30 transition hover:bg-red-500 md:h-14 md:w-14"
      >
        <svg
          className="h-5 w-5 md:h-6 md:w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v7m0 0l-4 7m4-7l4 7M7 10h10" />
        </svg>
      </button>

      {/* PANEL */}
      {open && (
        <div
          role="dialog"
          aria-label="Panel de accesibilidad"
          aria-modal="false"
          className="a11y-panel fixed bottom-24 right-4 z-[999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden border border-white/10 bg-[#0b0d10] shadow-2xl md:right-6 md:w-80"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/50">
                ACCESIBILIDAD
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar panel"
              className="text-white/40 transition hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4">
            {/* TEMA */}
            <div className="mb-5">
              <span className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40">
                TEMA
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  aria-pressed={theme === 'dark'}
                  className={`border px-3 py-2 text-xs font-medium transition ${
                    theme === 'dark'
                      ? 'border-red-600 bg-red-600/20 text-white'
                      : 'border-white/10 text-white/60 hover:bg-white/5'
                  }`}
                >
                  🌙 Oscuro
                </button>
                <button
                  onClick={() => setTheme('light')}
                  aria-pressed={theme === 'light'}
                  className={`border px-3 py-2 text-xs font-medium transition ${
                    theme === 'light'
                      ? 'border-red-600 bg-red-600/20 text-white'
                      : 'border-white/10 text-white/60 hover:bg-white/5'
                  }`}
                >
                  ☀️ Claro
                </button>
              </div>
            </div>

            {/* TAMAÑO DE TEXTO */}
            <div className="mb-5">
              <span className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40">
                TAMAÑO DE TEXTO
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    aria-pressed={fontSize === size}
                    className={`border py-2 text-xs font-bold transition ${
                      fontSize === size
                        ? 'border-red-600 bg-red-600/20 text-white'
                        : 'border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {size === 'sm' ? 'A-' : size === 'md' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>

            {/* LUPA / ZOOM */}
            <div className="mb-5">
              <span className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-white/40">
                🔍 LUPA / ZOOM
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['normal', 'lg', 'xl', 'xxl'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoom(z)}
                    aria-pressed={zoom === z}
                    className={`border py-2 text-xs font-bold transition ${
                      zoom === z
                        ? 'border-red-600 bg-red-600/20 text-white'
                        : 'border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {z === 'normal' ? '100%' : z === 'lg' ? '110%' : z === 'xl' ? '125%' : '150%'}
                  </button>
                ))}
              </div>
            </div>

            {/* OPCIONES */}
            <div className="space-y-2">
              <ToggleRow
                label="Alto contraste"
                description="Mejora la visibilidad"
                checked={highContrast}
                onChange={toggleHighContrast}
              />
              <ToggleRow
                label="Reducir animaciones"
                description="Menos movimiento"
                checked={reduceMotion}
                onChange={toggleReduceMotion}
              />
              <ToggleRow
                label="Resaltar enlaces"
                description="Subraya los links"
                checked={highlightLinks}
                onChange={toggleHighlightLinks}
              />
            </div>

            {/* RESET */}
            <button
              onClick={reset}
              className="mt-5 w-full border border-white/10 py-2 font-mono text-[9px] tracking-[0.25em] text-white/50 transition hover:border-red-600/40 hover:text-red-500"
            >
              RESTABLECER TODO
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="flex w-full items-center justify-between border border-white/10 bg-white/[0.02] p-3 text-left transition hover:bg-white/[0.04]"
    >
      <div>
        <div className="text-xs font-medium text-white">{label}</div>
        <div className="mt-0.5 text-[10px] text-white/40">{description}</div>
      </div>
      <div
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? 'bg-red-600' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  );
}