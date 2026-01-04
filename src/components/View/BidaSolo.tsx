import { cn } from "@/lib/utils";
import { RoomService } from "@/services/room.service";
import { KeyRound, LogOut, Trophy, User } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const BidaSoloView = ({
  room,
  onUpdateScore,
  onUndo,
  isReadOnly,
}: {
  room: any;
  isReadOnly: boolean;
  onUpdateScore?: (playerId: string) => void;
  onUndo?: () => void;
}) => {
  const navigate = useNavigate();

  const players = useMemo(() => {
    if (!room?.players) return [];
    return [...room.players].sort((a, b) => a.id.localeCompare(b.id));
  }, [room?.players]);

  const handleChangePin = () => {
    if (confirm("Bạn muốn đăng xuất và đổi mã PIN khác?")) {
      localStorage.removeItem(`room_pin_${room.id}`);
      window.location.reload();
    }
  };

  const handleFinishGame = async () => {
    const pinKey = `room_pin_${room.id}`; // Đặt biến để tái sử dụng
    const savedPin = localStorage.getItem(pinKey);

    if (
      !confirm(
        "Xác nhận kết thúc ván đấu? Phòng này sẽ được đóng lại và xóa PIN lưu trữ."
      )
    )
      return;

    try {
      await RoomService.finish(room.id, savedPin || "");

      // XÓA MÃ PIN KHỎI LOCALSTORAGE SAU KHI KẾT THÚC THÀNH CÔNG
      localStorage.removeItem(pinKey);

      toast.success("Ván đấu đã kết thúc và dọn dẹp bộ nhớ!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi kết thúc ván");
    }
  };

  const scoreDiff = useMemo(() => {
    if (players.length < 2) return 0;
    return Math.abs((players[0]?.score || 0) - (players[1]?.score || 0));
  }, [players]);

  const totalScore = useMemo(() => {
    return players.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
  }, [players]);

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      <div className="flex-1 grid grid-cols-1 gap-4 min-h-0">
        {players.map((player: any, index: number) => (
          <div
            key={player.id}
            className={cn(
              "relative overflow-hidden p-6 rounded-[35px] border-2 transition-all flex flex-col justify-center",
              isReadOnly
                ? "cursor-default"
                : "cursor-pointer active:scale-[0.96]",
              index === 0
                ? "bg-gradient-to-br from-blue-600/20 to-slate-900/50 border-blue-500/30"
                : "bg-gradient-to-br from-amber-600/20 to-slate-900/50 border-amber-500/30"
            )}
            onClick={() => !isReadOnly && onUpdateScore?.(player.id)}
          >
            <Trophy
              className={cn(
                "absolute -right-6 -bottom-6 opacity-5 rotate-12",
                index === 0 ? "text-blue-400" : "text-amber-400"
              )}
              size={150}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div
                  className={cn(
                    "w-fit p-3 rounded-2xl",
                    index === 0
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight italic line-clamp-1">
                    {player.name}
                  </h3>
                  <p className="text-[10px] font-bold text-[#a8c5bb] uppercase tracking-widest opacity-60">
                    Cơ thủ {index + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "text-8xl font-black tabular-nums tracking-tighter leading-none",
                    index === 0 ? "text-blue-400" : "text-[#f2c94c]"
                  )}
                >
                  {player.score}
                </div>
                <p className="text-[10px] font-bold text-[#a8c5bb] uppercase opacity-40 mt-1">
                  Ván thắng
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 space-y-4 pb-4">
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 bg-white/5 border border-white/10 rounded-[24px] p-4 flex justify-around items-center">
            <div className="text-center">
              <p className="text-[9px] uppercase font-bold text-[#a8c5bb] opacity-50">
                Tổng
              </p>
              <p className="text-lg font-black text-white">{totalScore}</p>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="text-center">
              <p className="text-[9px] uppercase font-bold text-[#a8c5bb] opacity-50">
                Cách biệt
              </p>
              <p className="text-lg font-black text-[#f2c94c]">{scoreDiff}</p>
            </div>
          </div>

          {!isReadOnly ? (
            <>
              <button
                onClick={handleChangePin}
                className="bg-white/5 border border-white/10 rounded-[24px] flex flex-col items-center justify-center gap-1 active:scale-90 transition-all text-[#a8c5bb]"
              >
                <KeyRound size={18} />
                <span className="text-[7px] font-black uppercase">PIN</span>
              </button>
              {/* <button
                onClick={() => onUndo?.()}
                className="bg-red-500/10 border border-red-500/20 rounded-[24px] flex flex-col items-center justify-center gap-1 active:scale-90 transition-all text-red-400"
              >
                <RotateCcw size={18} />
                <span className="text-[7px] font-black uppercase">Undo</span>
              </button> */}
              <button
                onClick={handleFinishGame}
                className="bg-white/10 border border-white/20 rounded-[24px] flex flex-col items-center justify-center gap-1 active:scale-90 transition-all text-white"
              >
                <LogOut size={18} />
                <span className="text-[7px] font-black uppercase">End</span>
              </button>
            </>
          ) : (
            <div className="col-span-2 bg-white/5 border border-white/5 rounded-[24px] flex items-center justify-center px-4">
              <p className="text-[8px] font-bold text-[#a8c5bb] uppercase opacity-40 italic text-center">
                Chế độ xem
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
