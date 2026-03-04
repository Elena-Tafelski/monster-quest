import type { Quest } from './questTypes.ts';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard = ({ quest }: QuestCardProps) => {
  return (
    <div className="quest-card flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md shadow-md flex-1">
      <h3>{quest.title}</h3>
      <p>Level: {quest.difficulty}</p>
      <span className={quest.completed ? 'text-green-500' : 'text-red-500'}>
        {quest.completed ? 'Abgeschlossen' : 'Offen'}
      </span>
    </div>
  );
};