import { normalizeRoom } from "@/lib/normalizeRoom";
import { RoomService } from "@/services/room.service";
import { connectSocket } from "@/services/socket";
import type { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useRoomController = (roomId?: string) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quản lý Modal tại đây cho gọn
  const [showSelectPlayer, setShowSelectPlayer] = useState(false);

  const { user } = useSelector((state: RootState) => state);
  const accessToken = user.accessToken;

  /* =========================
        LOAD ROOM (HTTP)
     ========================= */
  const loadRoom = useCallback(
    async (pin: string, silent = false) => {
      if (!roomId) return;
      try {
        if (!silent) setLoading(true);
        const res = await RoomService.getById(roomId, pin);

        // Gán currentUserId từ store vào room data
        const normalized = normalizeRoom({
          ...res,
          currentUserId: user?.id,
        });

        setRoom(normalized);
        setIsAuthorized(true);
        setIsViewer(!pin);

        if (pin) localStorage.setItem(`room_pin_${roomId}`, pin);
      } catch (err: any) {
        localStorage.removeItem(`room_pin_${roomId}`);
        if (!silent) toast.error(err.response?.data?.message || "Sai mã PIN");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [roomId, user?.id]
  );

  /* =========================
        AUTO SHOW/HIDE MODAL
     ========================= */
  useEffect(() => {
    // Điều kiện hiện: Có room, không phải viewer, đã login
    if (!room || isViewer || !accessToken || !user?.id) {
      setShowSelectPlayer(false);
      return;
    }

    const myId = Number(user.id);
    const isAlreadyClaimed = room.players?.some(
      (p: any) => p.userId !== null && Number(p.userId) === myId
    );
    const hasAvailablePlayer = room.players?.some(
      (p: any) => p.userId === null
    );

    // Nếu chưa nhận ai và vẫn còn chỗ thì hiện
    setShowSelectPlayer(!isAlreadyClaimed && hasAvailablePlayer);
  }, [room, user?.id, accessToken, isViewer]);

  /* =========================
        SOCKET REALTIME
     ========================= */
  useEffect(() => {
    if (!isAuthorized || !roomId) return;

    const socket = connectSocket();

    const onConnect = () => {
      socket.emit("join_room", roomId);
    };

    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    // SỬA TẠI ĐÂY: Kiểm tra ID trước khi setRoom
    socket.on("room_updated", (payload) => {
      // Ép kiểu về String để so sánh chính xác vì roomId từ useParams luôn là string
      const payloadRoomId = String(payload.id);
      const currentRoomId = String(roomId);

      if (payloadRoomId === currentRoomId) {
        // console.log("✅ Cập nhật đúng phòng:", currentRoomId);
        // console.log("🔄 Socket nhận dữ liệu mới:", payload);
        setRoom(normalizeRoom({ ...payload, currentUserId: user?.id }));
      } else {
        console.warn(
          `⚠️ Bỏ qua cập nhật từ phòng cũ: ${payloadRoomId}, phòng hiện tại: ${currentRoomId}`
        );
      }
    });

    socket.on("room_finished", (payload) => {
      console.log("📩 Nhận tín hiệu kết thúc phòng:", payload);

      // Kiểm tra kỹ payload từ server trả về là payload.id hay payload.roomId
      const incomingId = payload.id || payload.roomId;

      if (String(incomingId) === String(roomId)) {
        localStorage.removeItem(`room_pin_${roomId}`);
        // Không nên gọi disconnectSocket() ở đây nếu ứng dụng còn dùng socket ở trang khác
        // Chỉ cần xóa listener hoặc để cleanup function lo
        navigate("/");
        toast.info("Ván đấu đã kết thúc");
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("room_updated");
      socket.off("room_finished");
      socket.emit("leave_room", roomId);
    };
  }, [roomId, isAuthorized, user?.id, navigate]);

  /* =========================
           ACTIONS
     ========================= */
  // Giữ nguyên hàm updateRoom cho BidaPenaltyView
  const updateRoom = (data: any) => {
    setRoom(normalizeRoom({ ...data, currentUserId: user?.id }));
  };

  const handleClaimPlayer = async (playerId: number) => {
    if (!roomId) return;
    try {
      const updatedData = await RoomService.claimPlayer({ roomId, playerId });
      updateRoom(updatedData);
      toast.success("Đã xác nhận nhân vật!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi nhận nhân vật");
    }
  };

  const updateScore1vs1 = async (winnerId: string) => {
    if (!roomId) return;
    const pin = localStorage.getItem(`room_pin_${roomId}`);
    if (!pin) return;
    try {
      const res = await RoomService.updateScore({ roomId, pin, winnerId });
      updateRoom(res);
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật điểm");
    }
  };

  const undoScore1vs1 = async () => {
    if (!roomId || !room) return;
    const pin = localStorage.getItem(`room_pin_${roomId}`);
    const lastHistory = room.history?.[0];
    if (!pin || !lastHistory) return;

    try {
      setLoading(true);
      await RoomService.undoScore({
        roomId,
        historyId: lastHistory.id.toString(),
        pin,
      });
      await loadRoom(pin, true);
      toast.success("Đã hoàn tác");
    } catch (err: any) {
      toast.error("Lỗi hoàn tác");
    } finally {
      setLoading(false);
    }
  };

  const finishRoom = async () => {
    if (!roomId) return;
    const pinKey = `room_pin_${roomId}`;
    const pin = localStorage.getItem(pinKey);

    try {
      setLoading(true);
      await RoomService.finish(roomId, pin || "");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi kết thúc");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
          ACTIONS BIDA BÀI
     ========================= */

  const startGame = async (pin: string) => {
    if (!roomId) return;
    try {
      setLoading(true);
      const res = await RoomService.start(roomId, pin);
      updateRoom(res);
      toast.success("Ván đấu bắt đầu! Đã chia bài.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể bắt đầu");
    } finally {
      setLoading(false);
    }
  };

  const drawCard = async (playerId: number) => {
    if (!roomId) return;
    try {
      const res = await RoomService.drawCard(roomId, playerId);
      updateRoom(res);
      if (navigator.vibrate) navigator.vibrate(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể rút bài");
    }
  };

  const discardCard = async (playerId: number, ballValue: number) => {
    if (!roomId) return;
    try {
      const res = await RoomService.discardCard(roomId, playerId, ballValue);
      updateRoom(res);
      toast.success(`Đã bỏ bài bi số ${ballValue}`);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Bạn không có lá bài này");
    }
  };

  const resetGame = async (pin: string) => {
    if (!roomId) return;
    try {
      setLoading(true);
      const res = await RoomService.reset(roomId, pin);
      console.log(res);
      updateRoom(res);
      toast.success("Ván đấu đã được reset!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể reset ván đấu");
    } finally {
      setLoading(false);
    }
  };

  return {
    room,
    loading,
    isViewer,
    showSelectPlayer,
    setShowSelectPlayer,
    loadRoom,
    updateRoom,
    handleClaimPlayer,
    updateScore1vs1,
    undoScore1vs1,
    finishRoom,
    startGame,
    drawCard,
    discardCard,
    resetGame,
  };
};
