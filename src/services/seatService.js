import api from "./api";

const seatService = {
  // Lấy sơ đồ ghế theo suất chiếu — QUAN TRỌNG
  getByShowtime: (showtimeId) => api.get(`/seats/showtime/${showtimeId}`),

  // Tạo ghế hàng loạt (admin)
  createForRoom: (roomId, data) => api.post(`/seats/room/${roomId}`, data),

  // Sửa ghế (admin)
  update: (id, data) => api.put(`/seats/${id}`, data),

  // Xoá ghế (admin)
  delete: (id) => api.delete(`/seats/${id}`),
};

export default seatService;
