import { useEffect, useState } from "react";
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
  const [seatForm, setSeatForm] = useState({
    rows: 8,
    seatsPerRow: 10,
    vipRows: "D,E",
  });
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
      } else {
        await roomService.create(form);
      }
      setForm({ name: "", capacity: "", screen_type: "2D" });
      setEditing(null);
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu phòng");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá phòng này?")) return;
    try {
      await roomService.delete(id);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xoá phòng");
    }
  };

  const handleCreateSeats = async (roomId) => {
    try {
      const vipRowsArr = seatForm.vipRows
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      await seatService.createForRoom(roomId, {
        rows: parseInt(seatForm.rows),
        seatsPerRow: parseInt(seatForm.seatsPerRow),
        vipRows: vipRowsArr,
      });
      alert("Tạo ghế thành công!");
      setSelectedRoom(null);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi tạo ghế");
    }
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
                  onClick={() =>
                    setSelectedRoom(selectedRoom === room.id ? null : room.id)
                  }
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

            {/* Form tạo ghế */}
            {selectedRoom === room.id && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#f9f9f9",
                  borderRadius: 8,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: 12,
                  alignItems: "flex-end",
                }}
              >
                {[
                  { label: "Số hàng", key: "rows", type: "number" },
                  { label: "Ghế/hàng", key: "seatsPerRow", type: "number" },
                  { label: "Hàng VIP (VD: D,E)", key: "vipRows", type: "text" },
                ].map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#666",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={seatForm[f.key]}
                      onChange={(e) =>
                        setSeatForm({ ...seatForm, [f.key]: e.target.value })
                      }
                      style={{ ...inputStyle, width: "100%" }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleCreateSeats(room.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  Tạo ghế
                </button>
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
