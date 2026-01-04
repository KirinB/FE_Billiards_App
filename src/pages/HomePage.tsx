import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomService } from "@/services/room.service";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, PlayCircle, Trophy, Users } from "lucide-react";
import CreateRoomDialog from "@/components/CreateRoomDialog"; // Đảm bảo đúng đường dẫn file
import { Button } from "@/components/ui/button";

interface Room {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}

const HomePage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Hàm fetch dữ liệu
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response: any = await RoomService.getAll();

      // Xử lý dữ liệu trả về (kiểm tra trực tiếp response hoặc response.metaData tùy backend)
      if (response) {
        setRooms(Array.isArray(response) ? response : response.metaData || []);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    // Chuyển hướng sang trang chi tiết bàn đấu
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* HEADER: Tiêu đề và Component Dialog Tạo mới */}
      <div className="flex items-center justify-between px-1 mt-2">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <Trophy className="text-[#f2c94c] size-6" />
            Ván đấu
          </h1>
          <p className="text-[10px] uppercase text-[#a8c5bb] font-bold opacity-60 tracking-widest mt-0.5">
            {loading
              ? "Đang cập nhật..."
              : `${rooms?.length || 0} phòng sẵn sàng`}
          </p>
        </div>

        {/* THAY THẾ NÚT BUTTON CŨ BẰNG DIALOG */}
        <CreateRoomDialog onSuccess={fetchRooms} />
      </div>

      {/* DANH SÁCH PHÒNG */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#f2c94c] size-10" />
            <span className="text-[10px] font-bold uppercase text-[#a8c5bb] tracking-widest">
              Đang tìm bàn trống...
            </span>
          </div>
        ) : rooms && rooms.length > 0 ? (
          rooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <CardHeader>
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg tracking-tight">
                    {room.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 uppercase tracking-widest">
                    <Users className="size-3" />
                    {room.type === "BIDA_DIEM_DEN"
                      ? "Bida Điểm Đến"
                      : "Bida 1 VS 1"}
                  </CardDescription>
                </div>
                <CardAction>
                  <div className="bg-[#2a4d40]/30 p-2 rounded-lg border border-white/5">
                    <PlayCircle className="text-[#f2c94c] size-6" />
                  </div>
                </CardAction>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-[#a8c5bb] opacity-40">
                    Cập nhật cuối
                  </span>
                  <span className="text-[11px] font-medium text-white/60">
                    {new Date(room.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  className="bg-[#f2c94c] hover:bg-[#d4af37] text-black text-[10px] font-black px-4 py-2 rounded-xl uppercase shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click bị double với Card
                    handleJoinRoom(room.id);
                    // console.log("a");
                  }}
                >
                  VÀO BÀN
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-white/5 rounded-[24px]">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <Users className="size-8 text-white/20" />
            </div>
            <h3 className="text-white font-bold uppercase text-sm">
              Chưa có ván đấu nào
            </h3>
            <p className="text-[#a8c5bb] text-xs opacity-50 mt-1 max-w-50">
              Bấm nút "Tạo mới" để bắt đầu ván bida của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
