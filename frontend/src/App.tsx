import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import clsx from 'clsx';

import { questService } from './features/quests/questService';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import QuestList from './features/quests/QuestList.tsx';
import QuestDetail from './features/quests/QuestDetail';
import QuestForm from './features/quests/QuestForm';
import EditQuestPage from './features/quests/EditQuestPage';
import type { Quest } from './features/quests/questTypes';

import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [archivedQuests, setArchivedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const ERR_LOAD_QUESTS =
    'Die Daten konnten nicht geladen werden. ' +
    'Bitte überprüfe deine Internetverbindung oder versuche es später erneut.';

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    loadQuests();
  };

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
    if (token) {
      loadQuests();
    } else {
      setLoading(false);
    }
  }, [token]);

  const allQuests = [...activeQuests, ...archivedQuests];

  return (
    <div>
      {token && (
        <header
          className={clsx(
            'rounded-2xl border border-gray-200 bg-white',
            'xs:px-6 xs:py-3.5 mb-10 flex items-center justify-between p-3 shadow-sm sm:mx-4'
          )}
        >
          <div className="xs:gap-3 flex min-w-0 items-center gap-2.5">
            {/* Abgerundetes Avatar-Icon */}
            <div
              className={clsx(
                'rounded-xl border border-blue-100 bg-blue-50 text-sm font-bold text-blue-600',
                'xs:h-10 xs:w-10 flex h-9 w-9 shrink-0 items-center justify-center'
              )}
            >
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="flex min-w-0 flex-col">
              {/* Mobil ausgeblendet */}
              <span className="hidden text-xs font-medium text-gray-500 sm:inline">
                Angemeldet als
              </span>
              {/* Schneidet den Namen bei Überlänge mit "..." ab */}
              <span className="truncate text-sm font-bold text-gray-900">{username}</span>
            </div>
          </div>

          <button
            className={clsx(
              'rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700',
              'ml-3 flex shrink-0 cursor-pointer items-center gap-2 p-2.5 shadow-xs sm:px-4 sm:py-2',
              'transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95'
            )}
            onClick={() => {
              localStorage.clear();
              setToken(null);
              window.location.href = '/login';
            }}
            title="Abmelden"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {/* Text mobil ausgeblendet, nur Icon sichtbar */}
            <span className="hidden sm:inline">Abmelden</span>
          </button>
        </header>
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
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
              <QuestDetail
                quests={allQuests}
                loading={loading}
                error={error}
                onReload={loadQuests}
              />
            }
          />
          <Route path="/create" element={<QuestForm onSuccess={loadQuests} />} />
          <Route
            path="/quests/:id/edit"
            element={<EditQuestPage quests={allQuests} onUpdate={loadQuests} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
