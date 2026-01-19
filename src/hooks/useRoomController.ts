import { normalizeRoom } from "@/lib/normalizeRoom";
import { RoomService } from "@/services/room.service";
import { connectSocket } from "@/services/socket";
import type { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getGuestId } from "@/lib/guest"; // Import hàm uuid

export const useRoomController = (roomId?: string) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSelectPlayer, setShowSelectPlayer] = useState(false);

  const { user } = useSelector((state: RootState) => state);
  const accessToken = user.accessToken;

  const loadRoom = useCallback(
    async (pin: string, silent = false) => {
      if (!roomId) return;
      try {
        if (!silent) setLoading(true);
        const res = await RoomService.getById(roomId, pin);

        // Logic check định danh: ưu tiên userId, không có thì dùng guestId
        const currentUserId = user?.id || getGuestId();

        const normalized = normalizeRoom({
          ...res,
          currentUserId: currentUserId,
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
        AUTO SHOW/HIDE MODAL (Cập nhật logic UUID)
     ========================= */
  useEffect(() => {
    // 1. Nếu chưa có dữ liệu room hoặc đang ở chế độ Viewer (không nhập PIN) thì không hiện modal
    if (!room || isViewer) {
      setShowSelectPlayer(false);
      return;
    }

    // 2. Lấy định danh hiện tại (Ưu tiên ID của User, nếu không có thì dùng Guest UUID)
    // Ép về String để so sánh chính xác với dữ liệu từ API/Socket
    const currentIdentity = user?.id ? String(user.id) : getGuestId();

    // 3. Kiểm tra xem định danh này đã "chiếm" slot nào trong danh sách players chưa
    const isAlreadyClaimed = room.players?.some((p: any) => {
      const pUserId = p.userId ? String(p.userId) : null;
      const pTempId = p.tempIdentity ? String(p.tempIdentity) : null;

      return pUserId === currentIdentity || pTempId === currentIdentity;
    });

    // 4. Kiểm tra xem còn slot trống nào không
    const hasAvailablePlayer = room.players?.some(
      (p: any) => p.userId === null && p.tempIdentity === null
    );

    // CHỈ HIỆN nếu chưa nhận nhân vật VÀ vẫn còn chỗ trống
    setShowSelectPlayer(!isAlreadyClaimed && hasAvailablePlayer);
  }, [room, user?.id, isViewer]);

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

    socket.on("room_updated", (payload) => {
      const payloadRoomId = String(payload.id);
      const currentRoomId = String(roomId);

      if (payloadRoomId === currentRoomId) {
        console.log(payload);
        const currentId = user?.id || getGuestId();
        setRoom(normalizeRoom({ ...payload, currentUserId: currentId }));
      }
    });

    socket.on("room_finished", (payload) => {
      const incomingId = payload.id || payload.roomId;
      if (String(incomingId) === String(roomId)) {
        localStorage.removeItem(`room_pin_${roomId}`);
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

  const updateRoom = (data: any) => {
    const currentId = user?.id || getGuestId();
    setRoom(normalizeRoom({ ...data, currentUserId: currentId }));
  };

  const handleClaimPlayer = async (playerId: number) => {
    if (!roomId) return;
    try {
      // Gửi kèm tempIdentity nếu không có accessToken
      const payload: any = {
        roomId,
        playerId,
      };

      if (!accessToken) {
        payload.tempIdentity = getGuestId();
      }

      const updatedData = await RoomService.claimPlayer(payload);
      updateRoom(updatedData);
      toast.success("Đã xác nhận nhân vật!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi nhận nhân vật");
    }
  };

  // ... Các hàm khác giữ nguyên (updateScore1vs1, drawCard, v.v.)
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
      const tempId = !accessToken ? getGuestId() : undefined;
      const res = await RoomService.drawCard(roomId, playerId, tempId);
      updateRoom(res);
      if (navigator.vibrate) navigator.vibrate(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể rút bài");
    }
  };

  const discardCard = async (playerId: number, ballValue: number) => {
    if (!roomId) return;
    try {
      const tempId = !accessToken ? getGuestId() : undefined;
      const res = await RoomService.discardCard(
        roomId,
        playerId,
        ballValue,
        tempId
      );
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
