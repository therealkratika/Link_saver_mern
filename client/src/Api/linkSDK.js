import api from "./axios";

const validateId = (id) => {
  if (!id || typeof id !== "string") {
    throw new TypeError("Invalid link ID.");
  }

  const safePattern = /^[a-zA-Z0-9_-]+$/;

  if (!safePattern.test(id)) {
    throw new TypeError("Invalid link ID format.");
  }

  return encodeURIComponent(id);
};

const buildLinkUrl = (id) => {
  return `/links/${validateId(id)}`;
};

const validateLinkData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("Invalid payload.");
  }

  const sanitizedData = {};

  if ("url" in data) {
    if (typeof data.url !== "string") {
      throw new TypeError("Invalid URL.");
    }

    sanitizedData.url = data.url.trim();
  }

  if ("title" in data) {
    if (typeof data.title !== "string") {
      throw new TypeError("Invalid title.");
    }

    sanitizedData.title = data.title.trim();
  }

  if ("tags" in data) {
    if (
      !Array.isArray(data.tags) ||
      !data.tags.every((tag) => typeof tag === "string")
    ) {
      throw new TypeError("Invalid tags.");
    }

    sanitizedData.tags = data.tags.map((tag) => tag.trim());
  }

  return Object.freeze(sanitizedData);
};

export const LinkSDK = {
  getLinks: () => api.get("/links"),

  createLink: (data) => {
    const safeData = validateLinkData(data);

    return api.post("/links", safeData);
  },

  updateLink: (id, data) => {
    const safeData = validateLinkData(data);

    return api.put(buildLinkUrl(id), safeData);
  },

  deleteLink: (id) => {
    return api.delete(buildLinkUrl(id));
  },

  toggleFavorite: (id) => {
    return api.patch(`${buildLinkUrl(id)}/favorite`);
  },
};