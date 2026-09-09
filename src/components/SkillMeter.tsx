/**
 * Medidor de habilidad (basado en ProgressBar, estilo skill).
 */
interface SkillMeterProps {
  name: string;
  level: number; // 0-100
}

export default function SkillMeter({ name, level }: SkillMeterProps) {
  const clamped = Math.min(100, Math.max(0, level));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-red-400/30 hover:bg-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-white">{name}</span>
        <span className="text-sm text-red-300">{clamped}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Nivel de ${name}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-700"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}