import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService
      .getAll()
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      {/* Tổng doanh thu */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #e74c3c)",
          color: "#fff",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          display: "inline-block",
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>
          Tổng doanh thu
        </div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>
          {total.toLocaleString("vi-VN")}đ
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              {[
                "ID",
                "Phim",
                "Số tiền",
                "Phương thức",
                "Trạng thái",
                "Thời gian",
              ].map((h) => (
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
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td style={{ padding: "10px 12px", color: "#888" }}>#{p.id}</td>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                  {p.Booking?.Showtime?.Movie?.title}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontWeight: 700,
                    color: "#27ae60",
                  }}
                >
                  {Number(p.amount).toLocaleString("vi-VN")}đ
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {p.method === "momo"
                    ? "💜 MoMo"
                    : p.method === "vnpay"
                      ? "🔵 VNPay"
                      : "💵 Tiền mặt"}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      background: p.status === "paid" ? "#d4edda" : "#f8d7da",
                      color: p.status === "paid" ? "#155724" : "#721c24",
                    }}
                  >
                    {p.status === "paid" ? "Đã thanh toán" : "Thất bại"}
                  </span>
                </td>
                <td
                  style={{ padding: "10px 12px", color: "#666", fontSize: 12 }}
                >
                  {p.paid_at
                    ? new Date(p.paid_at).toLocaleString("vi-VN")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <p style={{ textAlign: "center", padding: 24, color: "#888" }}>
            Chưa có giao dịch nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
