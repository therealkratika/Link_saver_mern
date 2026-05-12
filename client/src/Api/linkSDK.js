import api from "./axios";
const validateId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error("Invalid link ID: ID must be a non-empty string.");
  }

  const safePattern = /^[a-zA-Z0-9-_]+$/;
  if (!safePattern.test(id)) {
    throw new Error("Invalid link ID: ID contains forbidden characters.");
  }

  return encodeURIComponent(id);
};

export const LinkSDK = {
  getLinks: () => api.get("/links"),

  createLink: (data) => api.post("/links", data),

  updateLink: (id, data) => {
    const safeId = validateId(id);
    return api.put(`/links/${safeId}`, data);
  },

  deleteLink: (id) => {
    const safeId = validateId(id);
    return api.delete(`/links/${safeId}`);
  },

  toggleFavorite: (id) => {
    const safeId = validateId(id);
    return api.patch(`/links/${safeId}/favorite`);
  }
};