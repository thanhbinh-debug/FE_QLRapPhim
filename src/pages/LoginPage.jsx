import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  // 2. Tạo một biến cờ hiệu (flag) không phụ thuộc vào render
  const isProcessing = useRef(false);

  //  const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // THÊM DÒNG NÀY: Ngăn click liên tục
  //   if (loading) return;
  //   setError("");
  //   setLoading(true);
  //   try {
  //     await login({ email, password });
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Đăng nhập thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Kiểm tra flag này ĐẦU TIÊN
    if (isProcessing.current) return;

    // 4. Bật flag lên ngay lập tức
    isProcessing.current = true;
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      if (res) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      // 5. Chỉ khi lỗi mới mở khóa để bấm lại
      isProcessing.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2 style={{ marginBottom: 24, textAlign: "center" }}>Đăng nhập</h2>

      {error && (
        <div
          style={{
            background: "#fde8e8",
            color: "#e74c3c",
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            fontSize: 15,
            opacity: loading ? 0.7 : 1, // Làm mờ nút khi đang load
            cursor: loading ? "not-allowed" : "pointer", // Đổi con trỏ chuột
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: 13, color: "#e74c3c" }}
          >
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default LoginPage;
