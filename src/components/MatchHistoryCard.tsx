import { Trophy, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const MatchHistoryCard = ({
  p,
  onClick,
}: {
  p: any;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="group bg-[#161920] border border-white/5 hover:border-[#f2c94c]/30 rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div
          className={`size-10 rounded-xl flex items-center justify-center ${
            p.room.type === "BIDA_1VS1"
              ? "bg-blue-500/10 text-blue-400"
              : "bg-purple-500/10 text-purple-400"
          }`}
        >
          <Trophy size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm line-clamp-1">{p.room.name}</h3>
          <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
            <span className="uppercase font-bold">
              {p.room.type === "BIDA_1VS1" ? "Solo 1vs1" : "Điểm đền"}
            </span>
            <span>•</span>
            <span>
              {format(new Date(p.createdAt), "HH:mm dd/MM", {
                locale: vi,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right flex items-center gap-3">
        <div>
          <p className="text-lg font-black leading-none">{p.score}</p>
          <p className="text-[9px] text-white/30 uppercase mt-1 font-bold">
            Điểm
          </p>
        </div>
        <ChevronRight
          size={14}
          className="text-white/10 group-hover:text-[#f2c94c] transition-colors"
        />
      </div>
    </div>
  );
};
