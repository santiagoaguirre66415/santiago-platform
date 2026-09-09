'use client';

import { useEffect } from 'react';

/**
 * Toast de level-up — aparece al desbloquear un nivel.
 */
interface LevelUpToastProps {
  level: number;
  title: string;
  visible: boolean;
  onClose: () => void;
}

export default function LevelUpToast({
  level,
  title,
  visible,
  onClose,
}: LevelUpToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 top-24 z-[60] w-[min(90vw,22rem)] -translate-x-1/2 animate-[toast-in_0.35s_ease-out]"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-red-400/40 bg-slate-950/95 p-4 shadow-xl shadow-red-500/30 backdrop-blur-xl level-up-flash">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-lg font-bold text-white">
            {level}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-red-400">
              Level up!
            </p>
            <p className="truncate font-semibold text-white">
              Nivel {level}: {title}
            </p>
            <p className="text-xs text-gray-400">Nuevo contenido desbloqueado</p>
          </div>
        </div>
      </div>
    </div>
  );
}