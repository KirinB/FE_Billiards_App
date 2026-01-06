import { io } from "socket.io-client";

// Kiểm tra môi trường để lấy URL phù hợp
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});
