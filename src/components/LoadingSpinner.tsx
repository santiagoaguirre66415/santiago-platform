/**
 * Spinner de carga reutilizable.
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  label = 'Cargando...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div
	className={`${sizeClasses[size]} animate-spin rounded-full border-red-400/30 border-t-red-400`}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-gray-400">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}