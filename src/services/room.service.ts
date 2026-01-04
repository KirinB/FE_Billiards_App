import axiosInstance from "@/lib/axios";

const API_URL = "/rooms";

export interface CreateRoomDto {
  name: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1";
  playerCount: number;
  names: string[];
  penaltyPoints: {
    key: number;
    value: number;
  }[];
}

export interface UpdateScoreDto {
  roomId: string;
  pin: string;
  winnerId?: string; // Dùng cho BIDA_1VS1
  currentPlayerId?: string; // Dùng cho BIDA_DIEM_DEN
  loserIds?: string[]; // Dùng cho BIDA_DIEM_DEN
  events?: { bi: number; count: number }[]; // Dùng cho BIDA_DIEM_DEN
}

export const RoomService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_URL);
    return response;
    // Lưu ý: Nếu backend bọc trong metaData, hãy sửa thành response.data.metaData
  },
  create: async (payload: CreateRoomDto) => {
    const response = await axiosInstance.post(API_URL, payload);
    return response;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`${API_URL}/?roomId=${id}`);
    return res;
  },
  updateScore: async (payload: UpdateScoreDto) => {
    const response = await axiosInstance.patch(`${API_URL}`, payload);
    // Backend của bạn trả về { message: "...", data: result }
    // Chúng ta trả về response.data để lấy được object data (chứa room mới nhất)
    return response.data;
  },
  undoScore: async (payload: {
    roomId: string;
    historyId: string;
    pin: string;
  }) => {
    // Sử dụng method delete của axios
    const response = await axiosInstance.delete(`${API_URL}/undo`, {
      data: payload,
    });
    return response.data;
  },

  finish: async (roomId: string, pin: string) => {
    const response = await axiosInstance.post(`${API_URL}/${roomId}/finish`, {
      pin,
    });
    return response.data;
  },
};
