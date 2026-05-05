import api from "./api";

const showtimeService = {
  // Lấy lịch chiếu theo phim và ngày
  getAll: (movieId, date) =>
    api.get("/showtimes", { params: { movieId, date } }),

  // Chi tiết suất chiếu
  getById: (id) => api.get(`/showtimes/${id}`),

  // Thêm suất chiếu (admin)
  create: (data) => api.post("/showtimes", data),

  // Sửa suất chiếu (admin)
  update: (id, data) => api.put(`/showtimes/${id}`, data),

  // Xoá suất chiếu (admin)
  delete: (id) => api.delete(`/showtimes/${id}`),
};

export default showtimeService;
