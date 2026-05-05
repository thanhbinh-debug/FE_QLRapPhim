import { useEffect, useState } from "react";
import bookingService from "../services/bookingService";

const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError("Không tải được danh sách vé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn huỷ vé này không?")) return;
    try {
      await bookingService.cancel(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      alert("Huỷ vé thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Huỷ vé thất bại");
    }
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");
  const formatPrice = (p) => Number(p).toLocaleString("vi-VN") + "đ";

  const statusConfig = {
    pending: { label: "Chờ thanh toán", color: "#856404", bg: "#fff3cd" },
    confirmed: { label: "Đã xác nhận", color: "#155724", bg: "#d4edda" },
    cancelled: { label: "Đã huỷ", color: "#721c24", bg: "#f8d7da" },
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: 40 }}>Đang tải...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", padding: 40, color: "red" }}>{error}</p>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 28,
          borderLeft: "4px solid #e74c3c",
          paddingLeft: 12,
        }}
      >
        🎟 Vé của tôi
      </h2>

      {bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            background: "#f9f9f9",
            borderRadius: 12,
            color: "#888",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
          <p style={{ fontSize: 16, marginBottom: 16 }}>Bạn chưa đặt vé nào</p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#e74c3c",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Xem phim ngay
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            const canCancel =
              booking.status === "pending" || booking.status === "confirmed";

            return (
              <div
                key={booking.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #eee",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  opacity: booking.status === "cancelled" ? 0.7 : 1,
                }}
              >
                <div style={{ display: "flex", gap: 0 }}>
                  {/* Poster */}
                  <img
                    src={
                      booking.Showtime?.Movie?.poster ||
                      "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/h/phi_pho_ng_teaser_2_-_social_size_4wx5h.jpg"
                    }
                    alt={booking.Showtime?.Movie?.title}
                    style={{ width: 100, objectFit: "cover", flexShrink: 0 }}
                  />

                  {/* Nội dung */}
                  <div style={{ flex: 1, padding: "16px 20px" }}>
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginRight: 12,
                        }}
                      >
                        {booking.Showtime?.Movie?.title}
                      </h3>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Thông tin suất chiếu */}
                    <div
                      style={{
                        fontSize: 13,
                        color: "#555",
                        marginBottom: 10,
                        lineHeight: 1.8,
                      }}
                    >
                      <span>📅 {formatDate(booking.Showtime?.start_time)}</span>
                      <span style={{ margin: "0 10px" }}>|</span>
                      <span>🕐 {formatTime(booking.Showtime?.start_time)}</span>
                      <span style={{ margin: "0 10px" }}>|</span>
                      <span>🏠 {booking.Showtime?.Room?.name}</span>
                    </div>

                    {/* Ghế */}
                    {booking.Seats?.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "#555" }}>
                          💺 Ghế:{" "}
                          {booking.Seats.map((s) => (
                            <span
                              key={s.id}
                              style={{
                                display: "inline-block",
                                background:
                                  s.type === "vip" ? "#fff3cd" : "#f1f1f1",
                                color: s.type === "vip" ? "#856404" : "#333",
                                padding: "1px 8px",
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 500,
                                marginRight: 4,
                              }}
                            >
                              {s.row}
                              {s.number} {s.type === "vip" ? "(VIP)" : ""}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {/* Đồ ăn */}
                    {booking.Foods?.length > 0 && (
                      <div
                        style={{ marginBottom: 8, fontSize: 13, color: "#555" }}
                      >
                        🍿{" "}
                        {booking.Foods.map(
                          (f) => `${f.name} x${f.booking_foods?.quantity || 1}`,
                        ).join(", ")}
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, color: "#888" }}>
                          Tổng cộng:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#e74c3c",
                          }}
                        >
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>

                      {/* Phương thức thanh toán */}
                      {booking.Payment && (
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {booking.Payment.method === "momo"
                            ? "💜 MoMo"
                            : booking.Payment.method === "vnpay"
                              ? "🔵 VNPay"
                              : "💵 Tiền mặt"}{" "}
                          •{" "}
                          {new Date(booking.Payment.paid_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      )}

                      {/* Nút huỷ vé */}
                      {canCancel && booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          style={{
                            padding: "6px 16px",
                            borderRadius: 6,
                            background: "#fff",
                            color: "#e74c3c",
                            border: "1px solid #e74c3c",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e74c3c";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.color = "#e74c3c";
                          }}
                        >
                          Huỷ vé
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
