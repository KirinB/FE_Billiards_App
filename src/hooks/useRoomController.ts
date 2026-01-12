import { useCallback, useEffect, useRef, useState } from "react";
import { RoomService } from "@/services/room.service";
import { connectSocket } from "@/services/socket";
import { normalizeRoom } from "@/lib/normalizeRoom";
import { toast } from "sonner";

export const useRoomController = (roomId?: string) => {
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 tránh join_room trùng
  const joinedRef = useRef(false);

  /* =========================
      LOAD ROOM (HTTP)
     ========================= */
  const loadRoom = useCallback(
    async (pin: string, silent = false) => {
      if (!roomId) return;

      try {
        if (!silent) setLoading(true);

        const res = await RoomService.getById(roomId, pin);
        const normalized = normalizeRoom(res);

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
    [roomId]
  );

  /* =========================
        SOCKET REALTIME
     ========================= */
  useEffect(() => {
    if (!isAuthorized || !roomId) return;

    const socket = connectSocket();

    const joinRoom = () => {
      if (joinedRef.current) return;
      joinedRef.current = true;
      socket.emit("join_room", roomId);
    };

    const onConnect = () => {
      joinRoom();
    };

    const onReconnect = () => {
      joinedRef.current = false;
    };

    socket.on("connect", onConnect);
    socket.io.on("reconnect", onReconnect);

    socket.on("room_updated", (payload) => {
      setRoom(normalizeRoom(payload));
    });

    socket.on("room_finished", () => {
      toast.info("Ván đấu đã kết thúc");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.io.off("reconnect", onReconnect);
      socket.off("room_updated");
      socket.off("room_finished");
    };
  }, [roomId, isAuthorized]);

  /* =========================
      iOS / MOBILE RESUME FIX
     ========================= */
  useEffect(() => {
    const resume = () => {
      if (document.visibilityState !== "visible") return;

      const pin = localStorage.getItem(`room_pin_${roomId}`);
      if (pin) {
        loadRoom(pin, true);
      }
    };

    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);

    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
    };
  }, [roomId, loadRoom]);

  /* =========================
          ACTIONS
     ========================= */
  const updateRoom = (data: any) => {
    setRoom(normalizeRoom(data));
  };

  const updateScore1vs1 = async (winnerId: string) => {
    if (!roomId) return;

    const pin = localStorage.getItem(`room_pin_${roomId}`);
    if (!pin) return;

    try {
      const res = await RoomService.updateScore({
        roomId,
        pin,
        winnerId,
      });

      setRoom(normalizeRoom(res));

      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật điểm");
    }
  };

  const undoScore1vs1 = async () => {
    if (!roomId || !room) return;

    const pin = localStorage.getItem(`room_pin_${roomId}`);
    const lastHistory = room.history?.[0];

    if (!pin) {
      toast.error("Vui lòng nhập lại mã PIN");
      return;
    }

    if (!lastHistory) {
      toast.error("Không còn ván đấu nào để hoàn tác");
      return;
    }

    try {
      setLoading(true);

      await RoomService.undoScore({
        roomId,
        historyId: lastHistory.id.toString(),
        pin,
      });

      await loadRoom(pin, true);

      toast.success("Đã hoàn tác điểm số");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi hoàn tác");
    } finally {
      setLoading(false);
    }
  };

  return {
    room,
    loading,
    isAuthorized,
    isViewer,
    loadRoom,
    updateRoom,
    updateScore1vs1,
    undoScore1vs1,
  };
};
