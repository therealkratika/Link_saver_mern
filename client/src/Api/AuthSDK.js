import api from "./axios";

// Centralized Auth SDK
export const AuthSDK = {

  // ✅ Signup
  signup: async ({ name, email, password }) => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password
      });

      return res.data;

    } catch (err) {
      throw err.response?.data || { msg: "Signup failed" };
    }
  },

  // ✅ Login
  login: async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      // store token
      localStorage.setItem("token", res.data.token);

      return res.data;

    } catch (err) {
      throw err.response?.data || { msg: "Login failed" };
    }
  },

  // 🔐 Get Profile (protected route)
  getProfile: async () => {
    try {
      const res = await api.get("/auth/profile");
      return res.data;

    } catch (err) {
      throw err.response?.data || { msg: "Failed to fetch profile" };
    }
  },

  // 🚪 Logout
  logout: () => {
    localStorage.removeItem("token");
  },

  // 🔍 Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};