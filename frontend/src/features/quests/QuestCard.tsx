import type { Quest } from './questTypes.ts';
import formatDate from '../../utils/dateFormatter.ts';
import monsterImage from '../../assets/monster.png';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard = ({ quest }: QuestCardProps) => {
  return (
    <div className="flex items-center p-4 border border-gray-300 rounded-md shadow-md gap-2">
      <img src={monsterImage} alt="Monster" className="w-1/3" />
      <div className="flex flex-col flex-1 items-start">
        <div className="flex justify-between w-full items-start">
          <h3 className="text-left">{quest.title}</h3>
          <button className="border border-gray-300 rounded p-px">✏️</button>
        </div>
        <p>Level: {quest.difficulty}</p>
        {quest.deadline && (
          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <span>📅</span>
            {formatDate(quest.deadline)}
          </div>
        )}
        {quest.hardDeadline && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
            ⚠️ HARTE DEADLINE
          </span>
        )}
        <p>Details ⏷</p>
      </div>
    </div>
  );
};