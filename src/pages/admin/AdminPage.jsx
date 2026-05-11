import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminMovies from "./AdminMovies";
import AdminRooms from "./AdminRooms";
import AdminShowtimes from "./AdminShowtimes";
import AdminBookings from "./AdminBookings";
import AdminFoods from "./AdminFoods";
import AdminPayments from "./AdminPayments";
import AdminDashboard from "./AdminDashboard";

const TABS = [
  { key: "movies", label: "🎬 Phim" },
  { key: "rooms", label: "🏠 Phòng & Ghế" },
  { key: "showtimes", label: "🗓 Suất chiếu" },
  { key: "bookings", label: "🎟 Vé" },
  { key: "foods", label: "🍿 Đồ ăn" },
  { key: "payments", label: "💳 Hoá đơn" },
  { key: "dashboard", label: "📊 Tổng quan" },
];

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("movies");

  if (!isAdmin) return <Navigate to="/" replace />;

  const renderTab = () => {
    switch (activeTab) {
      case "movies":
        return <AdminMovies />;
      case "rooms":
        return <AdminRooms />;
      case "showtimes":
        return <AdminShowtimes />;
      case "bookings":
        return <AdminBookings />;
      case "foods":
        return <AdminFoods />;
      case "payments":
        return <AdminPayments />;
      case "dashboard":
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 24,
          borderLeft: "4px solid #e74c3c",
          paddingLeft: 12,
        }}
      >
        ⚙️ Trang quản trị
      </h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 28,
          borderBottom: "2px solid #eee",
          paddingBottom: 0,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 18px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              fontSize: 14,
              fontWeight: 500,
              color: activeTab === tab.key ? "#e74c3c" : "#666",
              borderBottom: `3px solid ${activeTab === tab.key ? "#e74c3c" : "transparent"}`,
              marginBottom: -2,
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      {renderTab()}
    </div>
  );
};

export default AdminPage;
