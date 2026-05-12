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
const validateLinkData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error("Invalid payload for link data. Expected an object.");
  }
  if (data.url && typeof data.url !== 'string') {
    throw new Error("Invalid URL: URL must be a string.");
  }
  if (data.title && typeof data.title !== 'string') {
    throw new Error("Invalid title: Title must be a string.");
  }
  if (data.tags && !Array.isArray(data.tags)) {
    throw new Error("Invalid tags: Tags must be an array of strings.");
  }
  return data;
}

export const LinkSDK = {
  getLinks: () => api.get("/links"),

createLink: (data) => {
  const safeData = validateLinkData(data);

    return api.post("/links", safeData);
  },
  updateLink: (id, data) => {
    const safeId = validateId(id);
    const safeData = validateLinkData(data);
    return api.put(`/links/${safeId}`, safeData);
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