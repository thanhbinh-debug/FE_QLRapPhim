import api from "./api";

const foodService = {
  // Lấy menu
  getAll: (category) => api.get("/foods", { params: { category } }),

  // Chi tiết món
  getById: (id) => api.get(`/foods/${id}`),

  // Thêm món (admin)
  create: (data) => api.post("/foods", data),

  // Sửa món (admin)
  update: (id, data) => api.put(`/foods/${id}`, data),

  // Xoá món (admin)
  delete: (id) => api.delete(`/foods/${id}`),
};

export default foodService;
