import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questService } from './questService';
import { RecurrenceOptions, type Recurrence } from './questTypes.ts';

export const QuestForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hardDeadline, setHardDeadline] = useState(false);
  const [recurrence, setRecurrence] = useState<Recurrence>(RecurrenceOptions.NONE);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    // 1. Pflichtfelder
    if (title.trim().length < 3) {
      setError("Der Titel muss mindestens 3 Zeichen lang sein.");
      return false;
    }

    // 2. Deine Spezial-Logik (Abhängigkeiten)
    if (!date && (time || hardDeadline || recurrence !== 'NONE')) {
      setError("Uhrzeit/Harte Deadline/Wiederholung geht nur mit einem Datum.");
      return false;
    }

    // 3. Logik für Datum in der Vergangenheit
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() < today.getTime()) {
      setError("Das Datum darf nicht in der Vergangenheit liegen.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    let deadline = '';
    if (date) {
      deadline = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    }

    try {
      await questService.createQuest({
        title,
        difficulty,
        description,
        deadline,
        hardDeadline,
        recurrence,
        completed: false,
      });
      navigate('/');
    } catch (err: any) {
      // Hier fangen wir die Backend-Validierung ab!
      const msg = err.response?.data?.message || "Fehler beim Erstellen";
      setError(msg);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-xl mt-10">
      <button onClick={() => navigate('/')} className="text-blue-500 mb-4 flex items-center gap-1">
        ← Abbrechen
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Quest-Schmiede</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <input 
          placeholder="Titel (min 3 Zeichen)" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        
        <input 
          type="number" 
          min="1" 
          max="10"
          placeholder="Schwierigkeit" 
          value={difficulty} 
          onChange={e => setDifficulty(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <textarea 
          placeholder="Beschreibung (optional)" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input 
          type="date" 
          placeholder="Datum (optional)" 
          value={date} 
          onChange={(e) => {
            setDate(e.target.value);
            if (!e.target.value) {
              // Wenn Datum gelöscht wird, setzen wir Abhängigkeiten zurück
              setHardDeadline(false);
              setRecurrence(RecurrenceOptions.NONE);
              setTime('');
            }
          }}
          className="border p-2 rounded"
        />

        <input 
          type="time" 
          disabled={!date} // Button ist grau, wenn kein Datum gewählt wurde!
          placeholder="Uhrzeit (optional)" 
          value={time} 
          onChange={e => setTime(e.target.value)} 
          className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-400"
        />

        <div className="flex items-center justify-between p-1">
          <span className="font-medium text-gray-700">Harte Deadline?</span>
          
          <button
            type="button"
            disabled={!date}
            onClick={() => setHardDeadline(!hardDeadline)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              hardDeadline ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hardDeadline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <select 
          disabled={!date}
          value={recurrence} 
          onChange={e => setRecurrence(e.target.value as Recurrence)}
          className="border p-2 rounded disabled:bg-gray-100 disabled:text-gray-400"
        >
          {Object.values(RecurrenceOptions).map(opt => (
            <option key={opt as string} value={opt as string}>{opt as string}</option>
          ))}
        </select>

        <button type="submit" className="bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700">
          Quest erstellen
        </button>
      </form>
    </div>
  );
};

export default QuestForm;