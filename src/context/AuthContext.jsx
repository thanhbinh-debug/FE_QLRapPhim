import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

// Khởi tạo Context: Tạo một "kho chứa" dữ liệu chung cho toàn bộ ứng dụng
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect (Chạy khi app vừa load):
  // Kiểm tra xem có phiên đăng nhập cũ nào được lưu trong máy không (thông qua authService)
  // Khi app khởi động — lấy user từ localStorage nếu đã đăng nhập
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) setUser(savedUser); // Nếu có, tự động đăng nhập lại cho user
    setLoading(false); // Hoàn tất kiểm tra, cho phép hiển thị nội dung app
  }, []);

  // Chức năng Đăng nhập: Gọi API, cập nhật state 'user' để toàn app nhận biết

  const login = async (data) => {
    const res = await authService.login(data);
    setUser(res.user);
    return res;
  };

  //  Chức năng Đăng ký: Tương tự đăng nhập, tạo user mới và lưu vào state
  const register = async (data) => {
    const res = await authService.register(data);
    setUser(res.user);
    return res;
  };

  //Chức năng Đăng xuất: Xóa dữ liệu ở backend/localStorage và reset state về null
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    // Provider: Cung cấp tất cả dữ liệu và hàm dưới đây cho các component con
    <AuthContext.Provider
      value={{
        user, // thông tin user hiện tại (nếu đã đăng nhập)
        loading, // trạng thái đang tải dữ liệu (đang kiểm tra đăng nhập)
        login,
        register,
        logout,
        isAuthenticated: !!user, // Biến boolean nhanh để check đã login chưa
        isAdmin: user?.role === "admin", // Biến boolean để check quyền admin (dựa trên role)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — dùng ở mọi component
export const useAuth = () => useContext(AuthContext);
