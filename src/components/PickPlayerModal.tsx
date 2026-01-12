import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UserPlus, Users } from "lucide-react";

interface Player {
  id: number;
  name: string;
  userId: number | null;
}

interface SelectPlayerModalProps {
  open: boolean;
  players: Player[];
  onSelect: (playerId: number) => void;
  onClose?: () => void;
}

export const SelectPlayerModal = ({
  open,
  players,
  onSelect,
  onClose,
}: SelectPlayerModalProps) => {
  const availablePlayers = players.filter((p) => p.userId === null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f2c94c]/10">
              <Users className="size-6 text-[#f2c94c]" />
            </div>
            <div>
              <DialogTitle>Chọn nhân vật</DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                Tap để tham gia vào bàn
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2">
          <p className="text-xs sm:text-sm text-white/60 mb-5 leading-relaxed italic">
            Vui lòng chọn một vị trí trống để bắt đầu trò chơi:
          </p>

          <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {availablePlayers.map((player) => (
              <Card
                key={player.id}
                role="button"
                className={cn(
                  "group relative p-4 flex transition-all duration-200",
                  "cursor-pointer active:scale-[0.98] select-none", // Hiệu ứng thu nhỏ khi nhấn trên mobile
                  "hover:border-[#f2c94c]/40 bg-white/[0.02]"
                )}
                onClick={() => onSelect(player.id)}
              >
                {/* Overlay highlight khi hover/active */}
                <div className="absolute inset-0 bg-[#f2c94c]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 z-10">
                  <div className="size-10 rounded-full bg-black/40 border border-[#2a4d40] flex items-center justify-center font-bold text-[#f2c94c] group-hover:border-[#f2c94c]/50 transition-colors">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight group-hover:text-[#f2c94c] transition-colors">
                      {player.name}
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {availablePlayers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 opacity-30 border-2 border-dashed border-white/10 rounded-[24px]">
                <UserPlus className="size-10 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Phòng đã đầy
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
