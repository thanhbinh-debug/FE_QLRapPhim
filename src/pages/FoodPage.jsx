import React, { useState, useEffect } from "react";
import axios from "axios";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Sử dụng đúng URL bạn đã fix thành công
        const res = await axios.get("http://localhost:5000/foods");
        setFoods(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi tải đồ ăn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", padding: "100px" }}>
        Đang tải menu...
      </div>
    );

  return (
    // Đổi background thành màu xanh đen đồng bộ với trang chi tiết phim
    <div
      style={{
        padding: "60px 24px",
        minHeight: "100vh",
        background: "#fff",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Tiêu đề có gạch chân đỏ giống trang "Vé của tôi" */}
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 40,
            borderLeft: "4px solid #e74c3c",
            paddingLeft: 12,
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          🍿 Bắp Nước & Đồ Ăn
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {foods.map((food) => (
            <div
              key={food.id}
              style={{
                background: "#ffffff", // Đổi card sang nền trắng để nổi bật thông tin như trong trang MyTickets
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={food.image}
                alt={food.name}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "16px", textAlign: "left" }}>
                <h3
                  style={{
                    color: "#333",
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  {food.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#e74c3c",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    {Number(food.price).toLocaleString("vi-VN")}đ
                  </span>
                  <span
                    style={{
                      background: "#f1f1f1",
                      color: "#666",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    Combo
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
