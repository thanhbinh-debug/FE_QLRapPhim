import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#1a1a2e",
        color: "#fff",
        padding: "48px 24px 24px",
        marginTop: "auto", // Đẩy footer xuống dưới cùng
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 40,
        }}
      >
        {/* Cột 1: Giới thiệu */}
        <div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 16,
              color: "#e74c3c",
            }}
          >
            🎬 CinemaWebsite
          </h2>
          <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
            Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé hiện đại. Cập nhật
            những bộ phim mới nhất mỗi ngày.
          </p>
        </div>

        {/* Cột 2: Điều hướng */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Khám phá
          </h3>
          <ul style={{ listStyle: "none", padding: 0, fontSize: 14 }}>
            <li style={{ marginBottom: 12 }}>
              <Link
                to="/"
                style={{ color: "#fff", textDecoration: "none", opacity: 0.8 }}
              >
                Trang chủ
              </Link>
            </li>
            <li style={{ marginBottom: 12 }}>
              <Link
                to="/movies"
                style={{ color: "#fff", textDecoration: "none", opacity: 0.8 }}
              >
                Lịch chiếu
              </Link>
            </li>
            <li style={{ marginBottom: 12 }}>
              <Link
                to="/admin"
                style={{ color: "#fff", textDecoration: "none", opacity: 0.8 }}
              >
                Quản trị
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Liên hệ
          </h3>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
            📍Đại Học Lâm Nghiệp , Hà Nội
          </p>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
            📞 Hotline: 0352644***
          </p>
          <p style={{ fontSize: 14, opacity: 0.8 }}>
            📧 Email: thanhbinh2linh6@gmail.com
          </p>
          <p style={{ fontSize: 14, marginTop: 12 }}>
            <a
              href="https://www.facebook.com/mai.quoc.khanh.629925?locale=vi_VN" // Thay link fanpage của bạn vào đây
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <span
                style={{
                  background: "#1877F2", // Màu xanh đặc trưng của Facebook
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                f
              </span>
              Facebook Fanpage
            </a>
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          fontSize: 13,
          opacity: 0.5,
        }}
      >
        © {new Date().getFullYear()} CinemaApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
