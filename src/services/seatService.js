import api from "./api";

const seatService = {
  // Lấy sơ đồ ghế theo suất chiếu — QUAN TRỌNG
  getByShowtime: (showtimeId) => api.get(`/seats/showtime/${showtimeId}`),

  // Đổi tên hàm thành bulkCreate để khớp với AdminRooms.jsx, vẫn giữ nguyên route chuẩn của Backend
  bulkCreate: (roomId, data) => api.post(`/seats/room/${roomId}`, data),

  // Sửa ghế (admin)
  update: (id, data) => api.put(`/seats/${id}`, data),

  // Xoá ghế (admin)
  delete: (id) => api.delete(`/seats/${id}`),
};

export default seatService;
