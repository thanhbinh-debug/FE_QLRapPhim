import api from "./api";

const bookingService = {
  // Đặt vé
  create: (data) => api.post("/bookings", data),

  // Vé của tôi
  getMyBookings: () => api.get("/bookings/me"),

  // Chi tiết vé
  getById: (id) => api.get(`/bookings/${id}`),

  // Huỷ vé
  cancel: (id) => api.delete(`/bookings/${id}`),

  // Tất cả booking (admin)
  getAll: (params) => api.get("/bookings", { params }),
};

export default bookingService;
