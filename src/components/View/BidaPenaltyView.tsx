import React, { useState, useMemo } from "react";
import { RoomService } from "@/services/room.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Swords, Minus, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlayerScoreRow } from "@/components/PlayerScoreRow";
import ScoreHistory from "../ScoreHistory";

import imgBi3 from "@/assets/bi3.png";
import imgBi6 from "@/assets/bi6.png";
import imgBi9 from "@/assets/bi9.png";
import { useFinishRoom } from "@/hooks/useFinishRoom";

export type BiKey = 3 | 6 | 9;
const BI_KEYS: readonly BiKey[] = [3, 6, 9] as const;
const biImages: Record<BiKey, string> = { 3: imgBi3, 6: imgBi6, 9: imgBi9 };

interface Props {
  room: any;
  onUpdateRoom: (newRoom: any) => void;
  isReadOnly: boolean;
}

export const BidaPenaltyView: React.FC<Props> = ({
  room,
  onUpdateRoom,
  isReadOnly,
}) => {
  const navigate = useNavigate();
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [biCounts, setBiCounts] = useState<Record<BiKey, number>>({
    3: 0,
    6: 0,
    9: 0,
  });
  const [loserIds, setLoserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const players = useMemo(() => {
    return [...(room?.players || [])].sort((a, b) => a.id - b.id);
  }, [room?.players]);

  const handleSelectWinner = (id: string) => {
    if (isReadOnly) return;
    setCurrentPlayerId(id);
    setLoserIds([]);
  };

  const toggleLoser = (id: string) => {
    setLoserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const changeBiCount = (bi: BiKey, delta: number) => {
    setBiCounts((prev) => ({ ...prev, [bi]: Math.max(0, prev[bi] + delta) }));
  };

  const handleApply = async () => {
    if (!currentPlayerId) return toast.error("Chưa chọn người được điểm");
    if (loserIds.length === 0) return toast.error("Chưa chọn người bị đền");

    const events = BI_KEYS.filter((bi) => biCounts[bi] > 0).map((bi) => ({
      bi,
      count: biCounts[bi],
    }));
    if (events.length === 0) return toast.error("Chưa chọn bi đền");

    try {
      setLoading(true);
      const savedPin = localStorage.getItem(`room_pin_${room.id}`);
      const response = await RoomService.updateScore({
        roomId: room.id,
        pin: savedPin || "",
        currentPlayerId,
        loserIds,
        events,
      });
      onUpdateRoom(response);
      toast.success("Đã cập nhật điểm");
      setBiCounts({ 3: 0, 6: 0, 9: 0 });
      setLoserIds([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi ghi điểm");
    } finally {
      setLoading(false);
    }
  };

  // const handleFinishGame = async () => {
  //   const pinKey = `room_pin_${room.id}`;
  //   const savedPin = localStorage.getItem(pinKey);

  //   if (
  //     !confirm(
  //       "Xác nhận kết thúc ván đấu? Dữ liệu sẽ được lưu và dọn dẹp bộ nhớ PIN."
  //     )
  //   )
  //     return;

  //   try {
  //     await RoomService.finish(room.id, savedPin || "");
  //     localStorage.removeItem(pinKey);
  //     toast.success("Đã kết thúc và xóa mã PIN lưu trữ!");
  //     navigate("/");
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Lỗi khi kết thúc");
  //   }
  // };

  const { finishRoom } = useFinishRoom(room.id);

  const achievements = useMemo(() => {
    const stats = {
      topBi9Id: null as number | null,
      maxTurnId: null as number | null,
      topBi9Count: 0,
      maxTurnScore: 0,
    };

    const bi9Map: Record<number, number> = {};

    room?.history?.forEach((h: any) => {
      const log =
        typeof h.rawLog === "string" ? JSON.parse(h.rawLog) : h.rawLog;
      if (!log || log.type !== "DIEM_DEN") return;

      const pId = Number(log.currentPlayerId);

      // Cơ điên
      if (log.totalEarned > stats.maxTurnScore) {
        stats.maxTurnScore = log.totalEarned;
        stats.maxTurnId = pId;
      }

      // Vua chốt 9
      const bi9Event = log.events?.find((e: any) => Number(e.bi) === 9);
      if (bi9Event) {
        bi9Map[pId] = (bi9Map[pId] || 0) + Number(bi9Event.count);
      }
    });

    Object.entries(bi9Map).forEach(([id, count]) => {
      if (count > stats.topBi9Count) {
        stats.topBi9Count = count;
        stats.topBi9Id = Number(id);
      }
    });

    return stats;
  }, [room?.history]);

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <Label className="text-[#a8c5bb] text-[10px] font-black uppercase tracking-widest opacity-70">
            Người thắng (Cầm cơ)
          </Label>
        </div>
        <div className="flex flex-col gap-1">
          {players.map((p: any) => (
            <PlayerScoreRow
              key={p.id}
              id={p.id}
              name={p.name}
              score={p.score}
              active={currentPlayerId === p.id}
              showCue={currentPlayerId === p.id}
              achievements={achievements}
              onClick={() => handleSelectWinner(p.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-[24px] p-4 border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-[#f2c94c]">
          <Swords size={14} />
          <Label className="text-[10px] font-black uppercase tracking-widest">
            Mức bi đền
          </Label>
        </div>
        <div className="space-y-2">
          {BI_KEYS.map((bi) => (
            <div
              key={bi}
              className="flex items-center justify-between bg-black/20 rounded-xl p-2 px-4 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={biImages[bi]}
                  className="w-6 h-6 object-contain"
                  alt={`Bi ${bi}`}
                />
                <span className="text-sm font-bold text-white/90">Bi {bi}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg bg-white/5 text-white"
                  onClick={() => changeBiCount(bi, -1)}
                  disabled={isReadOnly || biCounts[bi] === 0}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-4 text-center font-black text-lg text-[#f2c94c]">
                  {biCounts[bi]}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg bg-white/5 text-white"
                  onClick={() => changeBiCount(bi, 1)}
                  disabled={isReadOnly}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="px-1 text-[#a8c5bb] text-[10px] font-black uppercase tracking-widest opacity-70">
          Người bị trừ điểm
        </Label>
        <div className="flex flex-col gap-1">
          {players
            .filter((p: any) => p.id !== currentPlayerId)
            .map((p: any) => (
              <PlayerScoreRow
                key={p.id}
                id={p.id}
                name={p.name}
                active={loserIds.includes(p.id)}
                onClick={() => !isReadOnly && toggleLoser(p.id)}
              />
            ))}
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-4 gap-3">
            {/* THAY THẾ NÚT UNDO BẰNG SCORE HISTORY */}
            <div className="col-span-1">
              <ScoreHistory room={room} onUpdateRoom={onUpdateRoom} />
            </div>

            <Button
              className="col-span-3 rounded-xl h-12 bg-[#f2c94c] text-black font-black uppercase tracking-widest shadow-lg shadow-[#f2c94c]/20"
              onClick={handleApply}
              disabled={loading}
            >
              {loading ? "ĐANG LƯU..." : "XÁC NHẬN GHI ĐIỂM"}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full rounded-xl h-10 border border-red-500/20 bg-red-500/5 text-red-400/60 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest"
            onClick={() => finishRoom("Xác nhận kết thúc ván đấu?")}
          >
            <LogOut size={14} className="mr-2" /> KẾT THÚC VÁN ĐẤU
          </Button>
        </div>
      )}
    </div>
  );
};
