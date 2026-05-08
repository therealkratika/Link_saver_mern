import api from "./axios";

export const LinkSDK = {
  getLinks: () => api.get("/links"),

  createLink: (data) => api.post("/links", data),

  updateLink: (id, data) =>{ 
    if(!id|| typeof id !== 'string') {
      throw new Error("Invalid link ID");
    }
    return api.put(`/links/${encodeURIComponent(id)}`, data)
  },

  deleteLink: (id) =>{ 
    if(!id|| typeof id !== 'string') {
      throw new Error("Invalid link ID");
    }
    return api.delete(`/links/${encodeURIComponent(id)}`)
  },

  toggleFavorite: (id) => {
    if(!id|| typeof id !== 'string') {
      throw new Error("Invalid link ID");
    }
    return api.patch(`/links/${encodeURIComponent(id)}/favorite`)
  }
};