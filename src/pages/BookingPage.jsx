import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import showtimeService from "../services/showtimeService";
import seatService from "../services/seatService";
import foodService from "../services/foodService";
import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";
import QRModal from "../components/QRModal";

const STEPS = ["Chọn ghế", "Chọn đồ ăn", "Xác nhận & Thanh toán"];

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // quản lý luồng hiện thị
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Lưu danh sách các ghế người dùng đã chọn
  const [selectedFoods, setSelectedFoods] = useState({}); // Lưu đồ ăn theo dạng{ food_id: quantity }
  const [payMethod, setPayMethod] = useState("momo");
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // TẢI DỮ LIỆU TỪ SERVER
  // Tự động chạy khi showtimeId thay đổi để lấy thông tin suất chiếu, ghế và đồ ăn[cite: 3]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, foodRes] = await Promise.all([
          showtimeService.getById(showtimeId),
          // seatService.getByShowtime(showtimeId),
          foodService.getAll(),
        ]);
        const showtimeData = stRes.data;
        setShowtime(showtimeData);
        // Kiểm tra cả hai trường hợp S hoa và s thường để đảm bảo luôn lấy được ghế
        const seatList = showtimeData?.Room?.Seats || showtimeData?.Room?.seats;
        // Vì Backend đã include Seat vào Room, nên ta lấy ở đây
        if (seatList) {
          setSeats(seatList);
        } else {
          console.warn(
            "Dữ liệu Seats không tìm thấy trong Room (Thử kiểm tra lại include ở Backend)",
          );
          setSeats([]);
        }
        // 3. Cập nhật đồ ăn
        setFoods(foodRes.data);
      } catch (err) {
        setError("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showtimeId]);

  // Toggle chọn ghế
  const toggleSeat = (seat) => {
    if (seat.status === "booked") return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat],
    );
  };

  // Tăng/giảm số lượng đồ ăn
  const updateFood = (foodId, delta) => {
    setSelectedFoods((prev) => {
      const qty = (prev[foodId] || 0) + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[foodId];
        return next;
      }
      return { ...prev, [foodId]: qty };
    });
  };

  // Tính tổng tiền
  const calcTotal = () => {
    const seatTotal = selectedSeats.reduce((sum, seat) => {
      return (
        sum +
        (seat.type === "vip"
          ? Number(showtime?.price_vip)
          : Number(showtime?.price))
      );
    }, 0);

    const foodTotal = Object.entries(selectedFoods).reduce(
      (sum, [foodId, qty]) => {
        const food = foods.find((f) => f.id === parseInt(foodId));
        return sum + (food ? Number(food.price) * qty : 0);
      },
      0,
    );

    return seatTotal + foodTotal;
  };

  // Xác nhận đặt vé
  const handleSubmit = async () => {
    const qrMethods = ["momo", "bank", "vnpay"];
    if (qrMethods.includes(payMethod) && !showQR) {
      setShowQR(true);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // 1. Gửi dữ liệu tạo Booking
      const foodItems = Object.entries(selectedFoods).map(
        ([food_id, quantity]) => ({
          food_id: parseInt(food_id),
          quantity,
        }),
      );

      const bookingRes = await bookingService.create({
        showtime_id: parseInt(showtimeId),
        seat_ids: selectedSeats.map((s) => s.id),
        food_items: foodItems,
      });

      // --- THÊM ĐOẠN NÀY VÀO ĐÂY ---
      let formattedMethod = payMethod;

      // Chuyển đổi các giá trị giao diện thành giá trị Database hiểu được
      if (payMethod === "bank") {
        formattedMethod = "vnpay"; // Hoặc "momo" tùy vào Database bạn cho phép gì
      } else if (payMethod === "cash") {
        formattedMethod = "cash";
      }
      // 2. Gửi dữ liệu tạo Payment (Sau khi nhận được booking_id)
      await paymentService.create({
        booking_id: bookingRes.data.booking.id,
        method: formattedMethod,
      });

      // 3. Xử lý sau khi thành công
      alert("Thanh toán thành công và đã lưu vào hệ thống!");
      setShowQR(false);
      navigate("/my-tickets");
    } catch (err) {
      // Nếu lỗi 400 xảy ra, nó sẽ hiện thông báo lỗi từ Backend ở đây
      setError(err.response?.data?.message || "Lỗi kết nối hệ thống!");
      console.error("Chi tiết lỗi:", err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");
  const formatPrice = (p) => Number(p).toLocaleString("vi-VN") + "đ";

  if (loading)
    return <p style={{ textAlign: "center", padding: 40 }}>Đang tải...</p>;
  if (error && !showtime)
    return (
      <p style={{ textAlign: "center", padding: 40, color: "red" }}>{error}</p>
    );

  // Group ghế theo hàng
  // const seatsByRow = seats.reduce((acc, seat) => {
  //   if (!acc[seat.row]) acc[seat.row] = [];
  //   acc[seat.row].push(seat);
  //   return acc;
  // }, {});
  // Thêm kiểm tra seats có phải là mảng không trước khi reduce để tránh trắng màn hình
  const seatsByRow = Array.isArray(seats)
    ? seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
      }, {})
    : {}; // Trả về object rỗng nếu chưa có dữ liệu

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      {/* Thông tin suất chiếu */}
      <div
        style={{
          background: "#1a1a2e",
          color: "#fff",
          borderRadius: 12,
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {showtime?.Movie?.title}
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            {formatDate(showtime?.start_time)} &nbsp;|&nbsp;
            {formatTime(showtime?.start_time)} –{" "}
            {formatTime(showtime?.end_time)} &nbsp;|&nbsp;
            {showtime?.Room?.name} ({showtime?.Room?.screen_type})
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Ghế thường / VIP</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {formatPrice(showtime?.price)} / {formatPrice(showtime?.price_vip)}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", marginBottom: 32, gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: i <= step ? "#e74c3c" : "#ddd",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px",
                transition: "background 0.2s",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: i === step ? 600 : 400,
                color: i <= step ? "#e74c3c" : "#aaa",
              }}
            >
              {s}
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  height: 2,
                  background: i < step ? "#e74c3c" : "#ddd",
                  position: "relative",
                  top: -24,
                  zIndex: -1,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Chọn ghế ── */}
      {step === 0 && (
        <div>
          {/* Màn chiếu */}
          <div
            style={{
              textAlign: "center",
              padding: "10px 0",
              background: "linear-gradient(to bottom, #bbb, #eee)",
              borderRadius: 6,
              marginBottom: 24,
              fontSize: 13,
              color: "#555",
              letterSpacing: 4,
            }}
          >
            MÀN HÌNH
          </div>

          {/* Sơ đồ ghế */}
          <div style={{ marginBottom: 24 }}>
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div
                key={row}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: 20,
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 600,
                  }}
                >
                  {row}
                </span>
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeats.find(
                    (s) => s.id === seat.id,
                  );
                  const isBooked = seat.status === "booked";
                  return (
                    <div
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      title={`${seat.row}${seat.number} - ${seat.type}`}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: isBooked ? "not-allowed" : "pointer",
                        transition: "all 0.15s",
                        background: isBooked
                          ? "#ddd"
                          : isSelected
                            ? "#e74c3c"
                            : seat.type === "vip"
                              ? "#fff3cd"
                              : "#fff",
                        color: isBooked
                          ? "#aaa"
                          : isSelected
                            ? "#fff"
                            : seat.type === "vip"
                              ? "#856404"
                              : "#333",
                        border: `2px solid ${
                          isBooked
                            ? "#ccc"
                            : isSelected
                              ? "#c0392b"
                              : seat.type === "vip"
                                ? "#f0a500"
                                : "#ccc"
                        }`,
                      }}
                    >
                      {seat.number}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Chú thích */}
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              { color: "#fff", border: "#ccc", label: "Thường" },
              { color: "#fff3cd", border: "#f0a500", label: "VIP" },
              { color: "#e74c3c", border: "#c0392b", label: "Đang chọn" },
              { color: "#ddd", border: "#ccc", label: "Đã đặt" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: item.color,
                    border: `2px solid ${item.border}`,
                  }}
                />
                {item.label}
              </div>
            ))}
          </div>

          {/* Ghế đã chọn */}
          {selectedSeats.length > 0 && (
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>Ghế đã chọn: </span>
                {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")}
              </div>
              <div style={{ fontWeight: 700, color: "#e74c3c", fontSize: 16 }}>
                {formatPrice(
                  selectedSeats.reduce(
                    (sum, s) =>
                      sum +
                      (s.type === "vip"
                        ? Number(showtime?.price_vip)
                        : Number(showtime?.price)),
                    0,
                  ),
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(1)}
            disabled={selectedSeats.length === 0}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              background: selectedSeats.length > 0 ? "#e74c3c" : "#ddd",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            Tiếp theo — Chọn đồ ăn →
          </button>
        </div>
      )}

      {/* ── STEP 1: Chọn đồ ăn ── */}
      {step === 1 && (
        <div>
          <p style={{ color: "#888", marginBottom: 20 }}>
            Tuỳ chọn — bạn có thể bỏ qua nếu không muốn đặt đồ ăn.
          </p>

          {["popcorn", "drink", "combo"].map((cat) => {
            const catFoods = foods.filter(
              (f) => f.category === cat && f.is_available,
            );
            if (catFoods.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 28 }}>
                <h3
                  style={{
                    marginBottom: 14,
                    textTransform: "capitalize",
                    fontWeight: 600,
                  }}
                >
                  {cat === "popcorn"
                    ? "🍿 Popcorn"
                    : cat === "drink"
                      ? "🥤 Nước uống"
                      : "🎁 Combo"}
                </h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {catFoods.map((food) => (
                    <div
                      key={food.id}
                      style={{
                        background: "#fff",
                        borderRadius: 10,
                        border: "1px solid #eee",
                        padding: 14,
                        width: 180,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={
                          food.image ||
                          "https://via.placeholder.com/160x100?text=Food"
                        }
                        alt={food.name}
                        style={{
                          width: "100%",
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      />
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {food.name}
                      </div>
                      <div
                        style={{
                          color: "#27ae60",
                          fontWeight: 600,
                          fontSize: 13,
                          marginBottom: 10,
                        }}
                      >
                        {formatPrice(food.price)}
                      </div>
                      {/* Tăng giảm số lượng */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <button
                          onClick={() => updateFood(food.id, -1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "1px solid #ddd",
                            background: "#f5f5f5",
                            fontSize: 16,
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontWeight: 600,
                            minWidth: 20,
                            textAlign: "center",
                          }}
                        >
                          {selectedFoods[food.id] || 0}
                        </span>
                        <button
                          onClick={() => updateFood(food.id, 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "1px solid #e74c3c",
                            background: "#e74c3c",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setStep(0)}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                background: "#f5f5f5",
                color: "#333",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Quay lại
            </button>
            <button
              onClick={() => setStep(2)}
              style={{
                flex: 2,
                padding: 14,
                borderRadius: 10,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tiếp theo — Xác nhận →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Xác nhận & Thanh toán ── */}
      {step === 2 && (
        <div>
          {/* Tóm tắt đơn hàng */}
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <h3 style={{ marginBottom: 16, fontWeight: 700 }}>
              📋 Tóm tắt đơn hàng
            </h3>

            {/* Phim & suất */}
            <div
              style={{
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {showtime?.Movie?.title}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>
                {formatDate(showtime?.start_time)} •{" "}
                {formatTime(showtime?.start_time)} • {showtime?.Room?.name}
              </div>
            </div>

            {/* Ghế */}
            <div
              style={{
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 14 }}>
                  Ghế:{" "}
                  {selectedSeats
                    .map(
                      (s) =>
                        `${s.row}${s.number}(${s.type === "vip" ? "VIP" : "Thường"})`,
                    )
                    .join(", ")}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatPrice(
                    selectedSeats.reduce(
                      (sum, s) =>
                        sum +
                        (s.type === "vip"
                          ? Number(showtime?.price_vip)
                          : Number(showtime?.price)),
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>

            {/* Đồ ăn */}
            {Object.keys(selectedFoods).length > 0 && (
              <div
                style={{
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                {Object.entries(selectedFoods).map(([foodId, qty]) => {
                  const food = foods.find((f) => f.id === parseInt(foodId));
                  return food ? (
                    <div
                      key={foodId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        {food.name} x{qty}
                      </span>
                      <span>{formatPrice(Number(food.price) * qty)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Tổng */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              <span>Tổng cộng</span>
              <span style={{ color: "#e74c3c" }}>
                {formatPrice(calcTotal())}
              </span>
            </div>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 14, fontWeight: 700 }}>
              💳 Phương thức thanh toán
            </h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { value: "momo", label: "💜 MoMo" },
                { value: "vnpay", label: "🔵 VNPay" },
                { value: "bank", label: "🏦 Ngân hàng (QR)" },
                { value: "cash", label: "💵 Tiền mặt" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPayMethod(method.value)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "2px solid",
                    borderColor:
                      payMethod === method.value ? "#e74c3c" : "#ddd",
                    background: payMethod === method.value ? "#fff5f5" : "#fff",
                    color: payMethod === method.value ? "#e74c3c" : "#333",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#fde8e8",
                color: "#e74c3c",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                background: "#f5f5f5",
                color: "#333",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                flex: 2,
                padding: 14,
                borderRadius: 10,
                background: submitting ? "#ccc" : "#e74c3c",
                color: "#fff",
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting
                ? "Đang xử lý..."
                : `🎟 Đặt vé • ${formatPrice(calcTotal())}`}
            </button>
          </div>
        </div>
      )}

      {/* 4. CHÈN MODAL QR VÀO CUỐI PHẦN RETURN */}
      {showQR && (
        <QRModal
          method={payMethod}
          amount={calcTotal()}
          onClose={() => setShowQR(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
};

export default BookingPage;
