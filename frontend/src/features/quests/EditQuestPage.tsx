import { useParams, useNavigate } from 'react-router-dom';
import { QuestForm } from './QuestForm';
import { questService } from './questService';
import { StatusMessage } from '../../components/ui/StatusMessage';
import type { Quest } from './questTypes';

interface EditQuestPageProps {
  quests: Quest[];
  onUpdate: () => void;
}

const EditQuestPage = ({ quests, onUpdate }: EditQuestPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const quest = quests.find(q => q.id === Number(id));

  if (!quest) {
    return <StatusMessage title="Quest nicht gefunden" message="Die Quest, die du bearbeiten willst, existiert nicht." />;
  }

  const handleDelete = async (questId: number) => {
    try {
      await questService.deleteQuest(questId);
      onUpdate(); // Liste in App.tsx aktualisieren
      navigate('/'); // Nach Löschen zur Liste
    } catch (err: any) {
      alert(err.message || "Fehler beim Löschen der Quest.");
    }
  };

  return (
    <div className="py-10">
      <QuestForm 
        initialData={quest} 
        onSuccess={onUpdate} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default EditQuestPage;