import axiosInstance from "@/lib/axios";
import type { CreateRoomDto, RoomResponse } from "@/types/room.type";

const API_URL = "/rooms";

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
    return response.data;
  },

  create: async (payload: CreateRoomDto): Promise<RoomResponse> => {
    const response = await axiosInstance.post<RoomResponse>(API_URL, payload);
    return response.data;
  },

  getById: async (id: string, pin: string) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`, {
      params: { pin },
    });
    return res.data;
  },
  updateScore: async (payload: UpdateScoreDto) => {
    const response = await axiosInstance.patch(`${API_URL}`, payload);
    return response.data;
  },

  undoScore: async (payload: {
    roomId: string;
    historyId: string;
    pin: string;
  }) => {
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
