import axiosInstance from "./axios";

const privateApi = axiosInstance;

// 👉 Gắn accessToken nếu có
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Silent refresh (BE cấp token mới)
privateApi.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-access-token"];
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }
    return response.data;
  },
  (error) => Promise.reject(error)
);

export default privateApi;
