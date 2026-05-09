import api from "./axios";
export const AuthSDK = {
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

  login: async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", {
      email,
      password,
    });

    const token = res?.data?.token;

const jwtRegex = /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;

if (token && typeof token === "string" && jwtRegex.test(token)) {
    localStorage.setItem("token", token);
}
return res.data;

    } catch (err) {
      throw err.response?.data || { msg: "Login failed" };
    }
  },

  // getProfile: async () => {
  //   try {
  //     const res = await api.get("/auth/profile");
  //     return res.data;

  //   } catch (err) {
  //     throw err.response?.data || { msg: "Failed to fetch profile" };
  //   }
  // },
  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

};