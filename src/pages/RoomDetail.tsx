import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { RoomService } from "@/services/room.service";
import { Loader2, Lock, Trophy, Eye } from "lucide-react";
import { BidaSoloView } from "@/components/View/BidaSolo";
import { BidaPenaltyView } from "@/components/View/BidaPenaltyView";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { connectSocket } from "@/services/socket";

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // --- HÀM TẢI DỮ LIỆU (Dùng chung) ---
  const loadRoomData = useCallback(
    async (pinToUse: string, silent = false) => {
      if (!roomId) return;

      try {
        if (!silent) setLoading(true);
        const res = await RoomService.getById(roomId, pinToUse);

        if (res?.isFinished) {
          setRoom(res);
          setIsViewer(true);
          setIsAuthorized(true);
          if (!silent) toast.info("Ván đấu này đã kết thúc.");
          return;
        }

        setRoom(res);
        if (pinToUse) {
          localStorage.setItem(`room_pin_${roomId}`, pinToUse);
          setIsAuthorized(true);
          setIsViewer(false);
        }
      } catch (err: any) {
        if (!silent) {
          localStorage.removeItem(`room_pin_${roomId}`);
          setPin("");
          toast.error(err.response?.data?.message || "Mã PIN không chính xác!");
        }
      } finally {
        setLoading(false);
      }
    },
    [roomId]
  );

  // --- 1. QUẢN LÝ SOCKET & ĐỒNG BỘ KHI RECONNECT ---
  useEffect(() => {
    if (!isAuthorized || !roomId) return;

    const socket = connectSocket();

    const handleConnect = () => {
      console.log("Socket connected/reconnected");
      socket.emit("join_room", roomId);

      // Khi kết nối lại, âm thầm lấy dữ liệu mới nhất để tránh lệch sync
      const savedPin = localStorage.getItem(`room_pin_${roomId}`) || "";
      loadRoomData(savedPin, true);
    };

    socket.on("connect", handleConnect);

    // Nếu socket đã kết nối sẵn từ trước, gọi thủ công lần đầu
    if (socket.connected) handleConnect();

    socket.on("room_updated", (payload) => {
      const cleanData = payload?.room ?? payload?.data?.room ?? payload;
      setRoom(cleanData);
      if (navigator.vibrate) navigator.vibrate(50);
    });

    socket.on("room_finished", () => {
      toast.info("Ván đấu đã kết thúc!");
      navigate("/");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room_updated");
      socket.off("room_finished");
      // Lưu ý: Không nên gọi disconnectSocket() ở đây nếu muốn giữ kết nối xuyên suốt ứng dụng
    };
  }, [isAuthorized, roomId, loadRoomData, navigate]);

  // --- 2. ĐỒNG BỘ KHI BẬT MÀN HÌNH (Visibility API) ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthorized) {
        const savedPin = localStorage.getItem(`room_pin_${roomId}`) || "";
        loadRoomData(savedPin, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthorized, roomId, loadRoomData]);

  // --- 3. KIỂM TRA PIN BAN ĐẦU ---
  useEffect(() => {
    const savedPin = localStorage.getItem(`room_pin_${roomId}`);
    if (savedPin) {
      setPin(savedPin);
      loadRoomData(savedPin);
    }
  }, [roomId, loadRoomData]);

  // --- CÁC HÀM ACTION ---
  const handleJoinAsViewer = async () => {
    try {
      setLoading(true);
      const res = await RoomService.getById(roomId!, "");
      setRoom(res);
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
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật điểm");
    }
  };

  const handleUndoScore = async () => {
    const savedPin = localStorage.getItem(`room_pin_${roomId}`);
    const lastHistoryEntry = room?.history?.[0];

    if (!savedPin) return toast.error("Vui lòng nhập lại mã PIN");
    if (!lastHistoryEntry)
      return toast.error("Không còn ván đấu nào để hoàn tác!");
    if (!confirm(`Bạn muốn xóa kết quả ván vừa rồi?`)) return;

    try {
      setLoading(true);
      await RoomService.undoScore({
        roomId: roomId!,
        historyId: lastHistoryEntry.id.toString(),
        pin: savedPin,
      });
      toast.success("Đã hoàn tác điểm số thành công");
      // Sau khi undo thành công, loadRoomData sẽ giúp sync lại toàn bộ máy
      loadRoomData(savedPin, true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi hoàn tác");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER GIAO DIỆN ---
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
            onChange={setPin}
            onComplete={loadRoomData}
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-16 text-2xl font-black border-2 border-white/10 bg-white/5 text-[#f2c94c] rounded-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex flex-col gap-3 w-56">
          <button
            onClick={() => loadRoomData(pin)}
            disabled={pin.length < 4 || loading}
            className="bg-[#f2c94c] disabled:opacity-30 text-black py-4 rounded-2xl font-black text-sm uppercase"
          >
            {loading ? (
              <Loader2 className="animate-spin size-5 mx-auto" />
            ) : (
              "XÁC NHẬN MÃ"
            )}
          </button>
          <button
            onClick={handleJoinAsViewer}
            className="text-[#a8c5bb] text-[10px] font-bold uppercase py-2 flex items-center justify-center gap-2"
          >
            <Eye size={14} /> Tôi là người xem (Viewer)
          </button>
        </div>
      </div>
    );
  }

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
            onUpdateRoom={(newRoom: any) =>
              setRoom(newRoom?.room || newRoom?.data || newRoom)
            }
          />
        )}
      </div>
    </div>
  );
};
