import CreateRoomDialog from "@/components/CreateRoomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RoomService } from "@/services/room.service";
import type { RoomResponse } from "@/types/room.type";
import {
  Loader2,
  PlayCircle,
  RotateCw,
  Trophy,
  User2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getRoomBadge = (type: string) => {
  switch (type) {
    case "BIDA_BAI":
      return {
        label: "Bida Bài",
        class:
          "bg-[#a8c5bb]/10 text-[#a8c5bb] border-[#a8c5bb]/20 shadow-[0_0_8px_rgba(168,197,187,0.1)]",
      };
    case "BIDA_DIEM_DEN":
      return {
        label: "Điểm Đến",
        class:
          "bg-[#f2c94c]/10 text-[#f2c94c] border-[#f2c94c]/20 shadow-[0_0_8px_rgba(242,201,76,0.1)]",
      };
    case "BIDA_1VS1":
      return {
        label: "Solo 1vs1",
        class:
          "bg-[#e67e22]/10 text-[#e67e22] border-[#e67e22]/20 shadow-[0_0_8px_rgba(230,126,34,0.1)]",
      };
    default:
      return {
        label: "Cơ bản",
        class: "bg-white/5 text-white/40 border-white/10",
      };
  }
};

const HomePage = () => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastFetch, setLastFetch] = useState<number>(0); // Lưu timestamp lần cuối reload
  const navigate = useNavigate();

  const COOLDOWN_TIME = 3000; // 3 giây cooldown

  const fetchRooms = async (silent = false) => {
    const now = Date.now();

    // Kiểm tra cooldown nếu là reload thủ công (silent = true)
    if (silent && now - lastFetch < COOLDOWN_TIME) {
      const remaining = Math.ceil((COOLDOWN_TIME - (now - lastFetch)) / 1000);
      toast.error(`Vui lòng đợi ${remaining} giây để làm mới tiếp`);
      return;
    }

    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);

      const response = await RoomService.getAll();
      console.log(response);

      if (response) {
        setRooms(response);
        setLastFetch(now); // Cập nhật thời gian fetch thành công
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleJoinRoom = (roomId: number) => {
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between px-1 mt-2">
        <div className="flex items-center gap-3">
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

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full bg-white/5 text-[#a8c5bb] hover:text-white mt-[-8px] transition-all",
              isRefreshing && "opacity-50"
            )}
            onClick={() => fetchRooms(true)}
            disabled={isRefreshing || loading}
          >
            <RotateCw
              className={cn("size-4", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>

        <CreateRoomDialog onSuccess={() => fetchRooms(true)} />
      </div>

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
              className="group cursor-pointer active:scale-[0.98] transition-all bg-[#1a1a1a] border-white/5 hover:border-[#f2c94c]/30 overflow-hidden"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg font-bold text-white group-hover:text-[#f2c94c] transition-colors">
                    {room.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Nhãn loại phòng */}
                    <span
                      className={cn(
                        "text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border",
                        getRoomBadge(room.type).class
                      )}
                    >
                      {getRoomBadge(room.type).label}
                    </span>

                    {/* ID Phòng (tùy chọn, giúp UI cân bằng hơn) */}
                    <span className="text-[9px] text-white/20 font-mono italic">
                      #{room.id}
                    </span>
                  </div>
                </div>
                <div className="bg-[#2a4d40]/30 p-2 rounded-lg border border-white/5">
                  <PlayCircle className="text-[#f2c94c] size-5" />
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between pt-2 border-t border-white/[0.02]">
                {/* HIỂN THỊ ICON USER THEO SLOT */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest">
                    Cơ thủ
                  </span>
                  <div className="flex gap-2">
                    {room.players?.map((p, idx) => {
                      const isClaimed = !!(p.userId || p.tempIdentity);
                      return (
                        <div key={p.id || idx} className="relative">
                          <User2
                            className={cn(
                              "size-5 transition-all",
                              isClaimed
                                ? "text-[#27ae60] drop-shadow-[0_0_5px_rgba(39,174,96,0.4)]"
                                : "text-white/10"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="bg-[#f2c94c] hover:bg-[#d4af37] text-black text-[11px] font-black px-6 rounded-xl uppercase shadow-lg h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRoom(room.id);
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
            <p className="text-[#a8c5bb] text-xs opacity-50 mt-1">
              Bấm nút "Tạo mới" để bắt đầu ván bida của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
