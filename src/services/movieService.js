import api from "./api";

const movieService = {
  // Lấy danh sách phim
  getAll: (status) => api.get("/movies", { params: { status } }),

  // Tìm kiếm phim
  search: (q) => api.get("/movies/search", { params: { q } }),

  // Chi tiết phim
  getById: (id) => api.get(`/movies/${id}`),

  // Thêm phim (admin)
  create: (data) => api.post("/movies", data),

  // Sửa phim (admin)
  update: (id, data) => api.put(`/movies/${id}`, data),

  // Xoá phim (admin)
  delete: (id) => api.delete(`/movies/${id}`),
};

export default movieService;
