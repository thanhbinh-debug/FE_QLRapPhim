import { useEffect, useState } from "react";
import bookingService from "../../services/bookingService";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .getAll()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? bookings.filter((b) => b.status === filter)
    : bookings;

  const statusConfig = {
    pending: { label: "Chờ TT", color: "#856404", bg: "#fff3cd" },
    confirmed: { label: "Đã xác nhận", color: "#155724", bg: "#d4edda" },
    cancelled: { label: "Đã huỷ", color: "#721c24", bg: "#f8d7da" },
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      {/* Filter */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {[
          { value: "", label: "Tất cả" },
          { value: "pending", label: "Chờ TT" },
          { value: "confirmed", label: "Đã xác nhận" },
          { value: "cancelled", label: "Đã huỷ" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: filter === f.value ? "#e74c3c" : "#ddd",
              background: filter === f.value ? "#e74c3c" : "#fff",
              color: filter === f.value ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {f.label}{" "}
            {f.value === ""
              ? `(${bookings.length})`
              : `(${bookings.filter((b) => b.status === f.value).length})`}
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              {["ID", "Phim", "Ghế", "Tổng tiền", "Trạng thái", "Ngày đặt"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const status = statusConfig[b.status] || statusConfig.pending;
              return (
                <tr
                  key={b.id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "10px 12px", color: "#888" }}>
                    #{b.id}
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                    {b.Showtime?.Movie?.title}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>
                    {b.Seats?.map((s) => `${s.row}${s.number}`).join(", ")}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 600,
                      color: "#e74c3c",
                    }}
                  >
                    {Number(b.total_price).toLocaleString("vi-VN")}đ
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        background: status.bg,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    {new Date(b.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: 24, color: "#888" }}>
            Không có vé nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
