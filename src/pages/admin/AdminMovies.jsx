import { useEffect, useState } from "react";
import movieService from "../../services/movieService";

const AVAILABLE_GENRES = [
  "Hành động",
  "Hài hước",
  "Kịch tính",
  "Hồi hộp",
  "Kinh dị",
  "Hoạt hình",
  "Tình cảm",
  "Viễn tưởng",
  "Bí ẩn",
  "Gia đình",
];

const EMPTY = {
  title: "",
  description: "",
  genre: "",
  duration: "",
  poster: "",
  trailer_url: "",
  status: "now_showing",
  release_date: "",
  end_date: "",
  copyright_cost: 0,
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  // CHỨC NĂNG: Xử lý khi admin tích chọn hoặc bỏ tích các checkbox thể loại phim
  const handleGenreCheckboxChange = (genreName) => {
    // Chuyển chuỗi thể loại hiện tại thành mảng để xử lý
    let currentGenres = form.genre ? form.genre.split(", ") : [];

    if (currentGenres.includes(genreName)) {
      // Nếu đã có thì xóa đi (bỏ tích)
      currentGenres = currentGenres.filter((g) => g !== genreName);
    } else {
      // Nếu chưa có thì thêm vào (tích chọn)
      currentGenres.push(genreName);
    }

    // Gộp lại thành chuỗi "Hành động, Hài hước" và lưu vào form
    setForm({ ...form, genre: currentGenres.join(", ") });
  };

  // CHỨC NĂNG: Xử lý khi admin chọn file ảnh từ máy tính cá nhân
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo một đường link ảo để hiển thị thẻ <img /> xem trước
    }
  };

  // CHỨC NĂNG: Xử lý submit gửi dữ liệu lên Server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Đẩy tất cả dữ liệu text từ state form vào FormData
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key !== "poster") {
        formData.append(key, form[key]);
      }
    });

    // Nếu có chọn file ảnh mới thì đính kèm file ảnh vào key 'poster'
    if (selectedFile) {
      formData.append("poster", selectedFile);
    } else if (editing && form.poster) {
      // Nếu đang sửa phim và KHÔNG chọn ảnh mới, gửi lại đường dẫn ảnh cũ dạng chuỗi văn bản
      formData.append("poster", form.poster);
    }

    try {
      if (editing) {
        await movieService.update(editing, formData);
      } else {
        await movieService.create(formData);
      }
      setForm(EMPTY);
      setSelectedFile(null);
      setImagePreview("");
      setEditing(null);
      setShowForm(false);
      await fetchMovies();
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
      end_date: movie.end_date || "",
      copyright_cost: movie.copyright_cost || 0,
      rating: movie.rating || "",
      director: movie.director || "",
      cast: movie.cast || "",
      country: movie.country || "",
    });
    setEditing(movie.id);
    // Hiển thị lại ảnh cũ của phim bằng cách lấy link từ server backend (Ví dụ cổng backend chạy ở port 5000)
    setImagePreview(movie.poster ? `http://localhost:5000${movie.poster}` : "");
    setSelectedFile(null); // Reset trạng thái file mới chọn
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
          justify: "flex-end",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => {
            setForm(EMPTY);
            setSelectedFile(null); // CHỨC NĂNG: Reset file đã chọn
            setImagePreview(""); // CHỨC NĂNG: Reset ảnh xem trước
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

          {/* VÒNG LẶP ĐỔ TỰ ĐỘNG CÁC TRƯỜNG NHẬP TEXT/DATE/NUMBER */}
          {[
            { name: "title", label: "Tên phim *", type: "text", col: 2 },
            {
              name: "duration",
              label: "Thời lượng (phút)",
              type: "number",
              col: 1,
            },
            {
              name: "copyright_cost",
              label: "Chi phí bản quyền (VND)",
              type: "number",
              col: 1,
            }, // CHỨC NĂNG: Thêm chi phí bản quyền
            { name: "trailer_url", label: "URL Trailer", type: "text", col: 2 },
            {
              name: "release_date",
              label: "Ngày khởi chiếu",
              type: "date",
              col: 1,
            },
            {
              name: "end_date",
              label: "Ngày kết thúc dự kiến",
              type: "date",
              col: 1,
            }, // CHỨC NĂNG: Thêm ngày kết thúc phim
            { name: "rating", label: "Điểm đánh giá", type: "number", col: 1 },
            { name: "director", label: "Đạo diễn", type: "text", col: 1 },
            { name: "country", label: "Quốc gia", type: "text", col: 1 },
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

          {/* CHỨC NĂNG: Tách phần Thể loại để hiển thị dạng Checkbox tích chọn tiện lợi thay vì nhập tay */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Thể loại phim
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                background: "#fff",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            >
              {AVAILABLE_GENRES.map((g) => {
                // Kiểm tra xem thể loại này đã được lưu trong chuỗi form.genre chưa để tích sẵn chọn
                const isChecked = form.genre
                  ? form.genre.split(", ").includes(g)
                  : false;
                return (
                  <label
                    key={g}
                    style={{
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleGenreCheckboxChange(g)}
                    />
                    {g}
                  </label>
                );
              })}
            </div>
          </div>

          {/* CHỨC NĂNG: Tách phần Poster cũ thành nút Tải file ảnh thực tế từ máy tính */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Poster Phim (Tải file ảnh: .png, .jpg, .jpeg dưới 2MB)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              required={!editing} // Khi thêm mới thì bắt buộc chọn ảnh, khi sửa có thể bỏ qua để giữ ảnh cũ
              style={{ ...inputStyle, background: "#fff" }}
            />

            {/* CHỨC NĂNG: Hiển thị khung hình ảnh xem trước (Preview) ngay sau khi chọn file từ máy */}
            {imagePreview && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                  Xem trước ảnh poster:
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 100,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "2px solid #e74c3c",
                  }}
                />
              </div>
            )}
          </div>

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

          {/* Các nút bấm hành động */}
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
              onClick={() => {
                setShowForm(false);
                setSelectedFile(null);
                setImagePreview("");
              }}
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
                  "Chi phí bản quyền", // CHỨC NĂNG: Thay thế cột Rating hiển thị ít quan trọng bằng chi phí bản quyền
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
                      /* CHỨC NĂNG: Thay đổi nguồn ảnh: kết nối địa chỉ API server với đường dẫn cục bộ được lưu trong DB */
                      src={
                        movie.poster && typeof movie.poster === "string" // Chỉ hiển thị nếu poster là dạng chuỗi đường dẫn
                          ? movie.poster.startsWith("http")
                            ? movie.poster
                            : `http://localhost:5000${movie.poster}`
                          : "https://via.placeholder.com/50x70?text=No+Image" // Ảnh mặc định nếu không có poster hoặc poster không phải là chuỗi
                      }
                      alt={movie.title}
                      style={{
                        width: 50,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        // Bẫy lỗi: Nếu link ảnh lỗi thì tự đổi sang ảnh placeholder mặc định
                        e.target.src =
                          "https://via.placeholder.com/50x70?text=Error";
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
                  {/* CHỨC NĂNG: Format định dạng hiển thị tiền tệ VNĐ có dấu chấm phân cách hàng nghìn cho Admin dễ đọc */}
                  <td
                    style={{
                      padding: "10px 12px",
                      fontWeight: "600",
                      color: "#27ae60",
                    }}
                  >
                    {movie.copyright_cost
                      ? movie.copyright_cost.toLocaleString("vi-VN") + " đ"
                      : "0 đ"}
                  </td>
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
