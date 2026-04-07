import { useParams, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { questService } from './questService';
import type { Quest } from './questTypes';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusMessage } from '../../components/ui/StatusMessage';
import formatDate from '../../utils/dateFormatter';
import monsterImage from '../../assets/monster.png';

interface QuestDetailProps {
  quests: Quest[];
  loading: boolean;
  onReload: () => void;
  error: string | null;
}

const QuestDetail = ({ quests, loading, onReload, error }: QuestDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quest = quests.find((q) => q.id === Number(id));

  if (loading) return <LoadingSpinner message="Beschwöre Monster..." />;

  // 1. Fall: Es gab einen echten Server-Fehler (aus der App.tsx)
  if (error) {
    return (
      <StatusMessage
        type="connection"
        title="Verbindung verloren?"
        message={error}
        onRetry={onReload}
        showBackButton={true}
      />
    );
  }

  // 2. Fall: Daten sind da, aber diese eine Quest-ID gibt es nicht
  if (!quest) {
    return (
      <StatusMessage
        type="error"
        title="Quest verschollen"
        message="Diese Quest existiert nicht (mehr) oder die URL ist falsch."
        showBackButton={true}
      />
    );
  }

  const handleToggle = async () => {
    try {
      await questService.toggleQuest(quest);
      onReload();
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Status konnte nicht geändert werden.');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* Header Bereich mit Monster und Navigation */}
      <div className="relative flex items-center justify-center bg-gray-100 p-8">
        <img src={monsterImage} alt="Monster" className="h-48 w-48 object-contain" />
        <Link
          to="/"
          className={clsx(
            'rounded-full bg-white/80 text-blue-600 backdrop-blur-sm',
            'absolute top-4 left-4 flex items-center gap-1 px-3 py-1 shadow-sm',
            'transition hover:bg-white'
          )}
        >
          ← Zurück
        </Link>
        <Link
          to={`/quests/${quest.id}/edit`}
          className={clsx(
            'rounded-full bg-white/80 backdrop-blur-sm',
            'absolute top-4 right-4 p-2 shadow-sm',
            'transition hover:bg-white'
          )}
        >
          ✏️
        </Link>
      </div>

      {/* Content Bereich */}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{quest.title}</h1>
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            LVL {quest.difficulty}
          </span>
        </div>

        {quest.description && <p>{quest.description}</p>}

        <hr className="my-2 border-gray-100" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          {quest.deadline && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Deadline</p>
                {formatDate(quest.deadline)}
              </div>
            </div>
          )}

          {quest.recurrence && quest.recurrence !== 'NONE' && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">🔁</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Wiederholung</p>
                {quest.recurrence}
              </div>
            </div>
          )}
        </div>

        {quest.hardDeadline && (
          <div
            className={clsx(
              'rounded-lg border border-red-100 bg-red-50 text-red-700',
              'mt-2 flex items-center gap-2 p-2'
            )}
          >
            <span className="animate-pulse">⚠️</span>
            <span className="text-xs font-bold tracking-wider uppercase">
              Harte Deadline - Keine Gnade!
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleToggle}
          className={clsx(
            'rounded-xl font-bold text-white',
            'mt-6 w-full p-4 shadow-lg',
            'transform transition-all active:scale-95',
            quest.completed
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          )}
        >
          {quest.completed ? '↩️ Quest reaktivieren' : '⚔️ Monster besiegen!'}
        </button>
      </div>
    </div>
  );
};

export default QuestDetail;
