import { Link } from 'react-router-dom';

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
  showBackButton = true 
}: StatusMessageProps) => {
  
  const emojis = {
    error: "😵‍💫",
    empty: "🛡️",
    connection: "📡"
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
      <div className="text-5xl mb-4">{emojis[type]}</div>
      
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      
      <p className="text-gray-500 mt-2 mb-3">
        {message}
      </p>
      
      <div className="flex flex-col gap-3 mt-6">
        {showBackButton && (
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md active:scale-95"
          >
            Zurück zur Übersicht
          </Link>
        )}
        
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-sm text-blue-500 font-semibold hover:underline mt-2"
          >
            🔄 Erneut versuchen
          </button>
        )}
      </div>
    </div>
  );
};