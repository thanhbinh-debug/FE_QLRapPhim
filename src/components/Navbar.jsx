import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#1a1a2e",
        color: "#fff",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        🎬 CinemaWebSite
      </Link>

      {/* Menu chính */}
      <div style={{ display: "flex", gap: 24 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Trang chủ
        </Link>
        <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
          Phim
        </Link>
        <Link to="/foods" style={{ color: "#fff", textDecoration: "none" }}>
          Đồ ăn
        </Link>
        {isAuthenticated && (
          <Link
            to="/my-tickets"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Vé của tôi
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin"
            style={{ color: "#f0a500", textDecoration: "none" }}
          >
            Admin
          </Link>
        )}
      </div>

      {/* User */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: 14 }}>Xin chào, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                textDecoration: "none",
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                background: "#e74c3c",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
