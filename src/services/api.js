import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // hoặc process.env.REACT_APP_API_URL
  headers: { "Content-Type": "application/json" },
});

// Tự động gắn token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Tự động xử lý lỗi 401 — token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // chuyển về trang đăng nhập
    }
    return Promise.reject(error);
  },
);

export default api;
