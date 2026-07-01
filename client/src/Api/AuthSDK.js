import api from "./axios";

export const AuthSDK = {
  signup: async ({ name, email, password }) => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      return res.data;
    } catch (err) {
      throw err.response?.data || { msg: "Signup failed" };
    }
  },

  login: async ({ email, password }) => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const token = res?.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || {
      msg: "Login failed",
    };
  }
},

  // 🔄 Resend verification email
  resendVerification: async (email) => {
    try {
      const res = await api.post(
        "/auth/resend-verification",
        {
          email,
        }
      );

      return res.data;
    } catch (err) {
      throw err.response?.data || {
        msg: "Failed to resend verification email",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};