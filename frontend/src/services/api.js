export const API_BASE_URL = "";

export const delay = (ms = 250) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const api = {
  async get(data) {
    await delay();
    return data;
  },

  async post(data) {
    await delay();
    return data;
  },
};

export default api;
