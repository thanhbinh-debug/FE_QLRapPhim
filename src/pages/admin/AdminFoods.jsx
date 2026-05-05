import { useEffect, useState } from "react";
import foodService from "../../services/foodService";

const EMPTY = {
  name: "",
  category: "popcorn",
  price: "",
  image: "",
  description: "",
};

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFoods = async () => {
    const res = await foodService.getAll();
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await foodService.update(editing, form);
      } else {
        await foodService.create(form);
      }
      setForm(EMPTY);
      setEditing(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu món");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá món này?")) return;
    try {
      await foodService.delete(id);
      fetchFoods();
    } catch (err) {
      alert("Lỗi xoá món");
    }
  };

  const toggleAvailable = async (food) => {
    try {
      await foodService.update(food.id, { is_available: !food.is_available });
      fetchFoods();
    } catch (err) {
      alert("Lỗi cập nhật");
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
          {showForm ? "✕ Đóng" : "+ Thêm món"}
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
            {editing ? "✏️ Sửa món" : "➕ Thêm món"}
          </h3>
          {[
            { name: "name", label: "Tên món *", type: "text", col: 2 },
            { name: "price", label: "Giá (đ) *", type: "number", col: 1 },
            { name: "image", label: "URL ảnh", type: "text", col: 1 },
            { name: "description", label: "Mô tả", type: "text", col: 2 },
          ].map((f) => (
            <div key={f.name} style={{ gridColumn: `span ${f.col}` }}>
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
                name={f.name}
                value={form[f.name]}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required={f.name === "name" || f.name === "price"}
                style={inputStyle}
              />
            </div>
          ))}
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#666",
                display: "block",
                marginBottom: 4,
              }}
            >
              Loại
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={inputStyle}
            >
              <option value="popcorn">🍿 Popcorn</option>
              <option value="drink">🥤 Nước uống</option>
              <option value="combo">🎁 Combo</option>
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

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {foods.map((food) => (
          <div
            key={food.id}
            style={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #eee",
              width: 180,
              overflow: "hidden",
              opacity: food.is_available ? 1 : 0.6,
            }}
          >
            <img
              src={
                food.image || "https://via.placeholder.com/180x110?text=Food"
              }
              alt={food.name}
              style={{ width: "100%", height: 110, objectFit: "cover" }}
            />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                {food.name}
              </div>
              <div
                style={{
                  color: "#27ae60",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                {Number(food.price).toLocaleString("vi-VN")}đ
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleAvailable(food)}
                  style={{
                    flex: 1,
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    background: food.is_available ? "#d4edda" : "#f8d7da",
                    color: food.is_available ? "#155724" : "#721c24",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {food.is_available ? "Còn hàng" : "Hết hàng"}
                </button>
                <button
                  onClick={() => {
                    setForm({
                      name: food.name,
                      category: food.category,
                      price: food.price,
                      image: food.image || "",
                      description: food.description || "",
                    });
                    setEditing(food.id);
                    setShowForm(true);
                  }}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #f0c040",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#f8d7da",
                    color: "#721c24",
                    border: "1px solid #f5c6cb",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
        {foods.length === 0 && (
          <p style={{ color: "#888" }}>Chưa có món nào.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFoods;
