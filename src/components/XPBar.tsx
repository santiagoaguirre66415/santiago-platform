'use client';

/**
 * Barra de XP fija (scroll progress del portafolio).
 * value: 0-100
 */
interface XPBarProps {
  value: number;
  level: number;
  label?: string;
}

export default function XPBar({ value, level, label }: XPBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-xl"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-sm font-bold text-white shadow-lg shadow-red-500/25">
          {level}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate text-gray-400">
              {label ?? `Nivel ${level}`}
            </span>
            <span className="font-medium text-red-300">{Math.round(clamped)}% XP</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Experiencia del portafolio"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}