import api from "./axios";

export const LinkSDK = {
  getLinks: () => api.get("/links"),
  createLink: (data) => api.post("/links", data),
  updateLink: (id, data) => api.put(`/links/${id}`, data),
  deleteLink: (id) => api.delete(`/links/${id}`),
  toggleFavorite: (id) => api.patch(`/links/${id}/favorite`)
};