import { api } from "./api";

export const favoritesService = {
  async getFavoritesByUser(email) {
    //devuelve [{ product_id, fecha, producto: {...} }, ...]
    return api.get(`/favoritos/user/${encodeURIComponent(email)}`);
  },

  async addFavorite(user_email, product_id) {
    return api.post("/favoritos/", { user_email, product_id }, { auth: true });
  },

  async removeFavorite(user_email, product_id) {
    return api.delete(
      `/favoritos/${encodeURIComponent(user_email)}/${encodeURIComponent(product_id)}`,
      { auth: true },
    );
  },
};

export default favoritesService;
