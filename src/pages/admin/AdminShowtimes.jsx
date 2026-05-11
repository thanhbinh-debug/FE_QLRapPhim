import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import showtimeService from "../../services/showtimeService";
import movieService from "../../services/movieService";
import roomService from "../../services/roomService";

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    movie_id: "",
    room_id: "",
    start_time: "",
    price: "",
    price_vip: "",
    is_auto: false,
    buffer_time: 15,
    end_day_time: "",
  });

  const fetchAll = async () => {
    const [stRes, mRes, rRes] = await Promise.all([
      showtimeService.getAll(),
      movieService.getAll(),
      roomService.getAll(),
    ]);
    setShowtimes(stRes.data);
    setMovies(mRes.data);
    setRooms(rRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await showtimeService.create(form);
      setForm({
        movie_id: "",
        room_id: "",
        start_time: "",
        price: "",
        price_vip: "",
        is_auto: false,
        buffer_time: 15,
        end_day_time: "",
      });
      setShowForm(false);
      fetchAll();

      Swal.fire({
        title: "Thành công!",
        text: "Suất chiếu mới đã được tạo thành công.",
        icon: "success",
        confirmButtonColor: "#e74c3c", // Màu đỏ đồng bộ với giao diện CinemaApp của bạn
        timer: 2000, // Tự động đóng sau 2 giây
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text:
          err.response?.data?.message ||
          "Không có suất chiếu nào được tạo. Vui lòng kiểm tra lại khung giờ hoặc trùng lịch!",
        icon: "error",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xoá?",
      text: "Bạn không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Đồng ý xoá",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) return;
    try {
      await showtimeService.delete(id);
      Swal.fire("Đã xoá!", "Suất chiếu đã được loại bỏ.", "success");
      fetchAll();
    } catch (err) {
      Swal.fire("Lỗi!", err.response?.data?.message || "Lỗi xoá", "error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
  };
  const fmt = (d) => new Date(d).toLocaleString("vi-VN");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showForm ? "✕ Đóng" : "+ Thêm suất chiếu"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9f9f9",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <h3 style={{ gridColumn: "1/-1", fontWeight: 700 }}>
            ➕ Thêm suất chiếu
          </h3>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Phim *
            </label>
            <select
              value={form.movie_id}
              onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">-- Chọn phim --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Phòng *
            </label>
            <select
              value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.screen_type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Giờ chiếu *
            </label>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Giá thường (đ) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Giá VIP (đ) *
            </label>
            <input
              type="number"
              value={form.price_vip}
              onChange={(e) => setForm({ ...form, price_vip: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              gridColumn: "1/-1",
              borderTop: "1px solid #eee",
              paddingTop: 14,
              marginTop: 10,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={form.is_auto}
                onChange={(e) =>
                  setForm({ ...form, is_auto: e.target.checked })
                }
              />
              Tự động tạo suất chiếu cho đến hết ngày
            </label>
          </div>

          {form.is_auto && (
            <>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: "#666",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Thời gian nghỉ giữa các suất (phút)
                </label>
                <input
                  type="number"
                  value={form.buffer_time}
                  onChange={(e) =>
                    setForm({ ...form, buffer_time: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: "#666",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Giờ kết thúc ngày *
                </label>
                <input
                  type="datetime-local"
                  value={form.end_day_time}
                  onChange={(e) =>
                    setForm({ ...form, end_day_time: e.target.value })
                  }
                  required={form.is_auto}
                  style={inputStyle}
                />
              </div>
            </>
          )}
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                background: "#f1f1f1",
                border: "none",
                cursor: "pointer",
              }}
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              {[
                "Phim",
                "Phòng",
                "Giờ chiếu",
                "Kết thúc",
                "Giá thường",
                "Giá VIP",
                "",
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
            {showtimes.map((st, i) => (
              <tr
                key={st.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                  {st.Movie?.title}
                </td>
                <td style={{ padding: "10px 12px", color: "#666" }}>
                  {st.Room?.name}
                </td>
                <td style={{ padding: "10px 12px" }}>{fmt(st.start_time)}</td>
                <td style={{ padding: "10px 12px", color: "#666" }}>
                  {fmt(st.end_time)}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {Number(st.price).toLocaleString("vi-VN")}đ
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {Number(st.price_vip).toLocaleString("vi-VN")}đ
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <button
                    onClick={() => handleDelete(st.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: "#f8d7da",
                      color: "#721c24",
                      border: "1px solid #f5c6cb",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showtimes.length === 0 && (
          <p style={{ textAlign: "center", padding: 24, color: "#888" }}>
            Chưa có suất chiếu nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminShowtimes;
