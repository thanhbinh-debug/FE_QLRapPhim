import { useEffect, useState } from "react";
import movieService from "../../services/movieService";

const EMPTY = {
  title: "",
  description: "",
  genre: "",
  duration: "",
  poster: "",
  trailer_url: "",
  status: "now_showing",
  release_date: "",
  rating: "",
  director: "",
  cast: "",
  country: "",
};

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // id đang sửa
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    const res = await movieService.getAll();
    setMovies(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await movieService.update(editing, form);
      } else {
        await movieService.create(form);
      }
      setForm(EMPTY);
      setEditing(null);
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu phim");
    }
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      description: movie.description || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      poster: movie.poster || "",
      trailer_url: movie.trailer_url || "",
      status: movie.status,
      release_date: movie.release_date || "",
      rating: movie.rating || "",
      director: movie.director || "",
      cast: movie.cast || "",
      country: movie.country || "",
    });
    setEditing(movie.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá phim này?")) return;
    try {
      await movieService.delete(id);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xoá phim");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
  };

  return (
    <div>
      {/* Nút thêm mới */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => {
            setForm(EMPTY);
            setEditing(null);
            setShowForm(!showForm);
          }}
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
          {showForm ? "✕ Đóng" : "+ Thêm phim"}
        </button>
      </div>

      {/* Form thêm/sửa */}
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
          <h3 style={{ gridColumn: "1/-1", fontWeight: 700, marginBottom: 4 }}>
            {editing ? "✏️ Sửa phim" : "➕ Thêm phim mới"}
          </h3>

          {[
            { name: "title", label: "Tên phim *", type: "text", col: 2 },
            { name: "genre", label: "Thể loại", type: "text", col: 1 },
            {
              name: "duration",
              label: "Thời lượng (phút)",
              type: "number",
              col: 1,
            },
            { name: "poster", label: "URL Poster", type: "text", col: 2 },
            { name: "trailer_url", label: "URL Trailer", type: "text", col: 2 },
            {
              name: "release_date",
              label: "Ngày khởi chiếu",
              type: "date",
              col: 1,
            },
            { name: "rating", label: "Điểm đánh giá", type: "number", col: 1 },
            { name: "director", label: "Đạo diễn", type: "text", col: 1 }, // Mới
            { name: "country", label: "Quốc gia", type: "text", col: 1 }, // Mới
            {
              name: "cast",
              label: "Diễn viên (cách nhau bởi dấu phẩy)",
              type: "text",
              col: 2,
            },
          ].map((field) => (
            <div key={field.name} style={{ gridColumn: `span ${field.col}` }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#666",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.name === "title"}
                step={field.name === "rating" ? "0.1" : undefined}
                min={field.name === "rating" ? "0" : undefined}
                max={field.name === "rating" ? "10" : undefined}
                style={inputStyle}
              />
            </div>
          ))}

          {/* Status */}
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Trạng thái
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="now_showing">Đang chiếu</option>
              <option value="coming_soon">Sắp chiếu</option>
            </select>
          </div>

          {/* Description */}
          <div style={{ gridColumn: "1/-1" }}>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

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
                fontSize: 14,
              }}
            >
              {editing ? "Lưu thay đổi" : "Thêm phim"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                background: "#f1f1f1",
                color: "#333",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách phim */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr style={{ background: "#f1f1f1" }}>
                {[
                  "Poster",
                  "Tên phim",
                  "Thể loại",
                  "TL (phút)",
                  "Trạng thái",
                  "Rating",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, i) => (
                <tr
                  key={movie.id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <img
                      src={
                        movie.poster ||
                        "https://via.placeholder.com/50x70?text=N/A"
                      }
                      alt={movie.title}
                      style={{
                        width: 50,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: 500,
                      maxWidth: 200,
                    }}
                  >
                    {movie.title}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>
                    {movie.genre}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>
                    {movie.duration}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        background:
                          movie.status === "now_showing"
                            ? "#d4edda"
                            : "#cce5ff",
                        color:
                          movie.status === "now_showing"
                            ? "#155724"
                            : "#004085",
                      }}
                    >
                      {movie.status === "now_showing"
                        ? "Đang chiếu"
                        : "Sắp chiếu"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>⭐ {movie.rating}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleEdit(movie)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          background: "#fff3cd",
                          color: "#856404",
                          border: "1px solid #f0c040",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {movies.length === 0 && (
            <p style={{ textAlign: "center", padding: 24, color: "#888" }}>
              Chưa có phim nào.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
