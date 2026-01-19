import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Target, Users } from "lucide-react";

interface Player {
  id: number;
  name: string;
  userId: number | null;
  tempIdentity?: string | null;
}

interface PickPlayerModalProps {
  open: boolean;
  players: Player[];
  onSelect: (playerId: number) => void;
  onClose?: () => void;
}

export const PickPlayerModal = ({
  open,
  players,
  onSelect,
  onClose,
}: PickPlayerModalProps) => {
  // Lọc danh sách các vị trí chưa có người nhận
  const availablePlayers = players.filter(
    (p) => (p.userId === null || p.userId === undefined) && !p.tempIdentity
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a3d32] border-[#2a4d40] text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f2c94c]/10">
              <Target className="size-6 text-[#f2c94c]" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl">
                Chọn vị trí cơ thủ
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Xác nhận danh tính để vào bàn
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2">
          <p className="text-xs sm:text-sm text-white/60 mb-5 leading-relaxed italic">
            Vui lòng chọn tên của bạn (hoặc vị trí bạn đang ngồi) để hệ thống
            ghi nhận điểm:
          </p>

          <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {availablePlayers.map((player) => (
              <Card
                key={player.id}
                role="button"
                className={cn(
                  "group relative p-4 flex transition-all duration-200 border-white/5",
                  "cursor-pointer active:scale-[0.98] select-none",
                  "hover:border-[#f2c94c]/40 bg-white/[0.05]"
                )}
                onClick={() => onSelect(player.id)}
              >
                {/* Hiệu ứng hover highlight */}
                <div className="absolute inset-0 bg-[#f2c94c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 z-10 w-full">
                  <div className="size-10 rounded-full bg-black/40 border border-[#2a4d40] flex items-center justify-center font-bold text-[#f2c94c] group-hover:border-[#f2c94c]/50 transition-colors shadow-inner">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="capitalize font-bold text-lg tracking-tight group-hover:text-[#f2c94c] transition-colors text-white">
                      {player.name}
                    </span>
                    <span className="text-[10px] text-white/40 group-hover:text-[#f2c94c]/60 transition-colors uppercase">
                      Cơ thủ trống
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-[#f2c94c] text-black px-2 py-0.5 rounded font-bold uppercase">
                      Chọn
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {availablePlayers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 opacity-30 border-2 border-dashed border-white/10 rounded-[24px]">
                <Users className="size-10 mb-2 text-[#f2c94c]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">
                  Mọi vị trí đã có chủ
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
