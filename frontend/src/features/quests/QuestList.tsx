import { useState, useEffect } from 'react';
import type { Quest } from './questTypes';
import { questService } from './questService';
import { QuestCard } from './QuestCard';
import { QuestForm } from './QuestForm';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const QuestList = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
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

  const handleQuestCreated = () => {
    setShowForm(false);
    loadQuests();
  };

  if (loading) return <LoadingSpinner message="Beschwöre Monster... " />;
  if (error) return <div className="text-red-500">Fehler: {error}</div>;

  return (
    <div>
      <h1 className="p-4">Quests</h1>

      <button 
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            showForm ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {showForm ? 'Abbrechen' : '+ Neue Quest'}
        </button>

      {showForm && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <QuestForm onQuestCreated={handleQuestCreated} />
        </div>
      )}

      <div className="quest-container flex gap-4 justify-center w-full flex-col md:flex-row p-4">
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default QuestList;