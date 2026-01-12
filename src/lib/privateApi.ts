import axiosInstance from "./axios";
import { store } from "@/store/store";
import { updateToken } from "@/store/slice/user.slice";

const privateApi = axiosInstance;

// 1. Request Interceptor: Không đổi
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Sửa lại cách đọc header
privateApi.interceptors.response.use(
  (response) => {
    const headers = response.headers;
    const newToken = headers ? headers["x-access-token"] : null;

    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      store.dispatch(updateToken({ accessToken: newToken }));
    }

    // Nếu interceptor ở file axios.ts đã return response.data rồi
    // thì ở đây response chính là data, ta trả về nó luôn
    return response.data || response;
  },
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default privateApi;
