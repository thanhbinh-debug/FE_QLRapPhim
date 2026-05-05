import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movieService from "../services/movieService";
import showtimeService from "../services/showtimeService";
import { useAuth } from "../context/AuthContext";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tạo danh sách 7 ngày tiếp theo để chọn
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0]; // format YYYY-MM-DD
  });

  // Load thông tin phim
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieService.getById(id);
        setMovie(res.data);
      } catch (err) {
        setError("Không tìm thấy phim");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    setSelectedDate(next7Days[0]); // mặc định chọn hôm nay
  }, [id]);

  // Load lịch chiếu khi chọn ngày
  useEffect(() => {
    if (!selectedDate) return;
    const fetchShowtimes = async () => {
      try {
        const res = await showtimeService.getAll(id, selectedDate);
        setShowtimes(res.data);
      } catch (err) {
        console.error("Lỗi tải lịch chiếu:", err);
      }
    };
    fetchShowtimes();
  }, [id, selectedDate]);

  const handleSelectShowtime = (showtimeId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${showtimeId}`);
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: 40 }}>Đang tải...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", padding: 40, color: "red" }}>{error}</p>
    );
  if (!movie) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Thông tin phim */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 48,
          flexWrap: "wrap",
        }}
      >
        {/* Poster */}
        <img
          src={
            movie.poster || "https://via.placeholder.com/250x370?text=No+Image"
          }
          alt={movie.title}
          style={{
            width: 250,
            height: 370,
            objectFit: "cover",
            borderRadius: 12,
          }}
        />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            {movie.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              ⭐ {movie.rating}
            </span>
            <span
              style={{
                background: "#f1f1f1",
                color: "#555",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
              }}
            >
              🕐 {movie.duration} phút
            </span>
            <span
              style={{
                background: "#f1f1f1",
                color: "#555",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
              }}
            >
              🎭 {movie.genre}
            </span>
            <span
              style={{
                background:
                  movie.status === "now_showing" ? "#d4edda" : "#cce5ff",
                color: movie.status === "now_showing" ? "#155724" : "#004085",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
              }}
            >
              {movie.status === "now_showing"
                ? "🎬 Đang chiếu"
                : "🔜 Sắp chiếu"}
            </span>
          </div>

          {/* PHẦN THÔNG TIN CHI TIẾT MỚI BỔ SUNG */}
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              fontSize: 15,
              color: "#333",
              lineHeight: "1.8",
            }}
          >
            <p style={{ margin: "4px 0" }}>
              <strong>🎬 Đạo diễn:</strong> {movie.director || "Đang cập nhật"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>🌍 Quốc gia:</strong> {movie.country || "Đang cập nhật"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>🎭 Diễn viên:</strong> {movie.cast || "Đang cập nhật"}
            </p>
          </div>

          <p style={{ color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
            {movie.description}
          </p>

          {movie.trailer_url && (
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: 8,
                background: "#e74c3c",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ▶ Xem Trailer
            </a>
          )}
        </div>
      </div>

      {/* Lịch chiếu */}
      {movie.status === "now_showing" && (
        <section>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
              borderLeft: "4px solid #e74c3c",
              paddingLeft: 12,
            }}
          >
            🗓 Lịch chiếu
          </h2>

          {/* Chọn ngày */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {next7Days.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "2px solid",
                  borderColor: selectedDate === date ? "#e74c3c" : "#ddd",
                  background: selectedDate === date ? "#e74c3c" : "#fff",
                  color: selectedDate === date ? "#fff" : "#333",
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>

          {/* Danh sách suất chiếu */}
          {showtimes.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                background: "#f9f9f9",
                borderRadius: 10,
                color: "#888",
              }}
            >
              Không có suất chiếu nào trong ngày này.
            </div>
          ) : (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {showtimes.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleSelectShowtime(st.id)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 10,
                    border: "2px solid #ddd",
                    cursor: "pointer",
                    background: "#fff",
                    minWidth: 180,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#e74c3c";
                    e.currentTarget.style.background = "#fff5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#e74c3c",
                      marginBottom: 6,
                    }}
                  >
                    {formatTime(st.start_time)}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                    Kết thúc: {formatTime(st.end_time)}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
                    🏠 {st.Room?.name} • {st.Room?.screen_type}
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#27ae60" }}
                  >
                    {Number(st.price).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MovieDetailPage;
