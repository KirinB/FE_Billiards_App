import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RoomService } from "@/services/room.service";
import { socket } from "@/services/socket";
import { Loader2, Lock, Trophy, Eye } from "lucide-react";
import { BidaSoloView } from "@/components/View/BidaSolo";
import { BidaPenaltyView } from "@/components/View/BidaPenaltyView";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Quản lý kết nối Socket.io
  useEffect(() => {
    if (isAuthorized && roomId) {
      socket.emit("join_room", roomId);

      socket.on("room_updated", (response: any) => {
        console.log("Dữ liệu mới nhận được qua Socket:", response);
        const cleanData =
          response?.data?.room || response?.room || response?.data || response;
        setRoom(cleanData);

        if (navigator.vibrate) navigator.vibrate(50);
      });

      socket.on("room_finished", () => {
        toast.info("Ván đấu đã kết thúc!");
        localStorage.removeItem(`room_pin_${roomId}`);
        navigate("/");
      });
    }

    return () => {
      socket.off("room_updated");
      socket.off("room_finished");
    };
  }, [isAuthorized, roomId, navigate]);

  // 2. Tự động kiểm tra nếu đã có PIN trong localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem(`room_pin_${roomId}`);
    if (savedPin) {
      setPin(savedPin);
      loadRoomData(savedPin);
    }
  }, [roomId]);

  const loadRoomData = async (pinToUse: string) => {
    if (!pinToUse || pinToUse.length < 4) return;

    try {
      setLoading(true);
      const res = await RoomService.getById(roomId!, pinToUse);
      setRoom(res.room);
      localStorage.setItem(`room_pin_${roomId}`, pinToUse);
      setIsAuthorized(true);
      setIsViewer(false);
    } catch (err: any) {
      localStorage.removeItem(`room_pin_${roomId}`);
      setPin("");
      toast.error(err.response?.data?.message || "Mã PIN không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAsViewer = async () => {
    try {
      setLoading(true);
      const res = await RoomService.getById(roomId!, "");
      setRoom(res.room || res);
      setIsViewer(true);
      setIsAuthorized(true);
    } catch (err) {
      toast.error("Không thể tải dữ liệu ở chế độ xem");
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

      const data =
        response?.data?.room || response?.room || response?.data || response;
      setRoom(data);

      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err: any) {
      console.error("Lỗi cập nhật điểm:", err.message);
      toast.error("Không thể cập nhật điểm");
    }
  };

  // HÀM HOÀN TÁC (UNDO)
  const handleUndoScore = async () => {
    // 1. Kiểm tra mã PIN
    const savedPin = localStorage.getItem(`room_pin_${roomId}`);
    if (!savedPin) {
      toast.error("Vui lòng nhập lại mã PIN");
      return;
    }

    const lastHistoryEntry = room?.history?.[0];

    if (!lastHistoryEntry) {
      toast.error("Không còn ván đấu nào để hoàn tác!");
      return;
    }

    // 3. Xác nhận với người dùng
    if (!confirm(`Bạn muốn xóa kết quả ván vừa rồi?`)) return;

    try {
      setLoading(true);
      await RoomService.undoScore({
        roomId: roomId!,
        historyId: lastHistoryEntry.id.toString(),
        pin: savedPin,
      });

      toast.success("Đã hoàn tác điểm số thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi hoàn tác");
    } finally {
      setLoading(false);
    }
  };
  // GIAO DIỆN NHẬP PIN
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
        <div className="bg-[#f2c94c]/10 p-4 rounded-full mb-6 italic animate-pulse">
          <Lock className="text-[#f2c94c] size-8" />
        </div>

        <h2 className="text-white font-black text-xl uppercase tracking-tighter mb-2">
          Quyền truy cập bàn
        </h2>
        <p className="text-[#a8c5bb] text-[11px] mb-8 max-w-[200px]">
          Nhập mã PIN gồm 4 chữ số để xác nhận quyền chủ bàn
        </p>

        <div className="mb-8">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(val) => setPin(val)}
            onComplete={(val) => loadRoomData(val)}
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-16 text-2xl font-black border-2 border-white/10 bg-white/5 text-[#f2c94c] rounded-xl focus:ring-[#f2c94c]"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-3 w-56">
          <button
            onClick={() => loadRoomData(pin)}
            disabled={pin.length < 4 || loading}
            className="bg-[#f2c94c] disabled:opacity-30 text-black py-4 rounded-2xl font-black text-sm uppercase transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-amber-500/10"
          >
            {loading && !isViewer ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              "XÁC NHẬN MÃ"
            )}
          </button>

          <button
            onClick={handleJoinAsViewer}
            className="text-[#a8c5bb] text-[10px] font-bold uppercase py-2 flex items-center justify-center gap-2 hover:text-white transition-colors"
          >
            <Eye size={14} /> Tôi là người xem (Viewer)
          </button>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH
  return (
    <div className="mx-auto p-4 flex flex-col min-h-screen">
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
              <span className="text-[9px] text-[#a8c5bb] font-bold uppercase border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Eye size={10} /> Chế độ xem
              </span>
            )}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
          <Trophy className="text-[#f2c94c] size-6" />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {room?.type === "BIDA_1VS1" ? (
          <BidaSoloView
            room={room}
            isReadOnly={isViewer}
            onUpdateScore={handleUpdateScore}
            onUndo={handleUndoScore}
          />
        ) : (
          <BidaPenaltyView
            room={room}
            isReadOnly={isViewer}
            onUpdateRoom={(newRoom: any) => {
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
