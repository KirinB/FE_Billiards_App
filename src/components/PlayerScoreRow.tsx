import { cn } from "@/lib/utils";
import imgCue from "@/assets/cue.png";
import AchievementBadge from "./AchievementBadge";

interface PlayerScoreRowProps {
  id: string; // ID người chơi từ Backend
  name: string;
  score?: number;
  active?: boolean;
  showCue?: boolean;
  onClick?: () => void;
  isMinimal?: boolean;
  size?: "default" | "sm";
  achievements?: any; // Nhận từ View cha
}

export function PlayerScoreRow({
  id,
  name,
  score,
  active,
  size = "default",
  showCue,
  onClick,
  isMinimal = false,
  achievements,
}: PlayerScoreRowProps) {
  const isNameOnly = score === undefined && !showCue;

  const content = (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-black text-sm uppercase transition-colors duration-200",
          active
            ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            : "text-slate-400"
        )}
      >
        {name}
      </span>
      {/* Hiển thị danh hiệu tại đây */}
      {achievements && (
        <AchievementBadge playerId={id} achievements={achievements} />
      )}
      {showCue && (
        <img
          src={imgCue}
          className="size-8 rotate-45 object-contain"
          alt="cue"
        />
      )}
    </div>
  );

  if (isMinimal) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded border transition-all mb-1 cursor-pointer",
          active
            ? "border-blue-500 bg-blue-50 font-bold"
            : "border-gray-200 dark:border-gray-700",
          isNameOnly && "justify-center py-2.5",
          size === "sm" && "py-1.5 text-xs"
        )}
      >
        {content}
        {score !== undefined && (
          <span
            className={cn(
              "font-bold",
              score < 0 ? "text-red-500" : "text-slate-700 dark:text-slate-300"
            )}
          >
            {score} điểm
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("mb-1.5 px-1 w-full")}>
      <div
        onClick={onClick}
        className="relative p-0.75 rounded-lg transition-transform active:scale-[0.97] shadow-lg cursor-pointer"
        style={{ backgroundColor: "#5d3a1a" }}
      >
        <div className="absolute top-0 left-0 size-3 bg-[#121212] rounded-br-full z-10 border-b border-black/30" />
        <div className="absolute top-0 right-0 size-3 bg-[#121212] rounded-bl-full z-10 border-b border-black/30" />
        <div className="absolute bottom-0 left-0 size-3 bg-[#121212] rounded-tr-full z-10 border-t border-black/30" />
        <div className="absolute bottom-0 right-0 size-3 bg-[#121212] rounded-tl-full z-10 border-t border-black/30" />

        <div
          className={cn(
            "relative w-full flex items-center px-4 overflow-hidden rounded-sm h-11 transition-all",
            size === "sm" && "h-9",
            active
              ? "bg-gradient-to-r from-[#2f6b55] to-[#1a3d32] text-white"
              : "bg-gradient-to-r from-slate-600 to-slate-700 text-slate-100",
            isNameOnly ? "justify-center" : "justify-between"
          )}
        >
          {content}
          {score !== undefined && (
            <div
              className={cn(
                "font-black text-base tabular-nums",
                score < 0
                  ? "text-red-500"
                  : active
                  ? "text-[#f2c94c]"
                  : "text-yellow-400/70"
              )}
            >
              {score} điểm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
