import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import roomService from "../../services/roomService";
import seatService from "../../services/seatService";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    screen_type: "2D",
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 1. THAY ĐỔI STATE KHỞI TẠO GHẾ THÀNH DẠNG MẢNG CẤU HÌNH LINH HOẠT
  const [rowsConfig, setRowsConfig] = useState([
    { row: "A", seatsCount: 10, type: "standard" },
  ]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    const res = await roomService.getAll();
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await roomService.update(editing, form);
        Swal.fire({
          title: "Thành công!",
          text: "Thông tin phòng đã được cập nhật.",
          icon: "success",
          confirmButtonColor: "#e74c3c",
          timer: 1500,
        });
      } else {
        await roomService.create(form);
        Swal.fire({
          title: "Thành công!",
          text: "Phòng mới đã được tạo.",
          icon: "success",
          confirmButtonColor: "#e74c3c",
          timer: 1500,
        });
      }
      setForm({ name: "", capacity: "", screen_type: "2D" });
      setEditing(null);
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: err.response?.data?.message || "Có lỗi xảy ra khi tạo phòng",
        icon: "error",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xoá?",
      text: "Tất cả dữ liệu liên quan đến phòng này sẽ bị mất!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Đồng ý xoá",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      try {
        await roomService.delete(id);
        Swal.fire({
          title: "Đã xoá!",
          icon: "success",
          confirmButtonColor: "#e74c3c",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchRooms();
      } catch (err) {
        Swal.fire("Lỗi!", "Không thể xoá phòng này", "error");
      }
    }
  };

  // 2. CẬP NHẬT HÀM GỌI API TRUYỀN `rowsConfig` LÊN BACKEND
  const handleCreateSeats = async (roomId) => {
    try {
      // Truyền đúng object chứa rowsConfig sang API
      await seatService.bulkCreate(roomId, { rowsConfig });

      Swal.fire({
        title: "Tạo ghế thành công!",
        text: `Đã tạo sơ đồ ghế cho phòng thành công.`,
        icon: "success",
        confirmButtonColor: "#27ae60",
        timer: 2000,
      });

      setSelectedRoom(null);
      fetchRooms(); // Tải lại phòng để cập nhật dung lượng (capacity) thực tế mới
    } catch (err) {
      Swal.fire({
        title: "Lỗi tạo ghế!",
        text: err.response?.data?.message || "Có lỗi xảy ra khi tạo sơ đồ ghế",
        icon: "error",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  // 3. CÁC HÀM BỔ TRỢ QUẢN LÝ THÊM/XÓA/SỬA HÀNG GHẾ ĐỘNG
  const getNextRowLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const handleAddRow = () => {
    const nextIndex = rowsConfig.length;
    if (nextIndex >= 26) return; // Giới hạn bảng chữ cái từ A-Z
    const nextRow = getNextRowLetter(nextIndex);
    setRowsConfig([
      ...rowsConfig,
      { row: nextRow, seatsCount: 10, type: "standard" },
    ]);
  };

  const handleRemoveRow = (indexToRemove) => {
    if (rowsConfig.length <= 1) return;
    const updated = rowsConfig
      .filter((_, idx) => idx !== indexToRemove)
      .map((item, idx) => ({
        ...item,
        row: getNextRowLetter(idx), // Reset lại ký tự theo thứ tự đúng A, B, C...
      }));
    setRowsConfig(updated);
  };

  const handleUpdateRowConfig = (index, key, value) => {
    const updated = [...rowsConfig];
    updated[index][key] = value;
    setRowsConfig(updated);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
  };

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
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setForm({ name: "", capacity: "", screen_type: "2D" });
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
          {showForm ? "✕ Đóng" : "+ Thêm phòng"}
        </button>
      </div>

      {/* Form phòng */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9f9f9",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
          }}
        >
          <h3 style={{ gridColumn: "1/-1", fontWeight: 700 }}>
            {editing ? "✏️ Sửa phòng" : "➕ Thêm phòng mới"}
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
              Tên phòng *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              Sức chứa
            </label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
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
              Loại màn hình
            </label>
            <select
              value={form.screen_type}
              onChange={(e) =>
                setForm({ ...form, screen_type: e.target.value })
              }
              style={inputStyle}
            >
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
            </select>
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
              }}
            >
              {editing ? "Lưu" : "Thêm"}
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

      {/* Danh sách phòng */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #eee",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>
                  {room.name}
                </span>
                <span style={{ marginLeft: 12, color: "#666", fontSize: 13 }}>
                  {room.screen_type} • {room.capacity} ghế
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    if (selectedRoom === room.id) {
                      setSelectedRoom(null);
                    } else {
                      setSelectedRoom(room.id);
                      // Reset form về mặc định khi chuyển hoặc mở phòng khác
                      setRowsConfig([
                        { row: "A", seatsCount: 10, type: "standard" },
                      ]);
                    }
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: "#e8f4fd",
                    color: "#0c447c",
                    border: "1px solid #bee5eb",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  🪑 Tạo ghế
                </button>
                <button
                  onClick={() => {
                    setForm({
                      name: room.name,
                      capacity: room.capacity,
                      screen_type: room.screen_type,
                    });
                    setEditing(room.id);
                    setShowForm(true);
                  }}
                  style={{
                    padding: "6px 12px",
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
                  onClick={() => handleDelete(room.id)}
                  style={{
                    padding: "6px 12px",
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
            </div>

            {/* Form cấu hình sơ đồ hàng ghế linh hoạt */}
            {selectedRoom === room.id && (
              <div
                style={{
                  marginTop: 16,
                  padding: 20,
                  background: "#f9f9f9",
                  borderRadius: 8,
                  border: "1px dashed #ccc",
                }}
              >
                <h4
                  style={{ marginBottom: 14, fontWeight: 600, color: "#333" }}
                >
                  ⚙️ Cấu hình sơ đồ ghế theo từng hàng:
                </h4>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {rowsConfig.map((config, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        background: "#fff",
                        padding: "8px 12px",
                        borderRadius: 6,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Tên hàng ghế */}
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          textAlign: "center",
                          color: "#e74c3c",
                        }}
                      >
                        Hàng {config.row}
                      </span>

                      {/* Số lượng ghế */}
                      <div>
                        <label
                          style={{
                            fontSize: 11,
                            color: "#888",
                            display: "block",
                            marginBottom: 2,
                          }}
                        >
                          Số ghế
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={config.seatsCount}
                          onChange={(e) =>
                            handleUpdateRowConfig(
                              index,
                              "seatsCount",
                              e.target.value,
                            )
                          }
                          style={{ ...inputStyle, padding: "6px 10px" }}
                        />
                      </div>

                      {/* Phân loại ghế hợp lệ với cấu trúc ENUM database */}
                      <div>
                        <label
                          style={{
                            fontSize: 11,
                            color: "#888",
                            display: "block",
                            marginBottom: 2,
                          }}
                        >
                          Loại ghế
                        </label>
                        <select
                          value={config.type}
                          onChange={(e) =>
                            handleUpdateRowConfig(index, "type", e.target.value)
                          }
                          style={{ ...inputStyle, padding: "6px 10px" }}
                        >
                          <option value="standard">Thường (Standard)</option>
                          <option value="vip">VIP</option>
                          <option value="couple">Ghế Đôi (Couple)</option>
                        </select>
                      </div>

                      {/* Nút xoá hàng hiện tại */}
                      {rowsConfig.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c0392b",
                            cursor: "pointer",
                            fontSize: 16,
                            paddingTop: 14,
                          }}
                          title="Xóa hàng này"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chức năng tương tác tổng quan */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleAddRow}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      background: "#fff",
                      color: "#2980b9",
                      border: "1px solid #2980b9",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ➕ Thêm hàng tiếp theo
                  </button>

                  <button
                    onClick={() => handleCreateSeats(room.id)}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 8,
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    🚀 Xác nhận tạo sơ đồ ghế
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {rooms.length === 0 && (
          <p style={{ textAlign: "center", padding: 24, color: "#888" }}>
            Chưa có phòng nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminRooms;
