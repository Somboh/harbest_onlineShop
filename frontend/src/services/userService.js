import { api } from "./api";

//Endpoints "self-service" del usuario logueado. Todos requieren JWT (auth:true).
export const userService = {
  async getMe() {
    return api.get("/users/me", { auth: true });
  },

  async updateProfile({ nombre, email }) {
    return api.patch("/users/me", { nombre, email }, { auth: true });
  },

  async changePassword({ currentPassword, newPassword }) {
    return api.put(
      "/users/me/password",
      { currentPassword, newPassword },
      { auth: true },
    );
  },
};

export default userService;
