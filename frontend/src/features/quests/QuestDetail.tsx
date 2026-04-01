import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusMessage } from '../../components/ui/StatusMessage';
import type { Quest } from './questTypes';
import monsterImage from '../../assets/monster.png';
import formatDate from '../../utils/dateFormatter';
import { questService } from './questService';

interface QuestDetailProps {
  quests: Quest[];
  loading: boolean;
  onReload: () => void;
  error: string | null;
}

const QuestDetail = ({ quests, loading, onReload, error  }: QuestDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quest = quests.find(q => q.id === Number(id));

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
      alert(err.message || "Status konnte nicht geändert werden.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Bereich mit Monster und Navigation */}
      <div className="relative bg-gray-100 flex justify-center items-center p-8">
        <img src={monsterImage} alt="Monster" className="w-48 h-48 object-contain" />
        <Link
          to="/"
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-blue-600 flex items-center gap-1 shadow-sm hover:bg-white transition"
        >
          ← Zurück
        </Link>
        <Link
          to={`/quests/${quest.id}/edit`}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition"
        >
          ✏️
        </Link>
      </div>

      {/* Content Bereich */}
      <div className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{quest.title}</h1>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
            LVL {quest.difficulty}
          </span>
        </div>

        {quest.description && (
          <p>{quest.description}</p>
        )}

        <hr className="my-2 border-gray-100" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          {quest.deadline && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Deadline</p>
                {formatDate(quest.deadline)}
              </div>
            </div>
          )}

          {quest.recurrence && quest.recurrence !== 'NONE' && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">🔁</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Wiederholung</p>
                {quest.recurrence}
              </div>
            </div>
          )}
        </div>

        {quest.hardDeadline && (
          <div className="mt-2 flex items-center gap-2 bg-red-50 text-red-700 p-2 rounded-lg border border-red-100">
            <span className="animate-pulse">⚠️</span>
            <span className="text-xs font-bold uppercase tracking-wider">Harte Deadline - Keine Gnade!</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleToggle}
          className={`mt-6 w-full p-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all ${
            quest.completed
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }`}
        >
          {quest.completed ? '↩️ Quest reaktivieren' : '⚔️ Monster besiegen!'}
        </button>
      </div>
    </div>
  );
};

export default QuestDetail;