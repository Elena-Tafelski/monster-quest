import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { questService } from './questService';
import { QuestForm } from './QuestForm';
import type { Quest } from './questTypes';
import { StatusMessage } from '../../components/ui/StatusMessage';

interface EditQuestPageProps {
  quests: Quest[];
  onUpdate: () => void;
}

const EditQuestPage = ({ quests, onUpdate }: EditQuestPageProps) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const previousPath = location.state?.from || '/';

  const quest = quests.find((q) => q.id === Number(id));

  if (!quest) {
    return (
      <StatusMessage
        title="Quest nicht gefunden"
        message="Die Quest, die du bearbeiten willst, existiert nicht."
      />
    );
  }

  const handleDelete = async (questId: number) => {
    try {
      await questService.deleteQuest(questId);
      onUpdate(); // Liste in App.tsx aktualisieren
      navigate(previousPath); // Nach Löschen zur Liste
    } catch (err: any) {
      alert(err.message || 'Fehler beim Löschen der Quest.');
    }
  };

  return (
    <div className="py-10">
      <QuestForm initialData={quest} onSuccess={onUpdate} onDelete={handleDelete} />
    </div>
  );
};

export default EditQuestPage;
