import api from "./axios";
const validateId = (id) => {
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new TypeError("Invalid link ID.");
  }

  const normalizedId = id.trim();

  const safePattern = /^[a-zA-Z0-9_-]+$/;

  if (!safePattern.test(normalizedId)) {
    throw new TypeError("Invalid link ID format.");
  }

  return encodeURIComponent(normalizedId);
};

const buildLinkUrl = (id) => {
  const safeId = validateId(id);

  return `/links/${safeId}`;
};

const validateLinkData = (data) => {
  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new TypeError("Invalid payload.");
  }

  const sanitizedData = {};

  if (Object.hasOwn(data, "url")) {
    if (typeof data.url !== "string") {
      throw new TypeError("Invalid URL.");
    }

    sanitizedData.url = String(data.url).trim();
  }

  if (Object.hasOwn(data, "title")) {
    if (typeof data.title !== "string") {
      throw new TypeError("Invalid title.");
    }

    sanitizedData.title = String(data.title).trim();
  }

  if (Object.hasOwn(data, "tags")) {
    if (
      !Array.isArray(data.tags) ||
      !data.tags.every((tag) => typeof tag === "string")
    ) {
      throw new TypeError("Invalid tags.");
    }

    sanitizedData.tags = data.tags.map((tag) =>
      String(tag).trim()
    );
  }

  return Object.freeze({
    ...sanitizedData,
  });
};

export const LinkSDK = Object.freeze({
  getLinks: () => {
    return api.get("/links");
  },
  createLink: (data) => {
    const safeData = validateLinkData(data);

    const payload = {
      ...safeData,
    };

    return api.post("/links", payload);
  },
  updateLink: (id, data) => {
    const safeUrl = buildLinkUrl(id);

    const safeData = validateLinkData(data);

    const payload = {
      ...safeData,
    };

    return api.put(safeUrl, payload);
  },

  deleteLink: (id) => {
    const safeUrl = buildLinkUrl(id);

    return api.delete(safeUrl);
  },
  toggleFavorite: (id) => {
    const safeUrl = `${buildLinkUrl(id)}/favorite`;

    return api.patch(safeUrl);
  },
});