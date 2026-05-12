import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../services/authService"; //[cite: 8]

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ path "/reset-password/:token"
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return setError("Mật khẩu xác nhận không khớp");

    try {
      await authService.resetPassword(token, password);
      await Swal.fire({
        title: "Thành công!",
        text: "Mật khẩu của bạn đã được thay đổi. Hãy đăng nhập lại.",
        icon: "success",
        confirmButtonColor: "#e74c3c",
      });
      navigate("/login"); //[cite: 3, 5]
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Mã xác thực đã hết hạn hoặc không hợp lệ",
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Đặt lại mật khẩu
      </h2>
      {error && (
        <div style={{ color: "#e74c3c", marginBottom: 16 }}>{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{
            padding: 12,
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
