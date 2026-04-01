import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuestList from './features/quests/QuestList.tsx';
import QuestForm from './features/quests/QuestForm';
import QuestDetail from './features/quests/QuestDetail';
import EditQuestPage from './features/quests/EditQuestPage';
import { questService } from './features/quests/questService';
import type { Quest } from './features/quests/questTypes';
import "./App.css";

function App() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuests = () => {
    setLoading(true);
    setError(null);
    questService.fetchQuests()
      .then(setQuests)
      .catch((err: any) => {
        setError(err.message || "Die Daten konnten nicht geladen werden. Bitte überprüfe deine Internetverbindung oder versuche es später erneut.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuests();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestList quests={quests} loading={loading} error={error} onReload={loadQuests} />} />
        <Route path="/quests/:id" element={<QuestDetail quests={quests} loading={loading} error={error} onReload={loadQuests} />} />
        <Route path="/create" element={<QuestForm onSuccess={loadQuests} />} />
        <Route path="/quests/:id/edit" element={
          <EditQuestPage quests={quests} onUpdate={loadQuests} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
