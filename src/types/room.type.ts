// ===== CREATE ROOM =====
export interface CreateRoomDto {
  name: string;
  pin: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1";
  playerNames: string[];
  valBi3?: number;
  valBi6?: number;
  valBi9?: number;
}

// ===== PLAYER =====
export interface Player {
  id: number;
  name: string;
  score: number;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

// ===== HISTORY (nên tách riêng, tạm basic) =====
export interface RoomHistory {
  id: string;
  type: string;
  payload: any;
  createdAt: string;
}

// ===== ROOM RESPONSE =====
export interface RoomResponse {
  id: number;
  name: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1";
  isFinished: boolean;

  valBi3: number;
  valBi6: number;
  valBi9: number;

  version: number;
  createdAt: string;
  updatedAt: string;

  players: Player[];
  history: RoomHistory[];
  currentUserId?: string | number | null;
}

export interface UpdateScoreDto {
  roomId: string;
  pin: string;

  // 1vs1
  winnerId?: string;

  // điểm đến
  currentPlayerId?: string;
  loserIds?: string[];
  events?: { bi: number; count: number }[];
}

export interface ClaimPlayerDto {
  roomId: string | number;
  playerId: number;
}

// Cập nhật lại interface Player để có userId (để check xem ai đã nhận)
export interface Player {
  id: number;
  name: string;
  score: number;
  roomId: number;
  userId: number | null; // Thêm dòng này
  createdAt: string;
  updatedAt: string;
}
