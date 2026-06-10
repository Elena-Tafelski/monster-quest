import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { questService } from './features/quests/questService';
import QuestList from './features/quests/QuestList.tsx';
import QuestDetail from './features/quests/QuestDetail';
import QuestForm from './features/quests/QuestForm';
import EditQuestPage from './features/quests/EditQuestPage';
import type { Quest } from './features/quests/questTypes';

import './App.css';

function App() {
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [archivedQuests, setArchivedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const ERR_LOAD_QUESTS =
    'Die Daten konnten nicht geladen werden. ' +
    'Bitte überprüfe deine Internetverbindung oder versuche es später erneut.';

  const loadQuests = () => {
    setLoading(true);
    setError(null);

    // Wir feuern beide Anfragen gleichzeitig ab
    Promise.all([questService.fetchActiveQuests(), questService.fetchArchivedQuests()])
      .then(([active, archived]) => {
        setActiveQuests(active);
        setArchivedQuests(archived);
      })
      .catch((err: any) => {
        setError(err.message || ERR_LOAD_QUESTS);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const allQuests = [...activeQuests, ...archivedQuests];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <QuestList
              quests={activeQuests}
              loading={loading}
              error={error}
              onReload={loadQuests}
            />
          }
        />
        <Route
          path="/archive"
          element={
            <QuestList
              quests={archivedQuests}
              isArchive={true}
              loading={loading}
              error={error}
              onReload={loadQuests}
            />
          }
        />
        <Route
          path="/quests/:id"
          element={
            <QuestDetail quests={allQuests} loading={loading} error={error} onReload={loadQuests} />
          }
        />
        <Route path="/create" element={<QuestForm onSuccess={loadQuests} />} />
        <Route
          path="/quests/:id/edit"
          element={<EditQuestPage quests={allQuests} onUpdate={loadQuests} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
