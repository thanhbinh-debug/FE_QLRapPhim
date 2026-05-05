import api from "./api";

const paymentService = {
  // Thanh toán
  create: (data) => api.post("/payments", data),

  // Lịch sử mua vé
  getHistory: () => api.get("/payments/history"),

  // Tất cả payment (admin)
  getAll: () => api.get("/payments"),
};

export default paymentService;
