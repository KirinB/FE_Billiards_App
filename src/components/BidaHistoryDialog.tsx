import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const PAGE_SIZE = 6;

export const BidaHistoryDialog = ({ room }: { room: any }) => {
  const [page, setPage] = useState(0);

  const fullHistory =
    room?.history?.filter((h: any) =>
      ["DISCARD", "DRAW", "START"].includes(h.rawLog?.type)
    ) || [];

  const totalPages = Math.ceil(fullHistory.length / PAGE_SIZE);
  const pageHistory = fullHistory.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 h-auto text-white shadow-xl transition-all active:scale-95"
        >
          <History className="size-4 text-[#f2c94c]" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Lịch sử ván đấu
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-[#121418] border-white/10 text-white max-w-[90vw] rounded-3xl overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-2 border-b border-white/5">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#f2c94c]">
              <History className="size-5" />
              <span className="uppercase tracking-tighter font-black">
                Nhật ký bàn đấu
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-2 min-h-[300px]">
          {fullHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <History className="size-12 mb-2" />
              <p className="text-xs font-bold uppercase">Chưa có dữ liệu</p>
            </div>
          ) : (
            pageHistory.map((h: any) => (
              <div
                key={h.id}
                className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {h.rawLog?.type === "DISCARD" ? (
                    <div className="relative size-10 bg-black/20 rounded-full flex items-center justify-center border border-white/10">
                      <span className="text-[10px] font-black">
                        {h.rawLog.ballValue}
                      </span>
                      <div className="absolute inset-0 bg-yellow-500/10 blur-sm rounded-full" />
                    </div>
                  ) : (
                    <div className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/20">
                      <span className="text-[8px] opacity-40 uppercase">
                        Card
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white/90">
                      {h.content}
                    </span>
                    <span className="text-[9px] text-white/30 font-medium">
                      {new Date(h.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {h.rawLog?.type === "DISCARD" && (
                  <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-500/20">
                    - {h.rawLog.count} LÁ
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-8 rounded-xl border-white/10 bg-white/5 disabled:opacity-20"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8 rounded-xl border-white/10 bg-white/5 disabled:opacity-20"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <span className="text-[10px] font-bold text-white/40 uppercase">
            Trang {page + 1} / {totalPages || 1}
          </span>

          <DialogClose asChild>
            <Button
              variant="ghost"
              className="h-8 text-[10px] font-black uppercase tracking-widest text-white/60"
            >
              Đóng
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
