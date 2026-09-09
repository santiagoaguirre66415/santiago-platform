/**
 * Barra de progreso con gradiente rojo/carmesí.
 */
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-red-300">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className="h-2.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progreso ${Math.round(clamped)}%`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}