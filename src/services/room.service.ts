import axiosInstance from "@/lib/axios";
import type {
  ClaimPlayerDto,
  CreateRoomDto,
  RoomResponse,
  UpdateScoreDto,
} from "@/types/room.type";

const API_URL = "/rooms";

export const RoomService = {
  // ===== GET ALL ROOMS =====
  getAll: async (): Promise<RoomResponse[]> => {
    const res = await axiosInstance.get<RoomResponse[]>(API_URL);
    return res.data;
  },

  // ===== CREATE ROOM =====
  create: async (payload: CreateRoomDto): Promise<RoomResponse> => {
    const res = await axiosInstance.post<RoomResponse>(API_URL, payload);
    return res.data;
  },

  // ===== GET ROOM BY ID + PIN =====
  getById: async (id: string, pin: string): Promise<RoomResponse> => {
    const res = await axiosInstance.get<RoomResponse>(`${API_URL}/${id}`, {
      params: { pin },
    });
    return res.data;
  },

  // ===== UPDATE SCORE =====
  updateScore: async (payload: UpdateScoreDto): Promise<RoomResponse> => {
    const res = await axiosInstance.patch<RoomResponse>(API_URL, payload);
    return res.data;
  },

  // ===== UNDO SCORE =====
  undoScore: async (payload: {
    roomId: string;
    historyId: string;
    pin: string;
  }): Promise<RoomResponse> => {
    const res = await axiosInstance.delete<RoomResponse>(`${API_URL}/undo`, {
      data: payload,
    });
    return res.data;
  },

  // ===== FINISH ROOM =====
  finish: async (roomId: string, pin: string): Promise<RoomResponse> => {
    const res = await axiosInstance.post<RoomResponse>(
      `${API_URL}/${roomId}/finish`,
      { pin }
    );
    return res.data;
  },

  // ===== CLAIM PLAYER (BIND USER TO PLAYER) =====
  claimPlayer: async (payload: ClaimPlayerDto): Promise<RoomResponse> => {
    const res = await axiosInstance.post<RoomResponse>(
      `${API_URL}/${payload.roomId}/claim`,
      { playerId: payload.playerId }
    );
    return res.data;
  },
};
