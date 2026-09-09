/**
 * Badge de nivel desbloqueado / bloqueado.
 */
interface LevelBadgeProps {
  level: number;
  title: string;
  unlocked: boolean;
  active?: boolean;
}

export default function LevelBadge({
  level,
  title,
  unlocked,
  active = false,
}: LevelBadgeProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
        unlocked
          ? active
            ? 'border-red-400/50 bg-red-500/20 shadow-lg shadow-red-500/20'
            : 'border-red-400/30 bg-red-500/10'
          : 'border-white/10 bg-white/5 opacity-50'
      }`}
      aria-label={`Nivel ${level}: ${title}${unlocked ? ' — desbloqueado' : ' — bloqueado'}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          unlocked
            ? 'bg-gradient-to-br from-red-600 to-rose-500 text-white'
            : 'bg-white/10 text-gray-500'
        }`}
      >
        {unlocked ? level : '🔒'}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">Nivel {level}</p>
        <p className={`truncate text-sm font-semibold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
          {title}
        </p>
      </div>
    </div>
  );
}