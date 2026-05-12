import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Lỗi tải thống kê", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  const chartData = (stats?.revenueByDay || []).map((item) => ({
    ...item,
    daily_revenue: Number(item.daily_revenue),
  }));

  const movieData = (stats?.revenueByMovie || []).map((item) => ({
    ...item,
    value: Number(item.value),
  }));

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Bảng điều khiển rạp phim</h2>

      {/* 1. Thẻ tổng quan (Cards) */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ ...cardStyle, borderLeft: "5px solid #2ecc71" }}>
          <h4 style={{ color: "#7f8c8d", margin: "0" }}>💰 Tổng doanh thu</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {stats.overview.total_revenue.toLocaleString()} VNĐ
          </p>
        </div>
        <div style={{ ...cardStyle, borderLeft: "5px solid #e67e22" }}>
          <h4 style={{ color: "#7f8c8d", margin: "0" }}>🍿 Doanh thu đồ ăn</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {stats.overview.food_revenue.toLocaleString()} VNĐ
          </p>
        </div>
        <div style={{ ...cardStyle, borderLeft: "5px solid #3498db" }}>
          <h4 style={{ color: "#7f8c8d", margin: "0" }}>🎟️ Vé đã bán</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {stats.overview.total_tickets} vé
          </p>
        </div>
      </div>

      {/* 2. Biểu đồ (Charts) */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ ...cardStyle, height: "350px", flex: 2 }}>
          <h4 style={{ marginBottom: "15px" }}>
            📈 Xu hướng doanh thu (7 ngày)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="daily_revenue"
                name="Doanh thu"
                stroke="#2ecc71"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...cardStyle, height: "350px", flex: 1 }}>
          <h4 style={{ marginBottom: "15px" }}>🎬 Top phim doanh thu</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={movieData}>
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                name="Doanh thu"
                fill="#3498db"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        {/* Biểu đồ Peak Hours */}
        <div style={{ ...cardStyle, flex: 2 }}>
          <h4>🕒 Khung giờ khách đặt vé</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={(stats?.peakHours || []).map((h) => ({
                hour: h.hour + "h",
                count: h.count,
              }))}
            >
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Số lượng vé" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cảnh báo kho */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4>⚠️ Cảnh báo hết hàng</h4>
          <div style={{ marginTop: "10px" }}>
            {stats.lowStockFoods?.length > 0 ? (
              stats.lowStockFoods.map((f, i) => (
                <div
                  key={i}
                  style={{
                    color: "red",
                    padding: "5px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {f.name}: <strong>Còn {f.stock}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: "green" }}>Mọi thứ vẫn ổn!</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bảng tình trạng ghế */}
      <div style={cardStyle}>
        <h4 style={{ marginBottom: "15px" }}>
          📊 Tình trạng lấp đầy suất chiếu
        </h4>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={thTdStyle}>Phim</th>
              <th style={thTdStyle}>Phòng</th>
              <th style={thTdStyle}>Suất chiếu</th>
              <th style={thTdStyle}>Tỷ lệ lấp đầy</th>
            </tr>
          </thead>
          <tbody>
            {stats.seatStats.map((item, index) => {
              const rate = (item.booked_seats / item.total_seats) * 100;
              return (
                <tr key={index}>
                  <td style={thTdStyle}>{item.movie_title}</td>
                  <td style={thTdStyle}>{item.room_name}</td>
                  <td style={thTdStyle}>
                    {new Date(item.start_time).toLocaleString("vi-VN")}
                  </td>
                  <td
                    style={{
                      ...thTdStyle,
                      fontWeight: "bold",
                      color:
                        rate > 80
                          ? "#27ae60"
                          : rate < 20
                            ? "#e74c3c"
                            : "#2c3e50",
                    }}
                  >
                    {rate.toFixed(1)}% ({item.booked_seats}/{item.total_seats})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "20px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  flex: 1,
};
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thTdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};

export default AdminDashboard;
