import { useState } from 'react';
import { questService } from './questService';
import { RecurrenceOptions, type Recurrence } from './questTypes.ts';

export const QuestForm = ({ onQuestCreated }: { onQuestCreated: () => void }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>(RecurrenceOptions.NONE);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await questService.createQuest({
        title,
        difficulty,
        description,
        recurrence,
        completed: false,
        hardDeadline: false // Standardwert für den Test
      });
      setTitle(''); // Formular leeren
      onQuestCreated(); // Liste neu laden
    } catch (err: any) {
      // Hier fangen wir die Backend-Validierung ab!
      const msg = err.response?.data?.message || "Fehler beim Erstellen";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-gray-400 rounded-lg mb-8 bg-gray-50">
      <h2 className="font-bold mb-4">Quest-Schmiede (Test-Form)</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      <div className="flex flex-col gap-2">
        <input 
          placeholder="Titel (min 3 Zeichen)" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="border p-2"
        />
        
        <input 
          type="number" 
          placeholder="Difficulty (Test mal 99!)" 
          value={difficulty} 
          onChange={e => setDifficulty(Number(e.target.value))}
          className="border p-2"
        />

        <textarea 
          placeholder="Beschreibung (optional)" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="border p-2"
        />

        <select 
          value={recurrence} 
          onChange={e => setRecurrence(e.target.value as Recurrence)}
          className="border p-2"
        >
          {Object.values(RecurrenceOptions).map(opt => (
            <option key={opt as string} value={opt as string}>{opt as string}</option>
          ))}
        </select>

        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Quest in DB hämmern 🔨
        </button>
      </div>
    </form>
  );
};

/*
// Pseudo-Code für dein Formular
<input 
  type="date" 
  onChange={(e) => setDate(e.target.value)} 
/>

<input 
  type="time" 
  disabled={!date} // Button ist grau, wenn kein Datum gewählt wurde!
  onChange={(e) => setTime(e.target.value)} 
/>


const handleSubmit = () => {
    // 1. Pflichtfeld-Check
    if (!title.trim()) {
      setError("Titel ist Pflicht!");
      return;
    }
  
    // 2. Deine Spezial-Regel: Zeit nur mit Datum
    if (time && !date) {
      setError("Du kannst keine Uhrzeit ohne Datum festlegen.");
      return;
    }
  
    // Wenn alles okay ist -> Service aufrufen
    questService.createQuest({...});
  };

  <input 
  type="number" 
  min="1" 
  max="10" 
  value={difficulty}
  onChange={(e) => setDifficulty(parseInt(e.target.value))}
  className="border p-2 rounded"
/>*/