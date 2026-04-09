import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { QuestCard } from './QuestCard';
import type { Quest } from './questTypes.ts';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusMessage } from '../../components/ui/StatusMessage';

interface QuestListProps {
  quests: Quest[];
  loading: boolean;
  onReload: () => void;
  error: string | null;
}

const QuestList = ({ quests, loading, onReload, error }: QuestListProps) => {
  return (
    <div className="mx-auto">
      {/* Header Bereich - Immer sichtbar */}
      <div className="flex items-center gap-4 px-4 pt-6 pb-2">
        <div className="w-10" />
        <h1 className="flex-1 text-center text-2xl font-bold text-gray-800">Quests</h1>

        <Link
          to="/create"
          className={clsx(
            'rounded-xl bg-green-600 font-bold text-white',
            'flex h-10 w-10 items-center justify-center shadow-md',
            'transition hover:bg-green-700 active:scale-90'
          )}
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
          <div className="xs:flex-row flex flex-col flex-wrap justify-center gap-4">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestList;
