/**
 * Mensaje de error accesible y reutilizable.
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-center"
      role="alert"
    >
      <p className="text-sm text-red-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/30"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}