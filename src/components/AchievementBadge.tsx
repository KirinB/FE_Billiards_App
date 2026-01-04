import { Flame, Target } from "lucide-react";

interface AchievementBadgeProps {
  playerId: string; // Đổi thành string vì Postgres UUID
  achievements: {
    topBi9Id: string | null;
    maxTurnId: string | null;
    topBi9Count: number;
    maxTurnScore: number;
  };
}

const AchievementBadge = ({
  playerId,
  achievements,
}: AchievementBadgeProps) => {
  const isTopBi9 =
    playerId === achievements.topBi9Id && achievements.topBi9Count > 0;
  const isMaxTurn =
    playerId === achievements.maxTurnId && achievements.maxTurnScore > 0;

  if (!isTopBi9 && !isMaxTurn) return null;

  return (
    <div className="flex gap-2 items-center ml-1">
      {isTopBi9 && (
        <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-sm border border-white/10 shadow-sm">
          <Target className="size-3 text-yellow-400" />
          <span className="text-[9px] font-black text-yellow-400 leading-none">
            {achievements.topBi9Count}
          </span>
        </div>
      )}

      {isMaxTurn && (
        <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-sm border border-white/10 shadow-sm">
          <Flame className="size-3 text-orange-500" />
          <span className="text-[9px] font-black text-orange-500 leading-none">
            +{achievements.maxTurnScore}
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
