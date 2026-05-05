import axiosClient from "./axiosClient";

const authService = {
  // Đăng ký
  register: async (data) => {
    const res = await axiosClient.post("/auth/register", data);
    // Lưu token và user vào localStorage
    // localStorage.setItem("token", res.token);
    // localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },

  // Đăng nhập
  login: async (data) => {
    const res = await axiosClient.post("/auth/login", data);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Quên mật khẩu: Gửi email yêu cầu
  forgotPassword: async (email) => {
    const res = await axiosClient.post("/auth/forgot-password", { email });
    return res;
  },

  // Đặt lại mật khẩu: Gửi mật khẩu mới kèm token từ URL[cite: 4]
  resetPassword: async (token, password) => {
    const res = await axiosClient.post(`/auth/reset-password/${token}`, {
      password,
    });
    return res;
  },

  // Lấy user hiện tại từ localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => !!localStorage.getItem("token"),

  // Kiểm tra có phải admin không
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },
};

export default authService;
