import { cn } from "@/lib/utils";
import { Eye, KeyRound, LogOut, RotateCcw, Trophy, User } from "lucide-react";
import { useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export const BidaSoloView = ({
  room,
  onUpdateScore,
  isReadOnly,
  onUndo,
  finishRoom,
}: {
  room: any;
  isReadOnly: boolean;
  onUpdateScore?: (playerId: string) => void;
  onUndo?: () => void;
  finishRoom: () => void;
}) => {
  // const navigate = useNavigate();

  const players = useMemo(() => {
    return [...(room?.players || [])].sort((a, b) => a.id - b.id);
  }, [room?.players]);

  const handleConfirmChangePin = () => {
    localStorage.removeItem(`room_pin_${room.id}`);
    window.location.reload();
  };
  //   const pinKey = `room_pin_${room.id}`;
  //   const savedPin = localStorage.getItem(pinKey);

  //   if (
  //     !confirm("Xác nhận kết thúc ván đấu? Phòng sẽ đóng và xóa PIN hoàn toàn.")
  //   )
  //     return;

  //   try {
  //     await RoomService.finish(room.id, savedPin || "");
  //     localStorage.removeItem(pinKey);
  //     toast.success("Ván đấu đã kết thúc!");
  //     navigate("/");
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Lỗi khi kết thúc ván");
  //   }
  // };

  const scoreDiff = useMemo(() => {
    if (players.length < 2) return 0;
    return Math.abs((players[0]?.score || 0) - (players[1]?.score || 0));
  }, [players]);

  const totalScore = useMemo(() => {
    return players.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
  }, [players]);

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      {/* GRID PLAYERS */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {players.map((player: any, index: number) => (
          <div
            key={player.id}
            className={cn(
              "relative overflow-hidden p-8 rounded-[40px] border-2 transition-all flex flex-col justify-center",
              isReadOnly
                ? "cursor-default"
                : "cursor-pointer active:scale-[0.98] hover:border-white/20",
              index === 0
                ? "bg-gradient-to-br from-blue-600/25 to-slate-900/60 border-blue-500/30"
                : "bg-gradient-to-br from-amber-600/25 to-slate-900/60 border-amber-500/30"
            )}
            onClick={() => !isReadOnly && onUpdateScore?.(player.id)}
          >
            <Trophy
              className={cn(
                "absolute -right-10 -bottom-10 opacity-5 rotate-12",
                index === 0 ? "text-blue-400" : "text-amber-400"
              )}
              size={280}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-4 rounded-2xl",
                    index === 0
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight italic line-clamp-1">
                    {player.name}
                  </h3>
                  <p className="text-xs font-bold text-[#a8c5bb] uppercase tracking-widest opacity-60">
                    Cơ thủ {index + 1}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center md:text-right">
                <div
                  className={cn(
                    "text-[120px] md:text-[160px] font-black tabular-nums tracking-tighter leading-none drop-shadow-2xl",
                    index === 0 ? "text-blue-400" : "text-[#f2c94c]"
                  )}
                >
                  {player.score}
                </div>
                <p className="text-sm font-bold text-[#a8c5bb] uppercase opacity-40 mt-2">
                  Ván thắng
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="shrink-0 pt-2 pb-8 space-y-3">
        {/* Chỉ số tổng hợp */}
        <div className="w-full bg-white/5 border border-white/10 rounded-[28px] p-5 flex justify-around items-center backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <p className="text-[11px] uppercase font-bold text-[#a8c5bb] opacity-50 tracking-widest">
              Tổng điểm
            </p>
            <p className="text-2xl font-black text-white">{totalScore}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex flex-col items-center">
            <p className="text-[11px] uppercase font-bold text-[#a8c5bb] opacity-50 tracking-widest">
              Cách biệt
            </p>
            <p className="text-2xl font-black text-[#f2c94c]">{scoreDiff}</p>
          </div>
        </div>

        {/* CÁC NÚT BẤM DÙNG SHADCN BUTTON */}
        <div className="grid grid-cols-3 gap-3">
          {!isReadOnly ? (
            <>
              {/* Nút Hoàn tác */}
              {/* <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onUndo?.();
                }}
                className="h-auto aspect-square bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all text-[#a8c5bb]"
              >
                <div className="p-3 bg-white/5 rounded-full">
                  <RotateCcw size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  Hoàn tác
                </span>
              </Button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={isReadOnly}
                    // Giữ lại class layout để nút này vẫn là hình vuông trong grid
                    className="h-auto aspect-square bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all text-[#a8c5bb]"
                  >
                    <div className="p-3 bg-white/5 rounded-full">
                      <RotateCcw size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Hoàn tác
                    </span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận hoàn tác?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa kết quả của ván đấu vừa rồi
                      không? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onUndo?.()}>
                      Xác nhận xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Nút Mã PIN */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto aspect-square bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all text-[#a8c5bb]"
                  >
                    <div className="p-3 bg-white/5 rounded-full">
                      <KeyRound size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Mã PIN
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Đăng xuất & Đổi PIN?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ được đăng xuất khỏi bàn này để nhập mã PIN khác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmChangePin}>
                      Đăng xuất
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Nút Kết thúc */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="h-auto aspect-square bg-red-500/10 border border-red-500/20 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-red-500/20 text-red-500 transition-all"
                  >
                    <div className="p-3 bg-red-500/10 rounded-full">
                      <LogOut size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Kết thúc
                    </span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Kết thúc ván đấu?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Xác nhận kết thúc ván đấu? Phòng sẽ đóng và mã PIN sẽ được
                      xóa hoàn toàn khỏi thiết bị này.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => finishRoom()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Kết thúc ngay
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <div className="col-span-3 bg-white/5 border border-white/5 rounded-[28px] py-6 flex items-center justify-center gap-3">
              <Eye size={20} className="text-[#a8c5bb] animate-pulse" />
              <p className="text-sm font-bold text-[#a8c5bb] uppercase tracking-widest italic">
                Chế độ xem trực tiếp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
