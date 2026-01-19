import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";

export interface UserState {
  id: number | null;
  username: string | null;
  avatar?: string | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

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

export const loginGoogleUser = createAsyncThunk(
  "user/loginGoogle",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await authService.googleLogin(idToken);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: res.userId, username: res.username })
      );
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Google Login failed"
      );
    }
  }
);

export const loginFacebookUser = createAsyncThunk(
  "user/loginFacebook",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const res = await authService.facebookLogin(accessToken);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: res.userId, username: res.username })
      );
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Facebook Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(clearUser());
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 Hàm mới: Chỉ cập nhật accessToken khi Silent Refresh thành công
    updateToken(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    setUserFromToken(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;

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
      state.username = null;
      state.accessToken = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(loginGoogleUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginGoogleUser.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.userId;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(loginGoogleUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(loginFacebookUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginFacebookUser.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.userId;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(loginFacebookUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { updateToken, setUserFromToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
