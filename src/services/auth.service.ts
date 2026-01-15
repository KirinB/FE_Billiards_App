import axiosInstance from "@/lib/axios";
import privateApi from "@/lib/privateApi";
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

  async getProfile() {
    const response = await privateApi.get(`${BASEURL}/profile`);
    return response.data;
  },

  async googleLogin(idToken: string) {
    const response = await axiosInstance.post<AuthResponse>(
      `${BASEURL}/google`,
      { idToken }
    );
    return response.data;
  },

  async facebookLogin(accessToken: string) {
    const response = await axiosInstance.post<AuthResponse>(
      `${BASEURL}/facebook`,
      { accessToken }
    );
    return response.data;
  },
};
