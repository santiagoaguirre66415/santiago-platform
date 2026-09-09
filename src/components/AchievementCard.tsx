/**
 * Tarjeta de logro / badge desbloqueado.
 */
interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  xp?: number;
}

export default function AchievementCard({
  icon,
  title,
  description,
  unlocked,
  xp,
}: AchievementCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        unlocked
          ? 'border-red-400/30 bg-red-500/10 shadow-md shadow-red-500/10'
          : 'border-white/10 bg-white/5 opacity-40 grayscale'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-3xl" aria-hidden="true">
          {icon}
        </span>
        {unlocked && typeof xp === 'number' && (
          <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300">
            +{xp} XP
          </span>
        )}
      </div>
      <h3 className={`font-semibold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
      {!unlocked && (
        <p className="mt-3 text-xs text-gray-500">🔒 Bloqueado</p>
      )}
    </div>
  );
}