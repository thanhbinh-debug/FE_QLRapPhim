import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token bạn đã lưu khi đăng nhập

        const res = await axios.get("http://localhost:5000/admin/stats", {
          headers: {
            // Gửi token kèm theo để Backend cho phép truy cập
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Lỗi tải thống kê", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      {/* Thẻ tổng quan */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h4>💰 Tổng doanh thu</h4>
          <p>
            {Number(stats.overview.total_revenue || 0).toLocaleString()} VNĐ
          </p>
        </div>

        <div style={cardStyle}>
          <h4>🍿 Doanh thu đồ ăn</h4>
          <p>{Number(stats.overview.food_revenue).toLocaleString()} VNĐ</p>
        </div>

        <div style={cardStyle}>
          <h4>🎟️ Vé đã bán</h4>
          <p>{stats.overview.total_tickets || 0} vé</p>
        </div>
      </div>

      {/* Bảng chi tiết ghế */}
      <h3 style={{ marginBottom: "15px" }}>
        📊 Tình trạng ghế theo suất chiếu
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={thTdStyle}>Phim</th>
            <th style={thTdStyle}>Phòng</th>
            <th style={thTdStyle}>Suất chiếu</th>
            <th style={thTdStyle}>Đã đặt</th>
            <th style={thTdStyle}>Còn trống</th>
            <th style={thTdStyle}>Tỷ lệ lấp đầy</th>
          </tr>
        </thead>
        <tbody>
          {stats.seatStats.map((item, index) => (
            <tr key={index}>
              <td style={thTdStyle}>{item.movie_title}</td>
              <td style={thTdStyle}>{item.room_name}</td>
              <td style={thTdStyle}>
                {new Date(item.start_time).toLocaleString("vi-VN")}
              </td>
              <td style={thTdStyle}>{item.booked_seats}</td>
              <td style={thTdStyle}>{item.total_seats - item.booked_seats}</td>
              <td style={thTdStyle}>
                {((item.booked_seats / item.total_seats) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CSS inline đơn giản
const cardStyle = {
  padding: "20px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  flex: 1,
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};
const thTdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left",
};

export default AdminDashboard;
