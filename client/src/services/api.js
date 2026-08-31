import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach admin token automatically when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a readable message for the UI.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please check your connection and try again.";

    if (error.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }

    return Promise.reject({ ...error, message });
  }
);

// --- Public endpoints ---
export const fetchFoods = (params = {}) => api.get("/foods", { params });
export const fetchFoodById = (id) => api.get(`/foods/${id}`);
export const fetchCategories = () => api.get("/categories");
export const fetchSettings = () => api.get("/settings");

// --- Auth ---
export const loginAdmin = (credentials) => api.post("/auth/login", credentials);
export const fetchAdminMe = () => api.get("/auth/me");

// --- Admin: foods (multipart for image/video) ---
export const createFood = (formData) =>
  api.post("/foods", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateFood = (id, formData) =>
  api.put(`/foods/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteFood = (id) => api.delete(`/foods/${id}`);

// --- Admin: categories ---
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// --- Admin: settings ---
export const updateSettings = (data) => api.put("/settings", data);

export default api;
