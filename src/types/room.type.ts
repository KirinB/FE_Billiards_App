// Dữ liệu gửi lên (Request Body)
export interface CreateRoomDto {
  name: string;
  pin: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1";
  playerNames: string[];
  valBi3?: number;
  valBi6?: number;
  valBi9?: number;
}

// Dữ liệu người chơi (Player lồng trong Response)
export interface Player {
  id: number;
  name: string;
  score: number;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

// Dữ liệu phòng trả về (Response Data)
export interface RoomResponse {
  id: number;
  name: string;
  pin: string;
  type: "BIDA_DIEM_DEN" | "BIDA_1VS1";
  isFinished: boolean;
  valBi3: number;
  valBi6: number;
  valBi9: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  players: Player[];
  history: any[]; // Thay 'any' bằng interface History nếu có
}
