import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";

export interface UserState {
  id: number | null;
  username: string | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

// 🔹 Khởi tạo state từ localStorage nếu có
const localUser = localStorage.getItem("user");
const localAccessToken = localStorage.getItem("accessToken");

const initialState: UserState = localUser
  ? {
      ...JSON.parse(localUser),
      accessToken: localAccessToken || null,
      loading: false,
      error: null,
    }
  : {
      id: null,
      username: null,
      accessToken: null,
      loading: false,
      error: null,
    };

// Thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);

      // 🔹 Lưu vào localStorage luôn
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: res.userId, username: res.username })
      );

      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    payload: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.register(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Register failed");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserFromToken(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;

      // 🔹 Cập nhật localStorage
      localStorage.setItem("accessToken", state.accessToken || "");
      localStorage.setItem(
        "user",
        JSON.stringify({ id: state.id, username: state.username })
      );
    },
    clearUser(state) {
      state.id = null;
      state.username = null;
      state.accessToken = null;
      state.error = null;
      state.loading = false;

      // 🔹 Xóa localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.userId;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.userId;
      state.username = null; // BE trả userId thôi
      state.accessToken = null; // Chưa login nên chưa có
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUserFromToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
