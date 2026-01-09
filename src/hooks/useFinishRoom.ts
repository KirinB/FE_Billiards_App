import { useNavigate } from "react-router-dom";
import { RoomService } from "@/services/room.service";
import { toast } from "sonner";
import { disconnectSocket } from "@/services/socket";

export const useFinishRoom = (roomId: string) => {
  const navigate = useNavigate();

  const finishRoom = async () => {
    const pinKey = `room_pin_${roomId}`;
    const pin = localStorage.getItem(pinKey);

    try {
      await RoomService.finish(roomId, pin || "");
      localStorage.removeItem(pinKey);

      disconnectSocket();

      toast.success("Ván đấu đã kết thúc!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi kết thúc");
    }
  };

  return { finishRoom };
};
