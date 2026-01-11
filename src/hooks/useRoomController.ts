import { useCallback, useEffect, useState } from "react";
import { RoomService } from "@/services/room.service";
import { connectSocket } from "@/services/socket";
import { normalizeRoom } from "@/lib/normalizeRoom";
import { toast } from "sonner";

export const useRoomController = (roomId?: string) => {
  const [room, setRoom] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [loading, setLoading] = useState(false);

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

  /* SOCKET */
  useEffect(() => {
    if (!isAuthorized || !roomId) return;

    const socket = connectSocket();

    socket.on("connect", () => {
      socket.emit("join_room", roomId);
    });

    socket.on("room_updated", (payload) => {
      console.log(payload);
      setRoom((prev: any) => ({
        ...prev,
        ...normalizeRoom(payload),
      }));
    });

    socket.on("room_finished", () => {
      toast.info("Ván đấu đã kết thúc");
    });

    return () => {
      socket.off("room_updated");
      socket.off("room_finished");
    };
  }, [roomId, isAuthorized]);

  /* ACTIONS */
  const updateRoom = (data: any) => {
    setRoom(normalizeRoom(data));
  };

  return {
    room,
    loading,
    isAuthorized,
    isViewer,
    loadRoom,
    updateRoom,
  };
};
