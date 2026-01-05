import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RoomService } from "@/services/room.service";
import { Loader2, Lock, Trophy, Eye } from "lucide-react";
import { BidaSoloView } from "@/components/View/BidaSolo";
import { BidaPenaltyView } from "@/components/View/BidaPenaltyView";

export const RoomPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem(`room_pin_${roomId}`);
    if (savedPin) setPin(savedPin);
  }, [roomId]);

  const loadRoomData = async (pinToUse?: string) => {
    try {
      setLoading(true);
      // Ép kiểu res về any để tránh lỗi TypeScript khi bóc tách dữ liệu linh hoạt
      const res: any = await RoomService.getById(roomId!);

      // FIX LỖI TYPE: Truy cập an toàn qua res.data hoặc res trực tiếp
      const data = res?.data?.room || res?.room || res?.data || res;
      console.log({ data });
      setRoom(data);

      if (pinToUse) localStorage.setItem(`room_pin_${roomId}`, pinToUse);
      setIsAuthorized(true);
      setIsViewer(false);
    } catch (err: any) {
      alert("Mã PIN không đúng hoặc có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAsViewer = async () => {
    try {
      setLoading(true);
      const res: any = await RoomService.getById(roomId!);

      // FIX LỖI TYPE
      const data = res?.data?.room || res?.room || res?.data || res;
      setRoom(data);
      setIsViewer(true);
      setIsAuthorized(true);
    } catch (err) {
      alert("Không thể tải dữ liệu bàn");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = async (winnerId: string) => {
    try {
      const savedPin = localStorage.getItem(`room_pin_${roomId}`);
      if (!savedPin) return;

      const response: any = await RoomService.updateScore({
        roomId: roomId!,
        pin: savedPin,
        winnerId: winnerId,
      });

      // FIX LỖI TYPE
      const data =
        response?.data?.room || response?.room || response?.data || response;
      setRoom(data);

      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err: any) {
      console.error("Lỗi cập nhật điểm:", err.message);
    }
  };

  // ... Các phần return JSX giữ nguyên (Glassmorphism bạn đã thêm ở trên)
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center bg-[#0a0a0a]">
        <div className="bg-[#f2c94c]/10 p-4 rounded-full mb-6 italic">
          <Lock className="text-[#f2c94c] size-8" />
        </div>
        <h2 className="text-white font-black text-xl uppercase tracking-tighter mb-2">
          Quyền truy cập bàn
        </h2>
        <p className="text-[#a8c5bb] text-xs mb-8">
          Vui lòng nhập mã PIN để bắt đầu tính điểm
        </p>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="****"
          className="bg-white/5 border-2 border-white/10 focus:border-[#f2c94c] text-center text-3xl text-white outline-none w-48 h-16 rounded-2xl tracking-[0.5em] transition-all"
          maxLength={4}
        />
        <div className="flex flex-col gap-3 mt-8 w-48">
          <button
            onClick={() => loadRoomData(pin)}
            disabled={pin.length < 4 || loading}
            className="bg-[#f2c94c] disabled:opacity-30 text-black py-4 rounded-2xl font-black text-sm uppercase transition-all active:scale-95 flex items-center justify-center"
          >
            {loading && !isViewer ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "XÁC NHẬN"
            )}
          </button>
          <button
            onClick={handleJoinAsViewer}
            className="text-[#a8c5bb] text-[10px] font-bold uppercase py-2 flex items-center justify-center gap-2"
          >
            <Eye size={14} /> Chỉ vào xem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            {room?.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-[#f2c94c] text-black text-[9px] font-black rounded uppercase">
              {room?.type === "BIDA_1VS1" ? "1 VS 1" : "ĐIỂM ĐỀN"}
            </span>
            {isViewer && (
              <span className="text-[9px] text-[#a8c5bb] font-bold uppercase border border-white/10 px-2 py-0.5 rounded">
                Chế độ xem
              </span>
            )}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl">
          <Trophy className="text-[#f2c94c] size-6" />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {room?.type === "BIDA_1VS1" ? (
          <BidaSoloView
            room={room}
            isReadOnly={isViewer}
            onUpdateScore={handleUpdateScore}
          />
        ) : (
          <BidaPenaltyView
            room={room}
            isReadOnly={isViewer}
            onUpdateRoom={(newRoom: any) => {
              // Ép kiểu any ở tham số newRoom và bóc tách
              const cleanData =
                newRoom?.data?.room ||
                newRoom?.room ||
                newRoom?.data ||
                newRoom;
              setRoom(cleanData);
            }}
          />
        )}
      </div>
    </div>
  );
};
