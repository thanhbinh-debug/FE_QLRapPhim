import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // THÊM DÒNG NÀY: Ngăn click liên tục
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      //await register( form.name, form.email, form.password, form.phone);
      await register(form);
      navigate("/login");
      Swal.fire({
        title: "Đăng ký thành công!",
        icon: "success",
        confirmButtonColor: "#e74c3c",
        timer: 1500,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2 style={{ marginBottom: 24, textAlign: "center" }}>Đăng ký</h2>

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
        {[
          { name: "name", placeholder: "Họ tên", type: "text" },
          { name: "email", placeholder: "Email", type: "email" },
          { name: "password", placeholder: "Mật khẩu", type: "password" },
          { name: "phone", placeholder: "Số điện thoại", type: "tel" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            required={field.name !== "phone"}
            style={{
              padding: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />
        ))}

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
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
