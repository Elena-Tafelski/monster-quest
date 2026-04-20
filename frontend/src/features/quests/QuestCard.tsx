import { Link } from 'react-router-dom';
import clsx from 'clsx';
import type { Quest } from './questTypes.ts';
import formatDate from '../../utils/dateFormatter.ts';
import monsterImage from '../../assets/monster.png';

interface QuestCardProps {
  quest: Quest;
  isArchive?: boolean;
}

export const QuestCard = ({ quest, isArchive }: QuestCardProps) => {
  return (
    <Link
      to={`/quests/${quest.id}`}
      state={{ from: isArchive ? '/archive' : '/' }}
      className={clsx(
        'rounded-md border border-gray-300',
        'xs:w-[300px] flex items-center gap-2 p-4 shadow-md',
        'transition-shadow hover:shadow-lg'
      )}
    >
      <img src={monsterImage} alt="Monster" className="xs:w-[100px] w-[85px]" />
      <div className="flex flex-1 flex-col items-start">
        <h3 className="text-left">{quest.title}</h3>
        <p>Level: {quest.difficulty}</p>
        {quest.deadline && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <span>📅</span>
            {formatDate(quest.deadline)}
          </div>
        )}
        {quest.hardDeadline && (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
            ⚠️ HARTE DEADLINE
          </span>
        )}
      </div>
    </Link>
  );
};
