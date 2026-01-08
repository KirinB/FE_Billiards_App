export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
  username: string;
}

export interface RegisterResponse {
  userId: number;
}
