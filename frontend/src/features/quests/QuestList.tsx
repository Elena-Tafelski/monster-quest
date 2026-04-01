import { Link } from 'react-router-dom';
import { QuestCard } from './QuestCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusMessage } from '../../components/ui/StatusMessage';
import type { Quest } from './questTypes.ts';

interface QuestListProps {
  quests: Quest[];
  loading: boolean;
  onReload: () => void;
  error: string | null;
}

const QuestList = ({ quests, loading, onReload, error }: QuestListProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Bereich - Immer sichtbar */}
      <div className="flex items-center p-4 gap-4">
        <div className="w-10" />
        <h1 className="flex-1 text-center text-2xl font-bold text-gray-800">Quests</h1>
        
        <Link 
          to="/create" 
          className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-md hover:bg-green-700 transition active:scale-90"
          title="Neue Quest erstellen"
        >
          +
        </Link>
      </div>

      {/* Content Bereich - Variabler Inhalt */}
      <div className="p-4">
        {loading && <LoadingSpinner message="Beschwöre Monster..." />}

        {/* Fehler-Fall */}
        {!loading && error && (
          <StatusMessage 
            title="Verbindung verloren?" 
            message={error} 
            type="connection"
            onRetry={onReload}
            showBackButton={false}
          />
        )}

        {/* Leer-Fall */}
        {!loading && !error && quests.length === 0 && (
          <StatusMessage 
            title="Keine Quests" 
            message="Zeit, ein neues Abenteuer zu beginnen!" 
            type="empty"
            showBackButton={false}
          />
        )}

        {/* Erfolgs-Fall: Die Liste */}
        {!loading && !error && quests.length > 0 && (
          <div className="flex gap-4 flex-col md:flex-row flex-wrap justify-center">
            {quests.map(quest => <QuestCard key={quest.id} quest={quest} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestList;