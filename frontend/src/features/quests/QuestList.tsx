import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Quest } from './questTypes';
import { questService } from './questService';
import { QuestCard } from './QuestCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const QuestList = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  const loadQuests = () => {
    setLoading(true);
    questService.fetchQuests()
      .then(setQuests)
      .catch(() => setError("Konnte Quests nicht laden"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuests();
  }, []);

  if (loading) return <LoadingSpinner message="Beschwöre Monster... " />;
  if (error) return <div className="text-red-500">Fehler: {error}</div>;

  return (
    <div>
      <div className="flex items-end p-4 gap-4">
        <h1 className="pl-[56px] flex-1 text-center">Quests</h1>
        
        <Link 
          to="/create" 
          className="mb-1 bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-md hover:bg-green-700 transition"
        >
          +
        </Link>
      </div>

      <div className="quest-container flex gap-4 justify-center w-full flex-col md:flex-row p-4">
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default QuestList;