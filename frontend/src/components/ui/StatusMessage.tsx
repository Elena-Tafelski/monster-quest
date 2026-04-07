import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface StatusMessageProps {
  title: string;
  message: string;
  type?: 'error' | 'empty' | 'connection';
  onRetry?: () => void;
  showBackButton?: boolean;
}

export const StatusMessage = ({
  title,
  message,
  type = 'error',
  onRetry,
  showBackButton = true,
}: StatusMessageProps) => {
  const emojis = {
    error: '😵‍💫',
    empty: '🛡️',
    connection: '📡',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-100 bg-white text-center',
        'mx-auto mt-10 max-w-lg p-8 shadow-xl'
      )}
    >
      <div className="mb-4 text-5xl">{emojis[type]}</div>

      <h2 className="text-xl font-bold text-gray-800">{title}</h2>

      <p className="mt-2 mb-3 text-gray-500">{message}</p>

      <div className="mt-6 flex flex-col gap-3">
        {showBackButton && (
          <Link
            to="/"
            className={clsx(
              'inline-block rounded-lg bg-blue-600 font-bold text-white',
              'px-6 py-3 shadow-md',
              'transition hover:bg-blue-700 active:scale-95'
            )}
          >
            Zurück zur Übersicht
          </Link>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-semibold text-blue-500 hover:underline"
          >
            🔄 Erneut versuchen
          </button>
        )}
      </div>
    </div>
  );
};
