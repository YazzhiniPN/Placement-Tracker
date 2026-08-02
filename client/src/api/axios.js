import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // needed so the httpOnly refreshToken cookie is sent/received
});

// Attach token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, kick back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Your backend returns errors as { err: "..." } — normalize to
    // { message: "..." } too so pages can read either key.
    if (err.response?.data?.err && !err.response.data.message) {
      err.response.data.message = err.response.data.err;
    }
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
