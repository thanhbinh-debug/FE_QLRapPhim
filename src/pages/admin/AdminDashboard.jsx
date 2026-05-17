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
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [filterRange, setFilterRange] = useState("7days"); // State cho bộ lọc thời gian

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Truyền thêm param ?range= vào API
        const res = await axios.get(
          `http://localhost:5000/admin/stats?range=${filterRange}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats(res.data.data);
      } catch (err) {
        console.error("Lỗi tải thống kê", err);
      }
    };
    fetchStats();
  }, [filterRange]); // Khi filterRange thay đổi, useEffect sẽ chạy lại để tải dữ liệu mới

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
      {/* Tiêu đề kết hợp Thanh Bộ Lọc */}
      <div
        style={{
          display: "flex",
          justifyContent: "滿足",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h2 style={{ margin: 0 }}>Bảng điều khiển rạp phim</h2>

        {/* Dropdown lọc thời gian */}
        <div>
          <label
            htmlFor="range-select"
            style={{ marginRight: "10px", fontWeight: "bold", color: "#555" }}
          >
            Thời gian:
          </label>
          <select
            id="range-select"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#fff",
              fontWeight: "500",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày gần nhất</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

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
        <div style={{ ...cardStyle, borderLeft: "5px solid #9b59b6" }}>
          <h4 style={{ color: "#7f8c8d", margin: "0" }}>📊 Tỷ lệ lấp đầy</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {stats.overview.average_occupancy}%
          </p>
        </div>
      </div>

      {/* 2. Biểu đồ (Charts) */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ ...cardStyle, height: "350px", flex: 2 }}>
          <h4 style={{ marginBottom: "15px" }}>
            {filterRange === "today"
              ? "📈 Doanh thu hôm nay"
              : filterRange === "month"
                ? "📈 Xu hướng doanh thu (Tháng này)"
                : "📈 Xu hướng doanh thu (7 ngày)"}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => {
                  if (!tick) return "";
                  const parts = tick.split("-");
                  if (parts.length < 3) return tick;
                  return `${parts[2]}/${parts[1]}`; // '2026-05-17' -> '17/05'
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label) => {
                  if (!label) return "";
                  const parts = label.split("-");
                  if (parts.length < 3) return label;
                  return `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
                }}
              />
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
              <XAxis dataKey="title" tick={{ fontSize: 10 }} />
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
