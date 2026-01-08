import axiosInstance from "@/lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth.type";

const BASEURL = "/auth";

export const authService = {
  async login(payload: LoginPayload) {
    // Gọi API login
    const response = await axiosInstance.post<AuthResponse>(
      `${BASEURL}/login`,
      payload
    );

    return response.data;
  },

  async register(payload: RegisterPayload) {
    // Gọi API register
    const response = await axiosInstance.post<RegisterResponse>(
      `${BASEURL}/register`,
      payload
    );
    return response.data;
  },
};
