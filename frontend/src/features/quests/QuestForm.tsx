import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { questService } from './questService';
import type { Quest } from './questTypes';
import { RecurrenceOptions, type Recurrence } from './questTypes.ts';

interface QuestFormProps {
  initialData?: Quest;
  onSuccess: () => void;
  onDelete?: (id: number) => void;
}

const splitDeadline = (isoString?: string) => {
  if (!isoString) return { d: '', t: '' };
  const [d, fullTime] = isoString.split('T');
  const t = fullTime ? fullTime.substring(0, 5) : '';
  return { d, t };
};

export const QuestForm = ({ initialData, onSuccess, onDelete }: QuestFormProps) => {
  const navigate = useNavigate();

  const { d, t } = splitDeadline(initialData?.deadline);

  const [title, setTitle] = useState(initialData?.title || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 1);
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(d);
  const [time, setTime] = useState(t);
  const [hardDeadline, setHardDeadline] = useState(initialData?.hardDeadline || false);
  const [recurrence, setRecurrence] = useState<Recurrence>(
    initialData?.recurrence || RecurrenceOptions.NONE
  );

  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    // 1. Pflichtfelder
    if (title.trim().length < 3) {
      setError('Der Titel muss mindestens 3 Zeichen lang sein.');
      return false;
    }

    // 2. Deine Spezial-Logik (Abhängigkeiten)
    if (!date && (time || hardDeadline || recurrence !== 'NONE')) {
      setError('Uhrzeit/Harte Deadline/Wiederholung geht nur mit einem Datum.');
      return false;
    }

    // 3. Logik für Datum in der Vergangenheit
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() < today.getTime()) {
      setError('Das Datum darf nicht in der Vergangenheit liegen.');
      return false;
    }

    setError(null);
    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setIsSubmitting(true);

    let deadline = '';
    if (date) {
      deadline = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    }

    const questData = {
      title,
      difficulty,
      description,
      deadline,
      hardDeadline,
      recurrence,
      completed: initialData?.completed || false,
    };

    try {
      if (initialData) {
        await questService.updateQuest(initialData.id, questData);
      } else {
        await questService.createQuest(questData);
      }
      onSuccess();
      navigate(initialData ? `/quests/${initialData.id}` : '/');
    } catch (err: any) {
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-1 text-blue-500">
        ← Abbrechen
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{initialData ? 'Quest anpassen' : 'Quest-Schmiede'}</h2>

        {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}

        <input
          placeholder="Titel (min 3 Zeichen)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border p-2"
        />

        <input
          type="number"
          min="1"
          max="10"
          placeholder="Schwierigkeit"
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="rounded border p-2"
        />

        <textarea
          placeholder="Beschreibung (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded border p-2"
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
          className="rounded border p-2"
        />

        <input
          type="time"
          disabled={!date} // Button ist grau, wenn kein Datum gewählt wurde!
          placeholder="Uhrzeit (optional)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
        />

        <div className="flex items-center justify-between p-1">
          <span className="font-medium text-gray-700">Harte Deadline?</span>

          <button
            type="button"
            disabled={!date}
            onClick={() => setHardDeadline(!hardDeadline)}
            className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full',
              'transition-colors focus:outline-none',
              hardDeadline ? 'bg-green-600' : 'bg-gray-300'
            )}
          >
            <span
              className={clsx(
                'rounded-full bg-white',
                'inline-block h-4 w-4',
                'transform transition-transform',
                hardDeadline ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        <select
          disabled={!date}
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as Recurrence)}
          className="rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {Object.values(RecurrenceOptions).map((opt) => (
            <option key={opt as string} value={opt as string}>
              {opt as string}
            </option>
          ))}
        </select>

        <button
          disabled={isSubmitting}
          type="submit"
          className={clsx(
            'rounded-xl bg-blue-600 font-bold text-white',
            'mt-4 p-4 shadow-lg',
            'transition hover:bg-blue-700 disabled:opacity-50'
          )}
        >
          {isSubmitting ? 'Wird geschmiedet...' : initialData ? 'Speichern' : 'Erstellen'}
        </button>

        {/* LÖSCHEN OPTION */}
        {initialData && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Bist du sicher? Das Monster wird spurlos verschwinden!')) {
                onDelete(initialData.id);
              }
            }}
            className="mt-2 self-center text-sm text-gray-400 transition hover:text-red-500"
          >
            Quest aufgeben & löschen
          </button>
        )}
      </form>
    </div>
  );
};

export default QuestForm;
