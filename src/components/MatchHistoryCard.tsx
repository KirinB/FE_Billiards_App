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
  // Hàm xác định màu sắc dựa trên type
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "BIDA_1VS1":
        return "bg-blue-500/10 text-blue-400";
      case "BIDA_DIEM_DEN":
        return "bg-purple-500/10 text-purple-400";
      case "BIDA_BAI":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  // Hàm hiển thị tên chế độ chơi
  const getTypeText = (type: string) => {
    if (type === "BIDA_1VS1") return "Solo 1vs1";
    if (type === "BIDA_DIEM_DEN") return "Điểm đền";
    if (type === "BIDA_BAI") return "Bida bài";
    return type;
  };

  // Hàm hiển thị đơn vị điểm
  const getScoreUnit = (type: string) => {
    return type === "BIDA_1VS1" ? "Ván thắng" : "Điểm";
  };

  return (
    <div
      onClick={onClick}
      className="group bg-[#161920] border border-white/5 hover:border-[#f2c94c]/30 rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div
          className={`size-10 rounded-xl flex items-center justify-center transition-colors ${getTypeStyles(
            p.room.type
          )}`}
        >
          <Trophy size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm line-clamp-1">{p.room.name}</h3>
          <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
            <span className="uppercase font-bold">
              {getTypeText(p.room.type)}
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
            {getScoreUnit(p.room.type)}
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
