import { useState } from "react";
import authService from "../services/authService"; // Đảm bảo đúng đường dẫn tới file authService.js[cite: 8]

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await authService.forgotPassword(email);
      setMessage(
        res.message ||
          "Kiểm tra email của bạn để nhận liên kết đặt lại mật khẩu.",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gửi yêu cầu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Quên mật khẩu</h2>
      {message && (
        <div style={{ color: "#2ecc71", marginBottom: 16 }}>{message}</div>
      )}
      {error && (
        <div style={{ color: "#e74c3c", marginBottom: 16 }}>{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
