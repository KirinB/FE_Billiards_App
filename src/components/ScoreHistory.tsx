import React, { useState } from "react";
import {
  TrashIcon,
  HistoryIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RoomService } from "@/services/room.service";

const PAGE_SIZE = 5;

const BiBadge = ({ bi, count }: { bi: number; count: number }) => {
  const colors: Record<number, string> = {
    3: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    6: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    9: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] text-black",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-black text-white ml-1 first:ml-0",
        colors[bi]
      )}
    >
      Bi {bi} × {count}
    </span>
  );
};

interface ScoreHistoryProps {
  room: any;
  onUpdateRoom: (newRoom: any) => void;
  isMinimal?: boolean;
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  room,
  onUpdateRoom,
  isMinimal = false,
}) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // LOGIC FIX: Đảm bảo trỏ đúng vào object chứa history/players
  const actualRoom = room?.room || room;
  const history = actualRoom?.history || [];
  const players = actualRoom?.players || [];

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const pageHistory = history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDelete = async (historyId: string) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn hoàn tác (xóa) lượt ghi điểm này?")
    )
      return;

    try {
      setLoading(true);
      const savedPin = localStorage.getItem(`room_pin_${actualRoom.id}`);

      const response = await RoomService.undoScore({
        roomId: actualRoom.id,
        historyId,
        pin: savedPin || "",
      });

      // Bóc tách data trước khi gọi onUpdateRoom để đồng bộ state cha
      const newData =
        response.data?.room || response.room || response.data || response;
      onUpdateRoom(newData);
      toast.success("Đã hoàn tác điểm số");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể hoàn tác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl bg-white/5 border-white/10 text-white w-full h-full"
        >
          <HistoryIcon className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden flex flex-col bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-white/90">
            <HistoryIcon className="size-5 opacity-50" /> Lịch sử điểm
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 space-y-3 max-h-[50vh] overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-2 opacity-30">
              <HistoryIcon className="size-10" />
              <p className="text-sm font-medium">Chưa có lượt ghi điểm nào</p>
            </div>
          ) : (
            pageHistory.map((h: any, i: number) => {
              const log = h.rawLog;
              if (!log) return null;

              const winner =
                players.find((p: any) => p.id === log.currentPlayerId)?.name ??
                "??";
              const losers = log.loserIds
                ?.map(
                  (id: string) =>
                    players.find((p: any) => p.id === id)?.name ?? "??"
                )
                .join(", ");

              const displayIndex = history.length - (page * PAGE_SIZE + i);
              const totalGain = log.totalEarned;

              return (
                <div
                  key={h.id}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-[18px] transition-all border",
                    isMinimal
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white/5 border-white/5"
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold opacity-30">
                        #{displayIndex}
                      </span>
                      <span className="font-bold text-sm text-emerald-400">
                        {winner}
                      </span>
                      <span className="text-[10px] opacity-50 uppercase font-bold text-white">
                        ăn
                      </span>
                      <span className="font-medium text-sm text-white/80">
                        {losers}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-1">
                        {log.events?.map((ev: any, idx: number) => (
                          <BiBadge
                            key={idx}
                            bi={ev.bi}
                            count={ev.count * (log.loserIds?.length || 1)}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-yellow-500 ml-1">
                        (+{totalGain})
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={loading}
                    className="text-red-400 hover:bg-red-500/10 shrink-0"
                    onClick={() => handleDelete(h.id)}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter
          className={cn(
            "p-4 mt-0 sm:justify-between items-center border-t gap-4",
            isMinimal
              ? "bg-slate-900 border-slate-800"
              : "bg-black/20 border-white/5"
          )}
        >
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-white/10 bg-white/5"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4 text-white" />
                </Button>
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-white">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-white/10 bg-white/5"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4 text-white" />
                </Button>
              </>
            )}
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-9 px-6 w-full bg-white/5 hover:bg-white/10 text-white"
            >
              Đóng lại
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreHistory;
