import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      // forceNew: true,

      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Đang ngắt kết nối Socket...");
    socket.removeAllListeners(); // 🚩 QUAN TRỌNG: Xóa tất cả sự kiện đang lắng nghe
    socket.disconnect();
    socket = null; // Reset về null để lần sau getSocket sẽ tạo mới hoàn toàn
  }
};
