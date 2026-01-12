import { SelectPlayerModal } from "@/components/PickPlayerModal";
import { BidaPenaltyView } from "@/components/View/BidaPenaltyView";
import { BidaSoloView } from "@/components/View/BidaSolo";
import { PinGate } from "@/components/room/PinGate";
import { RoomHeader } from "@/components/room/RoomHeader";
import { useRoomController } from "@/hooks/useRoomController";
import { Loader2 } from "lucide-react"; // Dùng icon của Lucide để làm spinner
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const RoomPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");

  // Trạng thái để xác định lần đầu tiên component mount và đang chờ useEffect xử lý PIN/Mode
  const [isInitialAuth, setIsInitialAuth] = useState(true);

  const {
    room,
    loading,
    isViewer,
    showSelectPlayer,
    setShowSelectPlayer,
    loadRoom,
    handleClaimPlayer,
    updateScore1vs1,
    undoScore1vs1,
    updateRoom,
    finishRoom,
  } = useRoomController(roomId);

  const handlePinSubmit = (pin: string) => loadRoom(pin);
  const handleJoinViewer = () => loadRoom("");

  /* AUTO LOGIN PIN HOẶC XỬ LÝ MODE VIEW */
  useEffect(() => {
    const initAuth = async () => {
      const mode = searchParams.get("mode");
      const savedPin = localStorage.getItem(`room_pin_${roomId}`);
      const urlPin = searchParams.get("pin");

      try {
        if (mode === "viewer") {
          // Nếu từ Profile sang với mode=viewer, vào thẳng chế độ đọc
          await loadRoom("");
        } else if (urlPin || savedPin) {
          // Nếu có mã PIN lưu sẵn, thử tự động đăng nhập
          await loadRoom(urlPin || savedPin || "");
        }
      } catch (error) {
        console.error("Auto auth failed");
      } finally {
        // Sau khi đã thử các phương thức auto-auth, tắt màn hình loading chờ
        setIsInitialAuth(false);
      }
    };

    initAuth();
  }, [roomId]); // Chỉ chạy lại khi roomId thay đổi

  /* 1. MÀN HÌNH CHỜ (LOADING STATE) */
  // Hiển thị khi: Đang loading từ Hook HOẶC đang xử lý logic auth ban đầu
  if ((loading || isInitialAuth) && !room) {
    return (
      <div className="min-h-screen bg-[#0f1115]/10 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="size-12 text-[#f2c94c] animate-spin" />
          <div className="absolute inset-0 size-12 bg-[#f2c94c]/20 blur-xl animate-pulse" />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-white font-black italic uppercase tracking-widest text-sm">
            Đang kết nối
          </p>
          <p className="text-white/30 text-[10px] uppercase font-bold mt-1">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  /* 2. CỔNG NHẬP MÃ (AUTHENTICATION GATE) */
  // Hiển thị khi: Đã tải xong nhưng không lấy được dữ liệu room (do chưa có PIN/sai PIN)
  if (!room) {
    return (
      <PinGate
        loading={loading}
        onSubmit={handlePinSubmit}
        onJoinAsViewer={handleJoinViewer}
      />
    );
  }

  /* 3. GIAO DIỆN PHÒNG (ROOM CONTENT) */
  // Hiển thị khi: Đã có dữ liệu room thành công
  return (
    <div className="min-h-screen p-4">
      <RoomHeader
        room={room}
        isReadOnly={isViewer}
        isViewer={mode === "viewer"}
      />

      <SelectPlayerModal
        open={showSelectPlayer}
        players={room.players}
        onSelect={handleClaimPlayer}
        onClose={() => setShowSelectPlayer(false)}
      />

      <div className="mt-4">
        {room.type === "BIDA_1VS1" ? (
          <BidaSoloView
            room={room}
            isReadOnly={isViewer}
            onUpdateScore={updateScore1vs1}
            finishRoom={finishRoom}
            onUndo={undoScore1vs1}
          />
        ) : (
          <BidaPenaltyView
            room={room}
            isReadOnly={isViewer}
            onUpdateRoom={updateRoom}
          />
        )}
      </div>
    </div>
  );
};
