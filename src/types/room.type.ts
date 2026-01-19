// ===== CREATE ROOM =====
export interface CreateRoomDto {
  name: string;
  pin: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1" | "BIDA_BAI";
  playerNames: string[];
  playerCount?: number;
  cardsPerPlayer?: number;
  valBi3?: number;
  valBi6?: number;
  valBi9?: number;
}

export interface Card {
  id: string;
  value: number;
  suit: string;
  isFlipped: boolean;
}

// ===== PLAYER =====
export interface Player {
  id: number;
  userId: number | null;
  tempIdentity?: string | null;
  name: string;
  score: number;
  roomId: number;
  cards?: Card[];
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
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1" | "BIDA_BAI";
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
  tempIdentity?: string | null;
  guestName?: string;
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

export interface ResetRoomDto {
  roomId: string | number;
  pin: string;
}
